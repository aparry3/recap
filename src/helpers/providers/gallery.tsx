// UploadContext.ts
import { ChangeEvent, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ClientUpload from '@/components/Upload'
import { Gallery } from '@/lib/types/Gallery';
import { convertImageToWebP, createMedia, deleteMedia, extractWebPPreview, fetchGalleryImages, fetchMedia, updateMedia } from '../api/mediaClient';
import useLocalStorage from '../hooks/localStorage';
import { Media, PresignedUrls } from '@/lib/types/Media';
import { fetchGalleryPeople } from '../api/personClient';
import { GalleryPersonData } from '@/lib/types/Person';
import { downloadMedia, uploadLargeMedia, uploadMedia } from '../hooks/upload';
import UploadStatus from '@/components/UploadStatus';
import { addFile, readFiles, removeFile, TempFile } from '../clientDb';
import ConfirmDelete from '@/components/ConfirmDelete';
import { AlbumMediaData } from '@/lib/types/Album';
import { updateGallery } from '../api/galleryClient';
import EditGallery from '@/components/PersonPage/Edit';
import { fetchAlbums } from '../api/albumClient';
import SyncStatus from '@/components/SyncStatus';

// Define constants at the top level
const CONCURRENT_UPLOADS = 5; // Number of concurrent uploads to maintain

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
    albums: AlbumMediaData[]
    person?: GalleryPersonData
    album?: AlbumMediaData
    people: GalleryPersonData[]
    stagedMedia: OrientationMedia[]
    gallery: Gallery
    selectImages: boolean
    canDelete?: boolean
    selectedImages: Set<string>
    loading: boolean
} 

interface UploadActions {
    deleteImages: () => void,
    upload: () => void
    download: () => void
    setAlbums: (albums: AlbumMediaData[]) => void
    setAlbum: (album?: AlbumMediaData) => void
    setPerson: (personId?: string) => void
    toggleSelectImages: () => void
    toggleSelectedImage: (imageId: string, personId: string) => void
    setSelectedImages: (imageIds: Set<string>) => void
    loadGallery: () => Promise<void>
    openSettings: () => void
    loadAlbums: () => Promise<void>
}

type GalleryContextType = UploadState & UploadActions

const GalleryContext = createContext<GalleryContextType>({} as GalleryContextType);

const GalleryProvider: React.FC<{ children: React.ReactNode, gallery: Gallery}> = ({ children, gallery: propsGallery }) => {
  const [personId] = useLocalStorage<string>('personId', '');
  const [galleryImages, setGalleryImages] = useLocalStorage<string>('galleryImages', '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [people, setPeople] = useState<GalleryPersonData[]>([]);
  const [stagedMedia, setStagedMedia] = useState<(OrientationMediaWithFile)[]>([]);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState<boolean>(false);
  const [gallery, setGallery] = useState<Gallery>(propsGallery);
  const [currentPerson, setCurrentPerson] = useState<GalleryPersonData | undefined>(undefined);
  const [currentAlbum, setCurrentAlbum] = useState<AlbumMediaData | undefined>(undefined)
  const[totalUploads, setTotalUploads] = useState<number | undefined>();
  const[completeUploads, setCompleteUploads] = useState<number | undefined>();
  const [selectImages, setSelectImages] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedMediaUploaders, setSelectedMediaUploaders] = useState<string[]>([])
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [albums, setAlbums] = useState<AlbumMediaData[]>([])
  const [syncingWebsite, setSyncingWebsite] = useState<boolean>(false)

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
  
  useEffect(() => {
    if (selectedImages.size === 0) {
      setSelectedMediaUploaders([])
    }
  }, [selectedImages])

  /**
   * Load a list of files into the staged media state.
   * @param media List of image files to load.
   */
  const loadFiles = async (files: File[]) => {
      const filesData = await Promise.all(
        files.map(file => {
          if (file.type.startsWith('image/')) {
             return getImageOrientation(file) 
          } else {
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

  const doUploadMedia = async (id: string, presignedUrls: PresignedUrls, file: File, previewFile: Blob) => {
    let mediaUploaded = false
    let previewUploaded = false
    let retryCount = 0
    const MAX_RETRIES = 3
    
    let signedUrls = presignedUrls
    while ((!mediaUploaded || !previewUploaded) && retryCount < MAX_RETRIES) {
      try {
        const uploadedPromise: Promise<boolean> = mediaUploaded 
          ? Promise.resolve(true) 
          : signedUrls.large 
            ? uploadMedia(signedUrls.large, file) 
            : signedUrls.uploadId 
              ? uploadLargeMedia(signedUrls.uploadId, signedUrls.key, file) 
              : Promise.reject(`Unable to upload file`)
        
        const webpUploadedPromise: Promise<boolean> = previewUploaded 
          ? Promise.resolve(true) 
          : uploadMedia(signedUrls.small, previewFile)
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Upload timed out')), 60000) // 60 second timeout
        })
        
        const [uploaded, webpUploaded] = await Promise.race([
          Promise.all([uploadedPromise, webpUploadedPromise]),
          timeoutPromise.then(() => { throw new Error('Upload timed out') })
        ])
        
        mediaUploaded = uploaded
        previewUploaded = webpUploaded
        
        if (!mediaUploaded || !previewUploaded) {
          retryCount++
          console.log(`Retrying upload for media ${id}. Attempt ${retryCount} of ${MAX_RETRIES}`)
          const m = await fetchMedia(id)
          signedUrls = m.presignedUrls
        }
      } catch (error) {
        retryCount++
        console.error(`Upload error for media ${id}:`, error)
        console.log(`Retrying upload for media ${id}. Attempt ${retryCount} of ${MAX_RETRIES}`)
        
        // Add exponential backoff delay
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
        
        // Refresh presigned URLs on error
        try {
          const m = await fetchMedia(id)
          signedUrls = m.presignedUrls
        } catch (urlError) {
          console.error(`Failed to refresh presigned URLs for media ${id}:`, urlError)
        }
      }
    }
    
    if (!mediaUploaded || !previewUploaded) {
      console.error(`Failed to upload media ${id} after ${MAX_RETRIES} attempts`)
      throw new Error(`Failed to upload media ${id} after ${MAX_RETRIES} attempts`)
    }
    
    return true
  }

  const insertMedia = useCallback(async (newMedia: OrientationMediaWithFile, addToAlbum: boolean): Promise<Media & {presignedUrls: PresignedUrls, file: File, previewFile: Blob}> => {
    const {file, previewFile, preview, url, isVertical, ..._newMedia} = newMedia
    const insertedMedia = await createMedia({..._newMedia, personId}, gallery.id, currentAlbum && addToAlbum ? currentAlbum.id : undefined)

    URL.revokeObjectURL(url)
    URL.revokeObjectURL(preview)

    await addFile(insertedMedia.id, gallery.id, file, previewFile)
    // await doUploadMedia(_media.id, presignedUrls, file, previewFile)
    // return _media
    return {...insertedMedia, file, previewFile}
  }, [personId, gallery.id, currentAlbum])

  const finalizeMedia = async (id: string): Promise<Media> => {
    const [media] = await Promise.all([
      updateMedia(id, {uploaded: true}),
      removeFile(id)
    ])
    return media
  }

  const confirmMedia = async (confirmedImages: OrientationMediaWithFile[], addToAlbum: boolean) => {
    setStagedMedia(confirmedImages);
    setTotalUploads(confirmedImages.length);
    setCompleteUploads(0);
    
    const uploadedImages = await Promise.all(confirmedImages.map(image => insertMedia(image, addToAlbum)))
    // Create a queue of all images to upload
    const queue = [...uploadedImages];
    const inProgress = new Set(); // Track ongoing uploads
    const results: Media[] = []; // Store completed upload results
    
    // Process function that maintains CONCURRENT_UPLOADS active uploads
    const processQueue = async () => {
      // While we have capacity and items in the queue, start new uploads
      while (inProgress.size < CONCURRENT_UPLOADS && queue.length > 0) {
        const image = queue.shift()!;
        inProgress.add(image.id);
        
        try {
        // Start the upload process
        await doUploadMedia(image.id, image.presignedUrls, image.file, image.previewFile)
        const m = await finalizeMedia(image.id);
        results.push(m);
        setCompleteUploads(oldComplete => (oldComplete || 0) + 1);
        setMedia((oldImages) => [...oldImages, m]);
        if (currentAlbum && addToAlbum) {
          setCurrentAlbum({...currentAlbum, recentMedia: [m, ...(currentAlbum?.recentMedia || [])]});
          }
        } catch (err) {
          console.error("Upload failed:", err);
        } finally {
          // Remove from in-progress set and process next item
          inProgress.delete(image.id);
          // If there are items in the queue, process the next one
          if (queue.length > 0) {
              processQueue();
            }
            // If we're done with everything, clean up
            if (inProgress.size === 0 && queue.length === 0) {
              finishUploads();
            }
        }
      }
    };
    
    // Function to handle cleanup after all uploads complete
    const finishUploads = () => {
      // Clean up any remaining object URLs
      confirmedImages.forEach(image => {
        // These may already be revoked in insertMedia, but it's good to be thorough
        if (image.url) URL.revokeObjectURL(image.url);
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
      
      setShowUploadConfirmation(false);
      setStagedMedia([]);
      
      const timer = setTimeout(() => {
        setTotalUploads(undefined);
        setGalleryImages('');
        setCompleteUploads(undefined);  
      }, 500);
    };
    
    // Start the initial batch of uploads
    await processQueue();
  }

  const cancelImages = () => {
    // Release object URLs for all staged media
    stagedMedia.forEach(media => {
      if (media.url) URL.revokeObjectURL(media.url);
      if (media.preview) URL.revokeObjectURL(media.preview);
    });
    setStagedMedia([])
    setGalleryImages('')
    setShowConfirmDelete(false)
    setShowUploadConfirmation(false);
  };

  const handleUnfinishedUploads = useCallback(async (files: TempFile[]) => {
    if (files.length === 0) {
      return
    }
    setTotalUploads(files.length)
    setCompleteUploads(0)

    // Create a queue of unfinished files to process
    const queue = [...files];
    const inProgress = new Set(); // Track ongoing uploads
    const results: Media[] = []; // Store completed results
    
    // Process function that maintains CONCURRENT_UPLOADS active uploads
    const processQueue = async () => {
      // While we have capacity and items in the queue, start new uploads
      while (inProgress.size < CONCURRENT_UPLOADS && queue.length > 0) {
        const file = queue.shift()!;
        inProgress.add(file.id);
        
        // Start the upload process
        fetchMedia(file.id)
          .then(async m => {
            return doUploadMedia(file.id, m.presignedUrls, file.file, file.previewFile)
              .then(async _ => {
                const finishedMedia = await finalizeMedia(m.id);
                results.push(finishedMedia);
                setCompleteUploads(oldComplete => (oldComplete || 0) + 1);
                setMedia((oldImages) => [...oldImages, finishedMedia]);
                return finishedMedia;
              });
          })
          .catch(err => {
            console.error("Unfinished upload failed:", err);
          })
          .finally(() => {
            // Remove from in-progress set and process next item
            inProgress.delete(file.id);
            // If there are items in the queue, process the next one
            if (queue.length > 0) {
              processQueue();
            }
            // If we're done with everything, clean up
            if (inProgress.size === 0 && queue.length === 0) {
              // All uploads completed, clean up
              const timer = setTimeout(() => {
                setTotalUploads(undefined);
                setCompleteUploads(undefined);
              }, 500);
            }
          });
      }
    };
    
    // Start the initial batch of uploads
    await processQueue();
  }, [])

  const initImages = async (galleryId: string) => {
    const _media = await fetchGalleryImages(galleryId)
    setMedia(_media.filter(m => m.uploaded))
    return _media.filter(m => !m.uploaded)
  }

  const initPeople = async (galleryId: string) => {
    const _people = await fetchGalleryPeople(galleryId)
    setPeople(_people)
  }

  const loadAlbums = useCallback(async () => {
    return initAlbums(gallery.id)
  }, [gallery.id])

  const initAlbums = async (galleryId: string) => {
    const _albums = await fetchAlbums(galleryId)
    setAlbums(_albums)
    setCurrentAlbum((oldAlbum) => _albums.find(a => a.id === oldAlbum?.id))
  }

  const loadGallery = useCallback(async () => {
    const [unfinishedImages, files] = await Promise.all([
      initImages(gallery.id),
      readFiles(),
      initAlbums(gallery.id),
      initPeople(gallery.id),
    ])
    const fileIds = new Set(files.map(f => f.id))
    const deleteImagePromises = unfinishedImages.map(async image => {
      if (fileIds.has(image.id)) {
        return
      }
      await deleteMedia(image.id)
    })
    await Promise.all([deleteImagePromises, handleUnfinishedUploads(files)])
    setLoading(false)
  }, [gallery.id])

  useEffect(() => {
    loadGallery()
  }, [loadGallery])

  const toggleSelectImages = () => {
    setSelectImages(!selectImages)
    setSelectedImages(new Set())
  }
  const toggleSelectedImage = useCallback((id: string, personId: string) => {
      if (selectedImages.has(id)) {
          selectedImages.delete(id)
          const index = selectedMediaUploaders.indexOf(personId);
          if (index !== -1) {
            selectedMediaUploaders.splice(index, 1)
            setSelectedMediaUploaders([...selectedMediaUploaders]);
          }
          const newSelectedImages = new Set(selectedImages)
          setSelectedImages(newSelectedImages)
      } else {
          selectedImages.add(id)
          setSelectedMediaUploaders([...selectedMediaUploaders, personId])
          const newSelectedImages = new Set(selectedImages)
          setSelectedImages(newSelectedImages)
      }
  }, [selectedImages, selectedMediaUploaders])
  
  const handleConfirmDelete = useCallback(async () => {
    if (selectedImages.size > 0) {
      setShowConfirmDelete(false)
      const deleteImagePromises = Array.from(selectedImages).map(async id => {
        await deleteMedia(id)
      })
      await Promise.all(deleteImagePromises).then(_ => {
        setMedia(media.filter(m => !selectedImages.has(m.id)))
      })
      console.log(currentAlbum)
      loadGallery()
      setSelectedImages(new Set())
      setSelectImages(false)
    }    
  }, [selectedImages, loadGallery])

  const convertUrlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    // Extract a file name from the URL; adjust as needed.
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], fileName, { type: blob.type });
  };
  
  useEffect(() => {
    console.log("Gallery images:", galleryImages);
    if (galleryImages.length > 0) {
      Promise.all(galleryImages.split(',').map(url => convertUrlToFile(url)))
        .then(files => {
          // Now that you have an array of File objects, call loadFiles.
          setShowUploadConfirmation(true);
          setSyncingWebsite(false)
          loadFiles(files);
        })
        .catch(error => {
          console.error("Error converting gallery images:", error);
        });
    }
  }, [galleryImages]);
  
  const handleSubmitGallery = async (galleryName: string, theKnot?: string, zola?: string) => {
    setShowSettings(false)
    setTotalUploads(1)
    setTotalUploads(0)
    const isNewWeddingWebsite = (theKnot && !gallery.theknot) || (zola && !gallery.zola)
    if (isNewWeddingWebsite) {
      setSyncingWebsite(true)
    }
    const _newGallery = await updateGallery(gallery.id, {
      name: galleryName,
      path: `${galleryName.toLowerCase().replaceAll(' ', '-')}`,
      zola,
      theknot: theKnot
    })
    if (_newGallery.images.length > 0) {
      setGalleryImages(_newGallery.images.join(','))
    }
    setCompleteUploads(1)
    setGallery(_newGallery)
    setTotalUploads(0)
    setCompleteUploads(0)
  }

  const handleDownload = useCallback(async () => {
    downloadMedia(gallery.name, Array.from(selectedImages).map(id => media.find(m => m.id === id)!))
  }, [selectedImages, gallery])

  const canDelete = useMemo(() => {
    console.log(selectedMediaUploaders)
    const uploaders = new Set(selectedMediaUploaders)
    return uploaders.size === 1 && uploaders.has(personId)
  }, [selectedMediaUploaders])
  
  
  return (
    <GalleryContext.Provider value={{
        deleteImages: () => setShowConfirmDelete(true),
        download: handleDownload,
        upload: handleBeginUpload,
        canDelete,
        media: media,
        people,
        setPerson,
        setAlbum: setCurrentAlbum,
        album: currentAlbum,
        person: currentPerson,
        stagedMedia: stagedMedia,
        gallery,
        selectImages,
        selectedImages,
        albums,
        toggleSelectImages,
        toggleSelectedImage,
        setSelectedImages,
        loadAlbums: () => loadAlbums(),
        loadGallery,
        setAlbums,
        openSettings: () => setShowSettings(true),
        loading
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
    {showConfirmDelete && <ConfirmDelete onCancel={cancelImages} onConfirm={handleConfirmDelete} selectedImages={selectedImages}/>}
    {showUploadConfirmation && <ClientUpload album={currentAlbum} media={stagedMedia} collaboratorCount={people.length} upload={handleBeginUpload} onConfirm={confirmMedia} onCancel={cancelImages}/>}
    {showSettings && (<EditGallery gallery={gallery} close={() => setShowSettings(false)} onSubmit={handleSubmitGallery} />)}
    <UploadStatus total={totalUploads} complete={completeUploads}/>
    <SyncStatus open={syncingWebsite}/>
    </GalleryContext.Provider>
  );
};



const useGallery = (): GalleryContextType => {
  const galleryContext = useContext(GalleryContext);

  return galleryContext;
};

export default useGallery;
export { GalleryProvider, GalleryContext };