from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import numpy as np
import base64
from flask_cors import CORS

# Kalo mau ngerun pencet F5
app = Flask(__name__)

CORS(app)

# Initializing the model
model = 'D:\\Code\\Back-End\\IsyaratKu\\model\\gesture_recognizer.task'
base_options = python.BaseOptions(model_asset_path=model)
options = vision.GestureRecognizerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.IMAGE
)
gesture_recognizer = vision.GestureRecognizer.create_from_options(options)

def process_image_with_model(base64_image):
    """Process the base64-encoded image with the Gesture Recognizer model."""
    img_data = base64.b64decode(base64_image)
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    result = gesture_recognizer.recognize(mp_image)

    if result and result.gestures:
        gesture_name = result.gestures[0][0].category_name
        gesture_score = result.gestures[0][0].score
        return {"gesture_name": gesture_name}
    else:
        return {"gesture_name": "No gesture detected"}
    
# Simple GET endpoint to test connection
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Connection successful!"})

@app.route('/api/upload', methods=['POST'])
def upload_image():
    data = request.json
    
    if not data or 'image' not in data:
        return jsonify({"error": "No image data provided!"}), 400
    
    base64_image = data['image']

    try:
        result = process_image_with_model(base64_image)
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
