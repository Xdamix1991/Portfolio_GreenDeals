from app.Models.Model_base import ModelBase


from app.db_extension import db

class Deal(ModelBase):
    __tablename__ = 'deals'

    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False )
    title = db.Column(db.String(128), nullable=False)
    link = db.Column(db.String(2048), nullable=True)
    description = db.Column(db.String(2048), nullable=False)
    price = db.Column(db.Float(10), nullable=False)
    location = db.Column(db.String(256), nullable=False)
    categorie = db.Column(db.String(256), nullable=False)
    reparability = db.Column(db.Float(3), nullable=True)
    author = db.relationship('User', back_populates='deals')
    comment = db.relationship('Comment', back_populates='deal', cascade="all, delete-orphan")


    def deal_to_dict(self):
        return {
            "id": self.id,
            "owner": self.user_id,
            "title": self.title,
            "link": self.link or "",
            "description": self.description,
            "price": self.price,
            "categorie": self.categorie,
            "location": self.location,
            "reparability": self.reparability
        }
