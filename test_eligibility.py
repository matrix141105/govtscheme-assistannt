import urllib.request
import json
import time

url = "http://127.0.0.1:8000/api/check-eligibility"
data = json.dumps({
    "age": 20,
    "income": 5000,
    "category": "General",
    "occupation": "student"
}).encode("utf-8")

req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

print("Starting request...")
start_time = time.time()
try:
    with urllib.request.urlopen(req) as response:
        result = response.read().decode("utf-8")
        print("Success!")
        print(result)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} - {e.reason}")
    print(e.read().decode("utf-8"))
except Exception as e:
    print(f"Exception: {e}")

print(f"Took {time.time() - start_time:.2f} seconds")
