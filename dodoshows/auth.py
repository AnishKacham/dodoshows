from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
)
from dodoshows import mysql

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/signup", methods=["POST"])
def doSignup():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    city_id = request.json["city_id"]

    cur = mysql.connection.cursor()

    count = cur.execute("SELECT * FROM user WHERE username = %s LIMIT 1", [username])

    if count:
        return {"error": "username taken"}

    count = cur.execute("SELECT * FROM user WHERE email = %s LIMIT 1", [email])
    if count:
        return {"error": "email exists"}

    cur.execute(
        "INSERT INTO user VALUES (DEFAULT, %s, %s, 1, %s, %s, 'USR')",
        [username, email, password, city_id],
    )
    mysql.connection.commit()

    cur.execute("SELECT user_id from user WHERE username = %s", [username])
    result = cur.fetchone()
    cur.close()

    access_token = create_access_token(identity=result["user_id"])
    return jsonify(jwt=access_token)


@auth_blueprint.route("/login", methods=["POST"])
def doLogin():
    username = request.json["username"]
    password = request.json["password"]

    cur = mysql.connection.cursor()

    cur.execute("SELECT user_id, password FROM user WHERE username = %s", [username])
    result = cur.fetchone()
    print(result["password"])
    if result["password"] != password:
        return {"error": "wrong credentials"}

    access_token = create_access_token(identity=result["user_id"])
    return jsonify(jwt=access_token)