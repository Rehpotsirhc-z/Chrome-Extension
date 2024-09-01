import sys
from pathlib import Path
from ultralytics import YOLO
from PIL import Image


def process_image(image_path, model):
    try:
        img = Image.open(image_path)
        results = model.predict(source=img, verbose=False)
        predictions = results[0].boxes

        response = {
            "predictions": [
                {
                    "class": model.names[int(pred.cls)],
                    "confidence": float(pred.conf),
                }
                for pred in predictions
                if float(pred.conf) >= 0.5
            ]
        }

        return response

    except Exception as e:
        return {"error": str(e)}


def main(image_paths):
    model_path = Path("model/model_v9.pt")
    model = YOLO(model_path)

    for image_path in image_paths:
        if not Path(image_path).exists():
            print(f"Error: The file {image_path} does not exist.")
            continue

        result = process_image(image_path, model)
        predictions = result.get("predictions")
        class_name = predictions[0].get("class") if predictions else None
        confidence_level = predictions[0].get("confidence") if predictions else None
        ignore_classes = ["background", None]
        if class_name not in ignore_classes:
            print(f"Results for {image_path}:")
            print(f"Class: {class_name}")
            print(f"Confidence: {confidence_level}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_image1> <path_to_image2> ...")
        sys.exit(1)

    image_paths = sys.argv[1:]
    main(image_paths)
