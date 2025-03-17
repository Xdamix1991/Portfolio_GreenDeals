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
        print("data", data)

        # Vérifier si le deal existe
        deal = deal_facade.get_deal(deal_id)
        if not deal:
            return {'message': 'Deal inexistant'}, 404

        existing_vote = vote_facade.get_user_vote(user_id, deal_id)
        print("existing vote", existing_vote)

        if existing_vote:
            update_data = {}
            if 'green_vote' in data:
                # Check if existing_vote.green_vote is None and handle accordingly
                current_green_vote = existing_vote.green_vote or 0  # Use 0 if it's None
                update_data['green_vote'] = current_green_vote + data['green_vote']
                # Limit between -1 and 1 to prevent multiple votes
                update_data['green_vote'] = max(-1, min(1, update_data['green_vote']))

            if 'price_vote' in data:
                # Same check for price_vote
                current_price_vote = existing_vote.price_vote or 0  # Use 0 if it's None
                update_data['price_vote'] = current_price_vote + data['price_vote']
                # Limit between -1 and 1 to prevent multiple votes
                update_data['price_vote'] = max(-1, min(1, update_data['price_vote']))

            # Update the vote with the new data
            updated_vote = vote_facade.update_vote(existing_vote.id, update_data)

            # Recalculer les sommes des votes pour le deal
            green_vote_sum, price_vote_sum = vote_facade.sum_votes(deal_id)

            return {
                'vote': updated_vote.vote_to_dict(),
                'green_vote_sum': green_vote_sum,
                'price_vote_sum': price_vote_sum,
                'success': True
            }, 200

        else:
            try:
                new_vote = vote_facade.add_vote(**data)
                if not new_vote:
                    return {'message': 'Vous avez déjà voté pour ce deal', 'success': False}, 400

                # Recalculer les sommes des votes pour le deal
                green_vote_sum, price_vote_sum = vote_facade.sum_votes(deal_id)

                return {
                    'vote': new_vote.vote_to_dict(),
                    'green_vote_sum': green_vote_sum,
                    'price_vote_sum': price_vote_sum,
                    'success': True
                }, 200
            except Exception as e:
                return {'message': str(e), 'success': False}, 400
