"""
Environment configuration loader for GovScheme Assistant
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the project root directory (parent of backend folder)
backend_dir = Path(__file__).parent
project_root = backend_dir.parent

# Load .env file from project root
env_path = project_root / '.env'
load_dotenv(dotenv_path=env_path)

def get_api_key():
    """Get the Gemini API key from environment variables"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError(
            "GEMINI_API_KEY is not properly configured.\n"
            f"Please add your API key to: {env_path}\n"
            "Get your key from: https://makersuite.google.com/app/apikey"
        )
    return api_key
