// UploadContext.ts
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlbumMediaData } from '@/lib/types/Album';
import { createAlbum, fetchAlbums } from '../api/albumClient';
import CreateAlbum from '@/components/CreateAlbum';
import { useUser } from './user';


interface AlbumState {
    albums: AlbumMediaData[]
    album: AlbumMediaData | undefined
} 

interface AlbumActions {
    setAlbum: (albumId?: string) => void
    createAlbum: () => void
}

type AlbumContextType = AlbumState & AlbumActions

const AlbumContext = createContext<AlbumContextType>({} as AlbumContextType);

const AlbumsProvider: React.FC<{ children: React.ReactNode, galleryId: string}> = ({ children, galleryId }) => {
    const {personId} = useUser()
    const [currentAlbum, setCurrentAlbum] = useState<AlbumMediaData | undefined>(undefined)
    const [albums, setAlbums] = useState<AlbumMediaData[]>([])
    const [showNewAlbumPage, setShowNewAlbumPage] = useState<boolean>(false)

    const setAlbum = useCallback((albumId?: string) => {
      const _album = albums.find(alb => alb.id === albumId)
      setCurrentAlbum(_album)
    }, [albums])
    
    useEffect(() => {
      const init = async () => {
        const _albums = await fetchAlbums(galleryId)
        setAlbums(_albums)
      }
      init()
    }, [])

    const submitAlbum = useCallback(async (name: string) => {
      if (personId) {
        const album = await createAlbum(galleryId, personId, name)
        setAlbums((oldAlbums) => [...oldAlbums, {...album, count: 0, recentMedia: []}])
        setShowNewAlbumPage(false)  
      }
    }, [personId])

  return (
    <AlbumContext.Provider value={{
        albums,
        album: currentAlbum,
        setAlbum,
        createAlbum: () => setShowNewAlbumPage(true)
    }}>
      {children}
      
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