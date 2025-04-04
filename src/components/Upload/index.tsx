"use client";
import React, { FC, useCallback, useEffect, useState } from "react"
import { Column, Row, Container, Text } from "react-web-layout-components"
import styles from './Upload.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkSquareIcon, squareIcon, uploadIcon } from "@/lib/icons";
import { OrientationMediaWithFile } from "@/helpers/providers/gallery";
import { MediaConfirmationGallery } from "../MediaGallery";
import { AlbumMediaData } from "@/lib/types/Album";


const Upload: FC<{media: OrientationMediaWithFile[], collaboratorCount: number, upload: () => void, onConfirm: (confirmedImages: OrientationMediaWithFile[], addToAlbum: boolean) => void, onCancel: () => void, album?: AlbumMediaData}> = ({media, collaboratorCount, album,upload, onConfirm, onCancel}) => {
    const pathname = usePathname()
    const name = pathname.replace('/upload', '').replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set(media.map((_, index) => index)))
    const [addToAlbum, setAddToAlbum] = useState<boolean>(album ? true : false)
    const [totalImages, setTotalImages] = useState<number>(0)
    const [totalVideos, setTotalVideos] = useState<number>(0)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)

    useEffect(() => {
        setTotalImages(0)
        setTotalVideos(0)
        media.forEach((m) => {
            if (m.contentType.startsWith('image')) {
                setTotalImages(old => old + 1)
            } else {
                setTotalVideos(old => old + 1)
            }
        })
    }, [media])

    const toggleImage = useCallback((index: number) => {
        if (selectedImages.has(index)) {
            selectedImages.delete(index)
            const newSelectedImages = new Set(selectedImages)
            setSelectedImages(newSelectedImages)
        } else {
            selectedImages.add(index)
            const newSelectedImages = new Set(selectedImages)
            setSelectedImages(newSelectedImages)
        }
    }, [selectedImages])

    const handleConfirm = useCallback(() => {
        onConfirm(media.filter((_, index) => selectedImages.has(index)).map(m => ({...m, isPrivate})), addToAlbum)
    }, [addToAlbum, media, selectedImages, isPrivate])

    useEffect(() => {
        if (album) {
            setAddToAlbum(true)
        }
    }, [album])

    useEffect(() => {
        if (media.length > 0) {
            setSelectedImages(new Set(media.map((_, index) => index)))
        }
    }, [media])

    return (
        <Column className={styles.upload}>
            <Container className={styles.header}>
                <Container className={styles.headerIcon}>
                    <NextImage src='/branding/icon.svg' alt='logo' className={styles.icon} layout='intrinsic' height={100} width={100}/>    
                </Container>
                <Row className={styles.headerTitle}>
                    <Container className={styles.title}>
                        <Text className={styles.titleText}>
                            {name}
                        </Text>
                    </Container>
                    <Container className={styles.info}>
                        <Text className={styles.infoText}>
                            {collaboratorCount} Collaborators
                        </Text>
                    </Container>
                </Row>
                <Container className={styles.action}>
                    <Button className={styles.button} onClick={upload}>
                        <Text size={1}>
                            + Upload
                        </Text>
                    </Button>
                    <Container className={styles.icon} onClick={upload}>
                        <FontAwesomeIcon icon={uploadIcon} />
                    </Container>
                </Container>
            </Container>
            <Column className={styles.content}>
                <Column className={styles.separator}>
                    <Row className={styles.separatorTitle}>
                        <Text size={2}>Uploads</Text>
                        <Container className={styles.mediaInfo}>
                            <Container className={styles.mediaType}>
                                <Text size={1.2}>{totalImages} Photos</Text>
                            </Container>
                            <Container className={styles.mediaType}>
                                <Text size={1.2}>{totalVideos} Videos</Text>
                            </Container>
                        </Container>
                    </Row>
                    <Container className={styles.separatorLine}/>
                </Column>
            </Column>
            <Column className={styles.galleryContainer} >
                <MediaConfirmationGallery media={media} toggleImage={toggleImage} selectedImages={selectedImages}/>
            </Column>
            <Container className={styles.actionBar}>
                { album && (
                <Container className={styles.albumCheck} onClick={() => setAddToAlbum(!addToAlbum)}>
                    <Container className={styles.checkContainer}>
                        <FontAwesomeIcon icon={addToAlbum ? checkSquareIcon : squareIcon} className={styles.checkIcon}/>
                    </Container>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>Add to album: <Text className={styles.albumName}>{album.name}</Text></Text>
                    </Container>
                </Container>
                )}
                <Container className={styles.albumCheck} onClick={() => setIsPrivate(!isPrivate)}>
                    <Container className={styles.checkContainer}>
                        <FontAwesomeIcon icon={isPrivate ? checkSquareIcon : squareIcon} className={styles.checkIcon}/>
                    </Container>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>Private</Text>
                    </Container>
                </Container>
                <Container className={styles.mediaInfo}>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>{totalImages} Photos</Text>
                    </Container>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>{totalVideos} Videos</Text>
                    </Container>
                </Container>
                <Container className={styles.button}>
                    <Button onClick={onCancel}>
                        <Text>Cancel</Text>
                    </Button>
                </Container>
                <Container className={styles.button}>
                    <Button onClick={handleConfirm}>
                        <Text>Confirm</Text>
                    </Button>
                </Container>
            </Container>
        </Column>
    )
}

export default Upload