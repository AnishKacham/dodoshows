import random
from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    jwt_optional,
    create_access_token,
)
from dodoshows import mysql
from .shows import shows_blueprint
from .auth import validatePayment

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


@shows_blueprint.route("/<show_id>/book")
@jwt_optional
def bookTicket(show_id):
    # Receive payment details and cross-verify and only if transaction was successful, proceed to book the tickets
    if validatePayment(request.json["paymentDeets"]):
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "NULL"
        seats = request.json["seats"]
        cur = mysql.connection.cursor()
        for seat in seats:
            if cur.execute(
                """SELECT *
                        FROM show_seat
                        WHERE show_id = %s AND seat_code = %s AND seat_status = 1""",
                [show_id, seat],
            ):
                return jsonify(error="Seats reserved")
        for seat in seats:
            cur.execute(
                """UPDATE show_seat
                    SET seat_status = 1
                    WHERE show_id = %s AND seat_code = %s""",
                [show_id, seat],
            )
            mysql.commit()
        ticket_code = random.randint(100000, 999999)
        cur.execute(
            """INSERT INTO ticket
                VALUES (DEFAULT, %s, %s, %s)""",
            [show_id, user_id, ticket_code],
        )
        ticket_id = cur.lastrowid
        mysql.commit()
        for seat in seats:
            cur.execute(
                """INSERT INTO ticket_seat
                    VALUES (%s, %s)""",
                [ticket_code, seat],
            )

        cur.execute(
            """SELECT theatre.*, show.movie_id, movie.movie_title
                FROM show
                INNER JOIN movie ON (show.movie_id = movie.movie_id)
                INNER JOIN theatre ON (show.theatre_id = theatre.theatre_id)
                WHERE show_id = %s""",
            [show_id],
        )
        result = cur.fetchone()
        cur.close()
        return jsonify(result)
