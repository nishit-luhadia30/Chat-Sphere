# 💬 ChatSphere - Advanced Real-Time Chat Application

A feature-rich, WhatsApp-inspired real-time chat application with modern UI/UX, file sharing, message reactions, and comprehensive chat management.

## 🚀 Live Demo

**Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)  
**Backend**: [https://your-api.onrender.com](https://your-api.onrender.com)

## ⚡ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Socket.IO Client
- **Backend**: Node.js + Express.js + Socket.IO + Multer
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🏗️ Project Architecture

```
ChatSphere/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── context/        # React Context (Global State)
│   │   └── utils/          # API utilities & helpers
│   └── package.json
├── server/                 # Node.js Backend
│   ├── config/            # Database & Cloudinary config
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth & file upload middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── package.json
├── DEPLOYMENT.md         # Detailed deployment guide
└── deploy-setup.md      # Quick deployment checklist
```

## ✨ Features

### 🔐 **Authentication & Security**
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes & middleware
- Secure session management

### 💬 **Real-Time Messaging**
- Instant message delivery via Socket.IO
- One-to-one private chats
- Group chat creation & management
- Typing indicators
- Online/offline status
- Message delivery & read receipts

### 📎 **File Sharing**
- **Image uploads** with inline preview
- **Audio files** with built-in playback controls
- **Document sharing** (PDF, DOC, TXT, ZIP)
- **Drag & drop** file upload interface
- **Cloud storage** via Cloudinary (10MB limit)

### 😍 **Message Interactions**
- **Emoji reactions** (👍❤️😂😮😢🔥)
- **Message editing** (10-minute time limit)
- **Message deletion** (10-minute time limit)
- **Real-time reaction sync** across all clients

### 👤 **User Profiles & Social**
- **Detailed user profiles** with avatar & status
- **Last seen** timestamps
- **Mutual groups** discovery
- **Clickable avatars** for quick profile access

### 📱 **Mobile-First Design**
- **Responsive layout** for all screen sizes
- **Mobile navigation** (chat list ↔ chat view)
- **Touch-friendly** interface
- **PWA-ready** structure

### 🔔 **Smart Notifications**
- **Real-time notifications** for new messages
- **Browser notifications** with permission handling
- **Unread message counters** with smart indicators
- **Notification management** (mark as read, clear all)

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account (for file uploads)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/chatsphere.git
cd chatsphere

# Install backend dependencies
cd server && npm install

# Install frontend dependencies  
cd ../client && npm install
```

### 2. Environment Setup

**Server (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatsphere
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary (Required for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

**Client (.env)**:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Servers

**Backend**:
```bash
cd server
npm run dev
```

**Frontend**:
```bash
cd client  
npm run dev
```

Visit `http://localhost:5173` to see the app! 🎉

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users?search=query` - Search users

### Chat Management
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create/access chat
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/rename` - Rename group
- `PUT /api/chats/groupadd` - Add user to group
- `PUT /api/chats/groupremove` - Remove user from group

### Messaging
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages` - Send text message
- `POST /api/messages/reaction` - Add/remove reaction
- `PUT /api/messages/edit` - Edit message
- `DELETE /api/messages/delete/:messageId` - Delete message

### File Upload
- `POST /api/files/upload` - Upload file (image/audio/document)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions or [deploy-setup.md](./deploy-setup.md) for a quick checklist.

### Quick Deploy:
1. **Setup Cloudinary** account
2. **Deploy backend** to Render with environment variables
3. **Deploy frontend** to Vercel  
4. **Update CORS** settings with production URLs

## 🧪 Testing Features

### Basic Chat Features:
- ✅ User registration & login
- ✅ Real-time messaging
- ✅ Group chat creation
- ✅ Typing indicators

### Advanced Features:
- ✅ File uploads (images, audio, documents)
- ✅ Message reactions (hover & click emojis)
- ✅ Edit messages (your own, within 10 minutes)
- ✅ Delete messages (your own, within 10 minutes)
- ✅ User profiles (click any avatar)
- ✅ Mobile responsive navigation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.IO** for real-time communication
- **Cloudinary** for file storage & management
- **MongoDB Atlas** for cloud database
- **Tailwind CSS** for beautiful UI components
- **React Icons** for consistent iconography

---

**Built with ❤️ by [Your Name]**

*ChatSphere - Where conversations come alive!* ✨
