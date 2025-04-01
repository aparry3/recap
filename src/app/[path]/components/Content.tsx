"use client";
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Content.module.scss'
import { Column } from 'react-web-layout-components'
import Heading from './Heading'
import Home from './Pages/Home';
import Gallery from './Pages/Gallery';
import { AppPage } from '../App';
import Me from './Pages/Me';
import useGallery from '@/helpers/providers/gallery';
import useAlbums from '@/helpers/providers/albums';
import RefreshStatusComponent, {RefreshStatus} from '@/components/RefreshStatusComponent';
import useNavigation from '@/helpers/providers/navigation';

const OVERSCROLL_THRESHOLD = 150
const Content: FC<{onQrClick: () => void, onInfoClick: () => void}> = ({onQrClick, onInfoClick}) => {
    const {page} = useNavigation()
    const {loadGallery} = useGallery()
    const {loadAlbums} = useAlbums()
    const contentRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number | null>(null);
    const [overscrollDistance, setOverscrollDistance] = useState<number>(0);
    const [statusOpen, setStatusOpen] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>(RefreshStatus.IDLE)
    const currentPage = useMemo(() => {
        switch (page) {
            case AppPage.HOME:
                return <Home />
            case AppPage.GALLERY:
                return <Gallery />
            case AppPage.USER:
                return <Me />
            default:
                return <Home />
        }
    }, [page])

    const onOverscroll = async () => {
        setStatusOpen(true)
        setRefreshStatus(RefreshStatus.REFRESHING)
        await Promise.all([loadGallery(), loadAlbums(), setTimeout(() => {}, 1000)])
        setRefreshStatus(RefreshStatus.DONE)
        setTimeout(() => {        
            setStatusOpen(false)
        }, 1000)
        setTimeout(() => {setRefreshStatus(RefreshStatus.IDLE)}, 2000)
    };

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;
    
        const handleTouchStart = (e: TouchEvent) => {
          if (
            content.scrollTop === 0 ||
            content.scrollHeight - content.scrollTop === content.clientHeight
          ) {
            // At the top or bottom
            startY.current = e.touches[0].clientY;
            setOverscrollDistance(0); // Reset distance
          } else {
            startY.current = null;
          }
        };
    
        const handleTouchMove = (e: TouchEvent) => {
          if (startY.current === null) return;
    
          const currentY = e.touches[0].clientY;
          const deltaY = currentY - startY.current;
    
          if (content.scrollTop === 0 && deltaY > 0) {
            // Overscrolling at the top
            setOverscrollDistance(deltaY);
            // Optionally, provide visual feedback here
          } else if (
            content.scrollHeight - content.scrollTop === content.clientHeight &&
            deltaY < 0
          ) {
            // Overscrolling at the bottom
            setOverscrollDistance(Math.abs(deltaY));
            // Optionally, provide visual feedback here
          } else {
            // Not overscrolling
            setOverscrollDistance(0);
          }
        };
    
        const handleTouchEnd = () => {
          setOverscrollDistance((prevDistance) => {
            if (prevDistance >= OVERSCROLL_THRESHOLD) {
              onOverscroll();
            }
            return 0; // Reset distance
          });
          // Reset tracking variables
          startY.current = null;
        };
    
        // Attach event listeners
        content.addEventListener('touchstart', handleTouchStart, { passive: true });
        content.addEventListener('touchmove', handleTouchMove, { passive: false });
        content.addEventListener('touchend', handleTouchEnd);
    
        // Cleanup event listeners on unmount
        return () => {
          content.removeEventListener('touchstart', handleTouchStart);
          content.removeEventListener('touchmove', handleTouchMove);
          content.removeEventListener('touchend', handleTouchEnd);
        };
      }, [onOverscroll]);
    
      // Log overscrollDistance whenever it changes
      useEffect(() => {
        console.log('Overscroll Distance:', overscrollDistance);
      }, [overscrollDistance]);
    
      const distance = useMemo(() => {
        if (overscrollDistance === 0) return undefined
        return Math.min(100, (overscrollDistance / OVERSCROLL_THRESHOLD) * 100)
      }, [overscrollDistance]);
      return (
        <Column as="section" className={styles.content} containerRef={contentRef}>
          <Heading onQrClick={onQrClick} onInfoClick={onInfoClick} />
          {currentPage}
          <RefreshStatusComponent
            refreshStatus={refreshStatus}
            open={statusOpen}
            distance={distance}
          />
        </Column>
      );
    };
    
export default Content