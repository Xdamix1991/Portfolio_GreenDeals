from app.Models.Vote import Vote

class VoteMethodes():
    def __init__(self):
        self._vote_repo = None  # Initialisation différée

    @property
    def vote_repo(self):
        if self._vote_repo is None:  # Importation uniquement à la première utilisation
            from app.Persistence.repos_queries import VoteRepository
            self._vote_repo = VoteRepository()
        return self._vote_repo

    def add_vote(self, **data):
        # Vérifier que les valeurs sont entre -1 et 1
        if 'green_vote' in data:
            data['green_vote'] = max(-1, min(1, data['green_vote']))
        if 'price_vote' in data:
            data['price_vote'] = max(-1, min(1, data['price_vote']))

        new_vote = Vote(**data)
        self.vote_repo.add(new_vote)
        return new_vote

    def get_user_vote(self, user_id, deal_id):
        return self.vote_repo.get_user_vote(user_id, deal_id)

    def update_vote(self, vote_id, data):
        return self.vote_repo.update(vote_id, data)

    def sum_votes(self, deal_id):
        votes = self.vote_repo.get_by_deal(deal_id)
        green_vote_sum = sum(vote.green_vote if vote.green_vote is not None else 0 for vote in votes)
        price_vote_sum = sum(vote.price_vote if vote.price_vote is not None else 0 for vote in votes)
        return green_vote_sum, price_vote_sum
