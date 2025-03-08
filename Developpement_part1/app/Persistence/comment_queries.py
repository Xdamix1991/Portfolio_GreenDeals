from app.Models.Review import Comment


class CommentMethodes():
    def __init__(self):
        self._comment_repos = None  # Déclaration différée

    @property
    def comment_repos(self):
        if self._comment_repos is None:  # Importation uniquement à la première utilisation
            from app.Persistence.persistence_ext import CommentRepository
            self._comment_repos = CommentRepository()
        return self._comment_repos

    def create_comment(self, **data):

        comment = Comment(**data)
        self.comment_repos.add(comment)
        return comment


    def get_comment(self, comment_id):
        comment = self.comment_repos.get(comment_id)
        return comment

    def get_all_comments(self):
        comments = self.comment_repos.get_all()
        return comments



    def update_comment(self, comment_id, data):
        current_comment = self.comment_repos.get(comment_id)
        if current_comment:
            update_comment = self.comment_repos.update(comment_id, data)
            return update_comment
        return

    def delete_comment(self, comment_id):
        current_comment = self.comment_repos.get(comment_id)
        if current_comment:
            self.comment_repos.delete(comment_id)
            return "comment deleted"
        return

    def get_comment_by_deal(self, deal_id):

        comments = self.comment_repos.get_by_deal(deal_id)
        return comments

    def get_comment_by_userid(self, user_id):
        return self.comment_repos.get_comment_by_user(user_id)

