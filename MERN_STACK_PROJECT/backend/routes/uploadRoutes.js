const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadFile, getDistributions, getDistributionById } = require('../controllers/uploadController');
const auth = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const allowedExts = ['.csv', '.xls', '.xlsx'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(ext) || allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.post('/', auth, upload.single('file'), uploadFile);
router.get('/distributions', auth, getDistributions);
router.get('/distributions/:id', auth, getDistributionById);

module.exports = router;
