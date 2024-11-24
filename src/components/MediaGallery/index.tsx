import { OrientationMedia } from "@/helpers/providers/gallery"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { Column, Container } from "react-web-layout-components"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { Media } from "@/lib/types/Media"
import LightBox from "./Lightbox"
import { isImage, isVideo } from "@/helpers/utils"

const MediaGallery: FC<{media: Media[]}> = ({media}) => {
    const [viewImageIndex, setViewImageIndex] = useState<number>(-1)
    const [mediaSrc, setMediaSrc] = useState<string | undefined>(undefined)
    const [nextSrc, setNextSrc] = useState<string | undefined>(undefined)
    const [prevSrc, setPrevSrc] = useState<string | undefined>(undefined)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const handleContextMenu = (e: Event) => {
          e.preventDefault(); // Prevent the default context menu
        };
    
        // Attach the listener to the document or a specific container
        document.addEventListener("contextmenu", handleContextMenu);
    
        return () => {
          // Cleanup the listener on unmount
          document.removeEventListener("contextmenu", handleContextMenu);
        };
      }, []);
    
    const loadMedia = (media: Media, setMethod: Dispatch<SetStateAction<string | undefined>>) => {
        setLoaded(false)
        if (media?.url) {
            if (isImage(media)) {
              // Handle image loading
              setMethod(media.preview)
              const fullImage = new Image();
              fullImage.src = media.url;
              fullImage.onload = () => {
                setMethod(media.url);
                setLoaded(true);
              };
              fullImage.onerror = () => {
                console.error("Failed to load image:", media.url);
                // You can choose to keep the preview or set a fallback image
                setLoaded(true); // Consider marking as "loaded" to avoid spinner loops
              };
            } else if (isVideo(media)) {
              // Handle video loading
              setMethod(media.url)
              setLoaded(true)
              console.log("Loading video:", media.url);
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
              setLoaded(true);
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

            loadMedia(media[imageIndex + 1], setNextSrc)
            setViewImageIndex(imageIndex);
        }  
    }, [viewImageIndex, media, mediaSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (viewImageIndex - 1 > -1) {
            const imageIndex = viewImageIndex - 1
            setNextSrc(mediaSrc)
            setMediaSrc(prevSrc)

            loadMedia(media[imageIndex - 1], setPrevSrc)  
            setViewImageIndex(imageIndex);  
          }
    }, [viewImageIndex, media, mediaSrc, nextSrc])

    const setImage = useCallback((index: number) => {
        loadMedia(media[index], setMediaSrc)
        if (index - 1 > -1) loadMedia(media[index -1], setPrevSrc)
        if (index + 1 < media.length) loadMedia(media[index + 1], setNextSrc)
        setViewImageIndex(index)
    }, [media])

    const handleClose = () => {
        setLoaded(false)
        setMediaSrc(undefined)
        setNextSrc(undefined)
        setPrevSrc(undefined)
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
        console.log('handleTouchEnd')
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
          setHoverIndex(-1);
        }
      }, [touchTimerRef.current]);
    
      const selectImage = (index: number) => {
        console.log("select image")
          setImage(index)
      }
    return (
            <>
            <Column className={styles.gallery}>
            {media.map((m, index) => (
                <Container onTouchStart={(e) => handleTouchStart(e, index)} onTouchEnd={handleTouchEnd} onContextMenu={(e) => {e.preventDefault()}} key={m.url} onMouseOver={() => handleMouseOver(index)} onMouseLeave={() => setHoverIndex(-1)} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''}`} onClick={() => selectImage(index)}>
                    { isVideo(m) && (
                        <video id="hover-video" src={m.url} muted loop autoPlay playsInline className={styles.image} style={{display: hoverIndex === index ? 'block' : 'none'}}/>
                    )}
                    <img src={m.preview} alt="image" className={`${styles.image}`} onContextMenu={(e) => e.preventDefault()} style={{display: isImage(m) || hoverIndex !== index ? 'block' : 'none'}}/>
                </Container>
            ))}
            </Column>
            <LightBox image={mediaSrc} contentType={loaded && media[viewImageIndex].contentType.startsWith('video') ? 'video' : 'image'} index={viewImageIndex + 1} total={media.length} onClose={handleClose} prevImage={prevSrc} nextImage={nextSrc} onPrevious={handlePrev} onNext={handleNext}/>
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