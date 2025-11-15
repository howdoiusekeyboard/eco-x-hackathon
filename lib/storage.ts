import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload waste image to Firebase Storage
 * @param file - Image file to upload
 * @param farmerId - ID of the farmer uploading the image
 * @returns Download URL of the uploaded image
 */
export async function uploadWasteImage(
  file: File,
  farmerId: string
): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `waste_${farmerId}_${timestamp}.${getFileExtension(file.name)}`;
    const filePath = `waste_images/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading waste image:', error);
    throw error;
  }
}

/**
 * Upload image from base64 data URL (for camera captures)
 * @param dataUrl - Base64 data URL of the image
 * @param farmerId - ID of the farmer uploading the image
 * @returns Download URL of the uploaded image
 */
export async function uploadWasteImageFromDataURL(
  dataUrl: string,
  farmerId: string
): Promise<string> {
  try {
    // Convert data URL to Blob
    const blob = await dataURLToBlob(dataUrl);

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `waste_${farmerId}_${timestamp}.jpg`;
    const filePath = `waste_images/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Upload blob
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading waste image from data URL:', error);
    throw error;
  }
}

/**
 * Delete an image from Firebase Storage
 * @param imageUrl - Download URL of the image to delete
 */
export async function deleteWasteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const path = extractPathFromURL(imageUrl);
    if (!path) {
      throw new Error('Invalid image URL');
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting waste image:', error);
    throw error;
  }
}

/**
 * Compress an image file before upload
 * @param file - Image file to compress
 * @param maxWidth - Maximum width of the compressed image
 * @param quality - JPEG quality (0-1)
 * @returns Compressed image as Blob
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1024,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'jpg';
}

/**
 * Convert data URL to Blob
 */
async function dataURLToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return await response.blob();
}

/**
 * Extract storage path from download URL
 */
function extractPathFromURL(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
    return null;
  } catch {
    return null;
  }
}
