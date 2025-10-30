# ChatSphere Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatsphere
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the React app:
```bash
npm start
```

## MongoDB Setup Options

### Option 1: Local MongoDB
Install MongoDB locally and run:
```bash
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in server `.env`

## Testing the Application

1. Open http://localhost:3000
2. Sign up with a new account
3. Open another browser/incognito window
4. Sign up with another account
5. Search for users and start chatting
6. Test real-time messaging, typing indicators, and group chats

## Features Implemented

✅ User authentication (JWT)
✅ Real-time messaging (Socket.IO)
✅ One-to-one chats
✅ Group chats
✅ User search
✅ Typing indicators
✅ Message history
✅ Responsive design

## Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect to Render/Heroku
3. Add environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)
Already cloud-based, just update connection string

## Troubleshooting

**Socket.IO not connecting:**
- Check CORS settings in server.js
- Verify REACT_APP_SOCKET_URL is correct
- Check firewall settings

**MongoDB connection failed:**
- Verify MongoDB is running
- Check connection string format
- Ensure IP is whitelisted (Atlas)

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage and re-login

## Next Steps (Phase 2)

- [ ] Message reactions
- [ ] File/image uploads (Cloudinary)
- [ ] Voice/video calls (WebRTC)
- [ ] Message search
- [ ] Dark mode
- [ ] Push notifications
- [ ] Read receipts
- [ ] User status (online/offline)
