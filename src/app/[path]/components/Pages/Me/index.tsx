"use client";
import { FC } from 'react'
import styles from './Me.module.scss'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import useGallery from '@/helpers/providers/gallery';
import MediaGallery from '@/components/MediaGallery';
import AlbumChip from '@/components/AlbumChip';
import useAlbums from '@/helpers/providers/albums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkSquareIcon, squareIcon } from '@/lib/icons';
import App from 'next/app';
import useNavigation from '@/helpers/providers/navigation';
import { AppPage } from '@/app/[path]/App';
import { Tab } from '../Gallery';


const Home: FC = () => {
    const {media, toggleSelectImages, selectImages} = useGallery()
    const {albums, setAlbum} = useAlbums()
    const {setPage, setTab} = useNavigation()

    const chooseAlbum = (albumId: string) => {
        setAlbum(albumId)
        setPage(AppPage.GALLERY)
        setTab(Tab.ALBUMS)
    }

    return (
        <>
            {albums.length && (
            <Column className={styles.section} padding>
                <Row className={styles.title}>
                    <Text size={2} weight={500}>My Albums</Text>
                </Row>
                <Container className={styles.line} style={{width: '100%'}}/>
                <Container className={styles.content}>
                    {albums.map((album, index) => (
                        <AlbumChip key={album.name} index={index} album={album} onClick={() => chooseAlbum(album.id)}/>
                    ))}
                </Container>
            </Column>
            )}
            <Column className={styles.section} padding>
                <Row className={styles.title}>
                    <Text size={2} weight={500}>My Recent Uploads</Text>
                    <Container className={styles.selectContainer} onClick={toggleSelectImages}>
                        <Text>Select</Text>
                        <Container className={styles.checkContainer}>
                            <FontAwesomeIcon icon={selectImages ? checkSquareIcon : squareIcon} className={styles.icon}/>
                        </Container>
                    </Container>
                </Row>
                <Container className={styles.line} style={{width: '100%'}}/>
                <Column className={styles.gallery}>
                    {media.length > 0 ? (
                        <MediaGallery media={media}/>
                    ) : (
                    <Container className={styles.emptyGallery} padding>
                        <Text size={2} weight={500}>No Recent Uploads</Text>
                    </Container>
                    )}
                </Column>
            </Column>
        </>
    )
}

export default Home