from app.db_extension import db
from abc import ABC,  abstractmethod
from app.Models.User import User
from app.Models.Deal import Deal
from app.Models.Review import Comment

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
        objs = db.session.query(self.model).filter_by(**kwargs).all()
        return objs

    def get_user_by_att(self, **kwargs):
        user = db.session.query(self.model).filter_by(**kwargs).first()
        return user

class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(User)

class DealRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Deal)

class CommentRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Comment)
