import { Media } from "@/lib/types/Media";
import JSZip from "jszip";

interface MultipartUploadPart {
    ETag: string | null
    PartNumber: number
}

  
async function getPresignedUrl(uploadId: string, key: string, partNumber: number): Promise<string> {
  const response = await fetch('/api/media/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId, partNumber, key }),
  });
  const data = await response.json();
  return data.url;
}
  
async function completeMultipartUpload(uploadId: string, key: string, parts: MultipartUploadPart[]): Promise<{url: string}> {
  try {  
    const res = await fetch('/api/media/end-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, parts, key }),
      });
      const data = await res.json()
      return data
  } catch (e: any) {
    throw e;
  }
}

export async function uploadPart(uploadId: string, key: string, partNumber: number, fileSlice: Blob) {
  const presignedUrl = await getPresignedUrl(uploadId, key, partNumber);
        
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: fileSlice,
  })
  const etag = res.headers.get('ETag');
  return { ETag: etag, PartNumber: partNumber };
}

const partSize = 5 * 1024 * 1024; // 5MB chunks
const maxPartsAtOnce = 10

export const uploadMedia = async (presignedUrl: string, file: File | Blob): Promise<boolean> => {
  try {
      const response = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
              'Content-Type': file.type,
          },
          body: file,
      })
      
      if (!response.ok) {
        const status = response.status;
        let errorDetail = '';
        try {
          errorDetail = await response.text();
        } catch (e) {
          console.error('Could not read error response text', e);
        }
        
        console.error(`Upload failed with status ${status}: ${errorDetail}`);
        
        if (status === 403) {
          console.error('Got 403 Forbidden - presigned URL might have expired');
          throw new Error('Presigned URL expired');
        }
        
        throw new Error(`Upload failed with status ${status}`);
      }
      
      return true;
  } catch (error) {
      console.error('Upload error:', error);
      return false;
  }
}

export async function uploadLargeMedia(uploadId: string, key: string, file: File): Promise<boolean> {    
  const fileParts = Math.ceil(file.size / partSize);
  const parts: MultipartUploadPart[] = [];
  const maxConcurrent = maxPartsAtOnce;

  // Use a sliding window approach to maintain constant concurrency
  let activeTasks = 0;
  let nextPartNumber = 1;
  
  return new Promise((resolve, reject) => {
    // Function to start a new part upload
    const uploadNextPart = () => {
      if (nextPartNumber > fileParts) {
        // No more parts to start
        return;
      }
      
      const partNumber = nextPartNumber++;
      activeTasks++;
      
      const begin = (partNumber - 1) * partSize;
      const end = partNumber * partSize;
      const slice = file.slice(begin, end);
      
      uploadPart(uploadId, key, partNumber, slice)
        .then(part => {
          parts.push(part);
          activeTasks--;
          
          // Check if all parts are uploaded
          if (parts.length === fileParts) {
            // All parts done, sort them by part number and complete the upload
            const sortedParts = [...parts].sort((a, b) => a.PartNumber - b.PartNumber);
            console.log("All parts uploaded, completing", sortedParts);
            completeMultipartUpload(uploadId, key, sortedParts)
              .then(({url}) => resolve(!!url))
              .catch(reject);
          } else {
            // Start another upload if there are more parts
            if (nextPartNumber <= fileParts) {
              uploadNextPart();
            }
          }
        })
        .catch(error => {
          console.error(`Error uploading part ${partNumber}:`, error);
          activeTasks--;
          reject(error);
        });
    };
    
    // Initialize uploads up to the concurrent limit
    for (let i = 0; i < Math.min(maxConcurrent, fileParts); i++) {
      uploadNextPart();
    }
  });
}

// export const useUploadFile = () => {
//   const [loading, setLoading] = useState<boolean>(false)
//   const [progress, setProgress] = useState<number>(0)
//   const [totalParts, setTotalParts] = useState<number>(0)
//   const [finishedParts, setFinishedParts] = useState<number>(0)

//   async function uploadFile(uploadId: string, key: string, file: File): Promise<string> {    
//     const fileParts = Math.ceil(file.size / partSize);
    
//     const parts: MultipartUploadPart[] = []

//     for (let partNumber = 1; partNumber <= fileParts; partNumber += maxPartsAtOnce) {
//       const partsPromises: Promise<MultipartUploadPart>[] = []

//       let finalPartNumber = partNumber
//       for (let i = partNumber; i < Math.min(partNumber + maxPartsAtOnce, fileParts + 1); i++) {
//           const begin = (i - 1) * partSize;
//           const end = i * partSize;
//           file.slice(begin, end)
//           partsPromises.push(uploadPart(uploadId, key, i, file.slice(begin, end)));
//           finalPartNumber += 1
//       }
//       const batchParts = await Promise.all(partsPromises);
//       setFinishedParts(oldFinishedParts =>  oldFinishedParts += (finalPartNumber - partNumber))
//       parts.push(...batchParts);
//     }

//     const {url} = await completeMultipartUpload(uploadId, key, parts);
//     return url
//   };

//   useEffect(() => {
//     if (totalParts > 0) {
//       setProgress(finishedParts / totalParts * 100)
//     }
//   }, [finishedParts, totalParts])

//   return {
//     uploadFile,
//     loading,
//     progress
//   }
// }

export async function downloadMedia(galleryName: string, mediaList: Media[]): Promise<void> {

  if (mediaList.length === 1) {
    const media = mediaList[0]
    const response = await fetch(media.url);
    const blob = await response.blob();

    // Create a link element to trigger the download
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = media.id;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(objectUrl);

  } else {
    const zip = new JSZip();

    for (const media of mediaList) {
        // Add the media to the zip if not a direct download
        const response = await fetch(media.url);
        const blob = await response.blob();
        zip.file(media.id, blob);
      }
      if (Object.keys(zip.files).length > 0) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // Create a link to download the zip file
          const link = document.createElement('a');
          const objectUrl = URL.createObjectURL(content);
          link.href = objectUrl;
          link.download = `${galleryName}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Clean up the URL object to prevent memory leaks
          URL.revokeObjectURL(objectUrl);
        });
      }
  }
}


export async function uploadHtml(rawHtml: string, propsId: string): Promise<{mediaLink: string, id: string}> {    
  const payload = {html: rawHtml, id: propsId}
  const response = await fetch('/api/upload/html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
};

