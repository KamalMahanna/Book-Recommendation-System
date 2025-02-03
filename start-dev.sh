#!/bin/bash

# Start the backend server
echo "Starting FastAPI backend server..."
cd backend
python3 -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 &

# Wait for backend to start
sleep 5

# Start the frontend development server
echo "Starting React frontend development server..."
cd ../frontend
npm run dev

# Trap SIGINT (Ctrl+C) to kill both servers
trap 'kill $(jobs -p)' SIGINT

wait
