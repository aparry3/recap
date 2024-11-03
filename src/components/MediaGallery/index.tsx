import { OrientationImage } from "@/helpers/providers/upload"
import { FC, useState } from "react"
import { Column, Container } from "react-web-layout-components"
import NextImage from "next/image"

import styles from './MediaGallery.module.scss'

const MediaGallery: FC<{images: OrientationImage[]}> = ({images}) => {
    const [viewImage, setViewImage] = useState<OrientationImage | null>(null)
    return (
            <>
            <Column className={styles.gallery}>
            {images.map((image) => (
                <Container key={image.url} className={`${styles.imageContainer} ${image.isVertical ? styles.vertical : ''}`} onClick={() => setViewImage(image)}>
                    <NextImage src={image.url} alt="image" className={`${styles.image}`} layout='intrinsic' height={350} width={350}/>
                </Container>
            ))}
            </Column>
            <LightBox image={viewImage} onClose={() => setViewImage(null)}/>
            </>
    )
}

const LightBox: FC<{image: OrientationImage | null, onClose: () => void}> = ({image, onClose}) => {
    return image ? (
        <Container className={styles.lightBox} >
            <Container className={styles.lightBoxBackground} onClick={onClose} />
            <NextImage src={image.url} alt="image" className={`${styles.lightBoxImage}`} layout='responsive'  height={image.dimensions.height} width={image.dimensions.width}  />
        </Container>
    ) : <></>
}
export default MediaGallery