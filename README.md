
# Coy Discover

A mobile-first profile discovery and mutual matching application built as part of the Coy SDE Intern take-home assignment.

## Features

- Home and Discover navigation tabs
- 30 mock user profiles
- One profile displayed at a time
- Like and Pass actions
- Swipe gestures on profile cards
- Mutual matching system
- Match popup when two users like each other
- Matches page showing mutual matches only
- Previously swiped profiles do not reappear
- Persistent swipes and matches using JSON storage
- Responsive design for mobile and desktop

## Tech Stack

**Frontend**
- React.js
- Vite
- CSS
- Framer Motion
- Lucide React

**Backend**
- Node.js
- Express.js
- CORS
- JSON file storage

## Project Structure

coy-discover/
- client/ - React frontend
- server/ - Express backend
- server/data.json - Persistent swipe and match data

## Setup Instructions

### 1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

cd coy-discover

### 2. Start the backend

cd server

npm install

node index.js

Backend runs at http://localhost:5000

### 3. Start the frontend

Open another terminal:

cd client

npm install

npm run dev

Frontend runs at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /feed | Get profiles not yet swiped |
| POST | /swipe | Save a like or pass and check for a mutual match |
| GET | /matches | Get mutual matches only |

## Matching Logic

A match is created only when the logged-in user likes a profile that has already liked them. Unreciprocated likes are never displayed in the Matches page.

## Note

This project uses mock profile data and a single demo user. No external authentication is required.
