const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } = require('../config/cloudinary');

const validateUploadedImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    });
  }

  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    });
  }

  const url = req.file.secure_url || req.file.path;
  if (!url || !url.includes('res.cloudinary.com')) {
    return res.status(400).json({
      success: false,
      error: 'Image must be uploaded to Cloudinary. Local uploads are not supported.',
    });
  }

  return next();
};

module.exports = { validateUploadedImage };
