from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from app.Persistence.user_queries import UserMethodes
from app.api.api_extensions import bcrypt



api = Namespace('auth', description='Authetification operations')

login_model = api.model('login', {'email': fields.String(required = True, description='user email'),
                                  'passWord': fields.String(required=True, description='user password')})

user_facade = UserMethodes()

@api.route('/login')

class AuthResource(Resource):

    @api.expect(login_model)
    @api.response(200, 'success')
    @api.response(401,'wrong input')

    def post(self):
        data = api.payload
        print(data)
        email = data['email']
        password = data['pass_word']
        if email :
            user = user_facade.get_user_by_email(email=email)
            print(user)
            if user:
                passwd = user.pass_word
                if  bcrypt.check_password_hash(passwd, password):
                    token = create_access_token(identity={'id': str(user.id),'is_admin': user.is_admin})
                    return {"access_token": token}, 200
                return {'error': 'invalid access passWord'}, 401
            return {'message': 'enter valid login'}, 401

@api.route('/protected')

class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        user = get_jwt_identity()
        if user['is_admin'] is True:
            return { "id": user['id'],
                "message": "hello user admin"}
        if user['is_admin'] is False:
            return {"id": user['id'],
                "message": "hello user"}, 200
