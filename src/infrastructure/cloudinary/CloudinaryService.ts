import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  private static instance: CloudinaryService;

  constructor() {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: 'dppjruhih',
      api_key: '428226644368993',
      api_secret: 'mMW8vc9nzwdclvIvwTqBSHr7ppA'
    });
  }

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload a profile photo to Cloudinary
   * @param fileBuffer - The image file buffer
   * @param userId - The user ID for creating a unique filename
   * @returns Promise<string> - The secure URL of the uploaded image
   */
  async uploadProfilePhoto(fileBuffer: Buffer, userId: string): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: `profile-photos/${userId}`,
            folder: 'sprintify/profile-photos',
            transformation: [
              { width: 300, height: 300, crop: 'fill', gravity: 'face' },
              { quality: 'auto', fetch_format: 'auto' }
            ],
            overwrite: true
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else if (result) {
              console.log('Cloudinary upload success:', result.secure_url);
              resolve(result.secure_url);
            } else {
              reject(new Error('Unknown upload error'));
            }
          }
        ).end(fileBuffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Delete a profile photo from Cloudinary
   * @param userId - The user ID to construct the public_id
   * @returns Promise<boolean> - Success status
   */
  async deleteProfilePhoto(userId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(`sprintify/profile-photos/${userId}`);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return false;
    }
  }
}
