# Project Directory Guide

This document explains what goes into each folder in the MERN Stack project.

## Root Level Files

```
├── package.json              # Root package configuration (dependencies, scripts)
├── package-lock.json         # Locked versions of dependencies
├── ROOT_README.md            # Main project documentation (START HERE!)
└── .gitignore               # Files to ignore in git
```

## Backend Directory (`/backend`)

The Node.js + Express server that handles all business logic.

```
backend/
├── server.js                 # Main entry point - starts the server
├── package.json              # Backend dependencies
├── .env                      # Environment variables (NOT in git)
│
├── config/                   # Configuration settings
│   └── database.js           # Database connection config
│
├── controllers/              # Request handlers - the logic for each route
│   ├── authController.js     # Login/logout logic
│   ├── agentController.js    # Agent CRUD operations
│   └── uploadController.js   # File upload & distribution logic
│
├── middleware/               # Express middleware - runs before controllers
│   └── authMiddleware.js     # JWT verification
│
├── models/                   # MongoDB schema definitions
│   ├── Admin.js              # Admin user schema
│   ├── Agent.js              # Agent schema
│   └── Distribution.js       # Distribution history schema
│
├── routes/                   # API endpoint definitions
│   ├── authRoutes.js         # Auth endpoints (/api/auth/*)
│   ├── agentRoutes.js        # Agent endpoints (/api/agents/*)
│   └── uploadRoutes.js       # Upload endpoints (/api/upload/*)
│
├── utils/                    # Helper/utility functions
│   ├── fileParser.js         # CSV/Excel parsing logic
│   ├── distribute.js         # Task distribution algorithm
│   └── upload.js             # File upload handling
│
├── scripts/                  # Database setup scripts
│   ├── seedAdmin.js          # Create default admin user
│   ├── addMyAdmin.js         # Add custom admin user
│   ├── seedMultipleAdmins.js # Seed multiple admins
│   └── addCustomAdmins.js    # Add custom admins
│
└── uploads/                  # Temporary storage for uploaded files
    └── (temporary CSV/Excel files)
```

### Backend Workflow
1. User sends request to `/api/upload`
2. Route forwards to `uploadController.uploadFile()`
3. Controller validates file using `fileParser.validateDataStructure()`
4. Parses file using `fileParser.parseCSV()` or `fileParser.parseExcel()`
5. Distributes items using `distribute.distributeItems()`
6. Updates agent records in MongoDB
7. Saves distribution record for history

## Frontend Directory (`/frontend`)

The React application - what users see and interact with.

```
frontend/
├── index.html                # HTML entry point
├── main.jsx                  # React entry point
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite build configuration
├── eslint.config.js          # Code linting rules
│
├── src/
│   ├── App.jsx               # Root React component
│   ├── App.css               # Root component styles
│   ├── index.css             # Global styles
│   │
│   ├── pages/                # Full page components
│   │   ├── Login.jsx         # Login page
│   │   └── Dashboard.jsx     # Main dashboard
│   │
│   ├── components/           # Reusable UI components
│   │   ├── AddAgent.jsx      # Form to add new agent
│   │   ├── AgentList.jsx     # Display list of agents
│   │   └── UploadFile.jsx    # File upload form
│   │
│   ├── styles/               # CSS for components
│   │   ├── components.css    # Component styles
│   │   ├── Dashboard.css     # Dashboard styles
│   │   └── Login.css         # Login page styles
│   │
│   ├── context/              # React Context (state management)
│   │   └── AuthContext.jsx   # Authentication state & logic
│   │
│   ├── api/                  # API communication
│   │   └── axios.js          # Axios instance with defaults
│   │
│   ├── assets/               # Images, fonts, media
│   │   └── (image files)
│   │
│   └── main.jsx              # React DOM render
│
└── public/                   # Static files (served as-is)
    └── (static assets)
```

### Frontend Data Flow
1. User opens app → `index.html` loads → `main.jsx` starts React
2. React renders `App.jsx`
3. `AuthContext` checks if user is logged in
4. If not logged in → Show `Login.jsx` page
5. If logged in → Show `Dashboard.jsx` with:
   - `AddAgent.jsx` component
   - `AgentList.jsx` component
   - `UploadFile.jsx` component
6. Components use `api/axios.js` to communicate with backend

## Data Directory (`/data`)

Storage for CSV/Excel files used in the application.

```
data/
├── samples/                  # Realistic sample data for testing
│   ├── clients-education.csv
│   ├── clients-finance.csv
│   ├── clients-healthcare.csv
│   ├── clients-hospitality.csv
│   ├── clients-legal.csv
│   ├── clients-manufacturing.csv
│   ├── clients-real-estate.csv
│   ├── clients-retail.csv
│   ├── clients-technology.csv
│   ├── prospects-q1.csv
│   ├── prospects-q2.csv
│   ├── sales-qualified-leads.csv
│   ├── partner-network.csv
│   ├── vip-clients.csv
│   ├── marketing-campaign-a.csv
│   ├── onboarding-new-clients.csv
│   ├── renewal-reminders.csv
│   ├── support-tickets-normal.csv
│   ├── support-tickets-urgent.csv
│   ├── training-attendees.csv
│   └── customer-feedback.csv
│
└── test/                     # Small test datasets (5-50 records)
    ├── test-data-5.csv      # 5 records - quick test
    ├── test-data-10.csv     # 10 records
    ├── test-data-15.csv     # 15 records
    ├── test-data-20.csv     # 20 records
    ├── test-data-30.csv     # 30 records
    └── test-data-50.csv     # 50 records - full test
```

**Usage:**
- **Sample data** - For realistic testing and demonstrations
- **Test data** - For quick development and testing

## Documentation Directory (`/docs`)

All project documentation and guides.

```
docs/
├── README.md                 # Project overview
├── QUICKSTART.md             # 5-minute setup guide ← START HERE
├── SETUP_CHECKLIST.md        # Detailed setup steps
├── TESTING_CHECKLIST.md      # Testing procedures
├── DEPLOYMENT.md             # Production deployment guide
├── PROJECT_SUMMARY.md        # Feature summary
├── COMPLETION_REPORT.md      # What's completed/pending
├── INDEX.md                  # Documentation index
└── VIDEO_RECORDING_GUIDE.md  # How to record demo videos
```

## Configuration Directory (`/.config`)

Project-level configuration and reference documents.

```
.config/
└── project-structure.md      # Detailed project structure (this file!)
```

## Common Tasks & Where Files Are

### "I want to modify the upload logic"
→ `/backend/utils/fileParser.js` (parsing)
→ `/backend/utils/distribute.js` (distribution)
→ `/backend/controllers/uploadController.js` (orchestration)

### "I want to add a new field to agents"
→ `/backend/models/Agent.js` (schema)
→ `/backend/controllers/agentController.js` (API logic)
→ `/frontend/src/components/AddAgent.jsx` (form)

### "I want to change the dashboard layout"
→ `/frontend/src/pages/Dashboard.jsx`
→ `/frontend/src/styles/Dashboard.css`

### "I want to add a new page"
→ Create `/frontend/src/pages/NewPage.jsx`
→ Add route in `/frontend/src/App.jsx`
→ Create styles in `/frontend/src/styles/NewPage.css`

### "I want to test with different data"
→ Use files from `/data/samples/` or `/data/test/`
→ Upload through UI or place in `/backend/uploads/`

### "I need to understand the API"
→ See `/backend/routes/` for endpoints
→ See `/backend/controllers/` for logic
→ See `/frontend/src/api/axios.js` for client setup

## File Organization Best Practices

✅ **DO:**
- Keep related files together (e.g., model + controller + routes for same feature)
- Use clear, descriptive names
- Keep files focused on one responsibility
- Put reusable code in `/utils/`
- Group styles with components

❌ **DON'T:**
- Mix backend and frontend code
- Put large files in root directory
- Store temporary files permanently
- Mix multiple features in one file

---

**Last Updated:** January 26, 2026

For quick start: See [ROOT_README.md](../ROOT_README.md)
