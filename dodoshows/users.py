from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from dodoshows import mysql

users_blueprint = Blueprint("users", __name__, url_prefix="/users")


@users_blueprint.route("/")
def getAllUsers():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_id, username, city_name
            FROM user
            INNER JOIN city ON user.city_id = city.city_id
            LIMIT 50"""
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>")
def getUser(user_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_id, username, city.city_name
            FROM user
            INNER JOIN city ON user.city_id = city.city_id
            WHERE user_id = %s""",
        [user_id],
    )
    result = cur.fetchone()
    cur.execute(
        """SELECT movie.movie_id, movie.movie_title, watch_status, score, review
            FROM rating
            INNER JOIN movie ON rating.movie_id = movie.movie_id
            WHERE user_id = %s""",
        [user_id],
    )
    result["movies"] = cur.fetchall()
    cur.close()
    return jsonify(result)


@users_blueprint.route("/<user_id>", methods=["POST"])
@jwt_required
def addRating(user_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    movie_id = request.json["movie_id"]
    watch_status = request.json["watch_status"]
    score = request.json["score"]
    review = request.json["review"]

    cur = mysql.connection.cursor()
    cur.execute(
        """INSERT INTO rating
            VALUES (DEFAULT, %s, %s, %s, %s, %s)""",
        [user_id, movie_id, watch_status, score, review],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/<movie_id>", methods=["DELETE"])
@jwt_required
def deleteRating(user_id, movie_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    cur = mysql.connection.cursor()
    cur.execute(
        """DELETE FROM rating
            WHERE user_id = %s AND movie_id = %s""",
        [user_id, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/<movie_id>", methods=["PUT"])
@jwt_required
def updateRating(user_id, movie_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    watch_status = request.json["watch_status"]
    score = request.json["score"]
    review = request.json["review"]

    cur = mysql.connection.cursor()
    cur.execute(
        """UPDATE rating
            SET watch_status = %s, score = %s, review = %s
            WHERE user_id = %s AND movie_id = %s""",
        [watch_status, score, review, user_id, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/<movie_id>/watched", methods=["PUT"])
@jwt_required
def setWatched(user_id, movie_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    cur = mysql.connection.cursor()
    cur.execute(
        """UPDATE rating
            SET watch_status = 1
            WHERE user_id = %s AND movie_id = %s""",
        [user_id, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None