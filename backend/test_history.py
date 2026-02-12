import requests
import auth
from datetime import timedelta

# Generate a token for User ID 1 (SujayPatibandla, email from check_db output)
# I need email. Let's assume it's valid.
# check_db output: ID: 1, Name: SujayPatibandla, Email: ... (didn't see email fully)
# Let me query email first.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User

DATABASE_URL = "sqlite:///./govscheme.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

user = db.query(User).filter(User.id == 1).first()
if not user:
    print("User 1 not found")
    exit(1)

print(f"Generating token for {user.email}")
access_token = auth.create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=30))

headers = {"Authorization": f"Bearer {access_token}"}
url = "http://127.0.0.1:8000/api/chats"

try:
    print(f"Requesting {url}")
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
