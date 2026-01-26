# Project Architecture & Data Flow Diagrams

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             React Frontend (Port 5173)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐             │  │
│  │  │  Login   │  │Dashboard │  │ Components  │             │  │
│  │  │  Page    │  │  Page    │  │ (Agents,    │             │  │
│  │  │          │  │          │  │  Upload)    │             │  │
│  │  └──────────┘  └──────────┘  └─────────────┘             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           ↓↑ (HTTP/REST)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │      Express Backend Server (Port 5000)                 │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ Routes: /api/auth  /api/agents  /api/upload     │   │    │
│  │  └────────────────────────────────────────────────┬┘   │    │
│  │                    ↓                              ↓     │    │
│  │  ┌──────────────────────────┐  ┌─────────────────────┐ │    │
│  │  │ Controllers              │  │ Utils               │ │    │
│  │  │ ├─ authController        │  │ ├─ fileParser.js    │ │    │
│  │  │ ├─ agentController       │  │ ├─ distribute.js    │ │    │
│  │  │ └─ uploadController      │  │ └─ upload.js        │ │    │
│  │  └──────────────────────────┘  └─────────────────────┘ │    │
│  │                    ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ Models (Schemas)                                │   │    │
│  │  │ ├─ Admin (users)                               │   │    │
│  │  │ ├─ Agent (task recipients)                     │   │    │
│  │  │ └─ Distribution (history)                      │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           ↓↑ (MongoDB Protocol)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         MongoDB Database (Port 27017)                   │    │
│  │  ├─ admins (collection)                                │    │
│  │  ├─ agents (collection)                                │    │
│  │  └─ distributions (collection)                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 File Upload & Distribution Flow

```
┌──────────────────────────────────┐
│  1. User Selects CSV File        │
│     (AddAgent, clients, etc.)    │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│  2. Frontend: UploadFile.jsx                 │
│     ├─ Validates file type (.csv, .xlsx)    │
│     ├─ Validates file size (<10MB)          │
│     └─ Sends to /api/upload                 │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│  3. Backend: uploadController.uploadFile()   │
│     ├─ Check file received                  │
│     ├─ Validate file format                 │
│     └─ Route to appropriate parser          │
└──────────────────────────────────────────────┘
           ↓
    ┌──────────────┴──────────────┐
    ↓                             ↓
┌────────────────┐         ┌─────────────────┐
│ CSV Parser     │         │ Excel Parser    │
│ fileParser.js  │         │ fileParser.js   │
│ .parseCSV()    │         │ .parseExcel()   │
└────────────────┘         └─────────────────┘
    ↓                             ↓
    └──────────────┬──────────────┘
           ↓
┌──────────────────────────────────────────────┐
│  4. Validate Data Structure                  │
│     validateDataStructure()                  │
│     ├─ Check required fields (FirstName,    │
│     │   Phone)                               │
│     ├─ Validate each row                    │
│     └─ Return errors if invalid             │
└──────────────────────────────────────────────┘
           ↓
    ┌──────────────────────┐
    │ Valid?               │
    ├──────────────────────┤
    │ NO ↘          ↙ YES  │
    └──────────────────────┘
      ↓                  ↓
  Return            ┌─────────────────────────┐
  Error             │ 5. Fetch All Agents     │
  Response          │ From MongoDB            │
                    └─────────────────────────┘
                             ↓
                    ┌─────────────────────────┐
                    │ 6. Distribute Tasks     │
                    │ distributeItems()       │
                    │ ├─ Evenly split data    │
                    │ │ among agents          │
                    │ └─ Create distribution  │
                    │   records               │
                    └─────────────────────────┘
                             ↓
                    ┌─────────────────────────┐
                    │ 7. Update Agents        │
                    │ Agent.findByIdAndUpdate │
                    │ ├─ Agent 1: 3 tasks     │
                    │ ├─ Agent 2: 3 tasks     │
                    │ └─ Agent 3: 4 tasks     │
                    └─────────────────────────┘
                             ↓
                    ┌─────────────────────────┐
                    │ 8. Save Distribution    │
                    │ Record                  │
                    │ ├─ File name            │
                    │ ├─ Date/Time            │
                    │ ├─ Agent assignments    │
                    │ └─ Total items          │
                    └─────────────────────────┘
                             ↓
                    ┌─────────────────────────┐
                    │ 9. Send Success         │
                    │ Response to Frontend    │
                    │ ├─ Total items          │
                    │ ├─ Agents count         │
                    │ └─ Distribution details │
                    └─────────────────────────┘
                             ↓
                    ┌─────────────────────────┐
                    │ 10. Show Success        │
                    │ Message to User         │
                    │ "Uploaded &             │
                    │ Distributed"            │
                    └─────────────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────┐
│ User: admin@example.com         │
│ Password: admin123              │
└─────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Frontend: Login.jsx                          │
│ └─ POST /api/auth/login                     │
│    ├─ email: "admin@example.com"            │
│    └─ password: "admin123"                  │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Backend: authController.login()              │
│ ├─ Find user by email in MongoDB            │
│ ├─ Verify password                          │
│ ├─ Generate JWT token                       │
│ └─ Return token to frontend                 │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Frontend: Store JWT in AuthContext           │
│ ├─ Save token to localStorage               │
│ ├─ Redirect to Dashboard                    │
│ └─ Set auth state                           │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Protected Routes: All /api/* requests        │
│ ├─ Axios adds token to headers              │
│ ├─ authMiddleware.js verifies token         │
│ └─ Grant access if valid                    │
└──────────────────────────────────────────────┘
```

## 📁 Component Data Flow

```
┌──────────────────────────────────────────────┐
│           App.jsx (Main)                     │
│  ├─ Loads AuthContext                       │
│  └─ Renders pages based on auth state       │
└──────────────────────────────────────────────┘
           ↓
    ┌──────────────────────┐
    │ Logged In?           │
    ├──────────────────────┤
    │ NO ↘          ↙ YES  │
    └──────────────────────┘
    ↓                      ↓
┌──────────────┐  ┌────────────────────────────────┐
│ Login Page   │  │ Dashboard Page                 │
│             │  │ ├─ AddAgent Component          │
│ - Email     │  │ │  ├─ Form inputs              │
│ - Password  │  │ │  └─ API: POST /api/agents    │
│ - Submit    │  │ │                               │
│   Button    │  │ ├─ AgentList Component         │
│             │  │ │  ├─ Fetch agents             │
│             │  │ │  ├─ Display table            │
│             │  │ │  └─ Delete buttons           │
│             │  │ │                               │
│             │  │ └─ UploadFile Component        │
│             │  │    ├─ File selector            │
│             │  │    ├─ Upload button            │
│             │  │    └─ Distribution display     │
│             │  │                                │
└──────────────┘  └────────────────────────────────┘
```

## 🗄️ Database Schema Relationships

```
┌──────────────────────┐
│    Admins            │
│ (Authentication)     │
├──────────────────────┤
│ _id                  │
│ email *              │
│ password *           │
│ name                 │
│ createdAt            │
└──────────────────────┘

┌──────────────────────┐
│     Agents           │
│ (Task Recipients)    │
├──────────────────────┤
│ _id                  │
│ name *               │
│ email *              │
│ phone                │
│ tasks: [             │  ← Array of task objects
│   {FirstName, Phone} │     from last upload
│ ]                    │
│ createdAt            │
└──────────────────────┘
        ↑
        │
        │ References
        │
┌──────────────────────┐
│  Distributions       │
│ (Upload History)     │
├──────────────────────┤
│ _id                  │
│ fileName             │
│ totalItems           │
│ distributions: [     │
│   {                  │
│     agentId,         │
│     agentName,       │
│     items: [...]     │
│   }                  │
│ ]                    │
│ uploadedAt           │
└──────────────────────┘
```

## 🔄 Distribution Algorithm

```
Input: CSV Data (10 rows), Agents (3 agents)

┌────────────────────────────────────────┐
│ Agents Available:                      │
│ - Agent 1                              │
│ - Agent 2                              │
│ - Agent 3                              │
└────────────────────────────────────────┘

Distribution (Round-Robin):
┌────────────────────────────────────────┐
│ Agent 1 ← Row 1, Row 4, Row 7, Row 10  │ (4 items)
│ Agent 2 ← Row 2, Row 5, Row 8          │ (3 items)
│ Agent 3 ← Row 3, Row 6, Row 9          │ (3 items)
└────────────────────────────────────────┘

Total: 10 items distributed evenly
```

## 📁 File Organization Quick Map

```
MERN_STACK_PROJECT/
│
├─ 📂 backend/
│  ├─ server.js ..................... Main entry point
│  ├─ routes/ ....................... API endpoint definitions
│  ├─ controllers/ .................. Business logic
│  ├─ models/ ....................... Database schemas
│  ├─ middleware/ ................... Auth & validation
│  ├─ utils/ ........................ Helper functions
│  ├─ scripts/ ...................... Database seeding
│  └─ uploads/ ...................... Temp file storage
│
├─ 📂 frontend/
│  ├─ src/
│  │  ├─ App.jsx .................... Main app
│  │  ├─ pages/ ..................... Full pages
│  │  ├─ components/ ................ Reusable UI
│  │  ├─ context/ ................... Global state
│  │  ├─ api/ ....................... HTTP client
│  │  └─ styles/ .................... CSS files
│  └─ index.html .................... Entry HTML
│
├─ 📂 data/
│  ├─ samples/ ...................... Test data
│  └─ test/ ......................... Small datasets
│
├─ 📂 docs/
│  ├─ README.md ..................... Overview
│  ├─ QUICKSTART.md ................. Fast setup
│  └─ ... (other guides)
│
└─ 📂 .config/
   ├─ project-structure.md .......... This structure
   ├─ quick-reference.md ............ Commands & refs
   └─ directory-guide.md ............ File purposes
```

---

**Last Updated:** January 26, 2026

This diagram helps visualize how all components connect! 🎯
