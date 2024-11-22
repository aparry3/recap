import { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './Albums.module.scss'
import Button from "@/components/Button"
import useGallery from "@/helpers/providers/gallery"

const Albums: FC = () => {
    const {upload} = useGallery()
    return (
        <Column className={styles.data}>
            <Container padding>
                <Text size={1.4}>
                    No albums yet.
                </Text>
            </Container>
            <Container padding>
                <Button onClick={upload}>Upload</Button>
            </Container>
        </Column>
    )
}

export default Albums