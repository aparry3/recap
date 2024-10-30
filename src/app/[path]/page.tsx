"use client";
import React, { FC } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './page.module.scss'
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { circleVideoIcon, qrcodeIcon } from "@/lib/icons"
import Button from "@/components/Button"


const GalleryPage: FC<{params: {path: string}}> = async ({params}) => {

    // const ipAddress = getIpAddress(headerList)

    return (
        <Container as='main'className={styles.app}>
            <Sidebar />
            <Content />
            {/* <Container className={styles.content} /> */}
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
                            <FontAwesomeIcon icon={circleVideoIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>Dashboard</Text>
                        </Container>
                    </Row>
                </Container>
                <Container className={styles.menuItemContainer}>
                    <Row className={styles.menuItem}>
                        <Container className={styles.menuIcon}>
                            <FontAwesomeIcon icon={circleVideoIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>Dashboard</Text>
                        </Container>
                    </Row>
                </Container>
                <Container className={styles.menuItemContainer}>
                    <Row className={styles.menuItem}>
                        <Container className={styles.menuIcon}>
                            <FontAwesomeIcon icon={circleVideoIcon} className={styles.icon}/>
                        </Container>
                        <Container>
                            <Text weight={500}>Dashboard</Text>
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
        </Column>
    )
}
export default GalleryPage;