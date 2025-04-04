"use client";
import Button from "@/components/Button"
import { gearIcon, qrcodeIcon, circleInfoIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Heading.module.scss'
import { FC, useEffect, useMemo } from "react";
import useGallery from "@/helpers/providers/gallery";
import { useUser } from "@/helpers/providers/user";
import useAlbums from "@/helpers/providers/albums";


const Heading: FC<{onQrClick?: () => void, onInfoClick?: () => void, showGalleryName?: boolean}> = ({onQrClick, onInfoClick, showGalleryName}) => {
    const {person: user} = useUser()
    const {editAlbum} = useAlbums()
    const {upload, gallery, people, person, album} = useGallery()
    const name = useMemo(() => showGalleryName ? gallery.name : person ? person.name : album ? album.name : gallery.name, [person, gallery, album, showGalleryName])
    const count = useMemo(() => showGalleryName ? undefined : person ? person.count : album ? album.count : undefined, [person, album, showGalleryName])
    
    const showEdit = useMemo(() => !showGalleryName && album && user && album.personId === user.id, [user, album, showGalleryName])

    return (
        <Container className={styles.heading} justify="space-between">
        <Column className={styles.titleContainer} padding>
            <Row className={styles.title}>
                <Text className={styles.titleText} size={3}>{name}</Text>
                {showEdit && (
                <Container padding={[0, 0.5]}>
                    <Container padding={0.5} className={styles.iconContainer} onClick={editAlbum}>
                        <FontAwesomeIcon icon={gearIcon} className={styles.icon} />
                    </Container>
                </Container>
                )}
            </Row>
            <Row className={styles.subtitleContainer} padding={[0, 0.5]}>
                { count === undefined ? (
                <>
                    <Container className={styles.subtitle} padding={[0, 1, 0, 0]}>
                        <Text className={styles.subtitleText} size={1.2}>{new Date().toDateString()}</Text>
                    </Container>
                    <Container className={styles.dashVertical}/>
                    <Container className={styles.subtitle} padding={[0, 0, 0, 1]}>
                        <Text className={styles.subtitleText} size={1.2}>{people?.length || 0} Contributors</Text>
                    </Container>
                </>
                ) : (
                <>
                    <Container className={styles.subtitle} padding={[0, 1, 0, 0]}>
                        <Text className={styles.subtitleText} size={1.2}>{gallery.name}</Text>
                    </Container>
                    <Container className={styles.dashVertical}/>
                    <Container className={styles.subtitle} padding={[0, 0, 0, 1]}>
                        <Text className={styles.subtitleText} size={1.2}>{count} uploads</Text>
                    </Container>
                </>
                )}
            </Row>
        </Column>
        {onQrClick && (
        <Container className={styles.actionContainer} padding>
            <Container padding={[0, 0.5]} className={styles.qrContainer}>
                <Container padding={0.5} className={styles.iconContainer} onClick={onInfoClick}>
                    <FontAwesomeIcon icon={circleInfoIcon} className={styles.icon} />
                </Container>
            </Container>
            <Container padding={[0, 0.5]} className={styles.qrContainer}>
                <Container padding={0.5} className={styles.iconContainer} onClick={onQrClick}>
                    <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon} />
                </Container>
            </Container>
            <Container padding={[0, 0.5]}>
                <Button onClick={upload}>
                    <Text size={1} weight={500}>+ Upload</Text>
                </Button>
            </Container>
        </Container>)}
    </Container>
    )
}

export default Heading