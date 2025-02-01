"use client";

import { menuIcon, qrcodeIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React, { FC } from "react"
import { Container } from "react-web-layout-components"
import Image from "next/image"
import styles from './Header.module.scss'
import useNavigation from "@/helpers/providers/navigation";


const Header: FC<{ onQrClick: () => void}> = ({onQrClick}) => {
    const {setShowSidebar} = useNavigation()
    return (
        <Container as='header' className={styles.header} justify='space-between'>
            <Container className={styles.headerItem} onClick={() => setShowSidebar(true)}>
                <FontAwesomeIcon icon={menuIcon} className={styles.icon}/>
            </Container>
            <Container className={styles.wordmarkContainer} padding={0.5}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                </Link>
            </Container>
            <Container className={styles.headerItem} onClick={onQrClick}>
                <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon}/>
            </Container>
        </Container>
    )
}

export default Header