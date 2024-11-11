import { OrientationImage } from "@/helpers/providers/gallery"
import { FC, memo, useEffect, useState } from "react"
import { Column, Container } from "react-web-layout-components"
import NextImage from "next/image"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { Media } from "@/lib/types/Media"

const MediaGallery: FC<{images: Media[]}> = ({images}) => {
    const [viewImage, setViewImage] = useState<Media | null>(null)
    return (
            <>
            <Column className={styles.gallery}>
            {images.map((image) => (
                <Container key={image.url} className={`${styles.imageContainer} ${(image?.height || 0) > (image?.width || 0) ? styles.vertical : ''}`} onClick={() => setViewImage(image)}>
                    <img src={image.preview} alt="image" className={`${styles.image}`} />
                </Container>
            ))}
            </Column>
            <LightBox image={viewImage} onClose={() => setViewImage(null)}/>
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


interface LightBoxProps {
    image: Media | null;
    onClose: () => void;
  }
  
const LightBox: FC<LightBoxProps> = memo(({ image, onClose }) => {
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(image?.preview);
  
    useEffect(() => {
      if (image?.url) {
        const fullImage = new Image();
        fullImage.src = image.url;
        fullImage.onload = () => {
          setCurrentSrc(image.url);
        };
        // Optionally handle error loading the full image
        fullImage.onerror = () => {
          console.error('Failed to load full image:', image.url);
          // You can choose to keep the preview or set a fallback image
        };
      }
  
      // Reset to preview when image changes
      setCurrentSrc(image?.preview);
    }, [image]);
  
    return image ? (
        <Container className={styles.lightBox} >
            <Container className={styles.lightBoxBackground} onClick={onClose} />
            <img src={currentSrc} alt="image" className={`${styles.lightBoxImage}`}  loading="lazy"/>
        </Container>
    ) : <></>
})
export default MediaGallery