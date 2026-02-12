from duckduckgo_search import DDGS
import json

print("Testing simple query 'test'...")
try:
    results = list(DDGS().news("Tamil Nadu welfare schemes 2025", max_results=3))
    print(f"Results: {json.dumps(results, indent=2)}")
except Exception as e:
    print(f"Error: {e}")
