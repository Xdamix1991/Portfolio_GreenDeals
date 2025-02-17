from app.Persistence.repos_queries import DealRepository
from app.Persistence.user_queries import UserMethodes
from app.Models.Deal import Deal

user_facade = UserMethodes()

class DealMethodes():
    def __init__(self):
        self.deal_repos = DealRepository()

    def create_deal(self, **data):

        user = user_facade.get_user(data['user_id'])
        print(f"User found: {user}")
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

    def update_deal(self, deal_id, data):
        deal = self.deal_repos.get(deal_id)
        if deal:
            deal_updated = self.deal_repos.update(deal_id, data)
            return deal_updated
        return

    def delete_deal(self, deal_id):
        current_deal = self.deal_repos.get(deal_id)
        if current_deal:
            self.deal_repos.delete(deal_id)
            return "sucess"
        return

