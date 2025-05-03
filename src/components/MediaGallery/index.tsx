import useGallery, { OrientationMedia } from "@/helpers/providers/gallery"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Column, Container} from "react-web-layout-components"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { Media } from "@/lib/types/Media"
import LightBox from "./Lightbox"
import { isImage, isVideo } from "@/helpers/utils"
import useAlbums from "@/helpers/providers/albums"
import { useUser } from "@/helpers/providers/user"
import Menu, { MenuItem } from "./Menu"
import LikeButton from "@/components/LikeButton"


const MediaGallery: FC<{media: Media[]}> = ({media}) => {
    const {person} = useUser()
    const {album, selectImages, toggleSelectImages, selectedImages, toggleSelectedImage, gallery} = useGallery()
    const {selectAlbums} = useAlbums()
    const [viewImageIndex, setViewImageIndex] = useState<number>(-1)
    const [mediaSrc, setMediaSrc] = useState<string | undefined>(undefined)
    const [nextSrc, setNextSrc] = useState<string | undefined>(undefined)
    const [prevSrc, setPrevSrc] = useState<string | undefined>(undefined)
    const [contentType, setContentType] = useState<string>()

    
    const loadMedia = (media: Media, setMethod: Dispatch<SetStateAction<string | undefined>>, setContentTypeMethod?: Dispatch<SetStateAction<string | undefined>>) => {
        if (media?.url) {
            // First clean up any existing objectURL that might be in the state
            setMethod(prevSrc => {
                if (prevSrc && prevSrc.startsWith('blob:')) {
                    URL.revokeObjectURL(prevSrc);
                }
                return media.preview; // Set to preview initially while loading
            });

            if (isImage(media)) {
              // Handle image loading
              const fullImage = new Image();
              fullImage.src = media.url;
              fullImage.onload = () => {
                setMethod(media.url);
                setContentTypeMethod?.(media.contentType)
              };
              fullImage.onerror = () => {
                console.error("Failed to load image:", media.url);
                // You can choose to keep the preview or set a fallback image
              };
            } else if (isVideo(media)) {
              // Handle video loading - use the url directly since we're not creating blob URLs
              setMethod(media.url);
              setContentTypeMethod?.(media.contentType);
            } else {
              console.warn("Unsupported media type:", media.contentType);
            }
          }
    }
    const handleNext = useCallback(() => {
        if (media.length === 0) return;
        
        let nextIndex;
        if (viewImageIndex + 1 < media.length) {
            // Normal case - go to next image
            nextIndex = viewImageIndex + 1;
        } else {
            // Circular navigation - go back to first image
            nextIndex = 0;
        }
        
        setPrevSrc(mediaSrc);
        setMediaSrc(nextSrc);
        
        // Set up the next image (or circle back to first)
        const nextNextIndex = nextIndex + 1 < media.length ? nextIndex + 1 : 0;
        isVideo(media[nextNextIndex]) 
            ? setNextSrc(media[nextNextIndex].preview) 
            : loadMedia(media[nextNextIndex], setNextSrc);
        
        loadMedia(media[nextIndex], setMediaSrc, setContentType);
        setViewImageIndex(nextIndex);
    }, [viewImageIndex, media, mediaSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (media.length === 0) return;
        
        let prevIndex;
        if (viewImageIndex - 1 >= 0) {
            // Normal case - go to previous image
            prevIndex = viewImageIndex - 1;
        } else {
            // Circular navigation - go to last image
            prevIndex = media.length - 1;
        }
        
        setNextSrc(mediaSrc);
        setMediaSrc(prevSrc);
        
        // Set up the previous image (or circle back to last)
        const prevPrevIndex = prevIndex - 1 >= 0 ? prevIndex - 1 : media.length - 1;
        isVideo(media[prevPrevIndex]) 
            ? setPrevSrc(media[prevPrevIndex].preview) 
            : loadMedia(media[prevPrevIndex], setPrevSrc);
        
        loadMedia(media[prevIndex], setMediaSrc, setContentType);
        setViewImageIndex(prevIndex);
    }, [viewImageIndex, media, mediaSrc, prevSrc])

    const setImage = useCallback((index: number) => {
        if (media.length === 0) return;
        
        loadMedia(media[index], setMediaSrc, setContentType);
        
        // Set up previous image (or circle to last if at first image)
        const prevIndex = index - 1 >= 0 ? index - 1 : media.length - 1;
        isVideo(media[prevIndex]) 
            ? setPrevSrc(media[prevIndex].preview) 
            : loadMedia(media[prevIndex], setPrevSrc);
        
        // Set up next image (or circle to first if at last image)
        const nextIndex = index + 1 < media.length ? index + 1 : 0;
        isVideo(media[nextIndex]) 
            ? setNextSrc(media[nextIndex].preview) 
            : loadMedia(media[nextIndex], setNextSrc);
        
        setViewImageIndex(index);
    }, [media])

    const handleClose = () => {
        // Clean up any object URLs when closing the lightbox
        if (mediaSrc && mediaSrc.startsWith('blob:')) {
            URL.revokeObjectURL(mediaSrc);
        }
        if (nextSrc && nextSrc.startsWith('blob:')) {
            URL.revokeObjectURL(nextSrc);
        }
        if (prevSrc && prevSrc.startsWith('blob:')) {
            URL.revokeObjectURL(prevSrc);
        }
        
        setMediaSrc(undefined)
        setNextSrc(undefined)
        setPrevSrc(undefined)
        setContentType(undefined)
        setViewImageIndex(-1)
    }

    useEffect(() => {
        handleClose()
    }, [media])

    // Cleanup effect for when the component unmounts
    useEffect(() => {
        return () => {
            // Clean up any remaining object URLs
            if (mediaSrc && mediaSrc.startsWith('blob:')) {
                URL.revokeObjectURL(mediaSrc);
            }
            if (nextSrc && nextSrc.startsWith('blob:')) {
                URL.revokeObjectURL(nextSrc);
            }
            if (prevSrc && prevSrc.startsWith('blob:')) {
                URL.revokeObjectURL(prevSrc);
            }
        };
    }, [mediaSrc, nextSrc, prevSrc]);
    
    const [hoverIndex, setHoverIndex] = useState<number>(-1)
    const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseOver = useCallback((index: number) => {
        if (!touchTimerRef.current) {
            setHoverIndex(index)
        }
      }, [touchTimerRef.current]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>,index: number) => {
        // Start a timer when the user touches the element
        e.stopPropagation()
        touchTimerRef.current = setTimeout(() => {
          setHoverIndex(index); // Update the state to play the video
        }, 1000); // 1-second threshold
      };
    
      const handleTouchEnd = useCallback(() => {
        // Clear the timer if the user stops touching
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
          setHoverIndex(-1);
        }
      }, [touchTimerRef.current]);
    
      const selectImage = (index: number) => {
          setImage(index)
      }

    const openSelectAlbums = useCallback(() => {
        selectAlbums(selectedImages)
        toggleSelectImages()
    }, [selectedImages, selectAlbums])
    
        const menuItems = useMemo(() => {
            return album ? [
                MenuItem.REMOVE,
                MenuItem.ADD,
                MenuItem.DOWNLOAD,
                MenuItem.DELETE,
            ] :  [
                MenuItem.ADD,
                MenuItem.DOWNLOAD,
                MenuItem.DELETE,
            ]
        }, [album])
    
    return (
            <>
            <Column className={styles.gallery}>
            {media.filter(m => (m.uploaded && (!m.isPrivate || m.personId === person?.id || person?.id === gallery.personId))).map((m, index) => {
                if (selectImages) {
                    const selected = selectedImages.has(m.id)
                    return (
                        <Container  key={m.url} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''} ${selected ? styles.border : ''}`} onClick={() => toggleSelectedImage(m.id, m.personId)}>
                            { isVideo(m) ? (
                                <video id="hover-video" src={m.url} muted loop autoPlay playsInline className={styles.image} />
                            ) : (
                                <img src={m.preview} alt="image" className={`${styles.image}`} onContextMenu={(e) => e.preventDefault()}/>
                            )}
                            {selected && (
                                <>
                                    <Container className={styles.checkContainer} />
                                    <FontAwesomeIcon icon={checkIcon} className={styles.icon}/>
                                </>
                            )}
                        </Container>
                        )        
                }
                return (
                <Container 
                    onTouchStart={(e) => handleTouchStart(e, index)} 
                    onTouchEnd={handleTouchEnd} 
                    onContextMenu={(e) => {e.preventDefault()}} 
                    key={m.url} 
                    onMouseOver={() => handleMouseOver(index)} 
                    onMouseLeave={() => setHoverIndex(-1)} 
                    className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''}`} 
                    onClick={() => selectImage(index)}
                >
                    { isVideo(m) && (
                        <video id="hover-video" src={m.url} muted loop autoPlay playsInline className={styles.image} style={{display: hoverIndex === index ? 'block' : 'none'}}/>
                    )}
                    <img src={m.preview} alt="image" className={`${styles.image}`} onContextMenu={(e) => e.preventDefault()} style={{display: isImage(m) || hoverIndex !== index ? 'block' : 'none'}}/>
                    <Container className={`${styles.overlay} ${hoverIndex === index ? styles.visible : ''}`}>
                        <LikeButton mediaId={m.id} variant="overlay" />
                    </Container>
                </Container>
                )
            })}
            </Column>
            {(!!selectedImages.size) && <Container className={styles.menuSpace}/>}
            <LightBox 
                mediaId={media[viewImageIndex]?.id || ''} 
                personId={media[viewImageIndex]?.personId || ''} 
                image={mediaSrc} 
                contentType={contentType} 
                index={viewImageIndex + 1} 
                total={media.length} 
                onClose={handleClose} 
                prevImage={prevSrc} 
                nextImage={nextSrc} 
                onPrevious={handlePrev} 
                onNext={handleNext} 
            />
            {(selectedImages && !!selectedImages.size) && (
                <Menu selectedImages={selectedImages} items={menuItems}/>
            )}
            </>
    )
}

export const MediaConfirmationGallery: FC<{media: OrientationMedia[], selectedImages: Set<number>, toggleImage: (index: number) => void}> = ({media, selectedImages, toggleImage}) => {
    
    return (
            <>
            <Column className={styles.gallery}>
            {media.map((m, index) => {
                const selected = selectedImages.has(index)
                return (
                <Container  key={m.url} className={`${styles.imageContainer} ${m.isVertical ? styles.vertical : ''} ${selected ? styles.border : ''}`} onClick={() => toggleImage(index)}>
                    { isVideo(m) ? (
                        <video id="hover-video" src={m.url} muted loop autoPlay playsInline className={styles.image} />
                    ) : (
                        <img src={m.preview} alt="image" className={`${styles.image}`} onContextMenu={(e) => e.preventDefault()}/>
                    )}
                    {selected && (
                        <>
                            <Container className={styles.checkContainer} />
                            <FontAwesomeIcon icon={checkIcon} className={styles.icon}/>
                        </>
                    )}
                </Container>
                )
            })}
            </Column>
            </>
    )
}


export default MediaGallery