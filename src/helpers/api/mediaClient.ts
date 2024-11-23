import { Media, NewMediaData } from "@/lib/types/Media"

export const createMedia = async (media: NewMediaData, galleryId: string): Promise<Media & {presignedUrls: {large: string, small: string}}> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(media as NewMediaData),
    }).then(res => res.json())
    return data
}

export const uploadMedia = async (presignedUrl: string, file: File | Blob): Promise<boolean> => {
    try {
        const data = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        })
        return data.status === 200
    }  catch (error) {
        console.log(error)
        return false
    }
}

export const fetchGalleryImages = async (galleryId: string): Promise<Media[]> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`).then(res => res.json())
    return data.media
}

export async function convertImageToWebP(imageFile: File | Blob, maxDimension: number = 500): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
  
        if (width > height && width > maxDimension) {
          height = (maxDimension / width) * height;
          width = maxDimension;
        } else if (height >= width && height > maxDimension) {
          width = (maxDimension / height) * width;
          height = maxDimension;
        }
  
        // Set up the canvas with the new dimensions
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
  
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Convert canvas to WebP
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject('Conversion to WebP failed');
          }
        }, 'image/webp');
      };
      img.onerror = reject;
    });
  }  


  export function extractWebPPreview(videoFile: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.currentTime = 1; // Seek to 1 second for a representative frame

      video.addEventListener('loadeddata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get 2D context for canvas.'));
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
              if (blob) {
                  resolve(blob); // Resolve the WebP blob
              } else {
                  reject(new Error('Failed to create WebP blob.'));
              }
          }, 'image/webp');
      });

      video.addEventListener('error', () => {
          reject(new Error('Error loading video.'));
      });
  });
}
