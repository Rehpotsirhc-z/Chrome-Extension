import requests
from pathlib import Path


if __name__ == "__main__":
    image_path = Path("test.jpg")
    server_url = "http://localhost:5000/predict"

    file = image_path.read_bytes()
    files = {"file": file}

    response = requests.post(server_url, files=files)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.status_code}")
