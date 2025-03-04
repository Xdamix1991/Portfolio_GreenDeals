from app.Models.Model_base import ModelBase

from app.db_extension import db
from sqlalchemy.orm import validates

class Vote(ModelBase):
    __tablename__ = 'votes'
    green_vote = db.Column(db.Integer(), nullable=True)
    price_vote = db.Column(db.Integer(), nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False )
    deal_id = db.Column(db.String(36), db.ForeignKey('deals.id'), nullable=False )

    voter = db.relationship('User', back_populates='votes')
    deal = db.relationship('Deal', back_populates='votes')


    @validates('green_vote', 'price_vote')
    def validate_votes(self, key, value):
        if value is not None and value not in [1, -1]:
            raise ValueError('vote must be +1 or -1')
        return value

    def vote_to_dict(self):
        return {
            "id": self.id,
            "voter": self.user_id,
            "deal": self.deal_id,
            "price_vote": self.price_vote,
            "green_vote": self.green_vote
        }
