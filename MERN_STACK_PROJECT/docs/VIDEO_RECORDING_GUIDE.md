# Video Recording Guide for MERN Stack Application

## Recording Setup

### Tools Needed
- Screen recording software (OBS Studio, Loom, or Windows Game Bar)
- Microphone (optional but recommended)
- Browser (Chrome or Edge recommended)

### Before Recording
1. Close unnecessary tabs and applications
2. Clear browser console
3. Have sample-data.csv ready
4. Have this guide open for reference

## Recording Script

### Introduction (30 seconds)
```
"Hello! I'm demonstrating a MERN Stack Application for Admin Dashboard, 
Agent Management, and Task Distribution.

This application features:
- JWT-based admin authentication
- Agent creation and management
- CSV/Excel file upload with automatic equal distribution among agents
- MongoDB database for data persistence
- React frontend with Vite
- Express.js backend with Node.js"
```

### Part 1: Starting the Application (1 minute)

**Actions:**
1. Open terminal/command prompt
2. Navigate to project directory
3. Show project structure briefly
4. Run: `npm run dev`
5. Show both servers starting:
   - Backend on port 5000
   - Frontend on port 5174

**Narration:**
```
"Let me start by launching the application. I'll use npm run dev 
which starts both the backend Express server and the React frontend 
simultaneously using concurrently.

As you can see, the backend is running on port 5000 and successfully 
connected to MongoDB Atlas. The frontend Vite server is running on port 5174."
```

### Part 2: Login (30 seconds)

**Actions:**
1. Open browser to http://localhost:5174
2. Show login page design
3. Enter credentials:
   - Email: admin@example.com
   - Password: password123
4. Click Login

**Narration:**
```
"Opening the application in the browser, we see the login page. 
The admin credentials were created using our seed script. 
I'll login with admin@example.com and password password123.

Upon successful login, JWT token is generated and stored in 
localStorage for subsequent authenticated requests."
```

### Part 3: Dashboard Overview (30 seconds)

**Actions:**
1. Show dashboard layout
2. Point out three main sections:
   - Add Agent
   - Upload File
   - Agent List

**Narration:**
```
"The dashboard has three main sections:
- Add New Agent: for creating agents with name, email, mobile, and password
- Upload CSV/Excel File: for uploading and distributing task lists
- Agents & Distributed Lists: showing all agents and their assigned tasks"
```

### Part 4: Adding Agents (2 minutes)

**Actions:**
1. Add first agent:
   - Name: John Agent
   - Email: john@example.com
   - Mobile: +1-555-1234
   - Password: password123
2. Click "Add Agent"
3. Show success message
4. Repeat for 4 more agents:
   - Jane Agent, jane@example.com, +1-555-5678
   - Bob Agent, bob@example.com, +1-555-9012
   - Alice Agent, alice@example.com, +1-555-3456
   - Charlie Agent, charlie@example.com, +1-555-7890

**Narration:**
```
"Let me add 5 agents. Each agent needs a name, email, mobile number 
with country code, and password. The passwords are automatically hashed 
using bcryptjs before storing in MongoDB.

[Add each agent]

Notice the success messages after each addition. All fields are validated 
both on frontend and backend. The agents are now stored in the database."
```

### Part 5: Viewing Agents (30 seconds)

**Actions:**
1. Scroll to Agent List section
2. Show all 5 agents listed
3. Point out task count (currently 0 for all)

**Narration:**
```
"In the Agent List section, we can see all 5 agents we just created. 
Each shows 0 tasks because we haven't uploaded any data yet. 
Let's expand one to show the structure."
```

### Part 6: CSV Upload and Distribution (2 minutes)

**Actions:**
1. Scroll to Upload section
2. Click "Choose File"
3. Select sample-data.csv
4. Show file name displayed
5. Click "Upload & Distribute"
6. Show distribution summary with:
   - Total items: 25
   - Agents: 5
   - Distribution breakdown (each gets 5 items)

**Narration:**
```
"Now I'll upload the sample CSV file which contains 25 records with 
FirstName, Phone, and Notes columns.

The file format is validated on the backend - only CSV, XLSX, and XLS 
files are accepted. The data structure is also validated to ensure 
all required columns exist.

Upon clicking Upload & Distribute, the backend:
1. Parses the CSV file
2. Validates the data structure
3. Retrieves all agents from database
4. Distributes items equally (25 items ÷ 5 agents = 5 items each)
5. Updates each agent's tasks
6. Saves distribution record

The distribution summary shows 5 items assigned to each agent."
```

### Part 7: Viewing Distributed Tasks (1.5 minutes)

**Actions:**
1. Scroll to Agent List
2. Show updated task counts (5 for each)
3. Click to expand first agent
4. Show table with FirstName, Phone, Notes columns
5. Show 5 tasks assigned
6. Collapse and expand another agent
7. Show their 5 different tasks
8. Demonstrate that all 25 items are distributed

**Narration:**
```
"Looking at the Agent List now, we can see each agent has 5 tasks assigned.

[Expand first agent]

Here are John Agent's 5 assigned tasks. Each shows the FirstName, Phone, 
and Notes from the CSV. The data is displayed in a clean table format.

[Show other agents]

Each agent received exactly 5 items. The distribution algorithm ensures 
equal distribution, and if there were remainder items, they would be 
distributed sequentially to the first N agents."
```

### Part 8: Testing Distribution Logic (2 minutes)

**Actions:**
1. Open browser console (F12)
2. Navigate to Network tab
3. Click Refresh button in Agent List
4. Show API call to /api/agents
5. Show response data
6. Go to Backend terminal
7. Show MongoDB connection
8. (Optional) Open MongoDB Compass and show database

**Narration:**
```
"Let me demonstrate the backend communication. Opening the developer console 
and clicking Refresh, we can see the GET request to /api/agents endpoint 
with the JWT token in the Authorization header.

The response shows all agents with their complete task arrays. Passwords 
are excluded from the response for security.

In the backend terminal, we can see the MongoDB connection is active. 
All data is persisted in the MongoDB Atlas cloud database."
```

### Part 9: Testing Unequal Distribution (Optional - 1.5 minutes)

**Actions:**
1. Add a 6th agent quickly
2. Upload a file with 26 items (or modify sample-data.csv)
3. Show distribution: 1st agent gets 6, others get 5

**Narration:**
```
"Let me demonstrate the remainder distribution logic. Adding a 6th agent 
and uploading 26 items...

With 26 items and 6 agents, the distribution is:
- 26 ÷ 6 = 4 items per agent
- 26 % 6 = 2 remainder items

So the first 2 agents get 5 items each, and the rest get 4 items each. 
This ensures fair sequential distribution of remainder items."
```

### Part 10: Security Features (1 minute)

**Actions:**
1. Open browser DevTools > Application > Local Storage
2. Show JWT token stored
3. Click Logout
4. Show token removed and redirect to login
5. Try accessing dashboard without login
6. Show automatic redirect

**Narration:**
```
"The application implements JWT-based authentication. The token is stored 
in localStorage after login.

[Click Logout]

Upon logout, the token is cleared and we're redirected to login. 
If I try to access protected endpoints without a token, the interceptor 
automatically redirects to login.

Security features include:
- Bcrypt password hashing with salt rounds
- JWT tokens with 7-day expiration
- Protected API endpoints requiring authentication
- File type and size validation
- CORS configuration for secure cross-origin requests"
```

### Part 11: Error Handling (1 minute)

**Actions:**
1. Try adding agent with duplicate email
2. Show error message
3. Try uploading invalid file (txt or jpg)
4. Show validation error
5. Try uploading CSV with missing columns
6. Show structure validation error

**Narration:**
```
"The application has comprehensive error handling. 

[Try duplicate agent]
Attempting to add an agent with an existing email shows a clear error message.

[Try invalid file]
Uploading a non-CSV file is rejected with validation error.

[Try invalid CSV structure]
A CSV without required columns shows structure validation errors."
```

### Conclusion (30 seconds)

**Actions:**
1. Show final dashboard with all data
2. Show terminal with both servers running
3. Stop servers (Ctrl+C)

**Narration:**
```
"In summary, this MERN Stack Application demonstrates:

✓ Complete authentication system with JWT
✓ CRUD operations for agent management  
✓ File upload with CSV/Excel parsing
✓ Intelligent equal distribution algorithm
✓ MongoDB integration with Mongoose
✓ React frontend with Vite
✓ RESTful API design
✓ Error handling and validation
✓ Responsive UI design

The complete source code, README with setup instructions, and this 
demonstration video are available. Thank you for watching!"
```

## Recording Tips

1. **Pace yourself**: Speak clearly and not too fast
2. **Zoom in**: Zoom browser to 125-150% for visibility
3. **Pause between sections**: Take brief pauses for editing
4. **Show errors gracefully**: If something goes wrong, explain it calmly
5. **Practice first**: Do a test run before final recording
6. **Good lighting**: Ensure screen is clearly visible
7. **Audio quality**: Use good microphone or quiet environment

## Post-Recording

1. Edit video to remove dead time
2. Add chapter markers for each section
3. Upload to Google Drive
4. Set sharing permissions to "Anyone with link"
5. Add video link to README.md

## Video Length Target
- Minimum: 8 minutes
- Recommended: 10-12 minutes
- Maximum: 15 minutes

## File Naming
```
MERN_Stack_Agent_Distribution_Demo_YYYY_MM_DD.mp4
```

---

**Good luck with your recording! 🎬**
