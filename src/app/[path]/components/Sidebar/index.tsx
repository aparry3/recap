"use client"
import { houseIcon, gridIcon, userIcon, leftIcon, qrcodeIcon, gearIcon, circleInfoIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useCallback } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Sidebar.module.scss'
import Image from "next/image"
import { AppPage } from "../../App";
import { useRouter } from "next/navigation";
import useGallery from "@/helpers/providers/gallery";
import useNavigation from "@/helpers/providers/navigation";
import { TheKnot, Zola } from "@/lib/icons/branding";
import { useUser } from "@/helpers/providers/user"
import { Tab } from "../Pages/Gallery"

interface SidebarProps {
}
const SidebarContent: FC<Omit<SidebarProps, 'open'>> = () => {
    const {personId} = useUser()
    const {handlePageChange, page, setShowSidebar, tab, setTab} = useNavigation()
    const {openSettings} = useGallery()
    const router = useRouter()
    const navigateToGalleries = useCallback(() => {
        router.push('/galleries')
    }, [router])

    const {setAlbum, setPerson, gallery} = useGallery()
    
    const changePage = (page: AppPage) => {
        setAlbum()
        setPerson()
        setShowSidebar(false)
        handlePageChange(page)
    }

    const handleClose = () => {
        setShowSidebar(false)
    }

    const handleGalleryItemClick = (newTab: Tab) => {
        setTab(newTab)
        changePage(AppPage.GALLERY)
    }

    const handleGalleryClick = () => {
        if (page !== AppPage.GALLERY) {
            // If not on gallery page, navigate to gallery with current/default tab
            const targetTab = tab || Tab.PHOTOS;
            setTab(targetTab);
            changePage(AppPage.GALLERY);
        }
    }

    return (
    <>
    <Container className={styles.header} padding>
        <Container className={styles.headerIcon}>
            <FontAwesomeIcon icon={leftIcon} className={styles.icon} onClick={handleClose}/>
        </Container>
        <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        <Container className={styles.headerIcon}>
            <FontAwesomeIcon icon={circleInfoIcon} className={styles.icon}/>
        </Container>    
     </Container>
     <Container className={styles.dash} />
     <Column className={styles.menu} style={{flexGrow: 1}}>
        <Container className={styles.menuItemContainer}>
            <Row className={`${styles.menuItem} ${page === AppPage.HOME ? styles.active : ''} `} onClick={() => changePage(AppPage.HOME)}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={houseIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>Dashboard</Text>
                </Container>
            </Row>
        </Container>
        <Container className={styles.menuItemContainer}>
            <Column>
                <Row className={`${styles.menuItem} ${page === AppPage.GALLERY ? styles.active : ''} `} onClick={handleGalleryClick}>
                    <Container className={styles.menuIcon}>
                        <FontAwesomeIcon icon={gridIcon} className={styles.icon}/>
                    </Container>
                    <Container>
                        <Text weight={500}>Gallery</Text>
                    </Container>
                </Row>
                <Column className={styles.submenu}>
                    <Container className={`${styles.submenuItem} ${page === AppPage.GALLERY && tab === Tab.PHOTOS ? styles.active : ''}`} onClick={() => handleGalleryItemClick(Tab.PHOTOS)}>
                        <Text weight={500}>Photos</Text>
                    </Container>
                    <Container className={`${styles.submenuItem} ${page === AppPage.GALLERY && tab === Tab.ALBUMS ? styles.active : ''}`} onClick={() => handleGalleryItemClick(Tab.ALBUMS)}>
                        <Text weight={500}>Albums</Text>
                    </Container>
                    <Container className={`${styles.submenuItem} ${page === AppPage.GALLERY && tab === Tab.PEOPLE ? styles.active : ''}`} onClick={() => handleGalleryItemClick(Tab.PEOPLE)}>
                        <Text weight={500}>People</Text>
                    </Container>
                </Column>
            </Column>
        </Container>
        <Container className={styles.menuItemContainer}>
            <Row className={`${styles.menuItem} ${page === AppPage.USER ? styles.active : ''}`} onClick={() => changePage(AppPage.USER)}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={userIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>My Uploads</Text>
                </Container>
            </Row>
        </Container>
        {(gallery.zola || gallery.theknot) && (
            <>
                <Container style={{width: '100%'}} padding>
                    <Container className={styles.dash} />
                </Container>
                {gallery.theknot && (
                <a className={styles.menuItemContainer} href={gallery.theknot} target='_blank'>
                    <Container className={styles.menuItem}>
                        <TheKnot />
                    </Container>
                </a>
                )}
                 {gallery.zola && (
                <a className={styles.menuItemContainer} href={gallery.zola} target='_blank'>
                    <Container className={styles.menuItem}>
                        <Zola />
                    </Container>
                </a>
                )}
            </>
        )}
     </Column>
     <Column className={styles.menu}>
     {personId === gallery.personId && (
        <Container className={styles.menuItemContainer}>
            <Row className={styles.menuItem} onClick={openSettings}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={gearIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>Settings</Text>
                </Container>
            </Row>
        </Container>
     )}
        <Container className={styles.menuItemContainer}>
            <Row className={`${styles.menuItem}`} onClick={navigateToGalleries}>
                <Container className={styles.menuIcon}>
                    <FontAwesomeIcon icon={leftIcon} className={styles.icon}/>
                </Container>
                <Container>
                    <Text weight={500}>All Galleries</Text>
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

export const MobileMenu: FC<SidebarProps> = ({ ...props}) => {
    const {sidebarOpen} = useNavigation()
    return sidebarOpen ? (
        <Column className={styles.mobileSidebar}>
            <SidebarContent {...props} />
        </Column>
    ) : <></>
}


export default Sidebar;