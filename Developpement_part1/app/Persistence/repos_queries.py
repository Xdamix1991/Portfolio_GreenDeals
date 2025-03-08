from app.db_extension import db
from abc import ABC,  abstractmethod
from app.Models.User import User
from app.Models.Deal import Deal
from app.Models.Review import Comment
from app.Models.Vote import Vote

class Repository(ABC):

    @abstractmethod
    def add(self, obj):
        pass

    @abstractmethod
    def get(self, obj_id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def update(self, obj_id, data):
        pass

    @abstractmethod
    def delete(self, obj_id):
        pass

    @abstractmethod
    def get_by_attributes(self, **kwargs):
        pass





class SQLAlchemyRepository(Repository):

    def __init__(self, model):
        self.model = model

    def add(self, obj):
        db.session.add(obj)
        db.session.commit()

    def get(self, obje_id):
        return db.session.get(self.model, obje_id)

    def get_all(self):
        return db.session.query(self.model).all()

    def update(self, obj_id, data):
       db.session.query(self.model).filter(self.model.id == obj_id).update(data)
       db.session.commit()
       return self.get(obj_id)

    def delete(self, obj_id):
        obj = self.get(obj_id)
        if obj:
            db.session.delete(obj)
            db.session.commit()

    def get_by_attributes(self, **kwargs):

        query = db.session.query(self.model)

        if 'name' in kwargs and kwargs['name']:
            search_term = f"%{kwargs['name']}%"
            query = query.filter(
                self.model.title.ilike(search_term) |
                self.model.categorie.ilike(search_term) |
                self.model.description.ilike(search_term)
            )

        filters = {
            'title': self.model.title,
            'categorie': self.model.categorie,
            'user_id': self.model.user_id,
            'reparability': self.model.reparability,
            'price': self.model.price
        }

        for key, column in filters.items():
            if key in kwargs and kwargs[key] is not None:
                if key == 'price' and isinstance(kwargs[key], tuple):
                    query = query.filter(self.model.price.between(kwargs[key][0], kwargs[key][1]))
                else:
                    query = query.filter(column == kwargs[key])


        result = query.order_by(self.model.created_at.desc()).all()
        return result

    def get_user_by_att(self, **kwargs):
        user = db.session.query(self.model).filter_by(**kwargs).first()
        return user


    def get_by_deal(self, deal_id):
        objs = db.session.query(self.model).filter(self.model.deal_id == deal_id).all()
        return objs

    def get_user_vote(self, user_id, deal_id):
        return db.session.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.deal_id == deal_id
        ).first()

    def get_comment_by_user(self, user_id, deal_id):
        return db.session.query(self.model).filter(
            self.model.user_id == user_id).all()

class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(User)

class DealRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Deal)

class CommentRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Comment)

class VoteRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Vote)
