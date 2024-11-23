"use client";
import React, { FC, useCallback, useEffect, useState } from "react"
import { Column, Row, Container, Text } from "react-web-layout-components"
import styles from './Upload.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadIcon } from "@/lib/icons";
import { OrientationMediaWithFile } from "@/helpers/providers/gallery";
import { MediaConfirmationGallery } from "../MediaGallery";


const Upload: FC<{media: OrientationMediaWithFile[], upload: () => void, onConfirm: (confirmedImages: OrientationMediaWithFile[]) => void, onCancel: () => void}> = ({media, upload, onConfirm, onCancel}) => {
    const pathname = usePathname()
    const name = pathname.replace('/upload', '').replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set(media.map((_, index) => index)))
    
    const [totalImages, setTotalImages] = useState<number>(0)
    const [totalVideos, setTotalVideos] = useState<number>(0)

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

    useEffect(() => {
        console.log(selectedImages)
    }, [selectedImages])
    const handleConfirm = () => {
        onConfirm(media.filter((_, index) => selectedImages.has(index)))
    }

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
                            15 Collaborators
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
                                <Text size={1.2}>10 Photos</Text>
                            </Container>
                            <Container className={styles.mediaType}>
                                <Text size={1.2}>5 Videos</Text>
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