# Testing Checklist for MERN Stack Application

## Pre-Testing Setup
- [ ] MongoDB is running (local or Atlas)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] `.env` file configured in backend
- [ ] Admin user created (`node backend/scripts/seedAdmin.js`)

---

## Part 1: Backend API Testing

### 1.1 Server Startup
- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] MongoDB connection successful
- [ ] Server running on port 5000
- [ ] No console errors

### 1.2 Authentication Endpoints

**Register Admin** (if needed)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```
- [ ] Returns 201 for new admin
- [ ] Returns 400 for duplicate email
- [ ] Returns 400 for missing fields
- [ ] Password is hashed in database

**Login Admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```
- [ ] Returns JWT token on success
- [ ] Returns 401 for wrong credentials
- [ ] Returns 400 for missing fields

### 1.3 Agent Endpoints (Require Token)

**Get All Agents**
```bash
curl http://localhost:5000/api/agents \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Returns empty array if no agents
- [ ] Returns 401 without token
- [ ] Passwords not included in response

**Add Agent**
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","email":"agent@test.com","mobile":"+1234567890","password":"pass123"}'
```
- [ ] Returns 201 for new agent
- [ ] Returns 400 for duplicate email
- [ ] Returns 400 for missing fields
- [ ] Password is hashed

**Get Agent by ID**
```bash
curl http://localhost:5000/api/agents/AGENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Returns agent data
- [ ] Returns 404 for invalid ID
- [ ] Includes tasks array

### 1.4 File Upload Endpoint

**Upload CSV File**
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample-data.csv"
```
- [ ] Returns 200 for valid CSV
- [ ] Returns 400 for invalid file type
- [ ] Returns 400 for missing columns
- [ ] Returns 400 if no agents exist
- [ ] Distribution summary returned

---

## Part 2: Frontend Testing

### 2.1 Application Startup
- [ ] Frontend starts: `cd frontend && npm run dev`
- [ ] Opens on http://localhost:5173 or 5174
- [ ] No console errors
- [ ] No 404 errors for assets

### 2.2 Login Page
- [ ] Page loads correctly
- [ ] Email input works
- [ ] Password input works (masked)
- [ ] Submit button works
- [ ] Demo credentials displayed
- [ ] Error message shows for wrong credentials
- [ ] Success: redirects to dashboard
- [ ] Token stored in localStorage

### 2.3 Dashboard Layout
- [ ] Header visible with title
- [ ] Logout button visible
- [ ] Three sections displayed:
  - [ ] Add Agent form
  - [ ] Upload File form
  - [ ] Agent List
- [ ] Responsive design works
- [ ] No visual glitches

### 2.4 Add Agent Form
- [ ] All 4 input fields present
- [ ] Name field validation
- [ ] Email field validation (format)
- [ ] Mobile field accepts country code
- [ ] Password field (masked)
- [ ] Submit button enabled/disabled correctly
- [ ] Success message on add
- [ ] Error message on failure (duplicate email)
- [ ] Form clears after success
- [ ] Agent appears in list immediately (or after refresh)

### 2.5 Upload File Component
- [ ] File input accepts CSV
- [ ] File input accepts XLSX
- [ ] File input accepts XLS
- [ ] File input rejects other formats
- [ ] Selected file name displays
- [ ] Upload button works
- [ ] Loading state shows during upload
- [ ] Success message with distribution summary
- [ ] Error message for invalid files
- [ ] Error message if no agents exist

### 2.6 Agent List Component
- [ ] Shows "No agents" when empty
- [ ] Lists all agents after adding
- [ ] Displays agent name, email, mobile
- [ ] Shows task count badge
- [ ] Expand/collapse works
- [ ] Task table displays correctly:
  - [ ] FirstName column
  - [ ] Phone column
  - [ ] Notes column
- [ ] Shows "No tasks" when agent has no tasks
- [ ] Refresh button works
- [ ] Loading state shows while fetching

### 2.7 Authentication Flow
- [ ] Protected routes redirect to login when not authenticated
- [ ] Token persists on page refresh
- [ ] Logout clears token
- [ ] Logout redirects to login
- [ ] Cannot access dashboard without login
- [ ] Expired token redirects to login (if testable)

---

## Part 3: Integration Testing

### 3.1 Full User Workflow
1. **Login as admin**
   - [ ] Login successful
   - [ ] Redirected to dashboard

2. **Add 5 agents**
   - [ ] Agent 1 added successfully
   - [ ] Agent 2 added successfully
   - [ ] Agent 3 added successfully
   - [ ] Agent 4 added successfully
   - [ ] Agent 5 added successfully
   - [ ] All appear in agent list

3. **Upload sample-data.csv (25 items)**
   - [ ] File selected successfully
   - [ ] Upload successful
   - [ ] Distribution summary shows:
     - [ ] Total items: 25
     - [ ] Agents: 5
     - [ ] Each agent: 5 items

4. **View distributed tasks**
   - [ ] Each agent shows 5 tasks
   - [ ] Expand Agent 1: shows 5 different tasks
   - [ ] Expand Agent 2: shows 5 different tasks
   - [ ] Expand Agent 3: shows 5 different tasks
   - [ ] Expand Agent 4: shows 5 different tasks
   - [ ] Expand Agent 5: shows 5 different tasks
   - [ ] Total = 25 tasks distributed

5. **Logout and re-login**
   - [ ] Logout successful
   - [ ] Data persists
   - [ ] Can log back in
   - [ ] All agents and tasks still visible

### 3.2 Distribution Logic Testing

**Scenario A: 25 items, 5 agents**
- [ ] Each agent gets exactly 5 items

**Scenario B: 26 items, 5 agents**
- [ ] First agent gets 6 items
- [ ] Other 4 agents get 5 items each

**Scenario C: 27 items, 5 agents**
- [ ] First 2 agents get 6 items each
- [ ] Other 3 agents get 5 items each

**Scenario D: 7 items, 2 agents**
- [ ] First agent gets 4 items
- [ ] Second agent gets 3 items

---

## Part 4: Error Handling Testing

### 4.1 Network Errors
- [ ] Stop backend server
- [ ] Frontend shows connection error on API calls
- [ ] Start backend again
- [ ] Frontend recovers and works

### 4.2 Database Errors
- [ ] Stop MongoDB
- [ ] Backend shows connection error
- [ ] Cannot perform operations
- [ ] Start MongoDB
- [ ] Backend reconnects automatically

### 4.3 Invalid Data
- [ ] Upload TXT file → Shows error
- [ ] Upload PDF file → Shows error
- [ ] Upload CSV without FirstName → Shows structure error
- [ ] Upload CSV without Phone → Shows structure error
- [ ] Add agent with invalid email → Shows validation error
- [ ] Add agent with existing email → Shows duplicate error

### 4.4 Security Testing
- [ ] Cannot access /api/agents without token
- [ ] Cannot access /api/upload without token
- [ ] Invalid token returns 401
- [ ] Token in Authorization header required
- [ ] Passwords not returned in API responses
- [ ] Passwords hashed in database

---

## Part 5: Performance Testing

### 5.1 Large File Upload
- [ ] Upload CSV with 100 items → Success
- [ ] Upload CSV with 500 items → Success
- [ ] Upload CSV with 1000 items → Success (or shows appropriate limit)
- [ ] File processing time acceptable (< 5 seconds)

### 5.2 Many Agents
- [ ] Add 10 agents → All display correctly
- [ ] Add 20 agents → List performs well
- [ ] Expand/collapse multiple agents → No lag

### 5.3 Page Load Performance
- [ ] Initial page load < 2 seconds
- [ ] Dashboard load < 1 second after login
- [ ] API responses < 500ms

---

## Part 6: Browser Compatibility

### 6.1 Chrome/Edge
- [ ] Login page works
- [ ] Dashboard works
- [ ] All features functional
- [ ] No console errors

### 6.2 Firefox
- [ ] Login page works
- [ ] Dashboard works
- [ ] All features functional

### 6.3 Safari (if available)
- [ ] Login page works
- [ ] Dashboard works
- [ ] All features functional

---

## Part 7: Responsive Design

### 7.1 Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements visible
- [ ] No overflow issues

### 7.2 Laptop (1366x768)
- [ ] Layout adapts correctly
- [ ] All elements accessible

### 7.3 Tablet (768px)
- [ ] Responsive layout
- [ ] Touch-friendly buttons
- [ ] Readable text

### 7.4 Mobile (375px)
- [ ] Mobile-friendly layout
- [ ] Forms usable
- [ ] Tables scroll horizontally
- [ ] Touch interactions work

---

## Part 8: Code Quality Checks

### 8.1 Frontend
- [ ] No errors in browser console
- [ ] No warnings in browser console
- [ ] No failed network requests (except intentional tests)
- [ ] Clean code structure
- [ ] Components properly organized

### 8.2 Backend
- [ ] No errors in terminal
- [ ] No deprecation warnings
- [ ] Clean code structure
- [ ] Proper error handling
- [ ] Comments present

---

## Final Checklist

### Functionality
- [ ] All authentication features work
- [ ] All agent management features work
- [ ] File upload and distribution work correctly
- [ ] All UI components functional
- [ ] Error handling works correctly

### Security
- [ ] Passwords hashed
- [ ] JWT authentication working
- [ ] Protected routes secured
- [ ] File validation working
- [ ] No sensitive data exposed

### Performance
- [ ] Fast page loads
- [ ] Quick API responses
- [ ] Handles large files
- [ ] Handles many agents
- [ ] No memory leaks

### Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md available
- [ ] VIDEO_RECORDING_GUIDE.md available
- [ ] Code comments present
- [ ] .env.example exists

### Deliverables
- [ ] Source code complete and organized
- [ ] All dependencies installed
- [ ] Database connected
- [ ] Application runs successfully
- [ ] Video demonstration recorded (or ready to record)
- [ ] Video uploaded to Google Drive with shareable link

---

## Testing Complete! 🎉

**Status:** ✓ PASS / ✗ FAIL

**Date:** ________________

**Tested by:** ________________

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

**Ready for Submission:** [ ] Yes  [ ] No

**Video Link:** _______________________________________
