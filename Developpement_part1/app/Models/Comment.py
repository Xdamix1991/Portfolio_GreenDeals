from app.Models.Model_base import ModelBase

from app.db_extension import db

class Comment(ModelBase):
    __tablename__ = 'comments'

    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    deal_id = db.Column(db.String(36), db.ForeignKey('deals.id'))
    comment = db.Column(db.String(256), nullable=True)
    user = db.relationship('User', back_populates='comment')
    deal = db.relationship('Deal', back_populates='comment')
