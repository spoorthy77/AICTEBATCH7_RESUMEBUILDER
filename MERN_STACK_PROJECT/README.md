# MERN Stack CRM/Distribution System 🚀

A full-stack web application built with **MongoDB**, **Express**, **React**, and **Node.js** for managing agents, distributing CSV/Excel data, and tracking distributions.

---

## 📖 TABLE OF CONTENTS

1. [What is This Project?](#what-is-this-project)
2. [How It Works](#how-it-works)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
7. [Running the Application](#running-the-application)
8. [Using the Application](#using-the-application)
9. [API Endpoints](#api-endpoints)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Database](#database)

---

## 🎯 What is This Project?

This is an **Agent Task Distribution System** - a web application that helps organizations:

- **Manage Agents** - Create and manage team members/agents
- **Upload Data** - Upload CSV or Excel files with customer/lead data
- **Distribute Tasks** - Automatically distribute tasks/data to agents evenly
- **Track Distributions** - Maintain a history of all uploads and distributions
- **Secure Access** - Admin-only dashboard with authentication

### Real-World Use Case
A sales company wants to upload a list of 100 leads and distribute them equally among 5 salespeople. This system does exactly that:
1. Admin uploads `leads.csv` with 100 leads
2. System automatically distributes: 20 leads to Agent 1, 20 to Agent 2, etc.
3. History is saved for tracking

---

## 🔄 How It Works

### Complete Application Flow

```
┌─────────────────────────────────────────────────┐
│         1. ADMIN LOGS IN                        │
│  Email: admin@example.com                       │
│  Password: admin123                             │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   2. DASHBOARD LOADS WITH 3 SECTIONS            │
│   ├─ Add Agent Form                             │
│   ├─ Agent List (all agents)                    │
│   └─ Upload & Distribute Form                   │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   3. ADD AGENTS (e.g., John, Sarah, Mike)       │
│   - Each agent gets a name, email, phone        │
│   - Stored in MongoDB                           │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   4. UPLOAD CSV FILE (e.g., customers.csv)      │
│   - File must have: FirstName, Phone columns    │
│   - Notes column is optional                    │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   5. BACKEND PROCESSES FILE                     │
│   ├─ Parse CSV/Excel                           │
│   ├─ Validate data structure                   │
│   └─ Check for errors                          │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   6. DISTRIBUTE TO AGENTS                       │
│   - Round-robin distribution                   │
│   - Agents split items evenly                  │
│   - Agent 1: Items 1, 4, 7, 10...              │
│   - Agent 2: Items 2, 5, 8, 11...              │
│   - Agent 3: Items 3, 6, 9, 12...              │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   7. SAVE TO DATABASE                           │
│   - Update agents with their tasks              │
│   - Save distribution record                   │
│   - Log in distribution history                │
└────────────┬────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────┐
│   8. SUCCESS MESSAGE & SUMMARY                  │
│   - Total items: 30                             │
│   - Agents count: 3                             │
│   - Distribution per agent                     │
└─────────────────────────────────────────────────┘
```

### Data Flow Example

```
INPUT CSV:
FirstName,Phone,Notes
John Smith,+1-555-0001,Manager
Jane Doe,+1-555-0002,Lead
Bob Johnson,+1-555-0003,Assistant

↓ (Parse & Validate)

OUTPUT DISTRIBUTION:
Agent 1 (Sarah): [John Smith, Bob Johnson]
Agent 2 (Mike):  [Jane Doe]
Agent 3 (Lisa):  []

↓ (Save to DB)

MongoDB Updated:
- Agent 1 tasks: [John Smith, Bob Johnson]
- Agent 2 tasks: [Jane Doe]
- Agent 3 tasks: []
- Distribution History: Logged
```

---

## ✨ Key Features

✅ **User Authentication** - Secure login with JWT tokens
✅ **Agent Management** - Create, view, edit, delete agents
✅ **File Upload** - Upload CSV and Excel files
✅ **Data Validation** - Automatic validation of file structure
✅ **Smart Distribution** - Evenly distribute items to agents
✅ **Distribution History** - Track all uploads and distributions
✅ **Responsive Design** - Works on desktop and mobile
✅ **Error Handling** - Clear error messages for issues
✅ **Database Persistence** - All data saved in MongoDB

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | User interface |
| **Build Tool** | Vite | Fast development & building |
| **HTTP Client** | Axios | API communication |
| **Styling** | CSS3 | Component styling |
| **Backend** | Node.js + Express | Server & API |
| **Database** | MongoDB | Data persistence |
| **Parsing** | csv-parser, xlsx | File parsing |
| **Auth** | JWT | Token-based authentication |

---

## 📁 Project Structure

```
MERN_STACK_PROJECT/
│
├── backend/                          # Node.js + Express Server
│   ├── server.js                     # Main entry point
│   ├── controllers/                  # Request handlers
│   │   ├── authController.js         # Login/logout logic
│   │   ├── agentController.js        # Agent CRUD
│   │   └── uploadController.js       # Upload & distribution
│   ├── models/                       # Database schemas
│   │   ├── Admin.js                  # Admin user schema
│   │   ├── Agent.js                  # Agent schema
│   │   └── Distribution.js           # Distribution record
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── agentRoutes.js            # Agent endpoints
│   │   └── uploadRoutes.js           # Upload endpoints
│   ├── utils/                        # Helper functions
│   │   ├── fileParser.js             # CSV/Excel parsing
│   │   ├── distribute.js             # Distribution logic
│   │   └── upload.js                 # Upload handling
│   ├── middleware/                   # Authentication middleware
│   ├── scripts/                      # Database seeding
│   ├── uploads/                      # Temporary file storage
│   └── package.json                  # Backend dependencies
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── App.jsx                   # Main component
│   │   ├── pages/                    # Page components
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Dashboard.jsx         # Main dashboard
│   │   ├── components/               # Reusable components
│   │   │   ├── AddAgent.jsx          # Add agent form
│   │   │   ├── AgentList.jsx         # List of agents
│   │   │   └── UploadFile.jsx        # Upload form
│   │   ├── context/                  # State management
│   │   │   └── AuthContext.jsx       # Auth state
│   │   ├── api/                      # API client
│   │   │   └── axios.js              # Axios configuration
│   │   └── styles/                   # CSS styles
│   ├── index.html                    # HTML entry
│   └── package.json                  # Frontend dependencies
│
├── data/                             # Data Files
│   ├── samples/                      # 23 realistic sample files
│   └── test/                         # 6 small test files
│
├── docs/                             # Documentation (9 files)
│   ├── QUICKSTART.md                 # 5-minute setup
│   ├── SETUP_CHECKLIST.md            # Full setup
│   ├── TESTING_CHECKLIST.md          # Testing guide
│   └── ...
│
├── .config/                          # Configuration Guides (5 files)
│   ├── quick-reference.md            # Commands & APIs
│   └── ...
│
└── ROOT_README.md                    # This file

```

---

## ⚙️ Installation & Setup

### Prerequisites

Before starting, ensure you have:

```
✅ Node.js v14+ (Check: node --version)
✅ npm or yarn
✅ MongoDB (local or Atlas connection)
✅ A code editor (VS Code recommended)
```

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd MERN_STACK_PROJECT

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Community
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at mongodb.com
2. Create cluster
3. Get connection string

### Step 3: Setup Environment Variables

Create `backend/.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mern_stack

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Step 4: Seed Database with Admin User

```bash
cd backend

# Run seeding script
node scripts/seedAdmin.js

# Output should show:
# ✅ Admin user created successfully!
# Email: admin@example.com
# Password: admin123
```

### Step 5: (Optional) Generate Dummy Agent Data

For testing with a large dataset, you can generate 100 dummy agents:

```bash
cd backend

# Generate 100 dummy agents with unique data
node scripts/seedDummyAgents.js

# This will create agents with:
# - Unique names (realistic first/last name combinations)
# - Unique emails (name-based with various domains)
# - Unique phone numbers (US format)
# - Unique passwords (12-char random strings, auto-hashed)

# Export agent data to CSV for reference
node scripts/exportAgents.js

# Output: data/dummy-agents.csv with all agent details
```

---

## 🚀 Running the Application

### Start Both Servers (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start

# Output:
# ╔════════════════════════════════╗
# ║  MERN Stack Server Started     ║
# ║  Environment: development      ║
# ║  Port: 5000                    ║
# ║  URL: http://localhost:5000    ║
# ╚════════════════════════════════╝
# ✓ MongoDB Connected
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev

# Output:
#   VITE v4.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/
```

### Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api |
| **MongoDB** | mongodb://localhost:27017 |

---

## 👥 Using the Application

### Login
1. Open http://localhost:5173 in browser
2. Enter credentials:
   - **Email:** admin@example.com
   - **Password:** admin123
3. Click "Login"
4. You'll be redirected to Dashboard

### Dashboard Overview
The dashboard has three main sections:

#### 1. Add Agent Section
- Enter agent name, email, phone
- Click "Add Agent"
- Agent is saved to database

#### 2. Agent List Section
- View all agents in a table
- See agent details (name, email, phone)
- Edit or delete agents
- Shows "No agents" if empty

#### 3. Upload & Distribute Section
- Click "Choose File"
- Select a CSV or Excel file
- File must have: `FirstName` and `Phone` columns
- Click "Upload & Distribute"
- System distributes to all agents
- See distribution summary

### CSV File Requirements

**Required Columns:**
| Column | Type | Example |
|--------|------|---------|
| FirstName | String | John Smith |
| Phone | String | +1-555-1234 |

**Optional Columns:**
| Column | Type | Example |
|--------|------|---------|
| Notes | String | Manager, Sales Rep |

**Valid File Example:**
```csv
FirstName,Phone,Notes
John Smith,+1-555-0001,Manager
Jane Doe,+1-555-0002,Sales Rep
Bob Johnson,+1-555-0003,Assistant
```

**Sample Files Available:**
- Test files: `/data/test/` (5-50 records)
- Sample files: `/data/samples/` (23 different types)

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login        # Login with email & password
GET    /api/auth/verify       # Verify current session
POST   /api/auth/logout       # Logout
```

### Agent Endpoints
```
GET    /api/agents            # Get all agents
POST   /api/agents            # Create new agent
GET    /api/agents/:id        # Get specific agent
PUT    /api/agents/:id        # Update agent
DELETE /api/agents/:id        # Delete agent
```

### Upload & Distribution Endpoints
```
POST   /api/upload                      # Upload & distribute CSV/Excel
GET    /api/upload/distributions        # Get all distributions
GET    /api/upload/distributions/:id    # Get specific distribution
```

### Example API Requests

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Create Agent:**
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+1-555-1234"}'
```

---

## 🧪 Testing

### Quick Test (2 minutes)

1. **Add some agents:**
   - Name: Sarah, Email: sarah@example.com
   - Name: Mike, Email: mike@example.com
   - Name: Lisa, Email: lisa@example.com

2. **Upload test data:**
   - Use file: `/data/test/test-data-10.csv` (10 records)
   - Click "Upload & Distribute"
   - Should see distribution summary

3. **Verify distribution:**
   - Check AgentList to see tasks assigned
   - Should see ~3-4 items per agent

### Test with Dummy Agents

If you generated dummy agents using `seedDummyAgents.js`, you can test distribution with 100 agents:

```bash
# Upload a file with 1000 leads to distribute among 100 agents
# Each agent should receive ~10 tasks
```

### Test with Different File Sizes

| File | Size | Time | Use Case |
|------|------|------|----------|
| test-data-5.csv | 5 items | <1 sec | Quick test |
| test-data-10.csv | 10 items | <1 sec | Basic test |
| test-data-20.csv | 20 items | <2 sec | Medium test |
| test-data-50.csv | 50 items | <2 sec | Full test |

### Sample Data Files

For realistic testing, use `/data/samples/`:
- clients-technology.csv
- clients-finance.csv
- prospects-q1.csv
- sales-qualified-leads.csv
- ... and 19 more

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community  # Mac

# Verify connection string in backend/.env
MONGODB_URI=mongodb://localhost:27017/mern_stack
```

### CSV Upload Fails
✅ Check file format (must be .csv or .xlsx)
✅ Check file size (<10MB)
✅ Check columns exist: FirstName, Phone
✅ Check no empty rows
✅ Check data types are correct

### Login Fails
✅ Check email: admin@example.com
✅ Check password: admin123
✅ Check MongoDB is running
✅ Check database was seeded (run scripts/seedAdmin.js)

### Cannot See Agents
✅ Make sure agents were added successfully
✅ Check agent list loads without errors
✅ Check MongoDB has data: use mern_stack; db.agents.find();

---

## 💾 Database

### Database Name
```
mern_stack
```

### Collections
```
admins          # Admin users for login
agents          # Team members/agents
distributions   # Upload history
```

### View Database Data (MongoDB CLI)
```bash
# Connect to MongoDB
mongo

# Switch to database
use mern_stack

# View admins
db.admins.find().pretty()

# View agents
db.agents.find().pretty()

# View distributions
db.distributions.find().pretty()

# Count total agents
db.agents.countDocuments()
```

---

## 📊 Example Workflow

### Scenario: Distribute 30 Leads Among 3 Salespeople

**Step 1: Add Agents**
```
Agent 1: Sarah Martinez (sarah@example.com)
Agent 2: Mike Johnson (mike@example.com)
Agent 3: Lisa Chen (lisa@example.com)
```

**Step 2: Prepare CSV File**
```csv
FirstName,Phone,Notes
Lead 1,+1-555-0001,Hot prospect
Lead 2,+1-555-0002,Follow up needed
...
Lead 30,+1-555-0030,Needs proposal
```

**Step 3: Upload File**
- Click "Choose File"
- Select file with 30 leads
- Click "Upload & Distribute"

**Step 4: Distribution Result**
```
Sarah Martinez: 10 leads (items 1, 4, 7, 10, 13, 16, 19, 22, 25, 28)
Mike Johnson:   10 leads (items 2, 5, 8, 11, 14, 17, 20, 23, 26, 29)
Lisa Chen:      10 leads (items 3, 6, 9, 12, 15, 18, 21, 24, 27, 30)
```

**Step 5: View History**
- Distribution record saved
- Can view anytime
- Shows who got what, when

---

## 📚 Documentation

For more details, see:

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](/docs/QUICKSTART.md) | 5-minute setup |
| [SETUP_CHECKLIST.md](/docs/SETUP_CHECKLIST.md) | Complete setup |
| [TESTING_CHECKLIST.md](/docs/TESTING_CHECKLIST.md) | Testing guide |
| [DEPLOYMENT.md](/docs/DEPLOYMENT.md) | Production guide |
| [quick-reference.md](/.config/quick-reference.md) | Commands & APIs |
| [architecture-diagrams.md](/.config/architecture-diagrams.md) | System design |

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login with admin@example.com / admin123
- [ ] Can add agents
- [ ] Can see agents in list
- [ ] Can upload CSV file
- [ ] Distribution shows success message
- [ ] Can see distribution history

---

## 🎉 You're Ready!

Your MERN Stack application is fully set up and ready to use. Start by:

1. **Run:** Backend and Frontend
2. **Login:** admin@example.com / admin123
3. **Test:** Add agents and upload data
4. **Explore:** Try with different files

For questions or issues, check the relevant documentation file or troubleshooting section above.

**Happy coding! 🚀**

### Default Login
- **Email:** admin@example.com
- **Password:** admin123

> See [QUICKSTART.md](/docs/QUICKSTART.md) for more details

## 📊 Using the Application

### 1. Login
- Navigate to the login page
- Enter admin credentials

### 2. Manage Agents
- Go to **Agent Management**
- Add, edit, or delete agents
- Each agent will receive distributed tasks

### 3. Upload Data
- Go to **Upload CSV/Excel**
- Select a file with columns: `FirstName`, `Phone`, `Notes (optional)`
- Click **Upload & Distribute**
- Tasks are automatically distributed to all agents

### 4. View Distributions
- Check **Distribution History**
- See which agents received which tasks
- Track all uploads

## 📝 CSV File Format

Your CSV files should have these columns:

| FirstName | Phone | Notes |
|-----------|-------|-------|
| John Smith | +1-555-0001 | Manager |
| Jane Doe | +1-555-0002 | Sales Rep |

**Required columns:** `FirstName`, `Phone`
**Optional columns:** `Notes`

Sample files are available in `/data/samples/`

## 🧪 Testing

- Test data files in `/data/test/` (5, 10, 15, 20, 30, 50 records)
- Sample data in `/data/samples/` for realistic testing
- See [TESTING_CHECKLIST.md](/docs/TESTING_CHECKLIST.md) for test scenarios

## 📚 Documentation

All documentation is in the `/docs/` folder:

| File | Purpose |
|------|---------|
| README.md | Project overview |
| QUICKSTART.md | 5-minute setup guide |
| SETUP_CHECKLIST.md | Detailed setup instructions |
| TESTING_CHECKLIST.md | Testing procedures |
| DEPLOYMENT.md | Production deployment |
| PROJECT_SUMMARY.md | Feature summary |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Upload & Distribution
- `POST /api/upload` - Upload and distribute file
- `GET /api/upload/distributions` - Get all distributions
- `GET /api/upload/distributions/:id` - Get specific distribution

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible

### CSV Upload Fails
- Check CSV format (must have FirstName, Phone columns)
- Ensure file is not corrupted
- File size must be under 10MB
- See [TESTING_CHECKLIST.md](/docs/TESTING_CHECKLIST.md) for examples

## 📞 Support

For issues or questions:
1. Check [QUICKSTART.md](/docs/QUICKSTART.md)
2. Review [TESTING_CHECKLIST.md](/docs/TESTING_CHECKLIST.md)
3. Check browser console for errors
4. Check backend logs in terminal

## 📄 License

This project is provided as-is for educational purposes.

---

## 📝 Recent Updates

### January 29, 2026
- **Fixed Mongoose Pre-Save Middleware**: Updated Agent schema pre-save hooks to use modern async patterns without `next()` calls, preventing "next is not a function" errors and ensuring agents save properly to MongoDB.

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0

Happy coding! 🚀