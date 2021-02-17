from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from dodoshows import mysql
from .users import users_blueprint


@users_blueprint.route("/<user_id>/lists")
def getUserLists(user_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT entry.list_id, user_list.list_name, movie.movie_id, movie.movie_title, rating.watch_status, rating.score
            FROM entry
            INNER JOIN user_list ON entry.list_id = user_list.list_id
            INNER JOIN rating ON user_list.user_id = rating.user_id
            INNER JOIN movie ON rating.movie_id = movie.movie_id
            WHERE user_list.user_id = %s""",
        [user_id],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>/lists", methods=["POST"])
@jwt_required
def addUserList(user_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    list_name = request.json["list_name"]

    cur = mysql.connection.cursor()
    cur.execute(
        """INSERT INTO list
            VALUES (DEFAULT, %s, %s)""",
        [user_id, list_name],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/lists/<list_id>", methods=["PUT"])
@jwt_required
def updateUserList(user_id, list_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    list_name = request.json["list_name"]

    cur = mysql.connection.cursor()

    cur.execute(
        """SELECT user_id
            FROM list
            WHERE list_id = %s""",
        [list_id],
    )
    if cur.fetchone()["user_id"] != user_id:
        return {"error": "not authorized"}

    cur.execute(
        """UPDATE list
            SET list_name = %s
            WHERE list_id = %s""",
        [list_name, list_id],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/lists/<list_id>", methods=["POST"])
@jwt_required
def addListEntry(user_id, list_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    movie_id = request.json["movie_id"]

    cur = mysql.connection.cursor()

    cur.execute(
        """SELECT user_id
            FROM list
            WHERE list_id = %s""",
        [list_id],
    )
    if cur.fetchone()["user_id"] != user_id:
        return {"error": "not authorized"}

    cur.execute(
        """SELECT movie_id
            FROM rating
            WHERE user_id = %s AND movie_id = %s""",
        [user_id, movie_id],
    )
    result = cur.fetchone()["movie_id"]

    if result == "":
        cur.execute(
            """INSERT INTO rating
            VALUES (%s, %s, 0, NULL, NULL)""",
            [user_id, movie_id],
        )

    cur.execute(
        """INSERT INTO entry
            VALUES (%s, %s)""",
        [list_id, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None


@users_blueprint.route("/<user_id>/lists/<list_id>/<movie_id>", methods=["DELETE"])
@jwt_required
def deleteListEntry(user_id, list_id, movie_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}

    movie_id = request.json["movie_id"]

    cur = mysql.connection.cursor()

    cur.execute(
        """SELECT user_id
            FROM list
            WHERE list_id = %s""",
        [list_id],
    )
    if cur.fetchone()["user_id"] != user_id:
        return {"error": "not authorized"}

    cur.execute(
        """DELETE FROM entry
            WHERE list_id = %s AND movie_id = %s""",
        [list_id, movie_id],
    )
    mysql.connection.commit()
    cur.close()
    return None