const { cloudinary } = require('../config/cloudinary');


const deleteImage = async (imageUrl) => {
    try {
        if (!imageUrl) {
            throw new Error('Image URL is required');
        }

       
        const publicId = extractPublicId(imageUrl);
        if (!publicId) {
            throw new Error('Invalid Cloudinary URL format');
        }

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};


const extractPublicId = (imageUrl) => {
    try {
        // Match Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
};


const getImageInfo = async (imageUrl) => {
    try {
        const publicId = extractPublicId(imageUrl);
        if (!publicId) {
            throw new Error('Invalid Cloudinary URL format');
        }

        const result = await cloudinary.api.resource(publicId);
        return result;
    } catch (error) {
        console.error('Error getting image info:', error);
        throw error;
    }
};


const transformImageUrl = (imageUrl, transformations = {}) => {
    try {
        const publicId = extractPublicId(imageUrl);
        if (!publicId) {
            throw new Error('Invalid Cloudinary URL format');
        }

        // Default transformations
        const defaultTransformations = {
            width: 800,
            height: 600,
            crop: 'limit',
            quality: 'auto:good',
            fetch_format: 'auto'
        };

        const finalTransformations = { ...defaultTransformations, ...transformations };
        
        return cloudinary.url(publicId, {
            transformation: [finalTransformations]
        });
    } catch (error) {
        console.error('Error transforming image URL:', error);
        return imageUrl; // Return original URL if transformation fails
    }
};


const isValidCloudinaryUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
        return false;
    }
    
    const cloudinaryUrlPattern = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9]+\/image\/upload\/.*$/;
    return cloudinaryUrlPattern.test(imageUrl);
};


const getOptimizedUrls = (imageUrl) => {
    if (!isValidCloudinaryUrl(imageUrl)) {
        return { original: imageUrl };
    }

    return {
        original: imageUrl,
        thumbnail: transformImageUrl(imageUrl, { width: 300, height: 200, crop: 'fill' }),
        medium: transformImageUrl(imageUrl, { width: 600, height: 400, crop: 'limit' }),
        large: transformImageUrl(imageUrl, { width: 1200, height: 800, crop: 'limit' }),
        webp: transformImageUrl(imageUrl, { fetch_format: 'webp', quality: 'auto:good' })
    };
};


const batchDeleteImages = async (imageUrls) => {
    try {
        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            throw new Error('Image URLs array is required and cannot be empty');
        }

        const publicIds = imageUrls
            .map(url => extractPublicId(url))
            .filter(id => id !== null);

        if (publicIds.length === 0) {
            throw new Error('No valid Cloudinary URLs found');
        }

        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error('Error batch deleting images:', error);
        throw error;
    }
};

module.exports = {
    deleteImage,
    extractPublicId,
    getImageInfo,
    transformImageUrl,
    isValidCloudinaryUrl,
    getOptimizedUrls,
    batchDeleteImages
};
