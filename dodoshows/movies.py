from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from dodoshows import mysql

movies_blueprint = Blueprint("movies", __name__, url_prefix="/movies")


@movies_blueprint.route("/")
def getAllMovies():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM movie ORDER BY release_date DESC LIMIT 100")
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@movies_blueprint.route("/<movie_id>")
def getMovie(movie_id):
    print(movie_id)
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM movie WHERE movie_id = %s",
        [movie_id],
    )
    result = cur.fetchone()
    cur.execute(
        """SELECT genre_name
            FROM genre
            WHERE genre_id IN (SELECT genre_id FROM movie_genre WHERE movie_id = %s)""",
        [movie_id],
    )
    result["genres"] = cur.fetchall()
    cur.execute(
        """SELECT person.person_name, importance, cast_or_crew, person_role
            FROM production
            INNER JOIN person ON production.person_id=person.person_id
            WHERE movie_id = %s""",
        [movie_id],
    )
    result["people"] = cur.fetchall()
    print(result)
    cur.close()
    return jsonify(result)


@movies_blueprint.route("/", methods=["POST"])
@jwt_required
def addMovie():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_role
            FROM user WHERE user_id = %s""",
        [get_jwt_identity()],
    )
    if cur.fetchone()["user_role"] != "ADM":
        return {"error": "not authorized"}

    movie_title = request.json["movie_title"]
    movie_desc = request.json["movie_desc"]
    release_date = request.json["release_date"]
    movie_length = request.json["movie_length"]
    pg_rating = request.json["pg_rating"]

    cur.execute(
        """INSERT INTO movie
            VALUES (DEFAULT, %s, %s, %s, %s, %s, NULL)""",
        [movie_title, movie_desc, release_date, movie_length, pg_rating],
    )
    mysql.connection.commit()
    cur.close()
    return None


@movies_blueprint.route("/<movie_id>", methods=["PUT"])
@jwt_required
def updateMovie(movie_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_role
            FROM user
            WHERE user_id = %s""",
        [get_jwt_identity()],
    )
    if cur.fetchone()["user_role"] != "ADM":
        return {"error": "not authorized"}

    movie_title = request.json["movie_title"]
    movie_desc = request.json["movie_desc"]
    release_date = request.json["release_date"]
    movie_length = request.json["movie_length"]
    pg_rating = request.json["pg_rating"]

    cur.execute(
        """UPDATE movie
            SET movie_title = %s, movie_desc  = %s, release_date = %s, movie_length = %s, pg_rating = %s
            WHERE movie_id = %s""",
        [movie_title, movie_desc, release_date, movie_length, pg_rating, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None


@movies_blueprint.route("/<movie_id>/shows")
def getMovieShows(movie_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT show_id, show_playing.movie_id, movie.movie_title, show_playing.date_time, show_playing.theatre_id, theatre.theatre_name, theatre.city_id, city.city_name, theatre.theatre_address, theatre.theatre_mall
            FROM show_playing
            INNER JOIN movie ON show_playing.movie_id = movie.movie_id
            INNER JOIN theatre ON show_playing.theatre_id = theatre.theatre_id
            INNER JOIN city ON theatre.city_id = city.city_id
            WHERE show_playing.movie_id = %s AND date_time >= NOW()
            ORDER BY date_time
            LIMIT 100""",
        [movie_id],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)