
import google.generativeai as genai
import os
import sys

# Add backend to path to import config
sys.path.append(os.path.join(os.getcwd(), 'backend'))
try:
    from config import get_api_key
    api_key = get_api_key()
    print(f"API Key: {api_key[:5]}...{api_key[-5:]}")
    
    genai.configure(api_key=api_key)
    print("Listing models...")
    for m in genai.list_models():
        print(f"Model: {m.name}")
        print(f"Supported methods: {m.supported_generation_methods}")
        print("-" * 20)
        
except Exception as e:
    print(f"Error: {e}")
