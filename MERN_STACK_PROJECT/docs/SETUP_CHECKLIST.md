# Configuration & Setup Checklist

## Pre-Requisites ✓

- [ ] Node.js v14+ installed
- [ ] MongoDB instance available (local or Atlas)
- [ ] npm/yarn available
- [ ] Git installed (optional)
- [ ] Text editor or IDE ready

## Backend Setup Checklist

### Installation
- [ ] Navigate to backend directory: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Verify packages installed: `npm list`
- [ ] Check node_modules created

### Environment Configuration
- [ ] Create `.env` file from `.env.example`: `cp .env.example .env`
- [ ] Update `MONGO_URI` with correct database:
  - [ ] Local: `mongodb://localhost:27017/mern_app`
  - [ ] OR Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- [ ] Set `PORT` to `5000` (or desired port)
- [ ] Set `NODE_ENV` to `development`
- [ ] Set `JWT_SECRET` to secure random string (32+ chars)
- [ ] Verify all variables set correctly: `cat .env`

### Database Setup
- [ ] MongoDB running:
  - [ ] Local: `mongod` service started
  - [ ] OR Atlas: Connection tested
- [ ] Database accessible from application
- [ ] Create admin user (see below)

### Create Admin User

**Option A: Using API (Recommended)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```
- [ ] Request successful
- [ ] Response: `{ "message": "Admin registered successfully" }`

**Option B: Direct Database**
- [ ] Connect to MongoDB
- [ ] Create database `mern_app`
- [ ] Create collection `admins`
- [ ] Insert test document (password will be hashed)

### Backend Verification
- [ ] Start backend: `npm run dev`
- [ ] Server starts successfully
- [ ] Console shows: "✓ MongoDB Connected"
- [ ] Console shows: "MERN Stack Server Started"
- [ ] Port 5000 is listening
- [ ] Can access: `http://localhost:5000/`
- [ ] Response is valid JSON

## Frontend Setup Checklist

### Installation
- [ ] Navigate to frontend directory: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify packages installed: `npm list`
- [ ] Check node_modules created

### Configuration
- [ ] Verify `vite.config.js` exists
- [ ] Confirm API proxy configured:
  - [ ] Target: `http://localhost:5000`
  - [ ] Port: `5173`

### Frontend Verification
- [ ] Start frontend: `npm run dev`
- [ ] Vite server starts successfully
- [ ] Console shows: "VITE v..."
- [ ] Shows: "➜  Local:   http://localhost:5173/"
- [ ] Can access: `http://localhost:5173/`
- [ ] Login page displays
- [ ] Styles load correctly
- [ ] No console errors
- [ ] Form elements visible
- [ ] Input fields functional

## Integration Testing Checklist

### Authentication Flow
- [ ] Open browser: `http://localhost:5173`
- [ ] Login page displays
- [ ] Email and password fields visible
- [ ] Submit button functional
- [ ] Enter invalid credentials → Error message
- [ ] Enter valid credentials → Redirect to dashboard
- [ ] Token stored in localStorage
- [ ] Token sent in API requests

### Dashboard Access
- [ ] After login, dashboard loads
- [ ] Header displays with title and logout button
- [ ] Three main sections visible:
  - [ ] Add New Agent
  - [ ] Upload File
  - [ ] Agents & Distributed Lists

### Add Agent Feature
- [ ] Form displays all 4 fields
- [ ] Submit blank form → Error
- [ ] Submit with duplicate email → Error
- [ ] Submit valid data → Success message
- [ ] Form clears after success
- [ ] Agent appears in list

### Upload File Feature
- [ ] File input accepts only CSV/XLSX/XLS
- [ ] Reject other file types → Error
- [ ] Upload valid CSV → Success
- [ ] Distribution summary displays
- [ ] Shows item count per agent
- [ ] File removed from server after upload

### View Agents
- [ ] All agents display
- [ ] Agent cards show name, email, mobile
- [ ] Task count badge visible
- [ ] Click agent to expand
- [ ] Tasks display in table
- [ ] Columns: FirstName, Phone, Notes

### API Communication
- [ ] Network tab shows successful requests
- [ ] All endpoints return 200/201
- [ ] No CORS errors
- [ ] Request/response data correct
- [ ] Token properly passed
- [ ] No 401 errors (unless expected)

## File Structure Verification

### Backend Files
- [ ] `/backend/server.js` exists
- [ ] `/backend/package.json` exists
- [ ] `/backend/.env` exists with values
- [ ] `/backend/models/Admin.js` exists
- [ ] `/backend/models/Agent.js` exists
- [ ] `/backend/models/Distribution.js` exists
- [ ] `/backend/controllers/authController.js` exists
- [ ] `/backend/controllers/agentController.js` exists
- [ ] `/backend/controllers/uploadController.js` exists
- [ ] `/backend/routes/authRoutes.js` exists
- [ ] `/backend/routes/agentRoutes.js` exists
- [ ] `/backend/routes/uploadRoutes.js` exists
- [ ] `/backend/middleware/authMiddleware.js` exists
- [ ] `/backend/utils/fileParser.js` exists
- [ ] `/backend/utils/distribute.js` exists
- [ ] `/backend/uploads/` directory exists

### Frontend Files
- [ ] `/frontend/package.json` exists
- [ ] `/frontend/vite.config.js` exists
- [ ] `/frontend/src/main.jsx` exists
- [ ] `/frontend/src/App.jsx` exists
- [ ] `/frontend/src/pages/Login.jsx` exists
- [ ] `/frontend/src/pages/Dashboard.jsx` exists
- [ ] `/frontend/src/components/AddAgent.jsx` exists
- [ ] `/frontend/src/components/AgentList.jsx` exists
- [ ] `/frontend/src/components/UploadFile.jsx` exists
- [ ] `/frontend/src/context/AuthContext.jsx` exists
- [ ] `/frontend/src/api/axios.js` exists
- [ ] `/frontend/src/styles/Login.css` exists
- [ ] `/frontend/src/styles/Dashboard.css` exists
- [ ] `/frontend/src/styles/components.css` exists
- [ ] `/frontend/src/index.css` exists

### Documentation Files
- [ ] `/README.md` exists and is comprehensive
- [ ] `/QUICKSTART.md` exists
- [ ] `/TESTING.md` exists
- [ ] `/DEPLOYMENT.md` exists
- [ ] `/PROJECT_SUMMARY.md` exists
- [ ] `/sample-data.csv` exists

### Root Files
- [ ] `/package.json` exists with scripts
- [ ] `/.env` files created

## Running Both Servers

### Method 1: Single Command
- [ ] From root directory: `npm run dev`
- [ ] Both servers start simultaneously
- [ ] Backend on 5000
- [ ] Frontend on 5173

### Method 2: Separate Terminals
**Terminal 1:**
- [ ] Navigate to backend: `cd backend`
- [ ] Start: `npm run dev`
- [ ] Server runs on 5000

**Terminal 2:**
- [ ] Navigate to frontend: `cd frontend`
- [ ] Start: `npm run dev`
- [ ] Server runs on 5173

## Security Checklist

### Environment Variables
- [ ] `MONGO_URI` not exposed publicly
- [ ] `JWT_SECRET` is strong (32+ chars, no spaces)
- [ ] `.env` file added to `.gitignore`
- [ ] `.env.example` doesn't contain secrets
- [ ] Environment-specific configs in place

### Database Security
- [ ] MongoDB authentication enabled
- [ ] Strong password for MongoDB user
- [ ] IP whitelist configured (if Atlas)
- [ ] Database backups enabled
- [ ] Access logs enabled

### API Security
- [ ] JWT token expiration set (7 days)
- [ ] Passwords hashed with bcryptjs
- [ ] CORS configured properly
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting ready for production

### Frontend Security
- [ ] No sensitive data in localStorage except token
- [ ] Token cleared on logout
- [ ] No hardcoded credentials
- [ ] API calls use HTTPS in production
- [ ] CSRF protection ready

## Performance Checklist

### Backend
- [ ] Database indexes configured
- [ ] Query optimization implemented
- [ ] Error handling comprehensive
- [ ] Logging in place
- [ ] File cleanup implemented

### Frontend
- [ ] Components properly optimized
- [ ] CSS loaded efficiently
- [ ] API calls are minimal
- [ ] No memory leaks
- [ ] Responsive design tested

### Network
- [ ] API requests complete < 500ms
- [ ] Page loads in < 2 seconds
- [ ] Network tab shows no 404s
- [ ] No unused requests
- [ ] Compression enabled (gzip)

## Browser Testing

### Compatibility
- [ ] Chrome (latest) ✓
- [ ] Firefox (latest) ✓
- [ ] Safari (latest) ✓
- [ ] Edge (latest) ✓
- [ ] Mobile Chrome ✓
- [ ] Mobile Safari ✓

### Functionality
- [ ] All features work in all browsers
- [ ] Responsive design works
- [ ] Forms submit properly
- [ ] File uploads work
- [ ] No console errors
- [ ] Styling consistent

## Data Testing

### Sample Data
- [ ] `sample-data.csv` file created
- [ ] CSV has required columns
- [ ] CSV has 25+ records
- [ ] File can be uploaded
- [ ] Distribution works correctly

### Test Scenarios
- [ ] Login → Add 5 agents → Upload CSV
- [ ] Verify distribution math correct
- [ ] Test with different item counts
- [ ] Test with different agent counts

## Error Handling

### API Errors
- [ ] 400 errors show clear message
- [ ] 401 errors redirect to login
- [ ] 404 errors handled gracefully
- [ ] 500 errors logged server-side
- [ ] Network errors show user message

### Form Validation
- [ ] Empty fields rejected
- [ ] Invalid email rejected
- [ ] Duplicate entries rejected
- [ ] File type validation works
- [ ] Error messages clear and helpful

### User Feedback
- [ ] Loading indicators show
- [ ] Success messages display
- [ ] Error messages display
- [ ] Confirmation dialogs work
- [ ] No silent failures

## Documentation Review

### README.md
- [ ] Installation instructions clear
- [ ] Feature list complete
- [ ] API documentation included
- [ ] Troubleshooting section present
- [ ] Examples provided

### QUICKSTART.md
- [ ] Setup steps numbered
- [ ] Commands provided with explanations
- [ ] Demo credentials listed
- [ ] Common issues addressed

### TESTING.md
- [ ] Test cases documented
- [ ] Expected outcomes clear
- [ ] Test data provided
- [ ] Checklist format easy to follow

### DEPLOYMENT.md
- [ ] Multiple deployment options
- [ ] Step-by-step instructions
- [ ] Environment setup clear
- [ ] Security considerations included

## Final Verification

### Complete Workflow Test
1. [ ] Start both servers
2. [ ] Open browser to localhost:5173
3. [ ] Login with admin credentials
4. [ ] Add 5 agents successfully
5. [ ] Create CSV with 25 items
6. [ ] Upload CSV file
7. [ ] Verify distribution (5 items each)
8. [ ] Click each agent and verify tasks
9. [ ] Logout successfully
10. [ ] Confirm redirected to login

### Database Verification
- [ ] MongoDB connected successfully
- [ ] Admin document exists
- [ ] Agent documents created
- [ ] Task assignments stored
- [ ] Distribution records saved

### Network Verification
- [ ] All API calls succeed
- [ ] No failed requests
- [ ] Token properly handled
- [ ] CORS working
- [ ] No console errors

## Troubleshooting Verification

### Common Issues
- [ ] MongoDB connection issues resolved
- [ ] Port conflicts resolved
- [ ] CORS errors fixed
- [ ] JWT token issues resolved
- [ ] File upload issues fixed

### Performance
- [ ] No slow queries
- [ ] No memory leaks
- [ ] File cleanup working
- [ ] Error logging working

## Production Preparation

### Code Quality
- [ ] No console.log() in production code
- [ ] No hardcoded passwords
- [ ] No commented-out code
- [ ] Consistent formatting
- [ ] Comments where needed

### Configuration
- [ ] Environment variables properly set
- [ ] Production database configured
- [ ] Security headers configured
- [ ] HTTPS ready
- [ ] Monitoring set up

### Deployment Ready
- [ ] Code committed to git
- [ ] Documentation complete
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security checklist passed

## Sign-Off

- **Setup Date:** ___________
- **Verified By:** ___________
- **Status:** ☐ Complete ☐ Incomplete
- **Issues Found:** ___________
- **Notes:** ___________

---

## Next Steps

1. [ ] Run complete workflow test
2. [ ] Create sample data
3. [ ] Test with production database (if available)
4. [ ] Set up monitoring
5. [ ] Deploy to staging environment
6. [ ] Final testing in staging
7. [ ] Deploy to production
8. [ ] Monitor production deployment

---

**Setup Complete! Ready for Testing! 🚀**
