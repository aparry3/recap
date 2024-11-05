// UploadContext.ts
import { ChangeEvent, createContext, useCallback, useContext, useRef, useState } from 'react';
import ClientUpload from '@/components/Upload'
import { Gallery } from '@/lib/types/Gallery';


export interface OrientationImage {
    url: string;
    isVertical: boolean;
    dimensions: { width: number; height: number };
}

interface UploadState {
    images: OrientationImage[]
    gallery: Gallery
} 

interface UploadActions {
    upload: () => void
}

type GalleryContextType = UploadState & UploadActions

const GalleryContext = createContext<GalleryContextType>({} as GalleryContextType);

const GalleryProvider: React.FC<{ children: React.ReactNode, gallery: Gallery}> = ({ children, gallery: propsGallery }) => {
  const [personId, setPersonId] = useState<string>(localStorage.getItem('personId') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<OrientationImage[]>([]);
  const [stagedImages, setStagedImages] = useState<OrientationImage[]>([]);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState<boolean>(false);
  const [gallery] = useState<Gallery>(propsGallery);

  const handleBeginUpload = useCallback(() => {
      console.log(fileInputRef.current)
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  }, [fileInputRef]);


  const getImageOrientation = async (imageFile: File): Promise<OrientationImage>  => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const isVertical = img.height > img.width;
        URL.revokeObjectURL(img.src); // Clean up
        resolve({ url: URL.createObjectURL(imageFile), isVertical, dimensions: { width: img.width, height: img.height } });
      };
      img.onerror = () => {
        // In case of error, default to landscape
        resolve({ url: URL.createObjectURL(imageFile), isVertical: false, dimensions: { width: img.width, height: img.height } });
      };
    });
  };

  const loadImages = async (images: File[]) => {
      const imagesData = await Promise.all(
        images.map(image => getImageOrientation(image))
      );
      setStagedImages((prevImages) => [...prevImages, ...imagesData]);
    };

    
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Optionally, you can limit the number of files or perform other validations here
    setShowUploadConfirmation(true);
    loadImages(imageFiles);
  };

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Inserts an image into the gallery.
 * 
 * @param media - The OrientationImage object containing the image details to be inserted.
 * @returns A promise that resolves when the image is successfully inserted.
 */
/******  874274c9-1ee4-4643-b8b8-35838b3e506e  *******/
  const insertImage = async (media: OrientationImage) => {
    // const insertedMedia = await createMedia(media, gallery.id, personId)
  }
  const confirmImages = (confirmedImages: OrientationImage[]) => {
    setStagedImages(confirmedImages)
    confirmedImages.map(image => insertImage(image))

    setImages((oldImages) => [...oldImages, ...confirmedImages]);
    setStagedImages([]);
    setShowUploadConfirmation(false);
  };

  return (
    <GalleryContext.Provider value={{
        upload: handleBeginUpload,
        images: images,
        gallery
    }}>
      {children}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
    />
    {showUploadConfirmation && <ClientUpload images={stagedImages} upload={handleBeginUpload} onConfirm={confirmImages}/>}
    </GalleryContext.Provider>
  );
};



const useGallery = (): GalleryContextType => {
  const {
    upload,
    images,
    gallery
  } = useContext(GalleryContext);

  return {
    images,
    upload,
    gallery
  };
};

export default useGallery;
export { GalleryProvider, GalleryContext };