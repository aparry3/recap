"use client";
import { FC } from 'react'
import styles from '../Content.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import { uploadIcon, zipIcon, photoFilmIcon } from '@/lib/icons'


const Home: FC = () => {
    return (
        <>
            <Column className={styles.section} padding>
                <Row className={styles.title}>
                    <Text size={2} weight={500}>Actions</Text>
                </Row>
                <Container className={styles.line} style={{width: '100%'}}/>
                <Row className={styles.actions}>
                    <Container className={styles.actionContainer}>
                        <Column className={styles.action}>
                            <Container padding={0.5}>
                                <FontAwesomeIcon icon={uploadIcon} className={styles.icon}/>
                            </Container>
                            <Container padding={0.5}>
                                <Text size={1.1}>Upload</Text>
                            </Container>
                        </Column>
                    </Container>
                    <Container className={styles.dividerContainer}>
                        <Container className={styles.divider}/>
                    </Container>
                    <Container className={styles.exportActions}>
                        <Container className={styles.actionContainer}>
                            <Column className={styles.action}>
                                <Container>
                                    <FontAwesomeIcon icon={photoFilmIcon} className={styles.icon}/>
                                </Container>
                                <Container padding={0.5}>
                                    <Text size={1.1}>Export Video</Text>
                                </Container>
                            </Column>
                        </Container>
                        <Container className={styles.actionContainer}>
                            <Column className={styles.action}>
                                <Container>
                                    <FontAwesomeIcon icon={zipIcon} className={styles.icon}/>
                                </Container>
                                <Container padding={0.5}>
                                    <Text size={1.1}>Download</Text>
                                </Container>
                            </Column>
                        </Container>
                    </Container>
                </Row>
            </Column>
            <Column className={styles.section} padding>
                <Row className={styles.title}>
                    <Text size={2} weight={500}>Recent Uploads</Text>
                </Row>
                <Container className={styles.line} style={{width: '100%'}}/>
                <Column className={styles.gallery}>
                    <Container className={styles.emptyGallery} padding>
                        <Text size={2} weight={500}>No Recent Uploads</Text>
                    </Container>  
                </Column>
            </Column>
        </>
    )
}

export default Home