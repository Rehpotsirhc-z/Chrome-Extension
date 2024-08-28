import requests

def predict_text(text):
    url = "http://127.0.0.1:5000/predict"
    data = {"text": text}
    response = requests.post(url, json=data)
    return response.json()

if __name__ == "__main__":
    command = ""

    while command != "quit":
        command = input("Enter text: ")
        result = predict_text(command)
        print(f"Prediction: {result['prediction']}")