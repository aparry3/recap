"use client";

import { houseIcon, gridIcon, userIcon, leftIcon, qrcodeIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Sidebar.module.scss'
import Image from "next/image"
import { AppPage } from "../App";

interface SidebarProps {
    onClose?: () => void
    open?: boolean
    page: AppPage
    onPageChange: (page: AppPage) => void
}
const SidebarContent: FC<Omit<SidebarProps, 'open'>> = ({onClose, onPageChange, page}) => {
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
            <Row className={`${styles.menuItem} ${page === AppPage.HOME ? styles.active : ''} `} onClick={() => onPageChange(AppPage.HOME)}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={houseIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>Dashboard</Text>
                </Container>
            </Row>
        </Container>
        <Container className={styles.menuItemContainer}>
            <Row className={`${styles.menuItem} ${page === AppPage.GALLERY ? styles.active : ''} `} onClick={() => onPageChange(AppPage.GALLERY)}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={gridIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>Gallery</Text>
                </Container>
            </Row>
        </Container>
        <Container className={styles.menuItemContainer}>
            <Row className={`${styles.menuItem} ${page === AppPage.USER ? styles.active : ''}`} onClick={() => onPageChange(AppPage.USER)}>
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

const Sidebar: FC<SidebarProps> = (props) => {
    return (
        <Column className={styles.sidebar}>
            <SidebarContent {...props}/>
        </Column>
    )
}

export const MobileMenu: FC<SidebarProps> = ({open = false, ...props}) => {
    return open ? (
        <Column className={styles.mobileSidebar}>
            <SidebarContent {...props} />
        </Column>
    ) : <></>
}


export default Sidebar;