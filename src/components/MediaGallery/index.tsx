import { OrientationImage } from "@/helpers/providers/gallery"
import { Dispatch, FC, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { Column, Container } from "react-web-layout-components"
import NextImage from "next/image"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { Media } from "@/lib/types/Media"
import LightBox from "./Lightbox"

const MediaGallery: FC<{images: Media[]}> = ({images}) => {
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
        if (viewImageIndex + 1 < images.length) {
            const imageIndex = viewImageIndex + 1
            setPrevSrc(imageSrc)
            setImageSrc(nextSrc)

            loadImage(images[imageIndex + 1], setNextSrc)
            setViewImageIndex(imageIndex);
        }  
    }, [viewImageIndex, images, imageSrc, nextSrc])
    
    const handlePrev = useCallback(() => {
        if (viewImageIndex - 1 > -1) {
            const imageIndex = viewImageIndex - 1
            setNextSrc(imageSrc)
            setImageSrc(prevSrc)

            loadImage(images[imageIndex - 1], setPrevSrc)  
            setViewImageIndex(imageIndex);  
          }
    }, [viewImageIndex, images, imageSrc, nextSrc])

    const setImage = useCallback((index: number) => {
        loadImage(images[index], setImageSrc)
        if (index - 1 > -1) loadImage(images[index -1], setPrevSrc)
        if (index + 1 < images.length) loadImage(images[index + 1], setNextSrc)
        setViewImageIndex(index)
    }, [images])

    const handleClose = () => {
        setImageSrc(undefined)
        setNextSrc(undefined)
        setPrevSrc(undefined)
        setViewImageIndex(-1)
    }

  

    return (
            <>
            <Column className={styles.gallery}>
            {images.map((image, index) => (
                <Container key={image.url} className={`${styles.imageContainer} ${(image?.height || 0) > (image?.width || 0) ? styles.vertical : ''}`} onClick={() => setImage(index)}>
                    <img src={image.preview} alt="image" className={`${styles.image}`} />
                </Container>
            ))}
            </Column>
            <LightBox image={imageSrc} index={viewImageIndex + 1} total={images.length} onClose={handleClose} prevImage={prevSrc} nextImage={nextSrc} onPrevious={handlePrev} onNext={handleNext}/>
            </>
    )
}

export const MediaConfirmationGallery: FC<{images: OrientationImage[], selectedImages: Set<number>, toggleImage: (index: number) => void}> = ({images, selectedImages, toggleImage}) => {
    return (
            <>
            <Column className={styles.gallery}>
            {images.map((image, index) => {
                const selected = selectedImages.has(index)
                return (
                <Container key={image.url} className={`${styles.imageContainer} ${image.isVertical ? styles.vertical : ''} ${selected ? styles.border : ''}`} onClick={() => toggleImage(index)}>
                    <img src={image.url} alt="image" className={`${styles.image}`} />
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