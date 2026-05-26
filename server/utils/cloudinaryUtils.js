const { cloudinary } = require('../config/cloudinary');
const ApiError = require('./ApiError');

const CLOUDINARY_URL_PATTERN =
  /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9]+\/image\/upload\/.*$/;

const extractPublicId = (imageUrl) => {
  try {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

const isValidCloudinaryUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  return CLOUDINARY_URL_PATTERN.test(imageUrl);
};

const transformImageUrl = (imageUrl, transformations = {}) => {
  try {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
      throw new Error('Invalid Cloudinary URL format');
    }

    const defaultTransformations = {
      width: 800,
      height: 600,
      crop: 'limit',
      quality: 'auto:good',
      fetch_format: 'auto',
    };

    return cloudinary.url(publicId, {
      transformation: [{ ...defaultTransformations, ...transformations }],
      secure: true,
    });
  } catch (error) {
    console.error('Error transforming image URL:', error);
    return imageUrl;
  }
};

const getOptimizedUrls = (imageUrl) => {
  if (!isValidCloudinaryUrl(imageUrl)) {
    return null;
  }

  return {
    original: imageUrl,
    thumbnail: transformImageUrl(imageUrl, {
      width: 400,
      height: 250,
      crop: 'fill',
      quality: 'auto:good',
    }),
    medium: transformImageUrl(imageUrl, {
      width: 800,
      height: 500,
      crop: 'limit',
      quality: 'auto:good',
    }),
    large: transformImageUrl(imageUrl, {
      width: 1200,
      height: 800,
      crop: 'limit',
      quality: 'auto:good',
    }),
    webp: transformImageUrl(imageUrl, {
      fetch_format: 'webp',
      quality: 'auto:good',
      width: 1200,
      height: 800,
      crop: 'limit',
    }),
  };
};

const resolvePublicIdFromFile = (file) => {
  if (!file) return null;
  if (file.public_id) return file.public_id;
  if (file.filename) return file.filename;
  const url = file.secure_url || file.path;
  return url ? extractPublicId(url) : null;
};

const buildImagePayload = (file) => {
  if (!file) return null;

  const secureUrl = file.secure_url || file.path;
  if (!secureUrl || !isValidCloudinaryUrl(secureUrl)) {
    throw new ApiError(
      400,
      'Image upload failed. Poster must be stored on Cloudinary.'
    );
  }

  const publicId = resolvePublicIdFromFile(file);
  const imageUrls = getOptimizedUrls(secureUrl);

  return {
    image: imageUrls.large || secureUrl,
    imagePublicId: publicId,
    imageUrls,
  };
};

const deleteImage = async (imageUrlOrPublicId) => {
  if (!imageUrlOrPublicId) {
    throw new Error('Image URL or public ID is required');
  }

  const publicId = imageUrlOrPublicId.includes('http')
    ? extractPublicId(imageUrlOrPublicId)
    : imageUrlOrPublicId;

  if (!publicId) {
    throw new Error('Invalid Cloudinary image reference');
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

const deleteEventImage = async (event) => {
  if (!event?.image) return;

  if (!isValidCloudinaryUrl(event.image)) {
    console.warn('Skipping delete for non-Cloudinary image:', event.image);
    return;
  }

  const publicId = event.imagePublicId || extractPublicId(event.image);
  if (!publicId) return;

  try {
    await deleteImage(publicId);
  } catch (error) {
    console.warn('Failed to delete Cloudinary image:', error.message);
  }
};

const getImageInfo = async (imageUrl) => {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) {
    throw new Error('Invalid Cloudinary URL format');
  }
  return cloudinary.api.resource(publicId);
};

const batchDeleteImages = async (imageUrls) => {
  const publicIds = imageUrls
    .map((url) => extractPublicId(url))
    .filter(Boolean);

  if (publicIds.length === 0) {
    throw new Error('No valid Cloudinary URLs found');
  }

  return cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
};

module.exports = {
  deleteImage,
  deleteEventImage,
  extractPublicId,
  getImageInfo,
  transformImageUrl,
  isValidCloudinaryUrl,
  getOptimizedUrls,
  buildImagePayload,
  batchDeleteImages,
};
