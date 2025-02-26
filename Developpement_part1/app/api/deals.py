from flask import jsonify, request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.Models.User import User
from app.Models.Deal import Deal
from app.Persistence.user_queries import UserMethodes
from app.Persistence.deal_queries import DealMethodes

api = Namespace(name='deals', description='deals operations')

user_facade = UserMethodes()
deal_facade = DealMethodes()




deal_model = api.model('deal', {'title': fields.String(required=True),
                                'link': fields.String(required=False), 'description': fields.String(required=True),
                                'price': fields.Float(required=True), 'location': fields.String(required=True),
                                'categorie': fields.String(required=True), 'reparability': fields.Float(required=False)})


@api.route('/')
class DealsResource(Resource):
    @api.expect(deal_model)
    @api.response(200, 'Success')
    @api.response(400, 'invalid data')

    @jwt_required()
    def post(self):
        token = get_jwt()

        if not token:
            return {'message': 'Token manquant'}, 401

        current_user = get_jwt_identity()
        print(current_user)
        user_id = current_user['id']
        print(user_id)
        data = api.payload
        data['user_id'] = user_id
        new_deal = deal_facade.create_deal(**data)
        return new_deal.deal_to_dict(), 200


    def get(self):
        filters= request.args.to_dict()

        if 'name' in filters:
            filters['name'] = filters.pop('name')  #

        print("Filters reçus dans deals.py:", filters)
        if filters.get('categorie') == "null" or filters.get('categorie') == '':
            filters['categorie'] = None
        if filters.get('price') == "null"or filters.get('price') == '':
            filters['price'] = None
        if filters.get('reparability') == "null" or filters.get('reparability') == '':
            filters['reparability'] = None

        if filters.get('price'):
            price_range = filters['price'].split('-')  # Par exemple '0-50'
            if len(price_range) == 2:
                filters['price'] = (price_range[0], price_range[1])

        deals = deal_facade.get_deal_by_attributes(**filters)
        print("resultat du filtre", deals)
        return [deal.deal_to_dict() for deal in deals]


@api.route('/<deal_id>')
class DealOpperations(Resource):
    @api.expect(deal_model)
    @api.response(201, 'Success')
    @api.response(400, 'invalid data')
    @jwt_required()

    def get(self, deal_id):
        deal = deal_facade.get_deal(deal_id)
        if deal:
            return deal.deal_to_dict(), 201
        return {"message": "no deal found"}

    @jwt_required()
    def put(self, deal_id):
        data = api.payload
        current_deal = deal_facade.get_deal(deal_id)
        if current_deal:
            deal_updated = deal_facade.update_deal(deal_id, data)
            return deal_updated.deal_to_dict(), 200
        return {"message": "error on updating not found"}

    @jwt_required()
    def delete(self, deal_id):
        deal = deal_facade.get_deal(deal_id)
        if deal:
            deal_facade.delete_deal(deal_id)
            return {"message": "deleted successufully"}, 200
        return {"erro": "an error hapend while trying to delete"}, 403
