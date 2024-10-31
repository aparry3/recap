"use client";
import { FC } from 'react'
import styles from '../Content.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import { uploadIcon, zipIcon, photoFilmIcon } from '@/lib/icons'


const Albums: FC = () => {
    return (
                <Column className={styles.section} padding>
                    <Row className={styles.title}>
                        <Container className={`${styles.titleOption} ${styles.active}`}><Text size={1.8} weight={500}>Gallery</Text></Container>
                        <Container className={styles.titleOption}><Text size={1.8} weight={500}>People</Text></Container>
                        <Container className={styles.titleOption}><Text size={1.8} weight={500}>Albums</Text></Container>
                    </Row>
                    <Container className={styles.line} style={{width: '100%'}}/>
                    <Container className={styles.data}>
                    </Container>
                </Column>
    )
}

export default Albums