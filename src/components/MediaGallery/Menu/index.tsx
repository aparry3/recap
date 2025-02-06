"use client";
import { downloadIcon, Actions, trashIcon, xIcon, albumIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Menu.module.scss'
import { FC, useCallback, useState } from "react";
import useGallery from "@/helpers/providers/gallery";
import useAlbums from "@/helpers/providers/albums";
import { Media } from "@/lib/types/Media";


const Menu: FC<{selectedImages: Set<string>}> = ({selectedImages}) => {
    const {selectAlbums} = useAlbums()
    const {album, deleteImages} = useGallery()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    const openSelectAlbums = useCallback(() => {
        selectAlbums(selectedImages)
        setMenuOpen(false)
    }, [selectedImages])
    return (
        <Column className={`${styles.selectedImageMenuContainer} ${menuOpen ? styles.selectedMenuOpen : ''}`}>
        <Container className={styles.selectedImageActionsContainer}>
            <Container className={styles.selectedImageActions}>
                <Container className={styles.iconContainer}>
                    <FontAwesomeIcon icon={downloadIcon} className={styles.actionIcon}/>
                </Container>
                <Container className={styles.iconContainer} onClick={() => setMenuOpen(!menuOpen)}>
                    <Actions  className={styles.actionIcon}/>
                </Container>
            </Container>
            <Container className={styles.selectedImageActions}>
                <Container className={styles.iconContainer} onClick={deleteImages}>
                    <FontAwesomeIcon icon={trashIcon} className={styles.actionIcon}/>
                </Container>
            </Container>
        </Container>
        { album && (
            <Row className={styles.selectedImageActionsContainer}>
                <Container className={styles.selectedImageActions} onClick={removeFromAlbum}>
                    <Container className={styles.iconContainer}>
                        <FontAwesomeIcon icon={xIcon} className={styles.actionIcon}/>
                    </Container>
                    <Container className={styles.iconContainer}>
                        <Text size={1.1}>Remove from <Text weight={600}>{album.name}</Text></Text>
                    </Container>
                </Container>
            </Row>
        )}
        <Row className={styles.selectedImageActionsContainer}>
            <Container className={styles.selectedImageActions} onClick={openSelectAlbums}>
                <Container className={styles.iconContainer}>
                    <FontAwesomeIcon icon={albumIcon} className={styles.actionIcon}/>
                </Container>
                <Container className={styles.iconContainer}>
                    <Text size={1.1} weight={600}>Add to album</Text>
                </Container>
            </Container>
        </Row>
    </Column>
    )
}