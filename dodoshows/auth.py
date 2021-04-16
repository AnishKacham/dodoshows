from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_optional, get_jwt_identity, create_access_token
from dodoshows import mysql

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api")


def validatePayment(paymentDeets):
    # Validate payment details. Ideally this is secure but we will always return true for now
    return True


@auth_blueprint.route("/is-logged-in")
@jwt_optional
def checkLoggedIn():
    logged_in = False
    details = []
    user_id = get_jwt_identity()
    if user_id:
        logged_in = True
        cur = mysql.connection.cursor()
        cur.execute(
            "SELECT user_role, user_id, username, email, profile_url, city.city_id, city.city_name FROM user INNER JOIN city ON (user.city_id = city.city_id) WHERE user_id = %s",
            [user_id],
        )
        details = cur.fetchone()
        cur.close()
    return jsonify(logged_in=logged_in, details=details)


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
        "INSERT INTO user VALUES (DEFAULT, %s, %s, 1, %s, %s, 'USR', NULL)",
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
    if not cur.rowcount:
        return {"error": "No such username exists"}
    result = cur.fetchone()
    cur.close()
    if result["password"] != password:
        return {"error": "wrong credentials"}

    access_token = create_access_token(identity=result["user_id"])
    return jsonify(jwt=access_token)