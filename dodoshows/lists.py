from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
)
from dodoshows import mysql

lists_blueprint = Blueprint("lists", __name__, url_prefix="/lists")


@lists_blueprint.route("/", methods=["POST"])
@jwt_required
def addList():

    user_id = get_jwt_identity()
    if user_id:
        list_name = request.json["list_name"]
        is_private = request.json["is_private"]

        cur = mysql.connection.cursor()
        cur.execute(
            """INSERT INTO user_list
                VALUES (DEFAULT, %s, %s, %s)""",
            [user_id, list_name, is_private],
        )
        mysql.connection.commit()
        cur.close()
    return ("", 200)


@lists_blueprint.route("/<list_id>", methods=["PUT"])
@jwt_required
def updateUserList(list_id):

    user_id = get_jwt_identity()
    if user_id:
        cur = mysql.connection.cursor()
        cur.execute(
            """SELECT user_id
                FROM user_list
                WHERE list_id = %s""",
            [list_id],
        )
        if cur.fetchone()["user_id"] == user_id:
            list_name = request.json["list_name"]
            is_private = request.json["is_private"]
            cur.execute(
                """UPDATE user_list
                    SET list_name = %s AND is_private = %s
                    WHERE list_id = %s""",
                [list_name, is_private, list_id],
            )
            mysql.connection.commit()
        cur.close()
    return ""


@lists_blueprint.route("/<list_id>/<movie_id>", methods=["POST"])
@jwt_required
def addListEntry(list_id, movie_id):

    user_id = get_jwt_identity()
    if user_id:
        cur = mysql.connection.cursor()
        cur.execute(
            """SELECT user_id
                FROM user_list
                WHERE list_id = %s""",
            [list_id],
        )
        if cur.fetchone()["user_id"] == user_id:
            cur.execute(
                """SELECT movie_id
                    FROM rating
                    WHERE user_id = %s AND movie_id = %s""",
                [user_id, movie_id],
            )
            if not cur.fetchone():
                cur.execute(
                    """INSERT INTO rating
                    VALUES (%s, %s, 0, NULL, NULL)""",
                    [user_id, movie_id],
                )
                mysql.connection.commit()
            cur.execute(
                """INSERT INTO entry
                    VALUES (%s, %s)""",
                [list_id, movie_id],
            )
            mysql.connection.commit()
        cur.close()
    return ""


@lists_blueprint.route("/<list_id>", methods=["POST"])
@jwt_required
def addListEntries(list_id):

    user_id = get_jwt_identity()
    if user_id:
        cur = mysql.connection.cursor()
        cur.execute(
            """SELECT user_id
                FROM user_list
                WHERE list_id = %s""",
            [list_id],
        )
        if cur.fetchone()["user_id"] == user_id:
            movies = request.json["movie_ids"]
            for movie_id in movies:
                cur.execute(
                    """SELECT movie_id
                        FROM rating
                        WHERE user_id = %s AND movie_id = %s""",
                    [user_id, movie_id],
                )
                if not cur.fetchone():
                    cur.execute(
                        """INSERT INTO rating
                        VALUES (%s, %s, 0, NULL, NULL)""",
                        [user_id, movie_id],
                    )
                    mysql.connection.commit()
                cur.execute(
                    """INSERT INTO entry
                        VALUES (%s, %s)""",
                    [list_id, movie_id],
                )
                mysql.connection.commit()
        cur.close()
    return ""


@lists_blueprint.route("/<list_id>/<movie_id>", methods=["DELETE"])
@jwt_required
def deleteListEntry(list_id, movie_id):

    user_id = get_jwt_identity()
    if user_id:
        cur = mysql.connection.cursor()
        cur.execute(
            """SELECT user_id
                FROM user_list
                WHERE list_id = %s""",
            [list_id],
        )
        if cur.fetchone()["user_id"] == user_id:
            cur.execute(
                """DELETE FROM entry
                    WHERE list_id = %s AND movie_id = %s""",
                [list_id, movie_id],
            )
            mysql.connection.commit()
        cur.close()
    return ""
