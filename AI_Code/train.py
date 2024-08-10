from ultralytics import YOLO
import os
import torch
import torchvision
from pathlib import Path


def train():
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"

    # paths
    dataset_config_path = Path("data.yaml")
    model_path = Path("model/model.pt")

    os.makedirs("model", exist_ok=True)

    model = YOLO("yolov8n.pt")
    model.train(data=dataset_config_path, epochs=50, batch=16, imgsz=640, device=device)

    results = model.val(data=dataset_config_path, device=device)
    metrics = results.results_dict

    accuracy = metrics["metrics/precision(B)"]
    print(f"Accuracy: {accuracy * 100:.2f}%")

    model.save(model_path)


if __name__ == "__main__":
    train()
