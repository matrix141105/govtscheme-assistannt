# 🎯 Backend Integration - Quick Start Guide

## ✅ What's Been Done

### 1. **Backend Created** (`backend/` folder)
   - ✅ `main.py` - FastAPI server with Gemini AI integration
   - ✅ `requirements.txt` - Python dependencies
   - ✅ API endpoint: `POST /api/chat`

### 2. **Environment Configuration**
   - ✅ `.env` file created in root directory
   - ⚠️ **ACTION REQUIRED**: Add your Gemini API key

### 3. **Frontend Integration**
   - ✅ `ChatArea.tsx` updated to call backend API
   - ✅ Replaced mock responses with real AI responses
   - ✅ Error handling added

### 4. **Launch Scripts**
   - ✅ `start_app.bat` - Windows launcher
   - ✅ `start_app.sh` - Unix/Mac launcher
   - ✅ `check_setup.bat` - Setup verification

---

## 🚀 How to Run

### Step 1: Get Your API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure .env
Open `.env` and replace:
```
GEMINI_API_KEY=your_api_key_here
```
with:
```
GEMINI_API_KEY=your_actual_key_from_google
```

### Step 3: Launch
Double-click `start_app.bat` (Windows) or run `./start_app.sh` (Mac/Linux)

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://127.0.0.1:8000 |
| **API Docs** | http://127.0.0.1:8000/docs |

---

## 📊 Architecture

```
┌─────────────────┐
│  React Frontend │  (Port 5173)
│  ChatArea.tsx   │
└────────┬────────┘
         │ HTTP POST
         │ /api/chat
         ▼
┌─────────────────┐
│  FastAPI Backend│  (Port 8000)
│  main.py        │
└────────┬────────┘
         │
         │ API Call
         ▼
┌─────────────────┐
│  Google Gemini  │
│  AI Model       │
└─────────────────┘
```

---

## 🔧 Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Google Generative AI (Gemini Pro)
- Uvicorn (ASGI server)

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS

---

## 📝 Files Modified/Created

### New Files:
- ✅ `backend/main.py`
- ✅ `backend/requirements.txt`
- ✅ `.env`
- ✅ `start_app.bat`
- ✅ `start_app.sh`
- ✅ `check_setup.bat`
- ✅ `README_BACKEND.md`
- ✅ `QUICKSTART.md` (this file)

### Modified Files:
- ✅ `src/components/ChatArea.tsx` - Connected to backend
- ✅ `.gitignore` - Added Python and .env entries

---

## ⚡ Quick Commands

```bash
# Check if everything is ready
check_setup.bat

# Start both servers
start_app.bat

# Manual backend start
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Manual frontend start
npm install
npm run dev
```

---

## 🐛 Common Issues

### "GEMINI_API_KEY not set"
- Check `.env` file exists in root directory
- Verify API key is correctly pasted (no extra spaces)

### "Connection refused"
- Ensure backend is running on port 8000
- Check if another app is using port 8000

### "Module not found"
- Run: `pip install -r backend/requirements.txt`
- Ensure virtual environment is activated

---

## 🎉 You're All Set!

Once you add your API key, you can:
1. Ask about government schemes
2. Get AI-powered responses
3. Check eligibility
4. File grievances

**Enjoy your AI-powered Government Assistant! 🚀**
