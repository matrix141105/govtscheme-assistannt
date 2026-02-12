from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, ChatSession, ChatMessage

DATABASE_URL = "sqlite:///./govscheme.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("--- Users ---")
users = db.query(User).all()
for u in users:
    print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}")

print("\n--- recent Chat Sessions ---")
sessions = db.query(ChatSession).order_by(ChatSession.id.desc()).limit(5).all()
for s in sessions:
    print(f"ID: {s.id}, UserID: {s.user_id}, Title: {s.title}")

if not sessions:
    print("No sessions found.")
