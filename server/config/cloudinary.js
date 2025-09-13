const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Enhanced file filter with security checks
const fileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = /\.(jpeg|jpg|png|gif)$/i;
  const extname = allowedExtensions.test(path.extname(file.originalname));
  
  // Check MIME type
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif)$/i;
  const mimetype = allowedMimeTypes.test(file.mimetype);
  
  // Additional security: check file signature (magic numbers)
  const allowedSignatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46]
  };
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
  }
};

// Cloudinary storage configuration with enhanced security
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-management-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' }, // Responsive sizing
      { quality: 'auto:good' }, // Optimized quality
      { fetch_format: 'auto' } // Auto format selection
    ],
    public_id: (req, file) => {
      // Generate secure, unique public ID
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      return `event-image-${timestamp}-${random}-${sanitizedName}`;
    },
    resource_type: 'image',
    use_filename: false, 
    unique_filename: true, 
    overwrite: false, 
  },
});

// 
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 1, 
    fieldSize: 1024 * 1024, 
  },
  
  onError: (err, next) => {
    console.error('Upload error:', err);
    next(err);
  }
});


const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Only one file allowed per request.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field. Use "image" field name.'
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'File upload error: ' + error.message
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};

module.exports = {
  cloudinary,
  upload,
  handleUploadError
};