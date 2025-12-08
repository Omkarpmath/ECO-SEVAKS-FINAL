# ECO-SEVAKS Deployment Guide

This guide covers deploying your full-stack application (Express.js backend + React/Vite frontend) to **Render** and **Vercel**.

---

## Prerequisites

Before deploying, ensure you have:
- A **MongoDB Atlas** account with a cluster (or another cloud MongoDB provider)
- A **GitHub** account with your project pushed to a repository
- Accounts on [Render](https://render.com) and/or [Vercel](https://vercel.com)

---

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and sign in
2. Create a new cluster (free tier is fine)
3. Click **"Connect"** → **"Connect your application"**
4. Copy your connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
   ```
5. Replace `<username>`, `<password>`, and `<database>` with your actual values
6. **Important**: Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)

---

## Step 2: Update Code for Production

### 2.1 Update Backend CORS Configuration

Edit `backend/server.js` to accept your frontend deployment URL:

```javascript
// CORS middleware - update this section
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        process.env.FRONTEND_URL // Add this line
    ].filter(Boolean),
    credentials: true
}));
```

### 2.2 Update Frontend API URL

Edit `frontend/src/data/api.js` to use environment variables:

```javascript
// Change line 4 from:
const API_URL = 'http://localhost:5001/api';

// To:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

### 2.3 Create Frontend Environment File

Create `frontend/.env.production`:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Option A: Deploy on Render (Recommended)

Render is excellent for full-stack apps as it can host both your backend and frontend.

### A1: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `ecosevaks-backend` |
   | **Root Directory** | `backend` |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

5. Click **"Advanced"** → Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5001` |
   | `MONGODB_URI` | `mongodb+srv://...` (your Atlas connection string) |
   | `JWT_SECRET` | `your-super-secure-random-string` |
   | `JWT_EXPIRE` | `30d` |
   | `SESSION_SECRET` | `another-secure-random-string` |
   | `FRONTEND_URL` | `https://your-frontend-url.onrender.com` (update after frontend deploy) |

6. Click **"Create Web Service"**
7. Wait for deployment (takes 2-5 minutes)
8. Copy your backend URL (e.g., `https://ecosevaks-backend.onrender.com`)

### A2: Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `ecosevaks-frontend` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. Add Environment Variable:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://ecosevaks-backend.onrender.com/api` |

5. Click **"Create Static Site"**
6. **After deployment**: Go back to your backend service and update the `FRONTEND_URL` environment variable with your frontend URL

### A3: Configure Redirects for React Router

Create `frontend/public/_redirects`:

```
/* /index.html 200
```

This ensures React Router works correctly on Render.

---

## Option B: Deploy on Vercel (Frontend) + Render (Backend)

Vercel is optimized for frontend frameworks. We'll use Vercel for frontend and Render for backend.

### B1: Deploy Backend on Render

Follow **Step A1** above to deploy the backend on Render.

### B2: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` (click "Edit") |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Expand **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |

6. Click **"Deploy"**

### B3: Configure Vercel for React Router

Create `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Step 3: Update Backend CORS with Final URLs

After both deployments are complete:

1. Go to your **Render backend** dashboard
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL` with your actual frontend URL:
   - Render: `https://ecosevaks-frontend.onrender.com`
   - Vercel: `https://your-project.vercel.app`
4. Click **"Save Changes"** - the service will auto-redeploy

---

## Step 4: Verify Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Try to login
4. Create an event (if logged in as organizer)
5. Check the browser console (F12) for any CORS or API errors

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches exactly with your frontend URL
- Ensure the backend is redeployed after updating environment variables

### Login Not Working
- Check that `credentials: true` is in your axios config
- Ensure `secure: true` is set for cookies in production (already configured in your server.js)

### API Calls Returning 404
- Verify `VITE_API_URL` is set correctly (with `/api` at the end)
- Check Render logs for any startup errors

### Build Failures
- Check that all dependencies are in `dependencies` (not `devDependencies`) if needed at runtime
- View build logs in Render/Vercel dashboard

---

## Environment Variables Summary

### Backend (Render)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string for JWT signing |
| `JWT_EXPIRE` | Token expiration (e.g., `30d`) |
| `SESSION_SECRET` | A long random string for sessions |
| `FRONTEND_URL` | Your deployed frontend URL |

### Frontend (Render/Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL with `/api` suffix |

---

## Quick Commands Reference

```bash
# Test build locally before deploying
cd frontend && npm run build && npm run preview

# Test backend locally in production mode
cd backend && NODE_ENV=production npm start
```

---

## Free Tier Limitations

### Render Free Tier
- Backend services **spin down** after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Limited to 750 hours/month

### Vercel Free Tier  
- Serverless functions limited to 100GB-hours
- No issues for static sites

**Tip**: For a more responsive app, consider Render's paid tier ($7/month) which keeps services always-on.

---

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
