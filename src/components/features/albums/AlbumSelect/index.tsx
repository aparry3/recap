"use client";
import React, { FC, useCallback, useEffect, useState } from "react"
import { Column, Row, Container, Text } from "react-web-layout-components"
import styles from './AlbumSelect.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { AlbumMediaData } from "@/lib/types/Album";
import AlbumChip from "../AlbumChip";


const AlbumSelect: FC<{
    albums: AlbumMediaData[], 
    createAlbum: () => void, 
    onConfirm: (confirmedAlbumIds: string[]) => void, 
    onCancel: () => void,
    singleSelect?: boolean
}> = ({
    albums, 
    createAlbum, 
    onConfirm, 
    onCancel,
    singleSelect = false
}) => {
    
    const [selectedAlbums, setSelectedAlbums] = useState<Set<string>>(new Set())
    

    const toggleAlbum = useCallback((id: string) => {
        if (selectedAlbums.has(id)) {
            selectedAlbums.delete(id)
            const newSelectedImages = new Set(selectedAlbums)
            setSelectedAlbums(newSelectedImages)
        } else {
            if (singleSelect) {
                // If single select mode, clear all previous selections first
                const newSelectedSet = new Set<string>([id])
                setSelectedAlbums(newSelectedSet)
            } else {
                // Multiple selection mode (original behavior)
                selectedAlbums.add(id)
                const newSelectedImages = new Set(selectedAlbums)
                setSelectedAlbums(newSelectedImages)
            }
        }
    }, [selectedAlbums, singleSelect])

    const handleConfirm = () => {
        onConfirm(Array.from(selectedAlbums))
    }

    return (
        <Column className={styles.select}>
            <Container className={styles.header}>
                <Container className={styles.headerIcon}>
                    <NextImage src='/branding/icon.svg' alt='logo' className={styles.icon} layout='intrinsic' height={100} width={100}/>    
                </Container>
            </Container>
            <Column>
                <Container className={styles.headerTitle}>
                    <Container className={styles.title}>
                        <Text className={styles.titleText}>
                            {singleSelect ? 'Select an Album...' : 'Select Albums...'}
                        </Text>
                    </Container>
                </Container>
                <Container className={styles.action}>
                    <Button className={styles.button} onClick={createAlbum}>
                        <Text size={1}>
                            + Create Album
                        </Text>
                    </Button>
                </Container>
            </Column>
            <Column className={styles.galleryContainer} >
            {albums.map((album, index) => (
                <AlbumChip selected={selectedAlbums.has(album.id)} key={index} album={album} index={index} onClick={() => toggleAlbum(album.id)}/>
            ))}
            </Column>
            <Container className={styles.actionBar}>
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

export default AlbumSelect