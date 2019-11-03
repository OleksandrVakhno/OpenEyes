from flask import request
from keras.applications.vgg16 import VGG16
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.preprocessing.sequence import pad_sequences
from numpy import argmax
from keras.models import Model



class Utility:
    def file_upload(self):
        file = request.files['file']
        if file is None:
            raise ValueError("Image is not found")
        return file

    # map an integer to a word
    def word_for_id(self, integer, tokenizer):
        for word, index in tokenizer.word_index.items():
            if index == integer:
                return word
        return None

    def extract_features(self, image):
        import keras.backend.tensorflow_backend as tb
        tb._SYMBOLIC_SCOPE.value = True
        import ssl
        ssl._create_default_https_context = ssl._create_unverified_context
        # load the model
        model = VGG16()
        # re-structure the model
        model.layers.pop()
        model = Model(inputs=model.inputs, outputs=model.layers[-1].output)

        image = load_img(image, target_size=(224, 224))
        # convert the image pixels to a numpy array
        image = img_to_array(image)
        # reshape data for the model
        image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
        # prepare the image for the VGG model
        image = preprocess_input(image)
        # get features
        feature = model.predict(image, verbose=0)
        return feature

    def generate_desc(self, model, tokenizer, photo, max_length):
        # seed the generation process
        in_text = 'startseq'
        # iterate over the whole length of the sequence
        for i in range(max_length):
            # integer encode input sequence
            sequence = tokenizer.texts_to_sequences([in_text])[0]
            # pad input
            sequence = pad_sequences([sequence], maxlen=max_length)
            # predict next word
            yhat = model.predict([photo, sequence], verbose=0)
            # convert probability to integer
            yhat = argmax(yhat)
            # map integer to word
            word = self.word_for_id(yhat, tokenizer)
            # stop if we cannot map the word
            if word is None:
                break
            # append as input for generating the next word
            in_text += ' ' + word
            # stop if we predict the end of the sequence
            if word == 'endseq':
                break
        return in_text
