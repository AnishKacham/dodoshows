from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from dodoshows import mysql

shows_blueprint = Blueprint("shows", __name__, url_prefix="/api/shows")


@shows_blueprint.route("/")
def getAllShows():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT show_id, show_playing.movie_id, movie.movie_title, show_playing.date_time, show_playing.theatre_id, theatre.theatre_name, theatre.city_id, city.city_name, theatre.theatre_address, theatre.theatre_mall
            FROM show_playing
            INNER JOIN movie ON show_playing.movie_id = movie.movie_id
            INNER JOIN theatre ON show_playing.theatre_id = theatre.theatre_id
            INNER JOIN city ON theatre.city_id = city.city_id
            LIMIT 100"""
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@shows_blueprint.route("/relevant")
def getRelevantShows():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT show_id, show_playing.movie_id, movie.movie_title, show_playing.date_time, show_playing.theatre_id, theatre.theatre_name, theatre.city_id, city.city_name, theatre.theatre_address, theatre.theatre_mall
            FROM show_playing
            INNER JOIN movie ON show_playing.movie_id = movie.movie_id
            INNER JOIN theatre ON show_playing.theatre_id = theatre.theatre_id
            INNER JOIN city ON theatre.city_id = city.city_id
            WHERE date_time >= NOW()
            ORDER BY date_time
            LIMIT 100"""
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@shows_blueprint.route("/<show_id>")
def getShow(show_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT show_id, seat_code, seat_status
            FROM show_seats
            WHERE show_id = %s""",
        [show_id],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@shows_blueprint.route("/", methods=["POST"])
@jwt_required
def addShow():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_role
            FROM user WHERE user_id = %s""",
        [get_jwt_identity()],
    )
    if cur.fetchone()["user_role"] != "ADM":
        return {"error": "not authorized"}

    movie_id = request.json["movie_id"]
    theatre_id = request.json["theatre_id"]
    date_time = request.json["date_time"]
    ticket_price = request.json["ticket_price"]

    cur.execute(
        """INSERT INTO show_playing
            VALUES (DEFAULT, %s, %s, %s, %s)""",
        [movie_id, theatre_id, date_time, ticket_price],
    )
    show_id = cur.lastrowid
    cur.execute(
        """SELECT seat_code
            FROM seat
            WHERE theatre_id = %s
        """,
        [theatre_id],
    )
    seats = cur.fetchall()
    for seat in seats:
        cur.execute(
            """INSERT INTO show_seat
            VALUES (%s, %s, 1)""",
            [show_id, seat["seat_code"]],
        )
    mysql.connection.commit()
    cur.close()
    return None


@shows_blueprint.route("/<show_id>", methods=["PUT"])
@jwt_required
def updateMovie(show_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_role
            FROM user
            WHERE user_id = %s""",
        [get_jwt_identity()],
    )
    if cur.fetchone()["user_role"] != "ADM":
        return {"error": "not authorized"}

    movie_id = request.json["movie_id"]
    date_time = request.json["date_time"]
    ticket_price = request.json["ticket_price"]

    cur.execute(
        """UPDATE show
            SET movie_id = %s, date_time = %s, ticket_price = %s
            WHERE show_id = %s""",
        [movie_id, date_time, ticket_price, show_id],
    )
    mysql.connection.commit()
    cur.close()
    return None