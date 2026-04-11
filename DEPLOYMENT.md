# Deployment Guide

This guide covers deploying the Project Management Web App to production.

## Prerequisites

- MongoDB Atlas account (for cloud database)
- Vercel/Netlify account (for frontend)
- Railway/Render/Heroku account (for backend)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Whitelist `0.0.0.0/0` for IP access (all IPs)
5. Create database user with read/write permissions
6. Update your connection string with credentials

## Step 2: Backend Deployment (Railway/Render)

### Using Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub
4. Select the `backend` folder as root
5. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/project-management
   JWT_SECRET=your-production-secret-key
   NODE_ENV=production
   ```
6. Deploy

### Using Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables (same as above)

## Step 3: Frontend Deployment (Vercel)

1. Update `frontend/src/services/api.js` with your backend URL:
   ```javascript
   const API_BASE = 'https://your-backend-url.com/api';
   ```

2. Or create `.env` file in frontend:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. Push code to GitHub
4. Go to [Vercel](https://vercel.com)
5. Import your repository
6. Set Root Directory to `frontend`
7. Add build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
8. Deploy

## Step 4: CORS Configuration

Update `backend/server.js` CORS settings:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true,
}));
```

## Step 5: Testing

1. Test user registration
2. Test login functionality
3. Test project creation and approval flow
4. Test WPR submission
5. Verify file uploads work correctly

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=super-secret-production-key-min-32-chars
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

## Troubleshooting

### CORS Errors
- Ensure backend CORS allows your frontend URL
- Check that requests include credentials

### Database Connection Failed
- Verify MongoDB connection string
- Check IP whitelist in Atlas
- Confirm database user credentials

### File Uploads Not Working
- Ensure `uploads` folder exists and is writable
- Check file size limits
- Verify static file serving configuration

## Post-Deployment Checklist

- [ ] MongoDB connection working
- [ ] User registration successful
- [ ] Login returns valid JWT
- [ ] Protected routes require authentication
- [ ] Project CRUD operations work
- [ ] WPR submission works
- [ ] File uploads functional
- [ ] Analytics dashboard loads
- [ ] Charts render correctly
- [ ] Mobile responsive design works
