# 🚀 GovScheme Assistant - Backend Integration Guide

## Overview
This project now has a **Python FastAPI backend** integrated with **Google Generative AI (Gemini)** to power the chat functionality.

---

## 📁 Project Structure

```
govscheme-assistant-main/
├── backend/
│   ├── main.py              # FastAPI backend with Gemini AI
│   └── requirements.txt     # Python dependencies
├── src/                     # React frontend
├── .env                     # Environment variables (API keys)
├── start_app.bat           # Windows launch script
├── start_app.sh            # Unix/Linux/Mac launch script
└── README_BACKEND.md       # This file
```

---

## 🔧 Setup Instructions

### 1. **Get Your Gemini API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. **Configure Environment Variables**

Open the `.env` file in the root directory and replace `your_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. **Install Dependencies**

#### Backend (Python)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

#### Frontend (Node.js)
```bash
# From project root
npm install
```

---

## 🚀 Running the Application

### Option 1: Using the Launch Script (Recommended)

#### On Windows:
```bash
start_app.bat
```

#### On Unix/Linux/Mac:
```bash
chmod +x start_app.sh
./start_app.sh
```

This will automatically:
- Set up virtual environments
- Install dependencies
- Start both backend and frontend servers
- Open in separate terminal windows

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd backend
# Activate virtual environment
python main.py
```

#### Terminal 2 - Frontend:
```bash
npm run dev
```

---

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs (Swagger UI)

---

## 🔌 API Endpoints

### `POST /api/chat`

**Request:**
```json
{
  "message": "Tell me about PM Kisan Yojana",
  "language": "en"
}
```

**Response:**
```json
{
  "response": "PM-KISAN provides ₹6,000/year in 3 instalments..."
}
```

### `GET /`
Health check endpoint

---

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Google Generative AI (Gemini)**: AI-powered responses
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Frontend
- **React + TypeScript**: UI framework
- **Vite**: Build tool
- **TailwindCSS**: Styling

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Check if GEMINI_API_KEY is set in `.env`
- Verify virtual environment is activated

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify the fetch URL in `ChatArea.tsx` is correct

### API Key Issues
- Verify your API key is valid
- Check for any quota limits on your Google AI account
- Ensure there are no extra spaces in the `.env` file

---

## 📝 Development Notes

### Adding New Languages
Update the `language` parameter in the chat request:
```typescript
body: JSON.stringify({
  message: userInput,
  language: "hi", // Hindi, or "ta" for Tamil, etc.
})
```

### Customizing the AI Behavior
Edit the `SYSTEM_PROMPT` in `backend/main.py` to change how the AI responds.

---

## 🔒 Security Notes

- **Never commit `.env` to version control**
- Keep your API key secret
- The `.env` file is already in `.gitignore`

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Generative AI Docs](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)

---

## ✅ Next Steps

1. ✅ Backend created with FastAPI
2. ✅ Gemini AI integrated
3. ✅ Frontend connected to backend
4. ✅ Launch scripts created
5. 🎯 **Get your API key and start chatting!**

---

**Happy Coding! 🎉**
