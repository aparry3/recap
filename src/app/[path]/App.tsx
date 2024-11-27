"use client";
import React, { FC, useEffect, useMemo, useState } from "react"
import {  Container } from "react-web-layout-components"
import styles from './page.module.scss'
import Content from "./components/Content";
import Header from "./components/Header";
import QrCode from "./components/LinkPage";
import useWindowSize from "@/helpers/hooks/window";
import { GalleryProvider } from "@/helpers/providers/gallery";
import { Gallery } from "@/lib/types/Gallery";
import { UserProvider } from "@/helpers/providers/user";
import useLocalStorage, { setCookie } from "@/helpers/hooks/localStorage";
import Password from "./components/Password";
import Sidebar, { MobileMenu } from "./components/Sidebar";

export enum AppPage {
    HOME = 'HOME',
    GALLERY = 'GALLERY',
    USER = 'USER',
    GALLERIES = 'GALLERIES'
}
const App: FC<{gallery: Gallery, password?: string}> =  ({gallery, password: propsPassword}) => {
    const {isMobile} = useWindowSize()
    const [showSidebar, setShowSidebar] = useState(false)
    const [showQrCode, setShowQrCode] = useState(false)
    const [page, setPage] = useState(AppPage.HOME)
    const [password, setPassword] = useLocalStorage<string | null>(gallery.id, propsPassword || null)
    const [cleared, setCleared] = useState(password === gallery.password)
    
    useEffect(() => {
        if (password && password === gallery.password) {
            setCleared(true)
            setCookie(gallery.id, gallery.password)
            
        }
    }, [password])

    const handlePageChange = (newPage: AppPage) => {
        setPage(newPage)
        setShowSidebar(false)
    }
    const sidebarOpen = useMemo(() => isMobile && showSidebar, [showSidebar, isMobile])
    return (
        <UserProvider galleryId={gallery.id}>
            <GalleryProvider gallery={gallery}>
                <Container as='main'className={styles.app}>
                    {
                        cleared ? (
                        <>
                            <Header onMenuClick={() => setShowSidebar(true)} onQrClick={() => setShowQrCode(true)} />
                            {showQrCode && <QrCode onClose={() => setShowQrCode(false)} open={showQrCode}/>}
                            <Sidebar page={page} onPageChange={handlePageChange} onClose={() => setShowSidebar(false)} />
                            <MobileMenu page={page} onPageChange={handlePageChange} open={sidebarOpen} onClose={() => setShowSidebar(false)} />
                            <Content page={page} onQrClick={() => setShowQrCode(true)}/>
                            {/* {showUploadConfirmation && <Upload /> } */}
                        </>
                        ): (
                            <Password password={password || ''} setPassword={setPassword} name={gallery.name}/>
                        )}
                </Container>
            </GalleryProvider>
        </UserProvider>
    )
}

export default App;