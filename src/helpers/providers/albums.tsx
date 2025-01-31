// UploadContext.ts
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlbumMediaData } from '@/lib/types/Album';
import { addMediaToAlbum, createAlbum, fetchAlbums } from '../api/albumClient';
import CreateAlbum from '@/components/CreateAlbum';
import { useUser } from './user';
import AlbumSelect from '@/components/AlbumSelect';
import useGallery from './gallery';


interface AlbumState {
    albums: AlbumMediaData[]
    album: AlbumMediaData | undefined
} 

interface AlbumActions {
    setAlbum: (albumId?: string) => void
    createAlbum: () => void
    selectAlbums: (imageIds: Set<string>) => void
    loadAlbums: () => Promise<void>
}

type AlbumContextType = AlbumState & AlbumActions

const AlbumContext = createContext<AlbumContextType>({} as AlbumContextType);

const AlbumsProvider: React.FC<{ children: React.ReactNode, galleryId: string}> = ({ children, galleryId }) => {
    const {album, setAlbum: setGalleryAlbum} = useGallery()
    const {personId} = useUser()
    const [albums, setAlbums] = useState<AlbumMediaData[]>([])
    const [showNewAlbumPage, setShowNewAlbumPage] = useState<boolean>(false)
    const [showSelectAlbums, setShowSelectAlbums] = useState<boolean>(false)
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
    const setAlbum = useCallback((albumId?: string) => {
      const _album = albums.find(alb => alb.id === albumId)
      setGalleryAlbum(_album)
    }, [albums])
    
    const loadAlbums = async () => {
      const _albums = await fetchAlbums(galleryId)
      setAlbums(_albums)
    }

    useEffect(() => {
      const init = async () => {
        const _albums = await fetchAlbums(galleryId)
        setAlbums(_albums)
      }
      init()
    }, [])

    const submitAlbum = useCallback(async (name: string) => {
      if (personId) {
        const _album = await createAlbum(galleryId, personId, name)
        setAlbums((oldAlbums) => [...oldAlbums, {..._album, count: 0, recentMedia: []}])
        setShowNewAlbumPage(false)  
      }
    }, [personId])

    const selectAlbums = useCallback((imageIds: Set<string>) => {
      setSelectedImages(new Set(imageIds))
      setShowSelectAlbums(true)
    }, [])

    const cancelSelectAlbums = useCallback(() => {
      setSelectedImages(new Set())
      setShowSelectAlbums(false)
    }, [])

    const addMediaToAlbums = async (albumIds: string[], mediaIds: string[]) => {
      const promises = albumIds.map(albumId => addMediaToAlbum(albumId, mediaIds))
      
      const _albums = await Promise.all(promises)
      return _albums
    }

    const confirmAlbums = useCallback(async (confirmedAlbumIds: string[]) => {
      setShowSelectAlbums(false)
      await addMediaToAlbums(confirmedAlbumIds, Array.from(selectedImages))
      loadAlbums()
    }, [selectedImages])
  return (
    <AlbumContext.Provider value={{
        albums,
        album,
        setAlbum,
        loadAlbums,
        selectAlbums: selectAlbums,
        createAlbum: () => setShowNewAlbumPage(true)
    }}>
      {children}
    {showSelectAlbums &&<AlbumSelect albums={albums} createAlbum={() => setShowNewAlbumPage(true)} onConfirm={confirmAlbums} onCancel={cancelSelectAlbums} />}
    {showNewAlbumPage && <CreateAlbum onSubmit={submitAlbum} onClose={() => setShowNewAlbumPage(false)}/>}
    </AlbumContext.Provider>
  );
};



const useAlbums = (): AlbumContextType => {
  const albums = useContext(AlbumContext);

  return albums;
};

export default useAlbums;
export { AlbumsProvider, AlbumContext };