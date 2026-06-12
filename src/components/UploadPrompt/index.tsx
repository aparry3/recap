"use client";
import React, { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './UploadPrompt.module.scss'
import NextImage from "next/image"
import Button from "@/components/Button"
import useGallery from "@/helpers/providers/gallery"
import useLocalStorage from "@/helpers/hooks/localStorage"


const UploadPrompt: FC = () => {
    const {gallery, upload, loading} = useGallery()
    const [seen, setSeen, seenLoading] = useLocalStorage<boolean>(`uploadPromptSeen-${gallery.id}`, false)

    if (loading || seenLoading || seen) return null

    const handleUpload = () => {
        setSeen(true)
        upload()
    }

    const handleDismiss = () => {
        setSeen(true)
    }

    return (
        <Column className={styles.uploadPrompt}>
            <Container className={styles.header}>
                <Container className={styles.headerIcon}>
                    <NextImage src='/branding/icon.svg' alt='logo' className={styles.icon} layout='intrinsic' height={100} width={100}/>
                </Container>
            </Container>
            <Column className={styles.content}>
                <Container className={styles.headerTitle}>
                    <Text className={styles.titleText}>
                        Add your first photos
                    </Text>
                </Container>
                <Container className={styles.subtitle}>
                    <Text className={styles.subtitleText}>
                        Help fill {gallery.name} with memories — upload a few photos to get started.
                    </Text>
                </Container>
            </Column>
            <Column className={styles.actionBar}>
                <Container className={styles.button}>
                    <Button className={styles.uploadButton} onClick={handleUpload}>
                        <Text size={1.2} weight={600}>Upload photos</Text>
                    </Button>
                </Container>
                <Container className={styles.button} onClick={handleDismiss}>
                    <Text className={styles.dismissText}>Maybe later</Text>
                </Container>
            </Column>
        </Column>
    )
}

export default UploadPrompt
