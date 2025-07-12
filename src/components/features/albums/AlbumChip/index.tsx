import { AlbumMediaData } from "@/lib/types/Album"
import { FC } from "react"
import styles from './AlbumChip.module.scss'
import { Container, Column, Row, Text } from "react-web-layout-components"

const AlbumChip: FC<{selected?: boolean, album: AlbumMediaData, index: number, onClick: () => void}> = ({selected, index, album, onClick}) => {
    return (
        <Container className={styles.albumContainer}>
            <Container key={index} className={`${styles.album} ${selected ? styles.selected : ''}`} onClick={onClick}>
                <Container className={styles.imageContainer}>
                    {album.recentMedia?.length ? (<img src={album.recentMedia[0].preview} alt={album.name} className={styles.preview} /> ) : (<Container  className={styles.placeholder}/>)}
                </Container>
                <Column className={styles.detailsContainer}>
                    <Row className={styles.nameContainer} justify="flex-start">
                        <Text size={1.4} className={styles.name}>
                            {album.name}
                        </Text>
                    </Row>
                    <Row className={styles.countContainer}>
                        <Text size={1.1} className={styles.count}>
                            {album.count || 0} uploads
                        </Text>
                    </Row>
                </Column>
            </Container>
        </Container>
    )
}

export default AlbumChip