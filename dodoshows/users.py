from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    jwt_optional,
    create_access_token,
)
from dodoshows import mysql

users_blueprint = Blueprint("users", __name__, url_prefix="/api/users")


@users_blueprint.route("/")
def getAllUsers():
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_id, username, city_name, profile_url
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
        """SELECT user_id, username, city.city_name, profile_url
            FROM user
            INNER JOIN city ON user.city_id = city.city_id
            WHERE user_id = %s""",
        [user_id],
    )
    result = cur.fetchone()
    cur.close()
    return jsonify(result)

@users_blueprint.route("/<user_id>/friends")
@jwt_required
def getUserFriends(user_id):
    if str(user_id) == str(get_jwt_identity()):
        results = {"Friends": [], "Incoming": [], "Outgoing": []}
        cur = mysql.connection.cursor()
        cur.execute(
            """SELECT user.user_id, user.username, city.city_name, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id2
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id1 = %s AND friendship.status = 1""",
            [user_id],
        )
        friends = cur.fetchall()
        if (friends):
            for friend in friends:
                results["Friends"].append(friend)

        cur.execute(
            """SELECT user.user_id, user.username, city.city_name, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id1
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id2 = %s AND friendship.status = 1""",
            [user_id],
        )
        print(results)

        friends = cur.fetchall()
        if (friends):
            for friend in friends:
                results["Friends"].append(friend)
        print(results)
        
        cur.execute(
            """SELECT user.user_id, user.username, city.city_name, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id2
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id1 = %s AND friendship.status = 0""",
            [user_id],
        )
        results["Outgoing"] = cur.fetchall()
        cur.execute(
            """SELECT user.user_id, user.username, city.city_name, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id1
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id2 = %s AND friendship.status = 0""",
            [user_id],
        )
        results["Incoming"] = cur.fetchall()
        cur.close()
        return jsonify(results)
    return jsonify(error="Not authorized")

@users_blueprint.route("/request/<user_id2>", methods=["POST"])
@jwt_required
def requestFriend(user_id2):
    user_id1 = get_jwt_identity()
    cur = mysql.connection.cursor()
    cur.execute(
        """INSERT INTO friendship
            VALUES (%s, %s, 0)""",
        [user_id1, user_id2],
    )
    mysql.connection.commit()
    cur.close()
    return ""

@users_blueprint.route("/accept/<user_id1>", methods=["PUT"])
@jwt_required
def acceptFriend(user_id1):
    user_id2 = get_jwt_identity()
    cur = mysql.connection.cursor()
    cur.execute(
        """UPDATE friendship
            SET status = 1
            WHERE user_id1 = %s AND user_id2 = %s""",
        [user_id1, user_id2],
    )
    mysql.connection.commit()
    cur.close()
    return ""

@users_blueprint.route("/unfriend/<user_id_b>", methods=["DELETE"])
@jwt_required
def unfriend(user_id_b):
    user_id_a = get_jwt_identity()
    cur = mysql.connection.cursor()
    cur.execute(
        """DELETE from friendship
            WHERE user_id1 = %s AND user_id2 = %s""",
        [user_id_a, user_id_b],
    )
    mysql.connection.commit()
    cur.execute(
        """DELETE from friendship
            WHERE user_id2 = %s AND user_id1 = %s""",
        [user_id_a, user_id_b],
    )
    mysql.connection.commit()
    cur.close()
    return ""

@users_blueprint.route("/<user_id>/entries")
@jwt_optional
def getUserEntries(user_id):
    cur = mysql.connection.cursor()
    if str(user_id) == str(get_jwt_identity()):
        cur.execute(
            """SELECT entry.list_id, user_list.list_name, user_list.is_private, movie.movie_id, movie.movie_title, rating.watch_status, rating.score, rating.review
                FROM entry
                INNER JOIN user_list ON entry.list_id = user_list.list_id
                INNER JOIN movie ON entry.movie_id = movie.movie_id
                INNER JOIN rating ON user_list.user_id = rating.user_id
                                    AND entry.movie_id = rating.movie_id
                WHERE user_list.user_id = %s""",
            [user_id],
        )
    else:
        cur.execute(
            """SELECT entry.list_id, user_list.list_name, user_list.is_private, movie.movie_id, movie.movie_title, rating.watch_status, rating.score, rating.review
                FROM entry
                INNER JOIN user_list ON entry.list_id = user_list.list_id
                INNER JOIN movie ON entry.movie_id = movie.movie_id
                INNER JOIN rating ON user_list.user_id = rating.user_id
                                    AND entry.movie_id = rating.movie_id
                WHERE user_list.user_id = %s AND user_list.is_private = 0""",
            [user_id],
        )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>/movies/<movie_id>/lists")
@jwt_optional
def getUserListsForMovie(user_id, movie_id):
    cur = mysql.connection.cursor()
    if str(user_id) == str(get_jwt_identity()):
        cur.execute(
            """SELECT entry.list_id, user_list.list_name, user_list.is_private
                FROM entry
                INNER JOIN user_list ON entry.list_id = user_list.list_id
                WHERE user_list.user_id = %s AND entry.movie_id = %s""",
            [user_id, movie_id],
        )
    else:
        cur.execute(
            """SELECT entry.list_id, user_list.list_name, user_list.is_private
                FROM entry
                INNER JOIN user_list ON entry.list_id = user_list.list_id
                WHERE user_list.user_id = %s AND entry.movie_id = %s AND user_list.is_private = 0""",
            [user_id, movie_id],
        )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>/lists")
@jwt_optional
def getUserLists(user_id):
    cur = mysql.connection.cursor()
    if str(user_id) == str(get_jwt_identity()):
        cur.execute(
            """SELECT list_id, list_name, is_private
                FROM user_list
                WHERE user_id = %s""",
            [user_id],
        )
    else:
        cur.execute(
            """SELECT list_id, list_name, is_private
                FROM user_list
                WHERE user_id = %s AND is_private = 0""",
            [user_id],
        )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>/<movie_id>")
def getRating(user_id, movie_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT *
            FROM rating
            WHERE user_id = %s AND movie_id = %s""",
        [user_id, movie_id],
    )
    results = cur.fetchone()
    print(results)
    cur.close()
    return jsonify(results)


@users_blueprint.route("/<user_id>/ratings")
def getRatingsForUser(user_id):
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT rating.movie_id, rating.watch_status, rating.score, rating.review, movie.movie_title
            FROM rating
            INNER JOIN movie ON rating.movie_id = movie.movie_id
            WHERE rating.user_id = %s""",
        [user_id],
    )
    results = cur.fetchall()
    print(results)
    cur.close()
    return jsonify(results)


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
            VALUES (%s, %s, %s, %s, %s)""",
        [user_id, movie_id, watch_status, score, review],
    )
    mysql.connection.commit()
    cur.close()
    return ""


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
    return ""


@users_blueprint.route("/<user_id>", methods=["PUT"])
@jwt_required
def updateRating(user_id):
    if str(user_id) != str(get_jwt_identity()):
        return {"error": "not authorized"}
    movie_id = request.json["movie_id"]
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
    return ""


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
    return ""