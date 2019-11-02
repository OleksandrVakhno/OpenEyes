from flask_restful import Resource
from pickle import load
from keras.models import load_model
import cv2
from resources.Utility import Utility


tokenizer = load(open('resources/tokenizer.pkl', 'rb'))
# pre-define the max sequence length (from training)
max_length = 34
# load the model
model = load_model('resources/model_19.h5')


class CaptionGeneration(Resource):
    def post(self):
        res = Utility()
        image = res.file_upload()
        # load the photo
        print(image)
        print(type(image))
        photo = res.extract_features(image)
        # generate description
        description = res.generate_desc(model, tokenizer, photo, max_length)
        return { "status": 'success', 'data': (" ".join(description.split(" ")[1:-1]))}, 201
