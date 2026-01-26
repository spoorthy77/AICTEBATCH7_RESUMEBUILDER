# MERN Stack Project Structure

## 📁 Project Directory Layout

```
MERN_STACK_PROJECT/
├── 📂 backend/                    # Backend server (Node.js + Express)
│   ├── config/                    # Configuration files
│   ├── controllers/               # Request handlers
│   │   ├── agentController.js
│   │   ├── authController.js
│   │   └── uploadController.js
│   ├── middleware/                # Express middleware
│   │   └── authMiddleware.js
│   ├── models/                    # MongoDB schemas
│   │   ├── Admin.js
│   │   ├── Agent.js
│   │   └── Distribution.js
│   ├── routes/                    # API route definitions
│   │   ├── agentRoutes.js
│   │   ├── authRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/                   # Database seeding scripts
│   │   ├── addCustomAdmins.js
│   │   ├── addMyAdmin.js
│   │   ├── seedAdmin.js
│   │   └── seedMultipleAdmins.js
│   ├── uploads/                   # Temporary file upload storage
│   ├── utils/                     # Utility functions
│   │   ├── distribute.js          # Item distribution logic
│   │   ├── fileParser.js          # CSV/Excel parsing
│   │   └── upload.js              # Upload handling
│   ├── .env                       # Environment variables (local)
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Main server entry point
│
├── 📂 frontend/                   # Frontend React application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # API client configuration
│   │   ├── assets/                # Images, fonts, media
│   │   ├── components/            # Reusable React components
│   │   │   ├── AddAgent.jsx
│   │   │   ├── AgentList.jsx
│   │   │   └── UploadFile.jsx
│   │   ├── context/               # React Context
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── styles/                # CSS stylesheets
│   │   │   ├── components.css
│   │   │   ├── Dashboard.css
│   │   │   └── Login.css
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css                # App styles
│   │   ├── index.css              # Global styles
│   │   ├── main.jsx               # React entry point
│   │   └── package.json           # Frontend dependencies
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── eslint.config.js           # ESLint configuration
│   └── README.md                  # Frontend documentation
│
├── 📂 data/                       # Data files and samples
│   ├── samples/                   # Sample data for testing
│   │   ├── clients-*.csv
│   │   ├── prospects-*.csv
│   │   ├── marketing-campaign-a.csv
│   │   ├── sales-qualified-leads.csv
│   │   ├── partner-network.csv
│   │   ├── vip-clients.csv
│   │   └── ... (other sample CSVs)
│   └── test/                      # Test datasets
│       ├── test-data-5.csv
│       ├── test-data-10.csv
│       ├── test-data-15.csv
│       ├── test-data-20.csv
│       ├── test-data-30.csv
│       └── test-data-50.csv
│
├── 📂 docs/                       # Documentation
│   ├── README.md                  # Project overview
│   ├── QUICKSTART.md              # Getting started guide
│   ├── SETUP_CHECKLIST.md         # Setup instructions
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── TESTING_CHECKLIST.md       # Testing procedures
│   ├── PROJECT_SUMMARY.md         # Project summary
│   ├── COMPLETION_REPORT.md       # Completion status
│   ├── INDEX.md                   # Documentation index
│   └── VIDEO_RECORDING_GUIDE.md   # Video recording guide
│
├── 📂 .config/                    # Configuration files
│   ├── project-structure.md       # This file - project structure guide
│   └── ... (other config files)
│
├── 📂 scripts/                    # Project-level scripts
│   └── ... (build/utility scripts)
│
├── 📂 public-assets/              # Public assets
│   └── ... (logos, icons, shared media)
│
├── package.json                   # Root package configuration
├── package-lock.json              # Dependency lock file
└── .gitignore                     # Git ignore rules
```

## 🎯 Key Directories Explained

### Backend (`/backend`)
- **controllers/**: Handle API request logic
- **models/**: Define MongoDB data schemas
- **routes/**: Map API endpoints to controllers
- **middleware/**: Authentication and request processing
- **utils/**: Helper functions for file parsing and distribution
- **scripts/**: Database setup and seeding scripts

### Frontend (`/frontend`)
- **components/**: Reusable UI components
- **pages/**: Full page components
- **context/**: Global state management
- **styles/**: Component and page styling
- **api/**: API communication setup

### Data (`/data`)
- **samples/**: Production-like sample data for testing
- **test/**: Small test datasets for quick testing

### Documentation (`/docs`)
- All project documentation and guides

## 📋 File Organization Principles

1. **Separation of Concerns**: Backend and frontend are completely separated
2. **Feature Grouping**: Related files are grouped by feature/functionality
3. **Data Management**: All data files are in dedicated folders
4. **Documentation**: Centralized in /docs for easy reference
5. **Configuration**: Environment and project configs in /.config

## 🚀 Getting Started

1. See [`docs/QUICKSTART.md`](../docs/QUICKSTART.md) for quick setup
2. Check [`docs/SETUP_CHECKLIST.md`](../docs/SETUP_CHECKLIST.md) for detailed steps
3. Review [`docs/README.md`](../docs/README.md) for project overview

## 📝 Notes

- **Backend** runs on port 5000
- **Frontend** runs on port 5173 (Vite development server)
- CSV uploads are temporarily stored in `/backend/uploads/`
- Sample data in `/data/samples/` can be used for testing
