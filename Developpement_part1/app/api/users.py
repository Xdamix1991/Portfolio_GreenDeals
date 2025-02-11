from flask import Flask, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Models.User import User
from app.Persistence.user_queries import facade_user




api = Namespace(name='users', description='User routes oppertations')

user_facade = facade_user()
user = User()
users_model = api.model('User', {'first_name': fields.String(required=True), 'last_name': fields.String(required=True),
                                 'email': fields.String(required=True), 'pass_word': fields.String(required=True),
                                 'is_admin': fields.Boolean(required=False)})


@api.route('/')

class UserReource(Resource):
    @api.expect(users_model)
    @api.response(200, 'Success')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')

    def post(self):
        data = api.payload
        user = user_facade.get_user_by_email(data['email'])
        if user :
            return {"message": "user already exist"}, 400
        else:
            new_user = user_facade.create_user(**data)
            return {'id': new_user.id,
                "message": "user was created succesfully"}, 201


@api.route('/<user_id>')

class UserOperation(Resource):
    @jwt_required
    def get(self, user_id):
        identity = get_jwt_identity()
        user = user_facade.get_user(user_id)
        if not user:
            return {'error': 'user not found'}, 404
        if user.id != identity['id']:
            return {'message': 'Unauthorized action.'}, 403
        return user

