import { OrientationMedia } from "@/helpers/providers/gallery"
import { Dispatch, FC, SetStateAction, useCallback, useRef, useState } from "react"
import { Column, Container } from "react-web-layout-components"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { Media } from "@/lib/types/Media"
import LightBox from "./Lightbox"

const MediaGallery: FC<{media: Media[]}> = ({media}) => {
    const [viewImageIndex, setViewImageIndex] = useState<number>(-1)
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
    const [nextSrc, setNextSrc] = useState<string | undefined>(undefined)
    const [prevSrc, setPrevSrc] = useState<string | undefined>(undefined)
    const [loaded, setLoaded] = useState(false)

    const loadMedia = (media: Media, setMethod: Dispatch<SetStateAction<string | undefined>>) => {
        setLoaded(false)
        if (media?.url) {
            if (media.contentType.startsWith("image")) {
              // Handle image loading
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
            } else if (media.contentType.startsWith("video")) {
              // Handle video loading
              const videoElement = document.createElement("video");
              videoElement.src = media.url;
              videoElement.onloadeddata = () => {
                setMethod(media.url);
                setLoaded(true);
              };
              videoElement.onerror = () => {
                console.error("Failed to load video:", media.url);
                // You can choose to keep the preview or set a fallback media
                setLoaded(true); // Consider marking as "loaded" to avoid spinner loops
              };
            } else {
              console.warn("Unsupported media type:", media.contentType);
              setLoaded(true);
            }
          }
        
          // Reset to preview when media changes
          setMethod(media?.preview);
          
    }
    const handleNext = useCallback(() => {
        if (viewImageIndex + 1 < media.length) {
            const imageIndex = viewImageIndex + 1
            setPrevSrc(imageSrc)
            setImageSrc(nextSrc)

            loadMedia(media[imageIndex + 1], setNextSrc)
            setViewImageIndex(imageIndex);
        }  
    }, [viewImageIndex, media, imageSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (viewImageIndex - 1 > -1) {
            const imageIndex = viewImageIndex - 1
            setNextSrc(imageSrc)
            setImageSrc(prevSrc)

            loadMedia(media[imageIndex - 1], setPrevSrc)  
            setViewImageIndex(imageIndex);  
          }
    }, [viewImageIndex, media, imageSrc, nextSrc])

    const setImage = useCallback((index: number) => {
        loadMedia(media[index], setImageSrc)
        if (index - 1 > -1) loadMedia(media[index -1], setPrevSrc)
        if (index + 1 < media.length) loadMedia(media[index + 1], setNextSrc)
        setViewImageIndex(index)
    }, [media])

    const handleClose = () => {
        setLoaded(false)
        setImageSrc(undefined)
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
    
    return (
            <>
            <Column className={styles.gallery}>
            {media.map((m, index) => (
                <Container onTouchStart={(e) => handleTouchStart(e, index)} onTouchEnd={handleTouchEnd} onContextMenu={(e) => e.preventDefault()} key={m.url} onMouseOver={() => handleMouseOver(index)} onMouseLeave={() => setHoverIndex(-1)} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''}`} onClick={() => setImage(index)}>
                    { m.contentType.startsWith('video') && (
                        <video id="hover-video" src={m.url} muted loop autoPlay className={styles.image} style={{display: hoverIndex === index ? 'block' : 'none'}}/>
                    )}
                    <img src={m.preview} alt="image" className={`${styles.image}`} style={{display: hoverIndex === index ? 'none' : 'block'}}/>
                </Container>
            ))}
            </Column>
            <LightBox image={imageSrc} contentType={loaded && media[viewImageIndex].contentType.startsWith('video') ? 'video' : 'image'} index={viewImageIndex + 1} total={media.length} onClose={handleClose} prevImage={prevSrc} nextImage={nextSrc} onPrevious={handlePrev} onNext={handleNext}/>
            </>
    )
}

export const MediaConfirmationGallery: FC<{media: OrientationMedia[], selectedImages: Set<number>, toggleImage: (index: number) => void}> = ({media, selectedImages, toggleImage}) => {
    const [hoverIndex, setHoverIndex] = useState<number>(-1)
    return (
            <>
            <Column className={styles.gallery}>
            {media.map((m, index) => {
                const selected = selectedImages.has(index)
                return (
                <Container onMouseOver={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)} key={m.url} className={`${styles.imageContainer} ${m.isVertical ? styles.vertical : ''} ${selected ? styles.border : ''}`} onClick={() => toggleImage(index)}>
                    { m.contentType.startsWith('video') && hoverIndex === index
                    ?  (
                        <video id="hover-video" src={m.url} muted loop autoPlay className={styles.image} />
                    )
                    : <img src={m.preview || m.url} alt="image" className={`${styles.image}`} />
                    }
                    
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