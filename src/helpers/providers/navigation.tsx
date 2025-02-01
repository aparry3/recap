// UploadContext.ts
import { createContext, use, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useGallery from './gallery';
import { AppPage } from '@/app/[path]/App';
import { Tab } from '@/app/[path]/components/Pages/Gallery';
import { useNavigationState } from '../hooks/localStorage';
import useWindowSize from '../hooks/window';
import { AlbumMediaData } from '@/lib/types/Album';


interface NavigationState {
    tab: Tab
    page: AppPage
    sidebarOpen: boolean
} 

interface NavigationActions {
    setPage: (page: AppPage) => void
    setTab: (tab: Tab) => void
    handlePageChange: (page: AppPage) => void
    setShowSidebar: (show: boolean) => void
}

type NavigationContextType = NavigationState & NavigationActions

const NavigationContext = createContext<NavigationContextType>({} as NavigationContextType);

const NavigationProvider: React.FC<{ children: React.ReactNode, album?: AlbumMediaData}> = ({ children, album: propsAlbum }) => {
    const {setAlbum} = useGallery()
    const {isMobile} = useWindowSize()
    const {page, setPage} = useNavigationState()
    const {tab, setTab} = useNavigationState()
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    useEffect(() => {
      if (propsAlbum) {
        setAlbum(propsAlbum)
        setPage(AppPage.GALLERY)
        setTab(Tab.ALBUMS)
      }
    }, [propsAlbum])
    const handlePageChange = useCallback((newPage: AppPage) => {
        setPage(newPage)
        setShowSidebar(false)
    }, [setPage])

    const sidebarOpen = useMemo(() => isMobile && showSidebar, [showSidebar, isMobile])

  return (
    <NavigationContext.Provider value={{
        tab,
        page,
        sidebarOpen,
        handlePageChange,
        setPage,
        setTab,
        setShowSidebar
    }}>
      {children}
    </NavigationContext.Provider>
  );
};



const useNavigation = (): NavigationContextType => {
  const navigation = useContext(NavigationContext);

  return navigation;
};

export default useNavigation;
export { NavigationProvider, NavigationContext };