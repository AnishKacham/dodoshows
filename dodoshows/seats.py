import random
from flask import jsonify, request, Blueprint,render_template
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    jwt_optional,
    create_access_token,
)

from dodoshows import mysql
from .shows import shows_blueprint
from .auth import validatePayment
from flask import Flask, request
from flask_mail import Mail,Message
import qrcode
import os

def makeQR(s):
    qr = qrcode.make(s[0])
    qr.save('ticket_' + s[1]+ '.png')



seats_blueprint = Blueprint("seats", __name__, url_prefix="/seats")


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
            """SELECT theatre.*, show_playing.movie_id, movie.movie_title
                FROM show_playing
                INNER JOIN movie ON (show_playing.movie_id = movie.movie_id)
                INNER JOIN theatre ON (show_playing.theatre_id = theatre.theatre_id)
                WHERE show_id = %s""",
            [show_id],
        )
        result = cur.fetchone()
        cur.execute(
            """SELECT email FROM user WHERE user_id = %s""",
            [user_id],
        )
        
        user_email = cur.fetchone()['email']
        print(user_email)
        
        mysql.connection.close()

        app = Flask(__name__)
        
        app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 465,
    MAIL_USE_TLS = False,
    MAIL_USE_SSL = True,
    MAIL_USERNAME = 'dodoshowsbooking@gmail.com',
    MAIL_PASSWORD = 'PAGA6453',
))
        makeQR([str(ticket_code), str(ticket_id)])
        mail = Mail(app)
        mail.init_app(app)
        ticket_qr = 'ticket_' + str(ticket_id) + '.png'
        msg = Message("Movie Ticket",
                  sender="dodoshowsbooking@gmail.com",
                  recipients=[user_email])
        os.system("cd ..")
        os.system("mv "+ticket_qr+ " dodoshows")
        #os.system("cd dodoshows")
        with app.open_resource(ticket_qr) as fp:
            msg.attach(ticket_qr, ticket_qr+"/png", fp.read())
        
        mail.send(msg)
        os.system("cd dodoshows && rm "+ticket_qr)
       
        return jsonify(result)
