from app.Models.Comment import Comment
from repos_queries import CommentRepository
from app.Models.Deal import Deal
from app.Models.User import User
from deal_queries import Deal_facade
from user_queries import facade_user

class facade_comment():
    def __init__(self):
        self.comment_repos = CommentRepository()

    def create_comment(self, deal_id, **data):
        deal = Deal_facade.get_deal(deal_id)
        if deal :
            comment = Comment()
            self.comment_repos.add(comment)
            return deal
        return

    def get_comment(self, comment_id):
        comment = self.comment_repos.get(comment_id)
        return comment

    def get_all_comments(self):
        comments = self.comment_repos.get_all()
        return comments

    def update_comment(self, comment_id, **data):
        current_comment = self.comment_repos.get(comment_id)
        if current_comment:
            update_comment = self.comment_repos.update(current_comment, data)
            return update_comment
        return

    def delete_comment(self, comment_id):
        current_comment = self.comment_repos.get(comment_id)
        if current_comment:
            self.comment_repos.delete(current_comment)
            return "comment deleted"
        return 
