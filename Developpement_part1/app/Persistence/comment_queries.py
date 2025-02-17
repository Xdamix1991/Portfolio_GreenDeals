from app.Models.Review import Comment
from app.Persistence.repos_queries import CommentRepository
from app.Models.Deal import Deal
from app.Models.User import User
from app.Persistence.deal_queries import DealMethodes

deal_facade = DealMethodes()

class CommentMethodes():
    def __init__(self):
        self.comment_repos = CommentRepository()

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
