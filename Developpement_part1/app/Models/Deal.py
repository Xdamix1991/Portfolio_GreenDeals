from app.Models.Model_base import ModelBase
from app.Models.queriesextension import VoteMethodes
from app.Persistence.comment_queries import CommentMethodes
from datetime import datetime, timedelta, timezone
from app.db_extension import db
import base64

vote_facade = VoteMethodes()
comment_facade = CommentMethodes()

class Deal(ModelBase):
    __tablename__ = 'deals'

    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False )
    title = db.Column(db.String(128), nullable=False)
    image = db.Column(db.LargeBinary, nullable=True)
    link = db.Column(db.String(2048), nullable=True)
    description = db.Column(db.String(2048), nullable=False)
    price_before = db.Column(db.Float(10), nullable=True)
    price = db.Column(db.Float(10), nullable=False)
    location = db.Column(db.String(256), nullable=False)
    categorie = db.Column(db.String(256), nullable=False)
    reparability = db.Column(db.Float(3), nullable=True)
    author = db.relationship('User', back_populates='deals')
    comments = db.relationship('Comment', back_populates='deal', cascade="all, delete-orphan")

    votes= db.relationship('Vote', back_populates='deal', cascade="all, delete-orphan")

    @property
    def green_vote_sum(self):
        return vote_facade.sum_votes(self.id)[0]

    @property
    def price_vote_sum(self):
        return vote_facade.sum_votes(self.id)[1]

    @property
    def deal_comments(self):
        comments = comment_facade.get_comment_by_deal(self.id)
        return comments

    def comments_number(self):
        return len(self.deal_comments)

    def time_since_creation(self):
        if self.created_at.tzinfo is None:
            self.created_at = self.created_at.replace(tzinfo=timezone.utc)
        delta = datetime.now(timezone.utc) - self.created_at
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

    def get_pseudo(self):
        from app.Persistence.user_queries import UserMethodes
        user_facade = UserMethodes()
        user = user_facade.get_user(self.user_id)
        if user:
            pseudo = user.pseudo
            return pseudo
        return

    def get_image(self):
        if self.image:
            return base64.b64encode(self.image).decode('utf-8')
        return None

    def reduction(self):
        if self.price_before:
            reduction = round((self.price_before - self.price) / self.price_before * 100)
            return f"{self.price_before}€ (-{reduction}%) = {self.price}€"
        return self.price

    def deal_to_dict(self):
        return {
            "id": self.id,
            'created_ago': self.time_since_creation(),
            "owner": self.user_id,
            "image": self.get_image() or None,
            "title": self.title,
            "link": self.link or "",
            "owner_pseudo": self.get_pseudo(),
            "description": self.description,
            "price": self.price,
            "price_before": self.price_before ,
            "reduction": self.reduction(),
            "categorie": self.categorie,
            "location": self.location,
            "reparability": self.reparability or f"N/a",
            "price_vote_sum": self.price_vote_sum,
            "green_vote_sum": self.green_vote_sum,
            "comments": [comment.comment_to_dict() for comment in self.deal_comments],
            "comments_number": self.comments_number() or 0
        }

