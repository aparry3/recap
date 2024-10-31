"use client";
import React, { FC } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './page.module.scss'
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { gridIcon, houseIcon, menuIcon, photoFilmIcon, qrcodeIcon, uploadIcon, userIcon, zipIcon } from "@/lib/icons"
import Button from "@/components/Button"
import Link from "next/link";


const Dashboard: FC = async ({}) => {

    // const ipAddress = getIpAddress(headerList)

    return (
        <Container as='main'className={styles.app}>
            <Header />
            <Sidebar />
            <Content />
        </Container>
    )
}

const Header: FC = () => {
    return (
        <Container as='header' className={styles.header} justify='space-between'>
            <Container className={styles.headerItem} >
                <FontAwesomeIcon icon={menuIcon} className={styles.icon}/>
            </Container>
            <Container className={styles.wordmarkContainer} padding={0.5}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                </Link>
            </Container>
            <Container className={styles.headerItem} >
                <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon}/>
            </Container>
        </Container>
    )
}

const Sidebar: FC = () => {
    return (
        <Column className={styles.sidebar}>
            <Container className={styles.sidebarHeader} padding>
                <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
             </Container>
             <Container className={styles.dash} />
             <Column className={styles.menu}>
                <Container className={styles.menuItemContainer}>
                    <Row className={`${styles.menuItem} ${styles.active}`}>
                        <Container className={styles.menuIcon}>
                            <FontAwesomeIcon icon={houseIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>Dashboard</Text>
                        </Container>
                    </Row>
                </Container>
                <Container className={styles.menuItemContainer}>
                    <Row className={styles.menuItem}>
                        <Container className={styles.menuIcon}>
                            <FontAwesomeIcon icon={gridIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>Gallery</Text>
                        </Container>
                    </Row>
                </Container>
                <Container className={styles.menuItemContainer}>
                    <Row className={styles.menuItem}>
                        <Container className={styles.menuIcon}>
                            <FontAwesomeIcon icon={userIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>My Uploads</Text>
                        </Container>
                    </Row>
                </Container>
             </Column>
        </Column>
    )
}

const Content: FC = () => {
    return (
        <Column as='section' className={styles.content}>
            <Container className={styles.heading} justify="space-between">
                <Column className={styles.titleContainer} padding>
                    <Row className={styles.title}>
                        <Text className={styles.titleText} size={3}>The Dion Wedding</Text>
                    </Row>
                    <Row className={styles.subtitleContainer} padding={[0, 0.5]}>
                        <Container className={styles.subtitle} padding={[0, 1, 0, 0]}>
                            <Text className={styles.subtitleText} size={1.2}>September 7, 2024</Text>
                        </Container>
                        <Container className={styles.dashVertical}/>
                        <Container className={styles.subtitle} padding={[0, 0, 0, 1]}>
                            <Text className={styles.subtitleText} size={1.2}>10 Contributors</Text>
                        </Container>
                    </Row>
                </Column>
                <Container className={styles.actionContainer} padding>
                    <Container padding={[0, 0.5]}>
                        <Container padding={0.5} className={styles.iconContainer}>
                            <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon} />
                        </Container>
                    </Container>
                    <Container padding={[0, 0.5]}>
                        <Button onClick={() => {}}>
                            <Text size={1} weight={500}>+ Upload</Text>
                        </Button>
                    </Container>
                </Container>
            </Container>
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
        </Column>
    )
}
export default Dashboard;