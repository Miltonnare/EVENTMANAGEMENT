const CLOUDINARY_HOST = 'res.cloudinary.com';

export const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.includes(CLOUDINARY_HOST);

/**
 * Resolve the best poster URL from an event document.
 * Prefers stored optimized variants, then falls back to the primary image field.
 */
export const getPosterUrl = (event, size = 'large') => {
  if (!event?.image && !event?.imageUrls) return null;

  const urls = event.imageUrls || {};
  const bySize = urls[size] || urls.large || urls.medium || urls.thumbnail;

  if (bySize) return bySize;
  if (event.image && isCloudinaryUrl(event.image)) return event.image;
  return null;
};

export const getResponsivePosterSources = (event) => {
  const urls = event?.imageUrls;
  const fallback = getPosterUrl(event, 'large');

  if (!urls && !fallback) return null;

  const thumbnail = urls?.thumbnail || fallback;
  const medium = urls?.medium || fallback;
  const large = urls?.large || urls?.webp || fallback;

  const srcSet = [
    thumbnail && `${thumbnail} 400w`,
    medium && `${medium} 800w`,
    large && `${large} 1200w`,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    src: medium || large || thumbnail,
    srcSet: srcSet || undefined,
  };
};

export const ACCEPTED_POSTER_TYPES = {
  accept: 'image/jpeg,image/png,image/webp',
  label: 'JPEG, PNG, or WebP',
};

export const validatePosterFile = (file) => {
  if (!file) return { valid: true };
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  const maxBytes = 5 * 1024 * 1024;

  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'Image must be 5MB or smaller.',
    };
  }

  return { valid: true };
};
