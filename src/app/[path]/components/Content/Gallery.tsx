"use client";
import { FC, useMemo, useState } from 'react'
import styles from './Gallery.module.scss'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import Photos from './Tabs/Photos';
import People from './Tabs/People';
import Albums from './Tabs/Albums';
import useGallery from '@/helpers/providers/gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { arrowLeftIcon } from '@/lib/icons';


enum Tab {
    PHOTOS = 'PHOTOS',
    PEOPLE = 'PEOPLE',
    ALBUMS = 'ALBUMS'
}

const Gallery: FC = () => {
    const [tab, setTab] = useState<Tab>(Tab.PHOTOS)
    const {person, setPerson} = useGallery()
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
    return (
        <Column className={styles.section}>
            {(person) ? (
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
            ) :(
            <Row className={styles.title}>
                <Container className={`${styles.titleOption} ${tab === Tab.PHOTOS ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.PHOTOS)}>Photos</Text></Container>
                <Container className={`${styles.titleOption} ${tab === Tab.PEOPLE ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.PEOPLE)}>People</Text></Container>
                <Container className={`${styles.titleOption} ${tab === Tab.ALBUMS ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.ALBUMS)}>Albums</Text></Container>
            </Row>
            )}
            <Container className={styles.line} style={{width: '95%'}}/>
            <Container className={styles.tab}>
                {currentTab}
            </Container>
        </Column>
    )
}

export default Gallery