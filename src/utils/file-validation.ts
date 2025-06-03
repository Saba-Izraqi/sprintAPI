// src/utils/file-validation.ts
export const validateProfilePhoto = (file: Express.Multer.File): { valid: boolean; error?: string } => {
  // 1. Check file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { 
      valid: false, 
      error: `Invalid file type. Only ${allowedMimeTypes.join(', ')} are allowed.` 
    };
  }

  // 2. Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is 5MB.` 
    };
  }

  return { valid: true };
};
