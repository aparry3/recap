"use client";

import { houseIcon, gridIcon, userIcon, leftIcon, qrcodeIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Sidebar.module.scss'
import Image from "next/image"


const SidebarContent: FC<{onClose?: () => void}> = ({onClose}) => {
    return (
    <>
    <Container className={styles.header} padding>
        <Container className={styles.headerIcon}>
            <FontAwesomeIcon icon={leftIcon} className={styles.icon} onClick={onClose}/>
        </Container>
        <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        <Container className={styles.headerIcon}>
            <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon}/>
        </Container>    
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
     </>
    )
}

const Sidebar: FC<{onClose: () => void}> = ({onClose}) => {
    return (
        <Column className={styles.sidebar}>
            <SidebarContent />
        </Column>
    )
}

export const MobileMenu: FC<{open: boolean, onClose: () => void}> = ({onClose, open = false}) => {
    return open ? (
        <Column className={styles.mobileSidebar}>
            <SidebarContent onClose={onClose} />
        </Column>
    ) : <></>
}


export default Sidebar;