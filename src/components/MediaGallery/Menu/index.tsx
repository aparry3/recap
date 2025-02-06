"use client";
import { downloadIcon, Actions, trashIcon, xIcon, albumIcon, downIcon, upIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Menu.module.scss'
import { FC, useCallback, useMemo, useState } from "react";
import useGallery from "@/helpers/providers/gallery";
import useAlbums from "@/helpers/providers/albums";
import { AlbumMediaData } from "@/lib/types/Album";


export enum MenuItem {
    REMOVE = 'remove',
    ADD = 'add',
    DELETE = 'delete',
    DOWNLOAD = 'download'
}

const Menu: FC<{selectedImages: Set<string>, items?: MenuItem[], onClose?: () => void}> = ({selectedImages, onClose, items = [MenuItem.ADD, MenuItem.DOWNLOAD, MenuItem.DELETE]}) => {
    const {selectAlbums, removeMedia} = useAlbums()
    const {album, deleteImages, download} = useGallery()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    const openSelectAlbums = useCallback(() => {
        selectAlbums(selectedImages)
        setMenuOpen(false)
    }, [selectedImages])

    const removeFromAlbum = useCallback(() => {
        if (album) {
            removeMedia(selectedImages)
        }
    }, [selectedImages])

    const menuItems: {[key in MenuItem]: {action: () => void, icon: any, text: any}} = useMemo(() => ({
        [MenuItem.REMOVE]: {
            action: removeFromAlbum,
            icon: trashIcon,
            text: <Text size={1.1}>Remove from <Text weight={600}>{album?.name}</Text></Text>
        },

        [MenuItem.ADD]: {
            action: openSelectAlbums,
            icon: albumIcon,
            text: <Text size={1.1} weight={600}>Add to album</Text>
        },
        [MenuItem.DELETE]: {
            action: deleteImages,
            icon: trashIcon,
            text: <Text size={1.1}>Delete image</Text>
        },
        [MenuItem.DOWNLOAD]: {
            action: download,
            icon: downloadIcon,
            text: <Text size={1.1}>Download images</Text>
        }

    }), [album])
    
    return (
    <Column className={`${styles.selectedImageMenuContainer} ${menuOpen ? styles.selectedMenuOpen : ''}`}>
        <Container className={styles.selectedImageActionsContainer}>
            <Container className={styles.selectedImageActions}>
                <Container className={styles.iconContainer} onClick={() => setMenuOpen(!menuOpen)}>
                    <FontAwesomeIcon icon={menuOpen ? downIcon : upIcon} className={styles.actionIcon}/>
                </Container>
            </Container>
            <Container className={styles.selectedImageActions}>
                {onClose ? (
                <Container className={styles.iconContainer} onClick={onClose}>
                    <FontAwesomeIcon icon={xIcon} className={styles.actionIcon}/>
                </Container>
                ) : (
                <Container className={styles.iconContainer} onClick={download}>
                    <FontAwesomeIcon icon={downloadIcon} className={styles.actionIcon}/>
                </Container>
                )}
            </Container>
        </Container>
        {items.map(item => (
        <Row className={styles.selectedImageActionsContainer}>
            <Container className={styles.selectedImageActions} onClick={menuItems[item].action}>
                <Container className={styles.iconContainer}>
                    <FontAwesomeIcon icon={menuItems[item].icon} className={styles.actionIcon}/>
                </Container>
                <Container className={styles.iconContainer}>
                    {menuItems[item].text}
                </Container>
            </Container>
        </Row>))}
    </Column>
    )
}

export default Menu