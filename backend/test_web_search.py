from web_search import get_state_schemes, search_specific

print("Testing State Search (Tamil Nadu)...")
try:
    results = get_state_schemes("Tamil Nadu")
    print(f"Results for Tamil Nadu:\n{results[:500]}...") # Print first 500 chars
except Exception as e:
    print(f"State Search Error: {e}")

print("\nTesting Specific Search...")
try:
    results = search_specific("PM Kisan scheme details")
    print(f"Results for PM Kisan:\n{results[:500]}...")
except Exception as e:
    print(f"Specific Search Error: {e}")
