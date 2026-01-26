# Quick Start Guide

## One-Time Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies (if not already done)
cd backend
npm install

# Install frontend dependencies (if not already done)
cd ../frontend
npm install

# Back to root
cd ..
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
# Windows: Start the MongoDB service from Services or run mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Already Configured)
The project is already configured with MongoDB Atlas.
- Connection string is in `backend/.env`
- No additional setup needed!

### 3. Create Admin User

**Easiest Method: Using Seed Script**
```bash
cd backend
node scripts/seedAdmin.js
```

This will create an admin with:
- Email: `admin@example.com`
- Password: `password123`

**Alternative: Using curl (requires backend running)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Alternative: Using Postman**
- Method: POST
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully"
}
```

## Daily Usage

### Start the Application

From the root directory:
```bash
npm run dev
```

This will:
- Start backend server on http://localhost:5000
- Start frontend on http://localhost:5173

### Access the Application
Open browser and go to: `http://localhost:5173`

Login with:
- Email: `admin@example.com`
- Password: `password123`

## Using the Application

### Step 1: Add Agents
1. On dashboard, fill "Add New Agent" form with:
   - Name: John Agent
   - Email: john@example.com
   - Mobile: +1-555-1234
   - Password: password123
2. Click "Add Agent"
3. Repeat to add more agents (5 agents recommended for optimal distribution)

### Step 2: Upload CSV File
1. Prepare CSV with columns: FirstName, Phone, Notes
   - Use `sample-data.csv` provided in project root (25 sample records)
2. Click "Upload & Distribute" button
3. Select CSV file and upload
4. System automatically distributes items equally

### Step 3: View Distributions
1. Scroll to "Agents & Distributed Lists"
2. Click on agent name to expand
3. View all tasks assigned to that agent

## Troubleshooting

### MongoDB Not Connecting
**Error:** `MongoDB Connection Error`
- Check MongoDB is running
- Verify MONGO_URI in backend/.env
- Check credentials for MongoDB Atlas

### Port 5000 Already in Use
**Error:** `Port 5000 is already in use`
```bash
# Kill process on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in backend/.env
PORT=5001
```

### Frontend Not Loading
**Error:** `Cannot GET /`
- Ensure frontend npm run dev is running
- Check http://localhost:5173 (not 5000)
- Clear browser cache and reload

### JWT Token Invalid
**Error:** `Invalid token` or `No token provided`
- Clear browser localStorage
- Logout and login again
- Check backend is running

### File Upload Not Working
**Error:** `Invalid file format` or `Failed to upload file`
- Ensure file is CSV, XLSX, or XLS
- Check file has required columns: FirstName, Phone, Notes
- Verify file size < 10MB
- Check backend/uploads directory exists

## API Testing with Postman

### Setup
1. Open Postman
2. Create new collection: "MERN App"
3. Set base URL: `http://localhost:5000`
4. Create environment variable: `token` (empty initially)

### 1. Register Admin
```
POST /api/auth/register
Body:
{
  "email": "admin@example.com",
  "password": "password123"
}
Response: { "message": "Admin registered successfully" }
```

### 2. Login
```
POST /api/auth/login
Body:
{
  "email": "admin@example.com",
  "password": "password123"
}
Response: { "token": "eyJhbGciOiJIUzI1NiIs..." }

Save token to Postman environment variable
```

### 3. Add Agent
```
POST /api/agents
Headers: Authorization: Bearer {{token}}
Body:
{
  "name": "John Agent",
  "email": "john@example.com",
  "mobile": "+1-555-1234",
  "password": "password123"
}
```

### 4. Get All Agents
```
GET /api/agents
Headers: Authorization: Bearer {{token}}
Response: [{ _id, name, email, mobile, tasks }]
```

### 5. Upload File
```
POST /api/upload
Headers: Authorization: Bearer {{token}}
Body: form-data
  file: <select CSV file>
Response: {
  "message": "File uploaded and distributed successfully",
  "totalItems": 25,
  "agentsCount": 5,
  "distributions": [...]
}
```

## Sample CSV Format

```csv
FirstName,Phone,Notes
John Doe,+1-555-0101,Primary contact
Jane Smith,+1-555-0102,Secondary contact
Robert Johnson,+1-555-0103,Decision maker
Emily Williams,+1-555-0104,HR department
Michael Brown,+1-555-0105,Finance team
```

## Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_app
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Useful Commands

```bash
# Start both servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build frontend for production
cd frontend && npm run build

# Install all dependencies
npm install && npm --prefix backend install && npm --prefix frontend install
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | Ensure mongod is running, check MONGO_URI |
| Port already in use | Change PORT in .env or kill process |
| CORS errors | Backend CORS is configured, check backend/server.js |
| Login fails | Verify admin exists and credentials are correct |
| File upload fails | Check file format (CSV/XLSX), columns exist |
| Token expired | Clear localStorage, login again |

## Performance Tips

1. Use MongoDB Atlas for production (not local)
2. Set NODE_ENV=production in .env
3. Add more agents (5+) for better distribution demo
4. Use larger CSV files (100+ rows) to see real distribution
5. Index MongoDB fields for faster queries

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong MongoDB passwords
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for secrets
- [ ] Regular backups of MongoDB

---

**Happy Building! 🚀**
