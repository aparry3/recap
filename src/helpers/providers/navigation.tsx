// UploadContext.ts
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useGallery from './gallery';
import { AppPage } from '@/app/[path]/App';
import { Tab } from '@/app/[path]/components/Pages/Gallery';
import { useNavigationState } from '../hooks/localStorage';
import useWindowSize from '../hooks/window';


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

const NavigationProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    // const {album, setAlbum: setGalleryAlbum, person, setPerson} = useGallery()\
    const {isMobile} = useWindowSize()
    const {page, setPage} = useNavigationState()
    const {tab, setTab} = useNavigationState()
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

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