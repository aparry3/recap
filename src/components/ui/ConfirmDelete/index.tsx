"use client";
import React, { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './ConfirmDelete.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { AlbumMediaData } from "@/lib/types/Album";


const ConfirmDelete: FC<{onCancel: () => void, onConfirm: () => void, selectedImages?: Set<string>, album?: AlbumMediaData}> = ({selectedImages, onConfirm, onCancel, album}) => {
        
    return (
        <Column className={styles.select}>
            <Container className={styles.header}>
                <Container className={styles.headerIcon}>
                    <NextImage src='/branding/icon.svg' alt='logo' className={styles.icon} layout='intrinsic' height={100} width={100}/>    
                </Container>
            </Container>
            <Column className={styles.confirmDeleteContent}>
                <Container className={styles.headerTitle}>
                    <Text className={styles.titleText}>
                        Confirm delete
                    </Text>
                </Container>
                {selectedImages ? (
                <>
                <Container className={styles.action}>
                        <Text className={styles.count}>
                            {selectedImages.size}
                        </Text>
                </Container>
                <Container className={styles.headerTitle}>
                    <Text className={styles.titleText}>
                        media?
                    </Text>
                </Container>
                </>
                ) : album ? (
                <Container className={styles.action}>
                        <Text className={styles.count}>
                            {album.name}
                        </Text>
                </Container>
                ) : <></>}
            </Column>
            <Container className={styles.actionBar}>
                <Container className={styles.button}>
                    <Button onClick={onCancel}>
                        <Text>Cancel</Text>
                    </Button>
                </Container>
                <Container className={styles.button}>
                    <Button onClick={onConfirm}>
                        <Text>Confirm</Text>
                    </Button>
                </Container>
            </Container>
        </Column>
    )
}

export default ConfirmDelete