from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv, find_dotenv
import os

mysql = MySQL()
jwt = JWTManager()

from dodoshows.search import search_blueprint
from dodoshows.movies import movies_blueprint
from dodoshows.users import users_blueprint
from dodoshows.lists import lists_blueprint
from dodoshows.auth import auth_blueprint
from dodoshows.shows import shows_blueprint


def create_app():
    app = Flask(__name__)

    load_dotenv("/.env")
    app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
    app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
    app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
    app.config["MYSQL_PORT"] = os.getenv("MYSQL_PORT")
    app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_KEY")

    mysql.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(search_blueprint)
    app.register_blueprint(movies_blueprint)
    app.register_blueprint(users_blueprint)
    app.register_blueprint(lists_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(shows_blueprint)

    return app


# if __name__ == "__main__":
#     app.run(debug=True)
