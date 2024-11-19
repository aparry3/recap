// UploadContext.ts
import { ChangeEvent, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ClientUpload from '@/components/Upload'
import { Gallery } from '@/lib/types/Gallery';
import { convertImageToWebP, createMedia, fetchGalleryImages, uploadMedia } from '../api/mediaClient';
import useLocalStorage from '../hooks/localStorage';
import { Media } from '@/lib/types/Media';
import { fetchGalleryPeople } from '../api/personClient';
import { GalleryPersonData, Person } from '@/lib/types/Person';


export interface OrientationImage {
    url: string;
    isVertical: boolean;
    name: string
    width: number; 
    height: number;
    contentType: string
}

export type OrientationImageWithFile = OrientationImage & {file: File}

interface UploadState {
    images: Media[]
    person?: GalleryPersonData
    people: GalleryPersonData[]
    stagedImages: OrientationImage[]
    gallery: Gallery
} 

interface UploadActions {
    upload: () => void
    setPerson: (personId?: string) => void
}

type GalleryContextType = UploadState & UploadActions

const GalleryContext = createContext<GalleryContextType>({} as GalleryContextType);

const GalleryProvider: React.FC<{ children: React.ReactNode, gallery: Gallery}> = ({ children, gallery: propsGallery }) => {
  const [personId] = useLocalStorage<string>('personId', '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Media[]>([]);
  const [people, setPeople] = useState<GalleryPersonData[]>([]);
  const [stagedImages, setStagedImages] = useState<(OrientationImageWithFile)[]>([]);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState<boolean>(false);
  const [gallery] = useState<Gallery>(propsGallery);

  const [currentPerson, setCurrentPerson] = useState<GalleryPersonData | undefined>(undefined);

  const handleBeginUpload = useCallback(() => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
}, [fileInputRef]);

useEffect(() => {
  console.log(personId)
}, [personId]);

const setPerson = useCallback((personId?: string) => {
  const _person = people.find(person => person.id === personId)
  setCurrentPerson(_person)
}, [people])
  const getImageOrientation = async (imageFile: File): Promise<OrientationImageWithFile>  => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      img.src = url;
      img.onload = () => {
        const isVertical = img.height > img.width;
        resolve({ url, file: imageFile, isVertical: isVertical, contentType: imageFile.type, name: imageFile.name, width: img.width, height: img.height });
      };
      img.onerror = () => {
        // In case of error, default to landscape
        resolve({ url, file: imageFile, isVertical: false, contentType: imageFile.type, name: imageFile.name, width: img.width, height: img.height});
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

  const insertImage = useCallback(async (newMedia: OrientationImageWithFile): Promise<Media> => {
    const {file, url, isVertical, ..._newMedia} = newMedia
    const insertedMedia = await createMedia({..._newMedia, personId}, gallery.id)
    const {presignedUrls, ...media} = insertedMedia
    URL.revokeObjectURL(url)
    const uploaded = uploadMedia(presignedUrls.large, file)
    const webpUploaded = convertImageToWebP(file).then(blob => uploadMedia(presignedUrls.small, blob))
    await Promise.all([uploaded, webpUploaded])
    return media
  }, [personId, gallery.id])

  const confirmImages = (confirmedImages: OrientationImageWithFile[]) => {
    setStagedImages(confirmedImages)
    const imagePromises = confirmedImages.map(image => insertImage(image).then(media => {
      setImages((oldImages) => [...oldImages, media])
    }))
    
    // setImages((oldImages) => [...oldImages, ...confirmedImages]);
    setStagedImages([]);
    setShowUploadConfirmation(false);
  };

  const cancelImages = () => {
    setStagedImages([])
    setShowUploadConfirmation(false);
  };

  const initImages = async (galleryId: string) => {
    const _images = await fetchGalleryImages(galleryId)
    setImages(_images)

  }

  const initPeople = async (galleryId: string) => {
    const _people = await fetchGalleryPeople(galleryId)
    console.log(_people)
    setPeople(_people)

  }

  useEffect(() => {
    initImages(gallery.id)
    initPeople(gallery.id)
  }, [gallery.id])


  return (
    <GalleryContext.Provider value={{
        upload: handleBeginUpload,
        images: images,
        people,
        setPerson,
        person: currentPerson,
        stagedImages: stagedImages,
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
    {showUploadConfirmation && <ClientUpload images={stagedImages} upload={handleBeginUpload} onConfirm={confirmImages} onCancel={cancelImages}/>}
    </GalleryContext.Provider>
  );
};



const useGallery = (): GalleryContextType => {
  const {
    upload,
    images,
    people,
    person,
    gallery,
    setPerson,
    stagedImages
  } = useContext(GalleryContext);

  return {
    images,
    people,
    person,
    setPerson,
    stagedImages,
    upload,
    gallery
  };
};

export default useGallery;
export { GalleryProvider, GalleryContext };