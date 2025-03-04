from flask import jsonify, request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.Persistence.user_queries import UserMethodes
from app.Persistence.deal_queries import DealMethodes
from app.Persistence.vote_queries import VoteMethodes


api = Namespace(name='votes', description='votes operation')

user_facade = UserMethodes()
deal_facade = DealMethodes()
vote_facade = VoteMethodes()

vote_model = api.model('vote', {'green_vote': fields.Integer(required=False),
                                'price_vote': fields.Integer(required=False),
                                'deal_id': fields.Integer(required=True)})

@api.route('/')
class VoteResource(Resource):
    @api.expect(vote_model)
    @api.response(200, 'Success')
    @api.response(400, 'invalid data')
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user_id = current_user['id']
        print("Post request received")
        data = api.payload
        data['user_id'] = user_id
        deal_id = data['deal_id']

        # Vérifier si le deal existe
        deal = deal_facade.get_deal(deal_id)
        if not deal:
            return {'message': 'Deal inexistant'}, 404


        existing_vote = vote_facade.get_user_vote(user_id, deal_id)
        print("existin vote", existing_vote)
        if existing_vote:

            update_data = {}
            if 'green_vote' in data:
                update_data['green_vote'] = existing_vote.green_vote + data['green_vote']

                # Limiter entre -1 et 1 pour empêcher les votes multiples
                update_data['green_vote'] = max(-1, min(1, update_data['green_vote']))

            if 'price_vote' in data:
                update_data['price_vote'] = existing_vote.price_vote + data['price_vote']

                # Limiter entre -1 et 1 pour empêcher les votes multiples
                update_data['price_vote'] = max(-1, min(1, update_data['price_vote']))

            updated_vote = vote_facade.update_vote(existing_vote.id, update_data)


            green_vote_sum, price_vote_sum = vote_facade.sum_votes(deal_id)

            return {
                'vote': updated_vote.vote_to_dict(),
                'green_vote_sum': green_vote_sum,
                'price_vote_sum': price_vote_sum,
                'success': True
            }, 200
        else:
            # Créer un nouveau vote
            new_vote = vote_facade.add_vote(**data)
            if not new_vote:
                return {'message': 'Vote non enregistré, données invalides'}, 400

            # Recalculer les sommes des votes pour le deal
            green_vote_sum, price_vote_sum = vote_facade.sum_votes(deal_id)

            return {
                'vote': new_vote.vote_to_dict(),
                'green_vote_sum': green_vote_sum,
                'price_vote_sum': price_vote_sum,
                'success': True
            }, 200
