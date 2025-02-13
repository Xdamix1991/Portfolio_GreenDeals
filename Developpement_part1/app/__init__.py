from flask import Flask
from flask_restx import Api
from config import DevelopementConfig
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from app.db_extension import db

bcrypt = Bcrypt()
jwt = JWTManager()
def creat_app(config_classe=DevelopementConfig):
    app = Flask(__name__)
    app.config.from_object(config_classe)
    api = Api(app, version="1.0", title='GreenDeals', description='GreenDeals_api')
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)


    from app.api.auth import api as api_auth
    from app.api.users import api as api_users

    api.add_namespace(api_users, path='/api/users')
    api.add_namespace(api_auth, path='/api/auth')
    with app.app_context():
        db.create_all()
    return app
