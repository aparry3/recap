"use client";
import { FC, useMemo, useState } from 'react'
import styles from '../../Content.module.scss'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import Photos from '../Tabs/Photos';
import People from '../Tabs/People';
import Albums from '../Tabs/Albums';


enum Tab {
    PHOTOS = 'PHOTOS',
    PEOPLE = 'PEOPLE',
    ALBUMS = 'ALBUMS'
}

const Gallery: FC = () => {
    const [tab, setTab] = useState<Tab>(Tab.PHOTOS)
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
            <Row className={styles.title}>
                <Container className={`${styles.titleOption} ${tab === Tab.PHOTOS ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.PHOTOS)}>Photos</Text></Container>
                <Container className={`${styles.titleOption} ${tab === Tab.PEOPLE ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.PEOPLE)}>People</Text></Container>
                <Container className={`${styles.titleOption} ${tab === Tab.ALBUMS ? styles.active : ''}`}><Text size={1.8} weight={500} onClick={() => setTab(Tab.ALBUMS)}>Albums</Text></Container>
            </Row>
            <Container className={styles.line} style={{width: '95%'}}/>
            <Container className={styles.tab}>
                {currentTab}
            </Container>
        </Column>
    )
}

export default Gallery