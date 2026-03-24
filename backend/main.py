import os
import sys
import traceback
import json
import datetime
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from groq import Groq
from dotenv import load_dotenv
import models
import database
import auth
import web_search # Import the new web search module
from duckduckgo_search import DDGS

# 1. SETUP & CONFIG
load_dotenv()

# Initialize DB
models.Base.metadata.create_all(bind=database.engine)

CACHE = {}  # Global cache to save API credits

# Try to get API key safely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("CRITICAL ERROR: GROQ_API_KEY is missing from .env file!")
    sys.exit(1)

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Initialize App
app = FastAPI(title="GovScheme Assistant API")

# Startup Log
with open("startup_log.txt", "a") as f:
    f.write("Backend server started/reloaded (Groq Version).\n")

# CORS (Allows your React Frontend to talk to this Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ENDPOINTS ---

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    language: str = "English"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    language: str

@app.post("/api/auth/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        language=user.language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- PROFILE ENDPOINTS ---

class ProfileCreate(BaseModel):
    name: str
    age: int
    income: float
    category: str
    occupation: str

class ProfileResponse(BaseModel):
    id: int
    name: str
    age: int
    income: float
    category: str
    occupation: str
    user_id: int

@app.post("/api/profiles", response_model=ProfileResponse)
def create_profile(profile: ProfileCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_profile = models.Profile(**profile.dict(), user_id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/api/profiles", response_model=list[ProfileResponse])
def get_profiles(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Profile).filter(models.Profile.user_id == current_user.id).all()

@app.delete("/api/profiles/{profile_id}")
def delete_profile(profile_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    profile = db.query(models.Profile).filter(models.Profile.id == profile_id, models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(profile)
    db.commit()
    return {"message": "Profile deleted successfully"}

# --- CHAT HISTORY ENDPOINTS ---

class ChatSessionCreate(BaseModel):
    title: str = "New Chat"

class ChatSessionResponse(BaseModel):
    id: int
    title: str
    updated_at: str

    class Config:
        from_attributes = True

class ChatMessageResponse(BaseModel):
    id: int
    sender: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True

@app.post("/api/chats", response_model=ChatSessionResponse)
def create_chat_session(session: ChatSessionCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_session = models.ChatSession(user_id=current_user.id, title=session.title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return ChatSessionResponse(
        id=new_session.id,
        title=new_session.title,
        updated_at=new_session.updated_at.isoformat()
    )

@app.get("/api/chats", response_model=list[ChatSessionResponse])
def get_chat_sessions(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    sessions = db.query(models.ChatSession).filter(models.ChatSession.user_id == current_user.id).order_by(models.ChatSession.updated_at.desc()).all()
    return [
        ChatSessionResponse(
            id=s.id,
            title=s.title,
            updated_at=s.updated_at.isoformat()
        ) for s in sessions
    ]

@app.get("/api/chats/{session_id}", response_model=list[ChatMessageResponse])
def get_chat_messages(session_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.timestamp.asc()).all()
    return [
        ChatMessageResponse(
            id=m.id,
            sender=m.sender,
            content=m.content,
            timestamp=m.timestamp.isoformat()
        ) for m in messages
    ]

@app.delete("/api/chats/{session_id}")
def delete_chat_session(session_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    db.delete(session)
    db.commit()
    return {"message": "Chat session deleted successfully"}

# --- 2. THE BRAIN (KNOWLEDGE BASE) ---

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMES_FILE = os.path.join(BASE_DIR, "schemes.json")

def load_knowledge_base():
    try:
        with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
            schemes = json.load(f)
        
        kb_text = ""
        for scheme in schemes:
            kb_text += f"{scheme['id']}. {scheme['name']}:\n"
            for key, value in scheme['details'].items():
                kb_text += f"   - {key}: {value}\n"
            kb_text += "\n"
        return kb_text
    except Exception as e:
        print(f"Error loading schemes.json from {SCHEMES_FILE}: {e}")
        return "Error: Could not load knowledge base."

KNOWLEDGE_BASE = load_knowledge_base() # Initial load

def search_google(query):
    print(f"DEBUG: Searching Google (via DDG) for: {query}")

    try:
        # Search constrained to India (in-en) for better relevance
        results = list(DDGS().text(query, max_results=5, region='in-en'))
        if not results:
            return "No web search results found."
        
        formatted_results = ""
        for i, res in enumerate(results, 1):
            title = res.get('title', 'No Title')
            body = res.get('body', res.get('snippet', 'No details available'))
            url = res.get('href', res.get('url', 'No link'))
            formatted_results += f"{i}. {title}\nSummary: {body}\nSource: {url}\n\n"
        return formatted_results
    except Exception as e:
        print(f"Search failed: {e}")
        return "Search failed due to an error."

# --- 3. THE RULES (MASTER PROMPT) ---
MASTER_PROMPT = """
You are GovAssist.
Context: I have performed a web search for you regarding {selected_region}. Use the following Real-Time Search Results to answer the user's question:
{web_search_results}

Instructions:
1. **Priority**: Use the Search Results to answer the user's question. Focus specifically on **{selected_region}** if applicable.
2. **Fallback**: If Search Results are empty/irrelevant, **USE YOUR INTERNAL KNOWLEDGE**. Do not apologize.
3. **Region Specificity**: If the scheme has state-specific rules for {selected_region}, mention them.
4. **Tone**: Be helpful, professional, and clear.
5. **Greeting**: If the user says "hi" or "hello", introduce yourself.
6. **Language**: Respond in {request_language}.

User Question:
{user_question}
"""

# --- 4. DATA MODELS ---
class ChatRequest(BaseModel):
    message: str
    language: str = "English"  # Default to English
    state: str = "All India" # Default to All India
    session_id: Optional[int] = None # Optional session ID

class ChatResponse(BaseModel):
    response: str
    session_id: Optional[int] = None # Return session ID

# --- 5. API ENDPOINTS ---

@app.get("/")
async def root():
    return {"status": "online", "service": "GovScheme Assistant API (Groq)"}

@app.get("/api/schemes")
async def get_schemes():
    try:
        with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
            schemes = json.load(f)
        return schemes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class EligibilityRequest(BaseModel):
    age: int
    income: float
    category: str
    occupation: str

@app.post("/api/check-eligibility")
async def check_eligibility(request: EligibilityRequest):
    try:
        # Reload KB to ensure freshness
        current_kb = load_knowledge_base()
        print(f"DEBUG: Checking eligibility for {request.age}, {request.income}, {request.occupation} against {len(current_kb)} chars of data")

        # Construct the prompt
        prompt = f"""
        You are a beneficial government scheme eligibility assistant.
        Your goal is to find ANY potential matches for the user from the Knowledge Base below.

        User Details:
        - Age: {request.age}
        - Annual Income: ₹{request.income}
        - Category: {request.category} (General/OBC/SC/ST)
        - Occupation: {request.occupation}

        Knowledge Base (List of Schemes):
        {current_kb}

        Instructions:
        1. Compare the user's details against the eligibility criteria of EACH scheme.
        2. BE LENIENT: 
           - If the scheme mentions "Farmers" and the user is a "Farmer" (or similar), match it.
           - If income is close or undefined in the scheme, lean towards eligible.
           - If category matches OR is not specified in requirements, consider eligible.
        3. IGNORE state-specific restrictions for now (assume All India eligibility for this check).
        4. Return a JSON object with a list of eligible schemes.
        
        Output Format (JSON Only):
        {{
            "schemes": [
                {{
                    "name": "Exact Scheme Name From List",
                    "reason": "Brief reason why (e.g. 'You are a farmer', 'Income is below limit')"
                }}
            ]
        }}
        
        If no schemes match, return {{ "schemes": [] }}.
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",  # Updated to a model with a larger context and free tier limit
            response_format={"type": "json_object"},
        )

        response_text = chat_completion.choices[0].message.content
        
        # Clean up markdown code blocks if present
        if "```" in response_text:
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        print(f"DEBUG: LLM Response (Cleaned): {response_text}")
        return json.loads(response_text)

    except Exception as e:
        print(f"Error checking eligibility: {e}")
        error_msg = str(e).lower()
        if "rate limit" in error_msg or "quota" in error_msg or "429" in error_msg:
             raise HTTPException(status_code=429, detail="AI Service is currently busy (Rate Limit). Please wait a minute and try again.")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_optional_current_user)
):
    
    # 1. Handle Session
    # 1. Handle Session
    session_id = request.session_id
    if current_user:
        if not session_id:
            # Create new session if not provided
            new_session = models.ChatSession(user_id=current_user.id, title=request.message[:30] + "...")
            db.add(new_session)
            db.commit()
            db.refresh(new_session)
            session_id = new_session.id
        
        # Save User Message
        user_msg = models.ChatMessage(session_id=session_id, sender="user", content=request.message)
        db.add(user_msg)
        db.commit()

    # A. Check Cache First (Saves time & quota)
    cache_key = f"{request.language}_{request.message}"
    if cache_key in CACHE:
        response_text = CACHE[cache_key]
        if current_user and session_id:
             # Save Bot Message even if cached
            bot_msg = models.ChatMessage(session_id=session_id, sender="bot", content=response_text)
            db.add(bot_msg)
            # Update session timestamp
            session = db.query(models.ChatSession).get(session_id)
            session.updated_at = datetime.datetime.utcnow()
            db.commit()
        return ChatResponse(response=response_text, session_id=session_id)

    try:
        # B. Perform Web Search (Dynamic Context)
        if request.state and request.state != "All India":
             search_query = f"{request.message} scheme details {request.state} government eligibility benefits"
        else:
             search_query = f"{request.message} government scheme india central government details"
        
        # Simple heuristic to skip search for greetings
        greetings = ["hi", "hello", "hey", "namaste", "greetings", "good morning", "good afternoon", "good evening"]
        if request.message.strip().lower() in greetings:
            web_search_results = "User is greeting. No web search performed."
        else:
            web_search_results = search_google(search_query)

        # C. Prepare the "Master Prompt"
        full_prompt = MASTER_PROMPT.format(
            selected_region=request.state,
            web_search_results=web_search_results,
            request_language=request.language,
            user_question=request.message
        )
        
        # D. Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": full_prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )

        response_text = chat_completion.choices[0].message.content
        
        if not response_text:
            raise HTTPException(status_code=500, detail="Empty response from AI")
        
        # D. Save to Cache
        CACHE[cache_key] = response_text

        # E. Save Bot Message to DB
        if current_user and session_id:
            bot_msg = models.ChatMessage(session_id=session_id, sender="bot", content=response_text)
            db.add(bot_msg)
             # Update session timestamp
            session = db.query(models.ChatSession).get(session_id)
            session.updated_at = datetime.datetime.utcnow()
            db.commit()

        return ChatResponse(response=response_text, session_id=session_id)
    
    except Exception as e:
        # Error Handling (Logs error to file)
        error_msg = str(e)
        print(f"ERROR: {error_msg}")
        
        # Log to file for debugging
        with open("backend_error.log", "a") as f:
            f.write(f"Error: {error_msg}\n")
            f.write(traceback.format_exc())
            f.write("-" * 20 + "\n")

        # Generic Error Response
        return ChatResponse(response="Server is busy. Please try again later.", session_id=session_id)

if __name__ == "__main__":
    import uvicorn
    # Use PORT provided by Render or default to 8000
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)