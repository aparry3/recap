"use client";
import React, { FC, useMemo, useState } from "react"
import {  Container } from "react-web-layout-components"
import styles from './page.module.scss'
import Content from "./components/Content";
import Header from "./components/Header";
import Sidebar, { MobileMenu } from "./components/Sidebar";
import QrCode from "./components/QrCode";
import useWindowSize from "@/helpers/hooks/window";
import { usePathname } from "next/navigation";

export enum Page {
    HOME = 'HOME',
    GALLERY = 'GALLERY',
    USER = 'USER'
}
const Dashboard: FC =  ({}) => {
    const {isMobile} = useWindowSize()
    const [showSidebar, setShowSidebar] = useState(false)
    const [showQrCode, setShowQrCode] = useState(false)
    const [page, setPage] = useState(Page.HOME)

    const sidebarOpen = useMemo(() => isMobile && showSidebar, [showSidebar, isMobile])
    return (
        <Container as='main'className={styles.app}>
            <Header onMenuClick={() => setShowSidebar(true)} onQrClick={() => setShowQrCode(true)} />
            {showQrCode && <QrCode onClose={() => setShowQrCode(false)} open={showQrCode}/>}
            <Sidebar page={page} onPageChange={(newPage: Page) => setPage(newPage)} onClose={() => setShowSidebar(false)} />
            <MobileMenu page={page} onPageChange={(newPage: Page) => setPage(newPage)} open={sidebarOpen} onClose={() => setShowSidebar(false)} />
            <Content page={page}onQrClick={() => setShowQrCode(true)}/>
        </Container>
    )
}

export default Dashboard;