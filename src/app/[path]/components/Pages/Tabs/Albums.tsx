import { FC, useState } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Albums.module.scss'
import Button from "@/components/Button"
import useAlbums from "@/helpers/providers/albums"
import MediaGallery from "@/components/MediaGallery"
import AlbumChip from "@/components/AlbumChip"

const Albums: FC = () => {
    const {createAlbum, albums, album, setAlbum} = useAlbums()

    return album ? (
            <MediaGallery media={album.recentMedia || []} />
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
                    <Container className={styles.albumContainer}>
                        <Container className={styles.createAlbum} onClick={createAlbum}>
                            <Container className={styles.createAlbumContent}>
                                <Text className={styles.createAlbumText}>+ Create New Album</Text>
                            </Container>
                        </Container>
                    </Container>
                    {albums.map((album, index) => (
                        <AlbumChip index={index} album={album} onClick={() => setAlbum(album.id)}/>
                    ))}
                </Container>
            )
}

export default Albums