from flask import Flask
from flask_restx import Api
from config import DevelopementConfig
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from app.db_extension import db

bcrypt = Bcrypt()
jwt = JWTManager()
def create_app(config_classe=DevelopementConfig):
    app = Flask(__name__, template_folder='templates', static_folder='statics', static_url_path='/statics')
    app.config.from_object(config_classe)
    api = Api(app, version="1.0", title='GreenDeals', description='GreenDeals_api', doc='/api/')
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)


    from app.api.auth import api as api_auth
    from app.api.users import api as api_users
    from app.api.deals import api as api_deals
    from app.api.reviews import api as api_comment

    api.add_namespace(api_users, path='/api/users')
    api.add_namespace(api_auth, path='/api/auth')
    api.add_namespace(api_deals, path='/api/deals')
    api.add_namespace(api_comment, path='/api/reviews')

    with app.app_context():
        db.create_all()
    return app
