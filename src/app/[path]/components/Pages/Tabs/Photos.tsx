import { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './Photos.module.scss'
import Button from "@/components/Button"
import useGallery from "@/helpers/providers/gallery"
import MediaGallery from "@/components/MediaGallery"

const Photos: FC = () => {
    const {media, upload} = useGallery()
    return (
        <Column className={styles.content}>
            {media.length > 0 ? (
                <MediaGallery media={media}/>
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