import os
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import torch
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Load the model
model_path = Path("model/model_v1.pt")
model = YOLO(model_path)


def saveImgToFile(img, path):
    img.save(path)


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        img = Image.open(BytesIO(file.read()))
        results = model([img])
        predictions = results[0].boxes

        response = {"predictions": []}

        for pred in predictions:
            if float(pred.conf) < 0.5:
                print((model.names[int(pred.cls)], float(pred.conf)))
                continue

            response["predictions"].append(
                {
                    "class": model.names[int(pred.cls)],
                    "confidence": float(pred.conf),
                }
            )

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
