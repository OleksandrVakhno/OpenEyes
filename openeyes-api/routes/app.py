from flask import Flask
from flask import Blueprint
from flask_restful import Api
from resources.CaptionGenerator import CaptionGeneration


app = Flask(__name__)
api_bp = Blueprint('api', __name__)
api = Api(api_bp)


# Route
api.add_resource(CaptionGeneration, '/process_image')


