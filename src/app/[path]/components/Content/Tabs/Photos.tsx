import { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './Photos.module.scss'
import Button from "@/components/Button"

const Photos: FC = () => {
    return (
        <Column className={styles.data}>
            <Container padding>
                <Text size={1.4}>
                    No photos yet.
                </Text>
            </Container>
            <Container padding>
                <Button onClick={() => {}}>Upload</Button>
            </Container>
        </Column>
    )
}

export default Photos