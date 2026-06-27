const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const ApiError = require('../utils/apiError');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
  },
});

module.exports = upload;
