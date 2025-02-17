from app.Persistence.repos_queries import UserRepository
from app.Models.User import User


class UserMethodes():
    def __init__(self):
        self.user_repos = UserRepository()



    def create_user(self, **data):
        from app import bcrypt
        user_pw = data['pass_word']
        if not user_pw:
            raise ValueError("password is required")
        hashed_pass = bcrypt.generate_password_hash(user_pw)
        data["pass_word"] = hashed_pass
        new_user = User(**data)
        self.user_repos.add(new_user)
        return new_user

    def get_user(self, user_id):
        user = self.user_repos.get(user_id)
        return user

    def get_user_by_email(self, email):
        user = self.user_repos.get_user_by_att(email=email)
        return user

    def get_all_users(self):
        return self.user_repos.get_all()

    def update_user(self, user_id, user_data):
        from app import bcrypt
        new_password = user_data['pass_word']
        hashed_password = bcrypt.generate_password_hash(new_password)
        user_data['pass_word'] = hashed_password
        updated_user = self.user_repos.update(user_id, user_data)
        return updated_user

    def delete_user(self, user_id):
        current_user = self.user_repos.get(user_id)
        if current_user:
            self.user_repos.delete(user_id)
            return {"user deleted"}
        return

