"use client";
import React, { FC, useMemo, useState } from "react"
import {  Container } from "react-web-layout-components"
import styles from './page.module.scss'
import Content from "./components/Content";
import Header from "./components/Header";
import Sidebar, { MobileMenu } from "./components/Sidebar";
import QrCode from "./components/LinkPage";
import useWindowSize from "@/helpers/hooks/window";
import { GalleryProvider } from "@/helpers/providers/gallery";
import { Gallery } from "@/lib/types/Gallery";
import { UserProvider } from "@/helpers/providers/user";

export enum AppPage {
    HOME = 'HOME',
    GALLERY = 'GALLERY',
    USER = 'USER'
}
const App: FC<{gallery: Gallery}> =  ({gallery}) => {
    const {isMobile} = useWindowSize()
    const [showSidebar, setShowSidebar] = useState(false)
    const [showQrCode, setShowQrCode] = useState(false)
    // const [showUploadConfirmation, setShowUploadConfirmation] = useState(true)
    const [page, setPage] = useState(AppPage.HOME)

    const handlePageChange = (newPage: AppPage) => {
        setPage(newPage)
        setShowSidebar(false)
    }
    const sidebarOpen = useMemo(() => isMobile && showSidebar, [showSidebar, isMobile])
    return (
        <UserProvider galleryId={gallery.id}>
            <GalleryProvider gallery={gallery}>
                <Container as='main'className={styles.app}>
                    <Header onMenuClick={() => setShowSidebar(true)} onQrClick={() => setShowQrCode(true)} />
                    {showQrCode && <QrCode onClose={() => setShowQrCode(false)} open={showQrCode}/>}
                    <Sidebar page={page} onPageChange={handlePageChange} onClose={() => setShowSidebar(false)} />
                    <MobileMenu page={page} onPageChange={handlePageChange} open={sidebarOpen} onClose={() => setShowSidebar(false)} />
                    <Content page={page}onQrClick={() => setShowQrCode(true)}/>
                    {/* {showUploadConfirmation && <Upload /> } */}
                </Container>
            </GalleryProvider>
        </UserProvider>
    )
}

export default App;