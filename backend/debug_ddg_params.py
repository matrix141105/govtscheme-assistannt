from duckduckgo_search import DDGS
import json

print("Testing with region='in-en'...")
try:
    # Try different regions and max_results
    with DDGS() as ddgs:
        results = list(ddgs.text("latest government welfare schemes in Tamil Nadu list 2025", region="in-en", max_results=10))
    print(f"Results Count: {len(results)}")
    if results:
        print(f"First result: {results[0]['title']}")
except Exception as e:
    print(f"Error: {e}")

print("\nTesting without region...")
try:
    with DDGS() as ddgs:
        results = list(ddgs.text("Tamil Nadu government schemes", max_results=5))
    print(f"Results Count: {len(results)}")
    if results:
         print(f"First result: {results[0]['title']}")
except Exception as e:
    print(f"Error: {e}")
