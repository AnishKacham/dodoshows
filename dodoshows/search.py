from flask import request, jsonify, Blueprint
from dodoshows import mysql

search_blueprint = Blueprint("search", __name__, url_prefix="/api/search")


@search_blueprint.route("/movies", methods=["POST"])
def searchMovies():
    title = request.json["title"]
    genres = request.json["genres"]
    people = request.json["people"]
    statement = (
        "SELECT movie_id, movie_title, avg_rating, release_date, pg_rating, poster_url FROM movie"
    )
    first = True

    if title or genres or people:
        statement += " WHERE"

    if title:
        statement += " movie_title LIKE '%" + title + "%'"
        first = False

    if genres:
        for genre in genres:
            if first:
                statement += (
                    " movie_id IN (SELECT movie_id FROM movie_genre WHERE genre_id="
                    + str(genre)
                    + ")"
                )
                first = False
            else:
                statement += (
                    " AND movie_id IN (SELECT movie_id FROM movie_genre WHERE genre_id="
                    + str(genre)
                    + ")"
                )

    if people:
        for person in people:
            if first:
                statement += (
                    " movie_id IN (SELECT movie_id FROM production WHERE person_id="
                    + str(person)
                    + ")"
                )
                first = False
            else:
                statement += (
                    " AND movie_id IN (SELECT movie_id FROM production WHERE person_id="
                    + str(person)
                    + ")"
                )
    statement += " ORDER BY release_date DESC "

    print(statement)
    cur = mysql.connection.cursor()
    cur.execute(statement)
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@search_blueprint.route("/people", methods=["POST"])
def searchPeople():
    person = "%" + request.json["person"] + "%"
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT person_id, person_name
            FROM person
            WHERE person_name LIKE %s
            LIMIT 10""",
        [person],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@search_blueprint.route("/cities", methods=["POST"])
def searchCities():
    city = "%" + request.json["city"] + "%"
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT city_id, city_name
            FROM city
            WHERE city_name LIKE %s
            LIMIT 10""",
        [city],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)


@search_blueprint.route("/users", methods=["POST"])
def searchUsers():
    user = "%" + request.json["user"] + "%"
    cur = mysql.connection.cursor()
    cur.execute(
        """SELECT user_id, username, city.city_name, user.profile_url
            FROM user
            INNER JOIN city ON user.city_id = city.city_id
            WHERE username LIKE %s""",
        [user],
    )
    results = cur.fetchall()
    cur.close()
    return jsonify(results)