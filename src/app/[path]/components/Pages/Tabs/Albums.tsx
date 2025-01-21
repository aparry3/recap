import { FC, useState } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Albums.module.scss'
import Button from "@/components/Button"
import useAlbums from "@/helpers/providers/albums"
import MediaGallery from "@/components/MediaGallery"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Albums: FC = () => {
    const [album, setAlbum] = useState<string>()
    const {createAlbum, albums} = useAlbums()

    return album ? (
            <MediaGallery media={[]} />
        ) : !albums.length ? (
                <Column className={styles.data}>
                    <Container padding>
                        <Text size={1.4}>
                            No albums yet.
                        </Text>
                    </Container>
                    <Container padding>
                        <Button onClick={createAlbum}>Create</Button>
                    </Container>
                </Column>
                ) : (
                <Container className={styles.content}>
                    {albums.map((album, index) => (
                        <Container className={styles.albumContainer}>
                            <Container key={index} className={styles.album} onClick={() => setAlbum(album.id)}>
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
                                            {album.count} uploads
                                        </Text>
                                    </Row>
                                </Column>
                            </Container>
                        </Container>
                    ))}
                    <Container className={styles.createAlbumContainer}>
                        <Container className={styles.createAlbum} onClick={createAlbum}>
                            <Text className={styles.createAlbumText}>+ Create New Album</Text>
                        </Container>
                    </Container>
                </Container>
            )
}

export default Albums