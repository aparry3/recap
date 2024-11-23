import { OrientationMedia } from "@/helpers/providers/gallery"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"
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

    const loadImage = (media: Media, setMethod: Dispatch<SetStateAction<string | undefined>>) => {
        if (media?.url) {
            const fullImage = new Image();
            fullImage.src = media.url;
            fullImage.onload = () => {
              setMethod(media.url);
            };
            // Optionally handle error loading the full media
            fullImage.onerror = () => {
              console.error('Failed to load full media:', media.url);
              // You can choose to keep the preview or set a fallback image
            };
          }
      
          // Reset to preview when image changes
          setMethod(media?.preview);
  
    }
    const handleNext = useCallback(() => {
        if (viewImageIndex + 1 < media.length) {
            const imageIndex = viewImageIndex + 1
            setPrevSrc(imageSrc)
            setImageSrc(nextSrc)

            loadImage(media[imageIndex + 1], setNextSrc)
            setViewImageIndex(imageIndex);
        }  
    }, [viewImageIndex, media, imageSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (viewImageIndex - 1 > -1) {
            const imageIndex = viewImageIndex - 1
            setNextSrc(imageSrc)
            setImageSrc(prevSrc)

            loadImage(media[imageIndex - 1], setPrevSrc)  
            setViewImageIndex(imageIndex);  
          }
    }, [viewImageIndex, media, imageSrc, nextSrc])

    const setImage = useCallback((index: number) => {
        loadImage(media[index], setImageSrc)
        if (index - 1 > -1) loadImage(media[index -1], setPrevSrc)
        if (index + 1 < media.length) loadImage(media[index + 1], setNextSrc)
        setViewImageIndex(index)
    }, [media])

    const handleClose = () => {
        setImageSrc(undefined)
        setNextSrc(undefined)
        setPrevSrc(undefined)
        setViewImageIndex(-1)
    }

    const [hoverIndex, setHoverIndex] = useState<number>(-1)

    return (
            <>
            <Column className={styles.gallery}>
            {media.map((m, index) => (
                <Container key={m.url} onMouseOver={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)} className={`${styles.imageContainer} ${(m?.height || 0) > (m?.width || 0) ? styles.vertical : ''}`} onClick={() => setImage(index)}>
                    { m.contentType.startsWith('video') && hoverIndex === index
                    ?  (
                        <video id="hover-video" src={m.url} muted loop autoPlay className={styles.image} />
                    )
                    :  <img src={m.preview} alt="image" className={`${styles.image}`} />
                    }
                </Container>
            ))}
            </Column>
            <LightBox image={imageSrc} index={viewImageIndex + 1} total={media.length} onClose={handleClose} prevImage={prevSrc} nextImage={nextSrc} onPrevious={handlePrev} onNext={handleNext}/>
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