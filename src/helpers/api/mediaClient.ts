import { Media, MediaUpdate, NewMediaData, PresignedUrls } from "@/lib/types/Media"

export const createMedia = async (media: NewMediaData, galleryId: string, albumId?: string): Promise<Media & {presignedUrls: PresignedUrls}> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...media, albumId: albumId || ''} as NewMediaData & {albumId: string}),
    }).then(res => res.json())
    return data
}

export const fetchMedia = async (id: string): Promise<Media & {presignedUrls: PresignedUrls}> => {
  const data = await fetch(`/api/media/${id}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => res.json())
  return data
}

export const deleteMedia = async (id: string): Promise<boolean> => {
  const data = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => res.json())
  return data.success
}


export const updateMedia = async (id: string, mediaUpdate: MediaUpdate): Promise<Media> => {
  const data = await fetch(`/api/media/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaUpdate as MediaUpdate),
  }).then(res => res.json())
  return data
}


export const fetchGalleryImages = async (galleryId: string): Promise<Media[]> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`).then(res => res.json())
    return data.media
}

export const fetchGalleryImage = async (galleryId: string, mediaId: string): Promise<Media[]> => {
  const data = await fetch(`/api/galleries/${galleryId}/media/${mediaId}`).then(res => res.json())
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
  
      // Ensure the video has a muted attribute for auto-playing
      video.muted = true;
      video.playsInline = true;
  
      // Handle the `canplay` event to ensure the video is ready for frame capture
      video.addEventListener('canplay', () => {
        // Seek to the desired frame
        video.currentTime = 1;
  
        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get 2D context for canvas.'));
            return;
          }
  
          // Draw the video frame to the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
          // Convert the canvas content to a WebP blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob); // Resolve with the WebP blob
            } else {
              reject(new Error('Failed to create WebP blob.'));
            }
          }, 'image/webp');
        });
  
        // Handle seek errors
        video.addEventListener('error', () => {
          reject(new Error('Error seeking video frame.'));
        });
      });
  
      // Handle video load errors
      video.addEventListener('error', () => {
        reject(new Error('Error loading video.'));
      });
  
      // Attempt to play the video to ensure it loads on mobile
      video.play().catch((err) => {
        // Ignore play errors, just ensure the video can load
        console.warn('Autoplay error, continuing with load:', err);
      });
    });
  }
  