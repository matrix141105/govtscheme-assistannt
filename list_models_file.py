
import google.generativeai as genai
import os
import sys

# Add backend to path to import config
sys.path.append(os.path.join(os.getcwd(), 'backend'))
try:
    from config import get_api_key
    api_key = get_api_key()
    
    genai.configure(api_key=api_key)
    
    with open("models_clean.txt", "w", encoding="utf-8") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
    print("Models written to models_clean.txt")
        
except Exception as e:
    print(f"Error: {e}")
