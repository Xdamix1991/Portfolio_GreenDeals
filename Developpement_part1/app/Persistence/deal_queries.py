from repos_queries import DealRepository
from user_queries import facade_user
from app.Models.Deal import Deal

user_facade = facade_user()

class Deal_facade():
    def __init__(self):
        self.deal_repos = DealRepository()

    def create_deal(self, user_id, **data):
        user = user_facade.get_user(user_id)
        if user:
             new_deal = Deal(**data)
             self.deal_repos.add(new_deal)
             return new_deal
        return

    def get_deal(self, deal_id):
        deal = self.deal_repos.get(deal_id)
        return deal

    def get_deal_by_attributes(self, title, categorie):
        deal = self.deal_repos.get_by_attributes(title=title, categorie=categorie)
        return deal

    def get_all_deals(self):
        deals = self.deal_repos.get_all()
        return deals

    def delete_deal(self, deal_id):
        current_deal = self.deal_repos.get(deal_id)
        if current_deal:
            self.deal_repos.delete(deal_id)
            return "sucess"
        return

