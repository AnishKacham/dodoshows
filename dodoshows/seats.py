import random
from flask import Flask, jsonify, request, Blueprint, render_template, current_app as app
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    jwt_optional,
    create_access_token,
)

from dodoshows import mysql
from dodoshows import mail
from .shows import shows_blueprint
from .auth import validatePayment
from flask_mail import Message
import qrcode
import io
import os

def makeQR(s):
    qr = qrcode.make(s)
    with io.BytesIO() as output:
        qr.save(output, format="PNG")
        contents = output.getvalue()
        return contents



seats_blueprint = Blueprint("seats", __name__, url_prefix="/api/seats")


@seats_blueprint.route("/")
def getAllSeats():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT *
            FROM seat"""
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@seats_blueprint.route("/<theatre_id>")
def getTheatreSeats(theatre_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT *
            FROM seat
            WHERE theatre_id = %s""",
        [theatre_id],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@shows_blueprint.route("/<show_id>/seats")
def getShowSeats(show_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT *
            FROM show_seat
            WHERE show_id = %s""",
        [show_id],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@shows_blueprint.route("/<show_id>/book", methods = ["POST"])
@jwt_required
def bookTicket(show_id):
    # Receive payment details and cross-verify and only if transaction was successful, proceed to book the tickets
    if validatePayment(request.json["paymentDeets"]):
        user_id = get_jwt_identity()
        seats = request.json["seats"]
        print(user_id)
         
        cur = mysql.connection.cursor()
        for seat in seats:
            if cur.execute(
                """SELECT *
                        FROM show_seat
                        WHERE show_id = %s AND seat_code = %s AND seat_status = 0""",
                [show_id, seat],
            ):
                return jsonify(error="Seats reserved")
        for seat in seats:
            cur.execute(
                """UPDATE show_seat
                    SET seat_status = 0
                    WHERE show_id = %s AND seat_code = %s""",
                [show_id, seat],
            )
            mysql.connection.commit()
        ticket_code = random.randint(100000, 999999)
        cur.execute(
            """INSERT INTO ticket
                VALUES (DEFAULT, %s, %s, %s)""",
            [show_id, user_id,ticket_code],
        )
       
        ticket_id = cur.lastrowid
        mysql.connection.commit()
        
        for seat in seats:
            cur.execute(
                """INSERT INTO ticket_seat
                    VALUES (%s, %s)""",
                [ticket_id, seat],
            )
            mysql.connection.commit()
            
        
        cur.execute(
            """SELECT theatre.*, show_playing.movie_id, movie.movie_title, movie.poster_url, show_playing.date_time
                FROM show_playing
                INNER JOIN movie ON (show_playing.movie_id = movie.movie_id)
                INNER JOIN theatre ON (show_playing.theatre_id = theatre.theatre_id)
                WHERE show_id = %s""",
            [show_id],
        )
        result = cur.fetchone()
        MovieTitle=result["movie_title"]
        Screen=result["theatre_name"]
        TheatreAdd=result["theatre_address"]
        TheatreMall=result["theatre_mall"]
        DateTime=result["date_time"]
        Seats = ""
        for seat in seats:
            Seats += seat+","
        Seats = Seats[:-1]
        print("Seats\n", Seats)
        cur.execute(
            """SELECT email FROM user WHERE user_id = %s""",
            [user_id],
        )        
        user_email = cur.fetchone()['email']
        print(user_email)        
        cur.close()
        
        ticket_qr_bytes = makeQR(str({"ticket_id": ticket_id, "ticket_code": ticket_code}))

        body = f"MOVIE: {MovieTitle}\nSCREEN: {Screen}\nADDRESS: {TheatreAdd}\nMALL: {TheatreMall}\nTIMING: {DateTime}\nSEATS: {Seats}"
        print("Mail body:\n",body)

        msg = Message("Movie Ticket",
                  sender = os.getenv("MAIL_USERNAME"),
                  recipients = [user_email])
        msg.body = body
        msg.attach("ticket.png", "image/png", ticket_qr_bytes)
        
        mail.send(msg)
       
        return jsonify(result)

    return jsonify(error="Invalid Payment")
