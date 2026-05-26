const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const config = require('./index');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

if (config.env === 'development') {
  console.log('Cloudinary config check:', {
    cloud_name: config.cloudinary.cloudName ? 'Set' : 'Missing',
    api_key: config.cloudinary.apiKey ? 'Set' : 'Missing',
    api_secret: config.cloudinary.apiSecret ? 'Set' : 'Missing',
  });
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|gif)$/i;
  const extname = allowedExtensions.test(path.extname(file.originalname));
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif)$/i;
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-management-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
    public_id: (req, file) => {
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

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fieldSize: 1024 * 1024,
  },
  onError: (err, next) => {
    console.error('Upload error:', err);
    next(err);
  },
});

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB.',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Only one file allowed per request.',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field. Use "image" field name.',
        });
      default:
        return res.status(400).json({
          success: false,
          error: `File upload error: ${error.message}`,
        });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
};

module.exports = {
  cloudinary,
  upload,
  handleUploadError,
};
