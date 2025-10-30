# ChatSphere - Real-Time Chat Application

A WhatsApp-like real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

## Tech Stack

- **Frontend**: React + Tailwind CSS + Socket.IO Client
- **Backend**: Node.js + Express.js + Socket.IO
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + bcrypt

## Project Structure

```
/client          - React frontend
/server          - Node.js backend
```

## Setup Instructions

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Add your MongoDB URI and JWT secret to .env
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## Features

- User authentication (register/login)
- Real-time one-to-one messaging
- Group chats
- Online/offline status
- Typing indicators
- Message delivery indicators
- User profiles

## Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `PORT` - Server port (default: 5000)

### Client (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - Socket.IO server URL
