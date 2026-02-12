from duckduckgo_search import DDGS
import json

print("Testing simple query 'test'...")
try:
    results = list(DDGS().text("test", max_results=2))
    print(f"Results: {json.dumps(results, indent=2)}")
except Exception as e:
    print(f"Error: {e}")

print("\nTesting 'Tamil Nadu schemes'...")
try:
    results = list(DDGS().text("Tamil Nadu government schemes 2025", max_results=2))
    print(f"Results: {json.dumps(results, indent=2)}")
except Exception as e:
    print(f"Error: {e}")
