from app import db

from app.Models.Model_base  import ModelBase

class User(ModelBase):
    __tablename__ = 'users'

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    pass_word = db.Column(db.String(50), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=True)
    deals = db.relationship('Deal', back_populates='author', cascade="all, delete-orphan")
    comment = db.relationship('Comment', back_populates='user', cascade="all, delete-orphan")
