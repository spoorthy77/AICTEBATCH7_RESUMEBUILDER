# Quick Reference Guide

## 🚀 Common Commands

### Start the Application
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Initialize the Project
```bash
# Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Seed database with admin user
cd backend
node scripts/seedAdmin.js
```

### Development Tasks

```bash
# Lint frontend code
cd frontend
npm run lint

# Check for syntax errors
npm run type-check

# View test data
ls data/test/

# View sample data
ls data/samples/
```

## 📂 Important File Locations

| Task | File Location |
|------|----------------|
| Add API endpoint | `/backend/routes/*.js` |
| Add business logic | `/backend/controllers/*.js` |
| Create database schema | `/backend/models/*.js` |
| Add React component | `/frontend/src/components/*.jsx` |
| Create new page | `/frontend/src/pages/*.jsx` |
| Style components | `/frontend/src/styles/*.css` |
| Setup API client | `/frontend/src/api/axios.js` |
| Environment variables | `/backend/.env` |
| Test CSV files | `/data/test/` |
| Sample CSV files | `/data/samples/` |

## 🔌 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/login        # Login with email/password
GET    /api/auth/verify       # Verify current session
POST   /api/auth/logout       # Logout
```

### Agents
```
GET    /api/agents            # Get all agents
POST   /api/agents            # Create new agent
GET    /api/agents/:id        # Get specific agent
PUT    /api/agents/:id        # Update agent
DELETE /api/agents/:id        # Delete agent
```

### File Upload
```
POST   /api/upload            # Upload & distribute CSV/Excel
GET    /api/upload/distributions     # Get all distribution history
GET    /api/upload/distributions/:id # Get specific distribution
```

## 🗂️ Project Folder Structure (Quick View)

```
MERN_STACK_PROJECT/
├── backend/           ← Server code
├── frontend/          ← React app
├── data/              ← CSV files
├── docs/              ← Documentation
└── .config/           ← Config & guides
```

## 🎯 Frontend Component Tree

```
App (main)
├── Login (page)
└── Dashboard (page)
    ├── AddAgent (component)
    ├── AgentList (component)
    └── UploadFile (component)
```

## 📊 CSV File Format

**Required Columns:**
- `FirstName` - Person's name
- `Phone` - Phone number

**Optional Columns:**
- `Notes` - Additional information

**Example:**
```
FirstName,Phone,Notes
John Smith,+1-555-0001,Manager
Jane Doe,+1-555-0002,Sales Rep
```

## 🧪 Testing with Different Data Sizes

| File | Records | Use Case |
|------|---------|----------|
| `test-data-5.csv` | 5 | Quick test |
| `test-data-10.csv` | 10 | Basic test |
| `test-data-20.csv` | 20 | Medium test |
| `test-data-50.csv` | 50 | Large test |
| `clients-*.csv` | ~10 | Realistic data |

## 🔑 Default Credentials

**Email:** `admin@example.com`  
**Password:** `admin123`

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| MongoDB | mongodb://localhost:27017 |

## 🆘 Troubleshooting Commands

```bash
# Check if ports are in use
lsof -i :5000    # Backend
lsof -i :5173    # Frontend
lsof -i :27017   # MongoDB

# Kill processes
kill -9 <PID>

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Node version
node --version

# Check npm version
npm --version
```

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| [ROOT_README.md](../ROOT_README.md) | Project overview |
| [QUICKSTART.md](../docs/QUICKSTART.md) | 5-minute setup |
| [SETUP_CHECKLIST.md](../docs/SETUP_CHECKLIST.md) | Detailed setup |
| [TESTING_CHECKLIST.md](../docs/TESTING_CHECKLIST.md) | Testing guide |
| [DEPLOYMENT.md](../docs/DEPLOYMENT.md) | Production deploy |
| [project-structure.md](./project-structure.md) | Folder layout |
| [directory-guide.md](./directory-guide.md) | File purposes |

## 🎨 React Component Template

```jsx
import { useState } from "react";
import "../styles/ComponentName.css";

export default function ComponentName() {
  const [state, setState] = useState(null);

  const handleAction = () => {
    // Your logic here
  };

  return (
    <div className="container">
      <h2>Component Name</h2>
      <button onClick={handleAction}>Action</button>
    </div>
  );
}
```

## 🔧 Backend Controller Template

```javascript
// Description of what this controller does
exports.functionName = async (req, res) => {
  try {
    // Your logic here
    
    res.json({
      message: "Success",
      data: {}
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      message: "Error message",
      error: err.message 
    });
  }
};
```

## 📝 Environment Variables (Backend `.env`)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mern_stack

# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## 🎯 Next Steps

1. **New to the project?** → Start with [QUICKSTART.md](../docs/QUICKSTART.md)
2. **Want to understand structure?** → Read [directory-guide.md](./directory-guide.md)
3. **Want to deploy?** → Check [DEPLOYMENT.md](../docs/DEPLOYMENT.md)
4. **Have questions?** → See [ROOT_README.md](../ROOT_README.md)

---

**Last Updated:** January 26, 2026  
**Quick Ref Version:** 1.0

Keep this handy while developing! 📌
