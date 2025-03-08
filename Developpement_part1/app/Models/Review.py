from app.Models.Model_base import ModelBase

from datetime import datetime, timedelta

from app.db_extension import db



class Comment(ModelBase):
    __tablename__ = 'comments'

    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    deal_id = db.Column(db.String(36), db.ForeignKey('deals.id'))
    comment = db.Column(db.String(256), nullable=True)
    user = db.relationship('User', back_populates='comments')
    deal = db.relationship('Deal', back_populates='comments')

    def get_pseudo(self):
        from app.Persistence.user_queries import UserMethodes
        user_facade = UserMethodes()
        user = user_facade.get_user(self.user_id)
        if user:
            pseudo = user.pseudo
            return pseudo
        return

    def time_since_creation(self):
        delta = datetime.now() - self.created_at
        if delta < timedelta(days=1):
            if delta < timedelta(minutes=1):
                return "Posté il y a moins d'une minute"
            elif delta < timedelta(hours=1):
                minutes = delta.seconds // 60
                return f"Posté il y a {minutes} minute{'s' if minutes > 1 else ''}"
            elif delta < timedelta(days=1):
                hours = delta.seconds // 3600
                return f"Posté il y a {hours} heure{'s' if hours > 1 else ''}"
        else:

            return self.created_at.strftime('%Y-%m-%d')

    def comment_to_dict(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "deal_id": self.deal_id,
            "user_id": self.user_id,
            "pseudo": self.get_pseudo(),
            "created_ago": self.time_since_creation()

                    }
