# ChatSphere Deployment Guide

## 🚀 Deployment Options

### Option 1: Quick Deploy (Recommended)

#### Frontend - Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

#### Backend - Render
1. Connect GitHub repo to Render
2. Create new Web Service
3. Set environment variables
4. Deploy automatically

### Option 2: Manual Deploy

#### Frontend - Netlify
1. Build: `npm run build`
2. Deploy dist folder to Netlify
3. Set environment variables

#### Backend - Railway/Heroku
1. Create account and connect repo
2. Set environment variables
3. Deploy

## 📋 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatsphere
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com

# Required for File Upload Features
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🔧 Pre-Deployment Steps

### 0. Setup Cloudinary (Required for File Uploads)

1. **Create Cloudinary Account**: https://cloudinary.com/users/register/free
2. **Get API Credentials**:
   - Go to Dashboard
   - Copy: Cloud Name, API Key, API Secret
3. **Add to Environment Variables** (both local and production)

**Note**: File upload features won't work without Cloudinary configuration.

## 🔧 Pre-Deployment Steps

### 1. Update Package.json (Server)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "npm install"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Update Package.json (Client)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. Create Build Scripts
- Frontend builds to `dist/` folder
- Backend runs directly from source

## 🌐 Deployment Steps

### Step 1: Deploy Backend First

1. **Create Render Account**: https://render.com
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - Name: `chatsphere-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `5000`

4. **Set Environment Variables**:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Deploy**: Click "Create Web Service"

### Step 2: Deploy Frontend

1. **Create Vercel Account**: https://vercel.com
2. **Import Project**: Connect GitHub repo
3. **Configure Build**:
   - Framework: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com
   VITE_SOCKET_URL=https://your-backend-domain.onrender.com
   ```

5. **Deploy**: Click "Deploy"

## ✅ Post-Deployment Checklist

- [ ] Backend API accessible at deployed URL
- [ ] Frontend loads without errors
- [ ] Socket.IO connection works
- [ ] User registration/login works
- [ ] Real-time messaging works
- [ ] Notifications work
- [ ] File uploads work (images, audio, documents)
- [ ] Message reactions work
- [ ] Edit/delete messages work
- [ ] User profiles work
- [ ] MongoDB connection stable
- [ ] Cloudinary file storage works

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CLIENT_URL in backend .env
2. **Socket.IO Issues**: Check VITE_SOCKET_URL matches backend URL
3. **Build Errors**: Check Node.js version compatibility
4. **Database Issues**: Verify MongoDB Atlas connection string

### Debug Commands:
```bash
# Check backend logs
curl https://your-backend-url.com/

# Test file upload endpoint
curl -X POST https://your-backend-url.com/api/files/upload

# Check frontend build
npm run build
npm run preview

# Test Cloudinary connection
node -e "console.log(require('./server/config/cloudinary'))"
```

## 📱 Mobile Optimization

The app is already responsive and mobile-friendly:
- ✅ Touch-friendly interface
- ✅ Responsive design
- ✅ Mobile notifications
- ✅ PWA-ready structure

## 🔒 Security Considerations

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Environment variables
- ✅ Input validation

## 🚀 Go Live!

Once deployed, your ChatSphere app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Share the frontend URL with users to start chatting!