# Deployment Guide - MERN Stack Application

## Local Development Deployment

### Prerequisites
- Node.js v14+
- MongoDB v4.4+ (local or MongoDB Atlas)
- Git (optional)

### Step 1: Environment Setup

#### Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern_app
PORT=5000
NODE_ENV=production
JWT_SECRET=use-strong-random-key-here-minimum-32-chars
JWT_EXPIRE=7d
```

### Step 2: Install & Build

```bash
# Install dependencies
npm install

# Optional: Install all dependencies from scratch
rm -rf node_modules package-lock.json
npm install

# Start backend
npm run server
```

### Step 3: Frontend Production Build

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

## Docker Deployment (Optional)

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mern-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: mern_app

  backend:
    build: ./backend
    container_name: mern-backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGO_URI: mongodb://mongodb:27017/mern_app
      PORT: 5000
      JWT_SECRET: secret-key-change-in-production
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: mern-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## Heroku Deployment

### Step 1: Create Heroku Account
- Go to https://www.heroku.com
- Sign up and download Heroku CLI

### Step 2: Initialize Git & Heroku

```bash
git init
git add .
git commit -m "Initial commit"

heroku login
heroku create your-app-name
```

### Step 3: Add Buildpacks

```bash
heroku buildpacks:add --index 1 heroku/nodejs
```

### Step 4: Set Environment Variables

```bash
heroku config:set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern_app
heroku config:set JWT_SECRET=your-production-secret-key
heroku config:set NODE_ENV=production
```

### Step 5: Update package.json

Root `package.json`:
```json
{
  "scripts": {
    "start": "node backend/server.js",
    "build": "cd frontend && npm run build",
    "heroku-postbuild": "npm run build",
    "dev": "concurrently \"npm --prefix backend run dev\" \"npm --prefix frontend run dev\"",
    "server": "npm --prefix backend run dev",
    "client": "npm --prefix frontend run dev"
  }
}
```

### Step 6: Deploy

```bash
git push heroku main

# Check logs
heroku logs --tail
```

## AWS Deployment

### Step 1: Create EC2 Instance
- Instance type: t2.micro (free tier)
- OS: Ubuntu 20.04 LTS
- Storage: 20GB

### Step 2: SSH into Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx as reverse proxy
sudo apt install -y nginx
```

### Step 4: Clone Repository & Install

```bash
cd ~
git clone your-repo-url
cd MERN_STACK_PROJECT

npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

npm run build
```

### Step 5: Configure PM2

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'mern-backend',
    script: './backend/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGO_URI: 'mongodb://localhost:27017/mern_app',
      JWT_SECRET: 'your-secret-key'
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: Configure Nginx

Edit `/etc/nginx/sites-available/default`:
```nginx
upstream backend {
  server localhost:5000;
}

server {
  listen 80 default_server;
  server_name your-domain.com;

  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location / {
    root /home/ubuntu/MERN_STACK_PROJECT/frontend/dist;
    try_files $uri $uri/ /index.html;
  }
}
```

Restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Vercel Deployment (Frontend Only)

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Connect GitHub account

### Step 2: Deploy Frontend

```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel

# Option B: GitHub Integration
# Push to GitHub, Vercel auto-deploys
```

### Step 3: Configure Environment

In Vercel dashboard:
- Add environment variable: `VITE_API_URL=https://your-backend-api.com`

### Step 4: Update Frontend

Create `.env.production`:
```env
VITE_API_URL=https://your-backend-api.com/api
```

Update `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});
```

## Netlify Deployment (Frontend)

### Step 1: Build Frontend

```bash
cd frontend
npm run build
```

### Step 2: Deploy to Netlify

**Option A: CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option B: Web Interface**
- Drag & drop `frontend/dist` folder to Netlify

### Step 3: Configure Redirects

Create `frontend/public/_redirects`:
```
/* /index.html 200
```

## MongoDB Atlas Setup

### Step 1: Create Cluster
- Go to https://www.mongodb.com/cloud/atlas
- Create free M0 cluster
- Create database user
- Get connection string

### Step 2: Whitelist IP
- Add IP address to whitelist
- Or allow all IPs (0.0.0.0/0) for development

### Step 3: Update .env
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern_app?retryWrites=true&w=majority
```

## SSL/HTTPS Setup

### Option A: Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx

sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Option B: AWS Certificate Manager
- Request certificate in ACM
- Add to ALB/CloudFront
- Automatically managed

## Performance Optimization

### Backend
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

### Frontend
```javascript
// Code splitting
const AddAgent = React.lazy(() => import('./components/AddAgent'));

// Image optimization
import { lazy, Suspense } from 'react';
```

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 save
```

### Application Insights (Azure)
```javascript
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_KEY);
appInsights.start();
```

### Datadog
```bash
npm install dd-trace
```

## Backup & Recovery

### MongoDB Backup
```bash
# Backup
mongodump --uri mongodb+srv://user:pass@cluster.mongodb.net/mern_app --out ./backup

# Restore
mongorestore --uri mongodb+srv://user:pass@cluster.mongodb.net/mern_app ./backup/mern_app
```

### Database Export
```bash
# Export to JSON
mongoexport --uri mongodb+srv://user:pass@cluster.mongodb.net/mern_app \
  --collection agents \
  --out agents.json
```

## Maintenance Checklist

- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Update dependencies monthly
- [ ] Security patches immediately
- [ ] Performance monitoring
- [ ] User feedback tracking
- [ ] Uptime monitoring

## Cost Estimation

### Free Tier (Development)
- MongoDB Atlas: Free (M0)
- Heroku: $7/month minimum
- Vercel: Free
- AWS EC2: Free (12 months)
- Total: ~$7-10/month

### Production
- MongoDB Atlas: $57+/month (M2)
- Heroku: $50-500+/month
- AWS: $20-200+/month depending on traffic
- Total: $127+/month

---

**Deployment Guide Complete!** 🚀
