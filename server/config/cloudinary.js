import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-management-app', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], 
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, 
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
    
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `event-image-${timestamp}-${random}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed! (jpeg, jpg, png, gif)'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  }
});


export default cloudinary;