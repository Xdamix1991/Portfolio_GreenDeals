from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies
from app.Persistence.user_queries import UserMethodes
from app.api.api_extensions import bcrypt
from app.Models.User import User
from flask import make_response, jsonify


api = Namespace('logout', description='logout operations')

@api.route('/logout')
class LogOutResource(Resource):
    @jwt_required()
    def post(self):
        user = get_jwt_identity()
        if user:

            response = make_response(jsonify({"msg": "Logout successful"}))
            response.delete_cookie('access_token_cookie')
            unset_jwt_cookies(response)

        return response
