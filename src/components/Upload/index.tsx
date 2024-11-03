"use client";
import React, { FC } from "react"
import { Column, Row, Container, Text } from "react-web-layout-components"
import styles from './Upload.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadIcon } from "@/lib/icons";
import { OrientationImage } from "@/helpers/providers/upload";
import MediaGallery from "../MediaGallery";


const Upload: FC<{images: OrientationImage[], upload: () => void, onConfirm: (confirmedImages: OrientationImage[]) => void}> = ({images, upload, onConfirm}) => {
    const pathname = usePathname()
    const name = pathname.replace('/upload', '').replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const handleConfirm = () => {
        onConfirm(images)
    }
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
                <MediaGallery images={images} />
            </Column>
            <Container className={styles.actionBar}>
                <Container className={styles.mediaInfo}>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>10 Photos</Text>
                    </Container>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>5 Videos</Text>
                    </Container>
                </Container>
                <Container className={styles.button}>
                    <Button onClick={handleConfirm}>
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