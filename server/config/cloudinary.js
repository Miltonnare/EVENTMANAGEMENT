const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const config = require('./index');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const extname = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));
  const mimetype = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'),
      false
    );
  }
};

const posterTransformations = [
  { width: 1200, height: 800, crop: 'limit' },
  { quality: 'auto:good' },
  { fetch_format: 'auto' },
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: config.cloudinary.folder,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: posterTransformations,
    public_id: () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      return `poster-${timestamp}-${random}-${sanitizedName}`;
    },
    resource_type: 'image',
    use_filename: false,
    unique_filename: true,
    overwrite: false,
  }),
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fieldSize: 1024 * 1024,
  },
});

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Only one poster image allowed per request.',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field. Use "image" as the field name.',
        });
      default:
        return res.status(400).json({
          success: false,
          error: `File upload error: ${error.message}`,
        });
    }
  }

  if (error.message && error.message.includes('Invalid file type')) {
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
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
};
