
import requests
import json

def test_trigger_error():
    print("Testing with 'pm kisam'...")
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/chat",
            json={"message": "pm kisam", "language": "en"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    test_trigger_error()
