const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /csv|xlsx|xls/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only CSV, XLSX, XLS allowed"));
};

module.exports = multer({ storage, fileFilter });
