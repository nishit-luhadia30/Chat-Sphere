# 🚀 Quick Deployment Setup

## 📋 Prerequisites Checklist

### ✅ **Required Accounts:**
- [ ] GitHub account (for code hosting)
- [ ] MongoDB Atlas account (database)
- [ ] Cloudinary account (file storage) - **NEW REQUIREMENT**
- [ ] Render account (backend hosting)
- [ ] Vercel account (frontend hosting)

### ✅ **Required Information:**
- [ ] MongoDB connection string
- [ ] Cloudinary credentials (Cloud Name, API Key, API Secret)
- [ ] JWT secret key

## 🔧 **Step-by-Step Deployment**

### **Step 1: Setup Cloudinary (NEW)**
1. Go to https://cloudinary.com/users/register/free
2. Create free account
3. Go to Dashboard → Copy these values:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `your_api_key`
   - **API Secret**: `your_api_secret`

### **Step 2: Deploy Backend (Render)**
1. Go to https://render.com
2. Connect GitHub repository
3. Create new **Web Service**
4. Configure:
   - **Name**: `chatsphere-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `5000`

5. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://nishit95luhadia1_db_user:chatsphere_1234@cluster0.vowiaah.mongodb.net/chatsphere
   JWT_SECRET=chatsphere_production_jwt_secret_2024
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

6. Click **Create Web Service**
7. **Copy the backend URL** (e.g., `https://chatsphere-backend.onrender.com`)

### **Step 3: Deploy Frontend (Vercel)**
1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. Click **Deploy**
6. **Copy the frontend URL** (e.g., `https://chatsphere.vercel.app`)

### **Step 4: Update Backend CLIENT_URL**
1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable with your Vercel URL
3. Redeploy backend

## 🧪 **Test Deployment**

### **Basic Features:**
- [ ] User registration/login works
- [ ] Real-time messaging works
- [ ] Notifications appear

### **Advanced Features (NEW):**
- [ ] **File Upload**: Try uploading an image
- [ ] **Reactions**: Hover over message and add emoji
- [ ] **Edit Message**: Edit your own recent message
- [ ] **Delete Message**: Delete your own recent message
- [ ] **User Profiles**: Click on user avatar

## 🚨 **Common Issues & Solutions**

### **File Upload Not Working:**
- ✅ Check Cloudinary credentials in Render environment variables
- ✅ Verify Cloudinary account is active
- ✅ Check browser console for upload errors

### **CORS Errors:**
- ✅ Verify `CLIENT_URL` matches your Vercel domain exactly
- ✅ Make sure both HTTP and HTTPS protocols match

### **Socket.IO Connection Failed:**
- ✅ Check `VITE_SOCKET_URL` points to correct backend URL
- ✅ Verify backend is running and accessible

### **Reactions/Edit/Delete Not Working:**
- ✅ Check browser console for JavaScript errors
- ✅ Verify API endpoints are responding (Network tab)
- ✅ Test with fresh messages (edit/delete has 10-minute limit)

## 🎉 **Success!**

Your ChatSphere app should now be live with all features:
- ✅ Real-time messaging
- ✅ File sharing (images, audio, documents)
- ✅ Message reactions
- ✅ Edit/delete messages
- ✅ User profiles
- ✅ Notifications

**Share your live URL**: `https://your-app.vercel.app`