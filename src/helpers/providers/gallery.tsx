// UploadContext.ts
import { ChangeEvent, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ClientUpload from '@/components/Upload'
import { Gallery } from '@/lib/types/Gallery';
import { convertImageToWebP, createMedia, extractWebPPreview, fetchGalleryImages } from '../api/mediaClient';
import useLocalStorage from '../hooks/localStorage';
import { Media } from '@/lib/types/Media';
import { fetchGalleryPeople } from '../api/personClient';
import { GalleryPersonData } from '@/lib/types/Person';
import { uploadLargeMedia, uploadMedia } from '../hooks/upload';


export interface OrientationMedia {
    url: string;
    isVertical: boolean;
    name: string
    width: number; 
    height: number;
    contentType: string
    preview: string
}

export type OrientationMediaWithFile = OrientationMedia & {file: File, previewFile: Blob}

interface UploadState {
    media: Media[]
    person?: GalleryPersonData
    people: GalleryPersonData[]
    stagedMedia: OrientationMedia[]
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
  const [media, setMedia] = useState<Media[]>([]);
  const [people, setPeople] = useState<GalleryPersonData[]>([]);
  const [stagedMedia, setStagedMedia] = useState<(OrientationMediaWithFile)[]>([]);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState<boolean>(false);
  const [gallery] = useState<Gallery>(propsGallery);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [totalVideos, setTotalVideos] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<GalleryPersonData | undefined>(undefined);

  const handleBeginUpload = useCallback(() => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
}, [fileInputRef]);


const setPerson = useCallback((personId?: string) => {
  const _person = people.find(person => person.id === personId)
  setCurrentPerson(_person)
}, [people])
  const getImageOrientation = async (imageFile: File): Promise<OrientationMediaWithFile>  => {
    const [preview, image] = await Promise.all([
      convertImageToWebP(imageFile),
      new Promise<OrientationMedia>((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      img.src = url;
      img.onload = () => {
        const isVertical = img.height > img.width;
        resolve({ url, preview: url, isVertical: isVertical, contentType: imageFile.type, name: imageFile.name, width: img.width, height: img.height });
      };
      img.onerror = () => {
        // In case of error, default to landscape
        resolve({ url, preview: url, isVertical: false, contentType: imageFile.type, name: imageFile.name, width: img.width, height: img.height});
      };
    })])

    return {
      ...image,
      file: imageFile,
      preview: URL.createObjectURL(preview),
      previewFile: preview
    }
  };

  const getVideoOrientation = async (videoFile: File): Promise<OrientationMediaWithFile> => {
    const [previewImage, video] = await Promise.all([
      extractWebPPreview(videoFile),
      new Promise<OrientationMedia>((resolve) => {
        const video = document.createElement('video');
        const url = URL.createObjectURL(videoFile);
        video.src = url;

        video.onloadedmetadata = () => {
          const isVertical = video.videoHeight > video.videoWidth;
          resolve({
            url,
            preview: url,
            isVertical: isVertical,
            contentType: videoFile.type,
            name: videoFile.name,
            width: video.videoWidth,
            height: video.videoHeight,
          });
        };
    
        video.onerror = () => {
          // Default to landscape in case of error
          console.log("Video error:", url);
          resolve({
            url,
            preview: url,
            isVertical: false,
            contentType: videoFile.type,
            name: videoFile.name,
            width: 0,
            height: 0,
          });
        };
      })])

   const orVid = {
      ...video,
      file: videoFile,
      preview: URL.createObjectURL(previewImage),
      previewFile: previewImage
    }

    return orVid
  };
  

  /**
   * Load a list of files into the staged media state.
   * @param media List of image files to load.
   */
  const loadFiles = async (files: File[]) => {
      const filesData = await Promise.all(
        files.map(file => {
          if (file.type.startsWith('image/')) {
            setTotalImages(oldTotal => oldTotal + 1)
             return getImageOrientation(file) 
          } else {
            setTotalVideos(oldTotal => oldTotal + 1)
             return getVideoOrientation(file)
          }
        }));
      setStagedMedia((prevImages) => [...prevImages, ...filesData]);
    };

  const handleFileChange = async(event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Optionally, you can limit the number of files or perform other validations here
    setShowUploadConfirmation(true);
    loadFiles(files);
  };

  const insertMedia = useCallback(async (newMedia: OrientationMediaWithFile): Promise<Media> => {
    const {file, previewFile, preview, url, isVertical, ..._newMedia} = newMedia
    const insertedMedia = await createMedia({..._newMedia, personId}, gallery.id)
    const {presignedUrls, ...media} = insertedMedia
    URL.revokeObjectURL(url)
    URL.revokeObjectURL(preview)
    console.log(presignedUrls)
    const uploaded = presignedUrls.large ? uploadMedia(presignedUrls.large, file) : presignedUrls.uploadId ? uploadLargeMedia(presignedUrls.uploadId, presignedUrls.key, file) : Promise.reject(`Unable to upload file`)
    const webpUploaded = uploadMedia(presignedUrls.small, previewFile)
    await Promise.all([uploaded, webpUploaded])
    return media
  }, [personId, gallery.id])

  const confirmMedia = (confirmedImages: OrientationMediaWithFile[]) => {
    setStagedMedia(confirmedImages)
    const imagePromises = confirmedImages.map(image => insertMedia(image).then(media => {
      setMedia((oldImages) => [...oldImages, media])
    }))
    
    // setMedia((oldImages) => [...oldImages, ...confirmedImages]);
    setStagedMedia([]);
    setShowUploadConfirmation(false);
  };

  const cancelImages = () => {
    setStagedMedia([])
    setShowUploadConfirmation(false);
  };

  const initImages = async (galleryId: string) => {
    const _media = await fetchGalleryImages(galleryId)
    setMedia(_media)

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
        media: media,
        people,
        setPerson,
        person: currentPerson,
        stagedMedia: stagedMedia,
        gallery
    }}>
      {children}
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
    />
    {showUploadConfirmation && <ClientUpload media={stagedMedia} upload={handleBeginUpload} onConfirm={confirmMedia} onCancel={cancelImages}/>}
    </GalleryContext.Provider>
  );
};



const useGallery = (): GalleryContextType => {
  const {
    upload,
    media,
    people,
    person,
    gallery,
    setPerson,
    stagedMedia
  } = useContext(GalleryContext);

  return {
    media,
    people,
    person,
    setPerson,
    stagedMedia,
    upload,
    gallery
  };
};

export default useGallery;
export { GalleryProvider, GalleryContext };