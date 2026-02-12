"""
Simple test script to verify the backend is working correctly
"""
import requests
import json

def test_backend():
    """Test the backend API endpoint"""
    
    print("=" * 50)
    print("Testing GovScheme Assistant Backend")
    print("=" * 50)
    print()
    
    # Test 1: Health check
    print("Test 1: Health Check")
    print("-" * 50)
    try:
        response = requests.get("http://127.0.0.1:8000/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        print("✅ Health check passed!")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        print("Make sure the backend is running!")
        return
    
    print()
    
    # Test 2: Chat endpoint
    print("Test 2: Chat Endpoint")
    print("-" * 50)
    
    test_message = {
        "message": "What is PM Kisan Yojana?",
        "language": "en"
    }
    
    print(f"Sending: {json.dumps(test_message, indent=2)}")
    print()
    
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/chat",
            json=test_message,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data['response'][:200]}...")  # First 200 chars
            print("✅ Chat endpoint working!")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Chat test failed: {e}")
    
    print()
    print("=" * 50)
    print("Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_backend()
