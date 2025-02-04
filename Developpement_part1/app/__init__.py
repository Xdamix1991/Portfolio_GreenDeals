from flask import Flask
from config import DevelopementConfig
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
def creat_app(config_classe=DevelopementConfig):
    app = Flask(__name__)
    app.config.from_object(config_classe)
    db.init_app(app)

    from app.Models import User, Deal, Comment
    with app.app_context():
        
        db.create_all()
    return app
