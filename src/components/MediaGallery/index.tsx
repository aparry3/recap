import useGallery, { OrientationMedia } from "@/helpers/providers/gallery"
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useRef, useState } from "react"
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


const MediaGallery: FC<{media: Media[]}> = ({media}) => {
    const {person} = useUser()
    const {album} = useGallery()
    const {selectImages, toggleSelectImages, selectedImages, toggleSelectedImage, deleteImages, gallery} = useGallery()
    const {selectAlbums} = useAlbums()
    const [viewImageIndex, setViewImageIndex] = useState<number>(-1)
    const [mediaSrc, setMediaSrc] = useState<string | undefined>(undefined)
    const [nextSrc, setNextSrc] = useState<string | undefined>(undefined)
    const [prevSrc, setPrevSrc] = useState<string | undefined>(undefined)
    const [contentType, setContentType] = useState<string>()

    
    const loadMedia = (media: Media, setMethod: Dispatch<SetStateAction<string | undefined>>, setContentTypeMethod?: Dispatch<SetStateAction<string | undefined>>) => {
        if (media?.url) {
            if (isImage(media)) {
              // Handle image loading
              setMethod(media.preview)
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
              // Handle video loading
              setMethod(media.url)
              setContentTypeMethod?.(media.contentType)
            //   const videoElement = document.createElement("video");
            //   videoElement.muted = true; // Ensure autoplay works
            //     videoElement.playsInline = true; // Avoid fullscreen mode on mobile
            //   videoElement.src = media.url;
            //   videoElement.preload = "auto"; // Preload the video data
            //   videoElement.oncanplay = () => {
            //     console.log("Video loaded:", media.url);
            //     setMethod(media.url);
            //     setLoaded(true);
            //   };
            //   videoElement.onerror = () => {
            //     console.error("Failed to load video:", media.url);
            //     // You can choose to keep the preview or set a fallback media
            //     setLoaded(true); // Consider marking as "loaded" to avoid spinner loops
            //   };
            } else {
              console.warn("Unsupported media type:", media.contentType);
            }
          }
        
          // Reset to preview when media changes
        //   setMethod(media?.preview);
          
    }
    const handleNext = useCallback(() => {
        if (viewImageIndex + 1 < media.length) {
            const imageIndex = viewImageIndex + 1
            setPrevSrc(mediaSrc)
            setMediaSrc(nextSrc)

            if (imageIndex + 1 < media.length) {
                isVideo(media[imageIndex + 1]) ? setNextSrc(media[imageIndex + 1].preview) : loadMedia(media[imageIndex + 1], setNextSrc)
            } else {
                setNextSrc(undefined)
            }
            loadMedia(media[imageIndex], setMediaSrc, setContentType)
            setViewImageIndex(imageIndex);
        }  
    }, [viewImageIndex, media, mediaSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (viewImageIndex - 1 > -1) {
            const imageIndex = viewImageIndex - 1
            setNextSrc(mediaSrc)
            setMediaSrc(prevSrc)

            if (imageIndex - 1 > -1) {
                isVideo(media[imageIndex - 1]) ? setPrevSrc(media[imageIndex - 1].preview) : loadMedia(media[imageIndex - 1], setPrevSrc)
            } else {
                setPrevSrc(undefined)
            }
            loadMedia(media[imageIndex], setMediaSrc, setContentType)
            setViewImageIndex(imageIndex);  
          }
    }, [viewImageIndex, media, mediaSrc, nextSrc])

    const setImage = useCallback((index: number) => {
        loadMedia(media[index], setMediaSrc, setContentType)
        if (index - 1 > -1) isVideo(media[index - 1]) ? setPrevSrc(media[index - 1].preview) : loadMedia(media[index -1], setPrevSrc)
        if (index + 1 < media.length) isVideo(media[index + 1]) ? setNextSrc(media[index + 1].preview) : loadMedia(media[index + 1], setNextSrc)
        setViewImageIndex(index)
    }, [media])

    const handleClose = () => {
        setMediaSrc(undefined)
        setNextSrc(undefined)
        setPrevSrc(undefined)
        setContentType(undefined)
        setViewImageIndex(-1)
    }

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
                        <Container  key={m.url} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''} ${selected ? styles.border : ''}`} onClick={() => toggleSelectedImage(m.id)}>
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
                <Container onTouchStart={(e) => handleTouchStart(e, index)} onTouchEnd={handleTouchEnd} onContextMenu={(e) => {e.preventDefault()}} key={m.url} onMouseOver={() => handleMouseOver(index)} onMouseLeave={() => setHoverIndex(-1)} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''}`} onClick={() => selectImage(index)}>
                    { isVideo(m) && (
                        <video id="hover-video" src={m.url} muted loop autoPlay playsInline className={styles.image} style={{display: hoverIndex === index ? 'block' : 'none'}}/>
                    )}
                    <img src={m.preview} alt="image" className={`${styles.image}`} onContextMenu={(e) => e.preventDefault()} style={{display: isImage(m) || hoverIndex !== index ? 'block' : 'none'}}/>
                </Container>
                )
            })}
            </Column>
            {(!!selectedImages.size) && <Container className={styles.menuSpace}/>}
            <LightBox mediaId={media[viewImageIndex]?.id} image={mediaSrc} contentType={contentType} index={viewImageIndex + 1} total={media.length} onClose={handleClose} prevImage={prevSrc} nextImage={nextSrc} onPrevious={handlePrev} onNext={handleNext} />
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