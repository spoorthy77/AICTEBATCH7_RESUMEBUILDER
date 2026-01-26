# MERN Stack Application - Admin Dashboard

A complete MERN (MongoDB, Express, React, Node.js) stack application for managing agents and distributing task lists.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create admin user
cd backend && node scripts/seedAdmin.js

# Start both servers
cd .. && npm run dev
```

Visit http://localhost:5173 and login with:
- **Email:** admin@example.com
- **Password:** password123

📖 For detailed setup, see [QUICKSTART.md](QUICKSTART.md)
🎬 For video recording guide, see [VIDEO_RECORDING_GUIDE.md](VIDEO_RECORDING_GUIDE.md)
✅ For testing checklist, see [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

---

## Features

### 1. **User Authentication**
- Admin login with email and password
- JWT-based authentication
- Secure session management
- Logout functionality

### 2. **Agent Management**
- Add new agents with:
  - Name
  - Email
  - Mobile number (with country code)
  - Password
- View all agents
- Display agents and their assigned tasks

### 3. **File Upload & Distribution**
- Upload CSV/Excel files with columns:
  - FirstName (Text)
  - Phone (Number/Text)
  - Notes (Text)
- Automatic distribution of items equally among agents
- Remaining items distributed sequentially
- File format validation (CSV, XLSX, XLS)
- File size limit: 10MB

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CSV-parser** - CSV file parsing
- **XLSX** - Excel file parsing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS** - Styling (responsive design)

## Project Structure

```
MERN_STACK_PROJECT/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js      (Login & registration)
│   │   ├── agentController.js     (Agent management)
│   │   └── uploadController.js    (File upload & distribution)
│   ├── middleware/
│   │   └── authMiddleware.js      (JWT verification)
│   ├── models/
│   │   ├── Admin.js               (Admin schema)
│   │   ├── Agent.js               (Agent schema)
│   │   └── Distribution.js        (Distribution records)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── agentRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── fileParser.js          (CSV/Excel parsing)
│   │   └── distribute.js          (Distribution logic)
│   ├── uploads/                   (Uploaded files)
│   ├── .env.example               (Environment variables template)
│   ├── package.json
│   └── server.js                  (Entry point)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           (API configuration)
│   │   ├── components/
│   │   │   ├── AddAgent.jsx       (Add agent form)
│   │   │   ├── AgentList.jsx      (Display agents & tasks)
│   │   │   └── UploadFile.jsx     (File upload form)
│   │   ├── context/
│   │   │   └── AuthContext.jsx    (Authentication state)
│   │   ├── pages/
│   │   │   ├── Login.jsx          (Login page)
│   │   │   └── Dashboard.jsx      (Main dashboard)
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.css
│   │   │   └── components.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── package.json                   (Root scripts)
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone/Setup Project

```bash
cd MERN_STACK_PROJECT
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Setup Backend Environment

Create a `.env` file in the backend directory based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and configure:
```env
MONGO_URI=mongodb://localhost:27017/mern_app
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 5: Start MongoDB (if using local)

```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
# or
mongod
```

### Step 6: Create Admin User (First Time Setup)

**Option A: Using Seed Script (Recommended)**
```bash
cd backend
node scripts/seedAdmin.js
```

This will create an admin with:
- Email: admin@example.com
- Password: password123

**Option B: Using API**
Start the backend server first, then make a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Option C: Use the API from frontend**
After starting both servers, you can register through the login page.

### Step 7: Run the Application

**Option A: Run both servers separately (in two terminals)**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Run both servers from root directory (recommended)**
```bash
npm run dev
```

This uses `concurrently` to run both servers simultaneously.

## Running Commands

From the root directory:

```bash
# Run both backend and frontend
npm run dev

# Run only backend
npm run server

# Run only frontend
npm run client

# Start backend (production)
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (development)

### Agents
- `GET /api/agents` - Get all agents (requires auth)
- `POST /api/agents` - Add new agent (requires auth)
- `GET /api/agents/:id` - Get agent by ID (requires auth)
- `PUT /api/agents/:id/tasks` - Update agent tasks (requires auth)

### File Upload
- `POST /api/upload` - Upload and distribute file (requires auth)
- `GET /api/upload/distributions` - Get all distributions (requires auth)
- `GET /api/upload/distributions/:id` - Get distribution by ID (requires auth)

## Demo Credentials

After setup, use these credentials to login:
- **Email:** admin@example.com
- **Password:** password123

## File Upload Format

The CSV/Excel file should have the following columns:

| FirstName | Phone | Notes |
|-----------|-------|-------|
| John | 1234567890 | Notes about John |
| Jane | 9876543210 | Notes about Jane |
| ... | ... | ... |

Example CSV:
```
FirstName,Phone,Notes
John Doe,+1-555-1234,Primary contact
Jane Smith,+1-555-5678,Secondary contact
Bob Johnson,+1-555-9012,Manager
```

## Distribution Logic

Items are distributed **equally** among agents:
- If you have 25 items and 5 agents: each gets 5 items
- If you have 26 items and 5 agents: 1st agent gets 6, others get 5
- Remaining items are distributed sequentially to the first N agents

## Database Models

### Admin
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Agent
```javascript
{
  name: String,
  email: String (unique),
  mobile: String,
  password: String (hashed),
  tasks: [{
    firstName: String,
    phone: String,
    notes: String
  }],
  createdAt: Date
}
```

### Distribution
```javascript
{
  fileName: String,
  uploadedAt: Date,
  totalItems: Number,
  distributions: [{
    agentId: ObjectId,
    agentName: String,
    items: [{
      firstName: String,
      phone: String,
      notes: String
    }]
  }]
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- Verify credentials for MongoDB Atlas

### Port Already in Use
- Change PORT in `.env` (backend)
- Change Vite port in `frontend/vite.config.js`

### CORS Errors
- Backend CORS is enabled for all origins in development
- Modify in `backend/server.js` if needed

### File Upload Not Working
- Check `backend/uploads/` directory exists
- Ensure file is CSV/XLSX/XLS format
- Check file size (max 10MB)

### JWT Token Expired
- Clear browser localStorage
- Login again to get new token

## Features Walkthrough

### 1. Login
1. Visit `http://localhost:5173` (frontend)
2. Enter admin email and password
3. Click "Login"

### 2. Add Agents
1. On dashboard, fill in the "Add New Agent" form
2. Add at least 1 agent (more recommended)
3. Click "Add Agent"

### 3. Upload & Distribute
1. Prepare CSV/Excel file with required columns
2. Click "Upload & Distribute" button
3. Select file and upload
4. Items automatically distributed among agents

### 4. View Agents & Tasks
1. See all agents in "Agents & Distributed Lists" section
2. Click agent to expand and view assigned tasks
3. Click "Refresh" to reload agent list

## Security Features

- JWT-based authentication with 7-day expiration
- Passwords hashed with Bcryptjs (salt rounds: 10)
- Protected API endpoints (require valid token)
- File type validation (only CSV/XLSX/XLS)
- File size limit (10MB)
- Password stored securely in database

## Performance Considerations

- Efficient file parsing with streaming for large CSV files
- Indexed MongoDB queries
- JWT tokens for stateless authentication
- Responsive frontend with smooth animations

## Future Enhancements

- Email notifications for agents
- Task status tracking
- Agent performance analytics
- Batch upload with scheduling
- Role-based access control (admin, supervisor, agent)
- Task reassignment functionality
- Export agent tasks to PDF

## Deployment

### Backend (Heroku/AWS)
```bash
# Set environment variables on platform
# Push to platform

git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build/ folder
```

## Support & Contact

For issues or questions:
1. Check the troubleshooting section
2. Review MongoDB & Express documentation
3. Check React documentation for frontend issues

## Project Files Summary

### Key Files
- **backend/server.js** - Express server entry point
- **backend/scripts/seedAdmin.js** - Admin user creation script
- **backend/models/** - MongoDB Mongoose schemas
- **backend/controllers/** - Business logic handlers
- **backend/routes/** - API endpoint definitions
- **backend/utils/** - Helper functions for file parsing and distribution
- **frontend/src/App.jsx** - React app entry with routing
- **frontend/src/pages/Login.jsx** - Login page component
- **frontend/src/pages/Dashboard.jsx** - Main dashboard
- **frontend/src/components/** - Reusable React components
- **sample-data.csv** - Sample CSV file with 25 test records

### Documentation Files
- **README.md** - Complete project documentation (this file)
- **QUICKSTART.md** - Quick setup and usage guide
- **VIDEO_RECORDING_GUIDE.md** - Step-by-step video recording instructions
- **TESTING_CHECKLIST.md** - Comprehensive testing checklist

## Technical Implementation Details

### Backend Architecture
- **Express.js** server with modular routing
- **MongoDB Atlas** cloud database for production
- **Mongoose** ODM for schema validation
- **JWT** tokens with 7-day expiration
- **Bcryptjs** for password hashing (salt rounds: 10)
- **Multer** for file upload handling
- **CSV-parser** for CSV parsing
- **XLSX** library for Excel file parsing

### Frontend Architecture
- **React 19** with functional components and hooks
- **Vite** for fast development and build
- **Axios** for API communication with interceptors
- **Context API** for global authentication state
- **CSS Modules** for component styling
- **Responsive design** with mobile-first approach

### Security Implementation
- JWT-based stateless authentication
- Password hashing before database storage
- Protected API endpoints with middleware
- CORS configuration for secure cross-origin requests
- File type validation (CSV, XLSX, XLS only)
- File size limit (10MB max)
- Input validation on both frontend and backend
- No sensitive data in localStorage except JWT token

### Distribution Algorithm
```javascript
// Equal distribution with sequential remainder distribution
itemsPerAgent = floor(totalItems / totalAgents)
remainingItems = totalItems % totalAgents

// First N agents get one extra item where N = remainingItems
// Example: 26 items, 5 agents
//   - itemsPerAgent = 5
//   - remainingItems = 1
//   - Agent 1: 6 items, Agents 2-5: 5 items each
```

## License

MIT License - Feel free to use for personal and commercial projects.

## Acknowledgments

- Built with MERN stack (MongoDB, Express, React, Node.js)
- UI inspiration from modern dashboard designs
- Distribution algorithm based on equal division with remainder handling

---

**Happy Coding! 🚀**

---

## 📹 Video Demonstration

**Video Link:** [Add your Google Drive link here after recording]

The video demonstrates:
1. ✅ Application startup (backend + frontend)
2. ✅ Admin login with JWT authentication
3. ✅ Adding 5 agents with validation
4. ✅ Uploading CSV file (25 items)
5. ✅ Automatic equal distribution (5 items per agent)
6. ✅ Viewing distributed tasks for each agent
7. ✅ Error handling and validation
8. ✅ Security features (logout, token management)
9. ✅ Complete workflow demonstration

Duration: ~10-12 minutes

---

**Project Completed:** ✓  
**Last Updated:** January 26, 2026
