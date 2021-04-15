from flask import Flask, request, jsonify, send_from_directory
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from flask_mail import Mail
from dotenv import load_dotenv, find_dotenv
import os

mysql = MySQL()
jwt = JWTManager()
cors = CORS()
mail = Mail()


from dodoshows.search import search_blueprint
from dodoshows.movies import movies_blueprint
from dodoshows.users import users_blueprint
from dodoshows.lists import lists_blueprint
from dodoshows.auth import auth_blueprint
from dodoshows.shows import shows_blueprint
from dodoshows.seats import seats_blueprint


def create_app():
    app = Flask(__name__,static_folder='../ReactApp/build',static_url_path='')

    load_dotenv("/.env")
    app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
    app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
    app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
    app.config["MYSQL_PORT"] = int(os.getenv("MYSQL_PORT"))
    app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 24 * 60 * 60
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config["DEBUG"] = True
    app.config["MAIL_SERVER"] = 'smtp.gmail.com'
    app.config["MAIL_PORT"] = 465
    app.config["MAIL_USE_TLS"] = False
    app.config["MAIL_USE_SSL"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

    mysql.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    mail.init_app(app)

    app.register_blueprint(search_blueprint)
    app.register_blueprint(movies_blueprint)
    app.register_blueprint(users_blueprint)
    app.register_blueprint(lists_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(shows_blueprint)
    app.register_blueprint(seats_blueprint)

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    return app


# if __name__ == "__main__":
#     app.run(debug=True)
