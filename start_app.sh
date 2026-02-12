#!/bin/bash

echo "========================================"
echo "  GovScheme Assistant - Starting..."
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv
fi

# Activate virtual environment and install dependencies
echo "Installing/Updating Python dependencies..."
source backend/venv/bin/activate
pip install -r backend/requirements.txt

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "========================================"
echo "  Starting Backend Server..."
echo "========================================"
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "========================================"
echo "  Starting Frontend Server..."
echo "========================================"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Both servers are running!"
echo "========================================"
echo "  Backend:  http://127.0.0.1:8000"
echo "  Frontend: http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Wait for processes
wait
