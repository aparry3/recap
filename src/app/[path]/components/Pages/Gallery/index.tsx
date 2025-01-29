"use client";
import { FC, useEffect, useMemo, useState } from 'react'
import styles from './Gallery.module.scss'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import Photos from '../Tabs/Photos';
import People from '../Tabs/People';
import Albums from '../Tabs/Albums';
import useGallery from '@/helpers/providers/gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { arrowLeftIcon, checkSquareIcon, downIcon, squareIcon, upIcon } from '@/lib/icons';
import useAlbums from '@/helpers/providers/albums';
import { useNavigationState } from '@/helpers/hooks/localStorage';


export enum Tab {
    PHOTOS = 'Photos',
    PEOPLE = 'People',
    ALBUMS = 'Albums'
}

const TabMenuItem: FC<{tab: Tab, activeTab: Tab, selectTab: (tab: Tab) => void}> = ({tab, activeTab,selectTab}) => {
    return (
        <Container className={styles.menuItem}>
            <Container className={`${styles.titleOption} ${activeTab === tab ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => selectTab(tab)}>{tab}</Text></Container>
        </Container>
    )
}

const Gallery: FC = () => {
    const {tab, setTab} = useNavigationState()
    const {person, setPerson, toggleSelectImages, selectImages} = useGallery()
    const {album, setAlbum} = useAlbums()
    const [menuOpen, setMenuOpen] = useState(false)

    const isPhotos = useMemo(() => tab === Tab.PHOTOS || album || person, [tab])

    const handleChangeTab = (tab: Tab) => {
        setTab(tab)
        setMenuOpen(false)
    }
    const currentTab = useMemo(() => {
        switch (tab) {
            case Tab.PHOTOS:
                return <Photos/>
            case Tab.PEOPLE:
                return <People />
            case Tab.ALBUMS:
                return <Albums />
            default:
                return <Photos />
        }
    }, [tab])
    
    useEffect(() => {
        console.log(album)
        console.log(tab)
    }, [album, tab])
    return (
        <Column className={styles.section}>
            <Column className={styles.titleContainer}>
                {(Tab.PEOPLE === tab && person) ? (
                    <Row className={styles.nameContainer}>
                        <Container className={styles.backIconContainer} onClick={() => setPerson()}>
                            <FontAwesomeIcon icon={arrowLeftIcon} className={styles.leftIcon} /><Text size={1.1} className={styles.backText}>Back</Text>
                        </Container>
                        <Container className={styles.name}>
                            <Text size={1.8}>{person.name}</Text>
                        </Container>
                        <Container className={styles.countContainer}>
                            <Text size={1.1}>{person.count} uploads</Text>
                        </Container>
                    </Row>
                ) : (Tab.ALBUMS === tab && album) ? (
                    <Row className={styles.nameContainer}>
                        <Container className={styles.backIconContainer} onClick={() => setAlbum()}>
                            <FontAwesomeIcon icon={arrowLeftIcon} className={styles.leftIcon} /><Text size={1.1} className={styles.backText}>Back</Text>
                        </Container>
                        <Container className={styles.name}>
                            <Text size={1.8}>{album.name}</Text>
                        </Container>
                        <Container className={styles.countContainer}>
                            <Text size={1.1}>{album.count} uploads</Text>
                        </Container>
                    </Row>
                ) :(
                <Row className={styles.tabs} justify='space-between'>
                    <Container className={`${styles.titleOption} ${styles.active}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <Text size={1.8} weight={500}>{tab}</Text>
                        <Container padding={[0, 1]}>
                            <FontAwesomeIcon icon={menuOpen ? upIcon : downIcon} className={styles.leftIcon} />
                        </Container>
                    </Container>
                    {menuOpen && (
                        <Column className={styles.tabMenu}>
                            <TabMenuItem tab={Tab.PHOTOS} activeTab={tab} selectTab={handleChangeTab}/>
                            <Container className={styles.line}/>
                            <TabMenuItem tab={Tab.PEOPLE} activeTab={tab} selectTab={handleChangeTab}/>
                            <Container className={styles.line}/>
                            <TabMenuItem tab={Tab.ALBUMS} activeTab={tab} selectTab={handleChangeTab}/>
                        </Column>
                    )}
                    { isPhotos && (
                    <Container className={styles.selectContainer} onClick={toggleSelectImages}>
                        <Text>Select</Text>
                        <Container className={styles.checkContainer}>
                            <FontAwesomeIcon icon={selectImages ? checkSquareIcon : squareIcon} className={styles.icon}/>
                        </Container>
                    </Container>
                    )}
                </Row>
                )}
                <Container className={styles.line}/>
            </Column>
            <Container className={styles.tab}>
                {currentTab}
            </Container>
        </Column>
    )
}

export default Gallery