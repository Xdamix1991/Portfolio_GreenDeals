from app.Models.Review import Comment
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.Persistence.user_queries import UserMethodes
from app.Persistence.deal_queries import DealMethodes
from app.Persistence.comment_queries import CommentMethodes
from flask_restx import Namespace, Resource, fields

api = Namespace(name='comments', description='comments opperations')

user_facade = UserMethodes()
deal_facade = DealMethodes()
comment_facade = CommentMethodes()

comment_model = api.model('comment', {'comment': fields.String(required=True)})



@api.route('/')
class CommentRessource(Resource):
    @api.expect(comment_model)
    @api.response(200, 'Success')
    @api.response(400, 'invalid data')

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        if not current_user:
            return {'message': 'need to be connected to post a comment'}
        userId = current_user['id']
        data = api.payload
        data['user_id'] = userId
        new_comment = comment_facade.create_comment(**data)



    def get(self):
        deal_id = request.args.get("deal_id", type=int)
        if not deal_id:
            return {"error": "deal_id est requis"}, 400

        comments = comment_facade.get_comment_by_deal(deal_id)
        print("comments", comments)
        return [comment.comment_to_dict() for comment in comments]

@api.route('/<comment_id>')
class CommentOperations(Resource):
    @api.expect(comment_model)
    @api.response(200, 'Success')
    @api.response(400, 'invalid data')
    @api.response(404, 'not found')

    @jwt_required()
    def get(self, comment_id):
        user = get_jwt_identity()
        if user:
            comment = comment_facade.get_comment(comment_id)
            return comment.comment_to_dict()
        return {'message': "you need to be connected"}


    @jwt_required()
    def put(self, comment_id):
        user = get_jwt_identity()
        if user:
            user_id = user['id']
            data = api.payload
            data['user_id'] = user_id
            current_comment = comment_facade.get_comment(comment_id)
            if current_comment:
                updated_comment = comment_facade.update_comment(comment_id, data)
                return updated_comment.comment_to_dict()
            return {'error': "error happend when geting the comment"}
        return {'message': "user not found"}


    @jwt_required()
    def delete(self, comment_id):
        user = get_jwt_identity()
        if user:
            comment = comment_facade.get_comment(comment_id)
            if comment :
                comment_facade.delete_comment(comment_id)
                return {'message': 'success'},200

            return {'error': 'comment not found or error'}
        return {'error': 'user not connected or error'}
