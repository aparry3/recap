"use client";
import React, { FC, useEffect, useState } from "react"
import {  Container } from "react-web-layout-components"
import styles from './page.module.scss'
import Content from "./components/Content";
import Header from "./components/Header";
import QrCode from "./components/LinkPage";
import { GalleryProvider } from "@/helpers/providers/gallery";
import { Gallery } from "@/lib/types/Gallery";
import { UserProvider } from "@/helpers/providers/user";
import useLocalStorage, { setCookie } from "@/helpers/hooks/localStorage";
import Password from "./components/Password";
import Sidebar, { MobileMenu } from "./components/Sidebar";
import { AlbumsProvider } from "@/helpers/providers/albums";
import { NavigationProvider } from "@/helpers/providers/navigation";
import { AlbumMediaData } from "@/lib/types/Album";
import TutorialOverlay from "./components/TutorialOverlay";

export enum AppPage {
    HOME = 'HOME',
    GALLERY = 'GALLERY',
    USER = 'USER',
    GALLERIES = 'GALLERIES'
}
const App: FC<{gallery: Gallery, password?: string, album?: AlbumMediaData}> =  ({gallery, password: propsPassword, album}) => {
    const [showQrCode, setShowQrCode] = useState(false)
    const [password, setPassword] = useLocalStorage<string | null>(gallery.id, propsPassword || null)
    const [cleared, setCleared] = useState(password === gallery.password)
    const [showInfo, setShowInfo] = useState(false)
    useEffect(() => {
        if (password && password === gallery.password) {
            setCleared(true)
            setCookie(gallery.id, gallery.password)
        }
    }, [password])
    
    return (
        <UserProvider gallery={gallery}>
            <GalleryProvider gallery={gallery}>
                <AlbumsProvider galleryId={gallery.id}>
                    <NavigationProvider album={album}>
                    <Container as='main'className={styles.app}>
                        {
                            cleared ? (
                            <>
                                <Header onQrClick={() => setShowQrCode(true)}/>
                                {showQrCode && <QrCode onClose={() => setShowQrCode(false)} open={showQrCode}/>}
                                <Sidebar onInfoClick={() => setShowInfo(true)}/>
                                <MobileMenu onInfoClick={() => setShowInfo(true)}/>
                                <Content onQrClick={() => setShowQrCode(true)} onInfoClick={() => setShowInfo(true)} />
                                <TutorialOverlay />
                                {/* {showUploadConfirmation && <Upload /> } */}
                            </>
                            ): (
                                <Password password={password || ''} setPassword={setPassword} name={gallery.name}/>
                            )}
                    </Container>
                    </NavigationProvider>
                </AlbumsProvider>
            </GalleryProvider>
        </UserProvider>
    )
}

export default App;