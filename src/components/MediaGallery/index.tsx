import { OrientationImage } from "@/helpers/providers/gallery"
import { FC, useState } from "react"
import { Column, Container } from "react-web-layout-components"
import NextImage from "next/image"

import styles from './MediaGallery.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon } from "@/lib/icons"
import { MediaWithUrl } from "@/lib/types/Media"

const MediaGallery: FC<{images: MediaWithUrl[]}> = ({images}) => {
    const [viewImage, setViewImage] = useState<MediaWithUrl | null>(null)
    return (
            <>
            <Column className={styles.gallery}>
            {images.map((image) => (
                <Container key={image.url} className={`${styles.imageContainer} ${(image?.height || 0) > (image?.width || 0) ? styles.vertical : ''}`} onClick={() => setViewImage(image)}>
                    <NextImage src={image.url} alt="image" className={`${styles.image}`} layout='intrinsic' height={350} width={350}/>
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
                    <NextImage src={image.url} alt="image" className={`${styles.image}`} layout='intrinsic' height={350} width={350}/>
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


const LightBox: FC<{image: MediaWithUrl | null, onClose: () => void}> = ({image, onClose}) => {
    return image ? (
        <Container className={styles.lightBox} >
            <Container className={styles.lightBoxBackground} onClick={onClose} />
            <NextImage src={image.url} alt="image" className={`${styles.lightBoxImage}`} layout='responsive'  height={image.height} width={image.width}  />
        </Container>
    ) : <></>
}
export default MediaGallery