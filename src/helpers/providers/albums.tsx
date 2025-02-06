// UploadContext.ts
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AlbumMediaData, AlbumUpdate } from '@/lib/types/Album';
import { addMediaToAlbum, createAlbum, deleteAlbum, fetchAlbums, updateAlbum } from '../api/albumClient';
import CreateAlbum from '@/components/CreateAlbum';
import { useUser } from './user';
import AlbumSelect from '@/components/AlbumSelect';
import useGallery from './gallery';
import EditAlbum from '@/components/CreateAlbum/EditAlbum';
import ConfirmDelete from '@/components/ConfirmDelete';


interface AlbumState {
    albums: AlbumMediaData[]
    album: AlbumMediaData | undefined
} 

interface AlbumActions {
    setAlbum: (albumId?: string) => void
    createAlbum: () => void
    editAlbum: () => void
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
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
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

    const editAlbum = () => {
      setIsEditing(true)
    }

    const saveAlbum = useCallback(async (_album: AlbumUpdate) => {
      console.log("SAVE")
      if (album) {
        const newAlbum = await updateAlbum(album.id, _album)
        const newAlbumMedia = {...newAlbum, count: album.count, recentMedia: album.recentMedia}
        setAlbums((oldAlbums) => oldAlbums.map(alb => alb.id === newAlbum.id ? newAlbumMedia : alb))
        setGalleryAlbum(newAlbumMedia)
        setIsEditing(false)
      }
    }, [album])

    const confirmAlbums = useCallback(async (confirmedAlbumIds: string[]) => {
      setShowSelectAlbums(false)
      await addMediaToAlbums(confirmedAlbumIds, Array.from(selectedImages))
      loadAlbums()
    }, [selectedImages])

    const handleConfirmDelete = useCallback(async () => {
      if (album) {
        const success = await deleteAlbum(album.id)
        if (success) {
          setAlbums((oldAlbums) => oldAlbums.filter(alb => alb.id !== album.id))
          setAlbum(undefined)
          setShowConfirmDelete(false)  
        }
      }
    }, [album])

    const removeFromAlbum = useCallback(async (selectedImages: Set<string>) => {
      if (album) {
        await removeMediaFromAlbum(album.id, Array.from(selectedImages))
        loadAlbums()
      }
    }, [selectedImages])

  return (
    <AlbumContext.Provider value={{
        albums,
        album,
        editAlbum,
        setAlbum,
        loadAlbums,
        selectAlbums: selectAlbums,
        createAlbum: () => setShowNewAlbumPage(true)
    }}>
      {children}
    {showSelectAlbums &&<AlbumSelect albums={albums} createAlbum={() => setShowNewAlbumPage(true)} onConfirm={confirmAlbums} onCancel={cancelSelectAlbums} />}
    {showNewAlbumPage && <CreateAlbum onSubmit={submitAlbum} onClose={() => setShowNewAlbumPage(false)}/>}
    {(isEditing && album) && <EditAlbum album={album} onDelete={() => setShowConfirmDelete(true)} onSubmit={saveAlbum} onClose={() => setIsEditing(false)}/>}
    {showConfirmDelete && <ConfirmDelete onCancel={() => setShowConfirmDelete(false)} onConfirm={handleConfirmDelete} album={album}/>}

    </AlbumContext.Provider>
  );
};



const useAlbums = (): AlbumContextType => {
  const albums = useContext(AlbumContext);

  return albums;
};

export default useAlbums;
export { AlbumsProvider, AlbumContext };