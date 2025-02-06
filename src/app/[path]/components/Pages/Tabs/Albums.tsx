import { FC, useEffect, useState } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Albums.module.scss'
import Button from "@/components/Button"
import useAlbums from "@/helpers/providers/albums"
import MediaGallery from "@/components/MediaGallery"
import AlbumChip from "@/components/AlbumChip"
import useGallery from "@/helpers/providers/gallery"
import { useUser } from "@/helpers/providers/user"

const Albums: FC = () => {
    const {personId} = useUser()
    const {upload, gallery} = useGallery()
    const {createAlbum, albums, album, setAlbum} = useAlbums()

    useEffect(() => {
        console.log(album)
    }, [album])

    return album ? (
            <Column className={styles.content}>
            {album.recentMedia && album.recentMedia.length ? (
                <MediaGallery media={album.recentMedia} />
            ) : (
                <Column className={styles.data}>
                <Container padding>
                    <Text size={1.4}>
                        No album uploads yet..
                    </Text>
                </Container>
                <Container padding>
                    <Button onClick={upload}>Upload</Button>
                </Container>
            </Column>
            )}
            </Column>
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
                    {albums.filter(a => !a.isPrivate || a.personId === personId || personId === gallery.personId).map((album, index) => (
                        <AlbumChip index={index} album={album} onClick={() => setAlbum(album.id)}/>
                    ))}
                </Container>
            )
}

export default Albums