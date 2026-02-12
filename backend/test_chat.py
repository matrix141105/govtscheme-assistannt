import requests
import json
import time

url = "http://127.0.0.1:8000/api/chat"
headers = {"Content-Type": "application/json"}
payload = {
    "message": "Tell me about PM Kisan",
    "language": "English"
}

try:
    print(f"Sending request to {url} with payload: {payload}")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    with open("response.txt", "w", encoding="utf-8") as f:
        f.write(response.text)

    
    # Check debug log
    time.sleep(1)
    with open("backend_debug.log", "r") as f:
        log_content = f.read()
        print("\n--- Backend Debug Log Content ---")
        print(log_content)
        print("---------------------------------")

except Exception as e:
    print(f"Error: {e}")
