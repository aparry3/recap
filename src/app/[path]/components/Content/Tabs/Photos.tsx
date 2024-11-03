import { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './Photos.module.scss'
import Button from "@/components/Button"
import useUpload from "@/helpers/providers/upload"
import MediaGallery from "@/components/MediaGallery"

const Photos: FC = () => {
    const {images, upload} = useUpload()
    return (
        <Column className={styles.content}>
            {images.length > 0 ? (
                <MediaGallery images={images}/>
            ) : 
            (
                <>
                    <Container padding>
                        <Text size={1.4}>
                            No photos yet.
                        </Text>
                    </Container>
                    <Container padding>
                        <Button onClick={upload}>Upload</Button>
                    </Container>
                </>
            )}
        </Column>
    )
}

export default Photos