# Deployment Guide: GovScheme Chatbot (Groq Version)

This guide explains how to deploy your Groq-powered GovScheme Assistant to the public internet for free.

## Prerequisites
- A GitHub account.
- A [Render](https://render.com) account (for Backend).
- A [Vercel](https://vercel.com) account (for Frontend).
- Your Groq API Key (starts with `gsk_`).

---

## Part 1: Push Code to GitHub
1. Create a new repository on GitHub (e.g., `govscheme-assistant`).
2. Push your local code to this repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/govscheme-assistant.git
   git push -u origin main
   ```

---

## Part 2: Deploy Backend to Render
1. Log in to **Render.com**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `govscheme-backend` (or similar)
   - **Region**: Closest to you (e.g., Singapore or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend` (Important!)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
     - *Note: Ensure your main.py uses `os.environ.get("PORT")` as updated.*
   - **Instance Type**: Free

5. **Environment Variables** (Click "Advanced"):
   Add the following keys:
   - `GROQ_API_KEY`: Paste your `gsk_...` key here.
   - `FRONTEND_URL`: (You will add the Vercel URL here later. For now, you can leave it blank or put `*`)
   - `PYTHON_VERSION`: `3.11.0` (Recommended)

6. Click **Create Web Service**.
7. Wait for the deployment to finish. Copy the **Render URL** (e.g., `https://govscheme-backend.onrender.com`).

---

## Part 3: Deploy Frontend to Vercel
1. Log in to **Vercel.com**.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `govscheme-assistant-main` (or just `./` if your package.json is in root. Check where `package.json` is).
     - *Note based on your structure: Your frontend code seems to be in the root or `govscheme-assistant-main` folder. Ensure Vercel points to the folder containing `package.json`.*

5. **Environment Variables**:
   Add the following key:
   - `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://govscheme-backend.onrender.com`).
     - *Important: Do NOT add a trailing slash `/` at the end.*

6. Click **Deploy**.

---

## Part 4: Final Connection
1. Once Vercel deployment is complete, copy your **Vercel App URL** (e.g., `https://govscheme-assistant.vercel.app`).
2. Go back to **Render** -> **Environment Variables**.
3. Update `FRONTEND_URL` with your Vercel URL.
4. Render will redeploy automatically.

## Updates & Maintenance
- Whenever you push changes to GitHub, Render and Vercel will automatically redeploy your app.
- If you change the Groq API key, update it in Render Environment Variables.
