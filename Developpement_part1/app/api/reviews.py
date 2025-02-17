from flask import Flask, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Models.User import User
from app.Models.Review import Comment
from app.Models.Deal import Deal
from app.Persistence.user_queries import UserMethodes
from app.Persistence.deal_queries import DealMethodes
from app.Persistence.comment_queries import CommentMethodes
from flask import jsonify

deal_facade = DealMethodes()
comment_facade = CommentMethodes()
api = Namespace('comments', description='comments routes and opperations')

comment_model = api.model('comments', {'comment': fields.String(required=True),
                                       "user_id": fields.String(required=False),
                                       "deal_id": fields.String(required=False)})



@api.route('/<deal_id>')

class CommentResource(Resource):
    @api.expect(comment_model)
    @api.response(200, 'success')
    @api.response(403, 'forbiden')

    @jwt_required()
    def post(self, deal_id):
        user = get_jwt_identity()
        user_id = user['id']
        data = api.payload
        data['user_id'] = user_id
        current_deal = deal_facade.get_deal(deal_id)
        data['deal_id'] = current_deal.id
        print(data)
        print(current_deal.id)
        new_comment = comment_facade.create_comment( **data)
        return new_comment.comment_to_dict(), 200


    def get(self):
        comments = comment_facade.get_all_comments()
        if comments:
            return [comment.comment_to_dict() for comment in comments], 201
        return {"message": "no comment found"}, 404


@api.route('/<comment_id>')
class CommentOperations(Resource):
    @api.expect(comment_model)
    @api.response(200, 'success')
    @api.response(403, 'faillure')



    def get(self, comment_id):
        comment = comment_facade.get_comment(comment_id)
        if comment:
            return comment.comment_to_dict(), 201
        return {"error": "no comment found"}, 404

    @jwt_required()
    def put(self, comment_id):
        data = api.payload
        comment = comment_facade.get_comment(comment_id)
        if comment:
            comment_upadated = comment_facade.update_comment(comment_id, data)
            return comment_upadated.comment_to_dict(), 200
        return {"error", "an error occured while updating comment"}


    @jwt_required()
    def delete(self, comment_id):
        comment = comment_facade.get_comment(comment_id)
        if comment:
            comment_facade.delete_comment(comment_id)
            return {"message": "comment was deleted"}, 200
        return {"message": "and error occured while deleting the comment"}
