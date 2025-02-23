from app.Models.Model_base  import ModelBase
from sqlalchemy.orm import validates
import re

from app.db_extension import db

class User(ModelBase):
    __tablename__ = 'users'

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    pass_word = db.Column(db.String(50), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=True)
    deals = db.relationship('Deal', back_populates='author', cascade="all, delete-orphan")
    comment = db.relationship('Comment', back_populates='user', cascade="all, delete-orphan")


    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError("must enter an email")
        regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$"
        if not re.match(regex, email):
            raise ValueError("you must enter a valid email")
        return email

    @validates('pass_word')
    def validate_password(self, key, password):
        regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$"
        if not password:
            raise ValueError("you must enter a password")
        if isinstance(password, bytes):
            password = password.decode('utf-8')
        if not re.match(regex, password):
            raise ValueError("you must enter a valid password (one lowercase, one uppercase, one number, and at least 6 characters)")
        return password

    @validates('first_name', 'last_name')
    def validate_names(self, key, name):
        if not name:
            raise ValueError("must enter your first and last name")
        regex = r"^[a-zA-Zàâçéèêëîïôùûüÿ\- ']+$"
        if not re.match(regex, name):
            raise ValueError("must enter a valid first and last name")
        return name

    def user_to_dict (self):
        return  {
                "user_id": self.id,
                 "first_name": self.first_name,
                 "last_name": self.last_name,
            }
