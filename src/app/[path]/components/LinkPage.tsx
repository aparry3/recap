"use client";

import { downloadIcon, xIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useState } from "react"
import { Column, Container } from "react-web-layout-components"
import styles from './LinkPage.module.scss'
import Image from "next/image"
import Heading from "./Heading";
import useGallery from "@/helpers/providers/gallery";
import QrCode from "@/components/QrCode";


const BASE = process.env.NEXT_PUBLIC_BASE_URL
enum Color {
    PRIMARY = '#CA9B8C',
    SECONDARY = '#CFDFDD',

    PRIMARY_DARK = '#926C60',
    SECONDARY_DARK = '#214F4B',

    PRIMARY_LIGHT = '#EFD5D0',

    BACKGROUND_DARK = '#FFF5F3',
    BACKGROUND_MEDIUM = '#FDF8F7',
    BACKGROUND_LIGHT = '#FFFFFF',

    TEXT_DARK = '#1D1C1C'
}

const LinkPage: FC<{open: boolean, onClose: () => void}> = ({onClose, open}) => {
    const {gallery} = useGallery()
    const [color, setColor] = useState(Color.PRIMARY)
    return open ?(
        <Column className={styles.qrcodePage}>
            <Container className={styles.header} padding justify="space-between">
                <Container className={styles.headerIcon} onClick={onClose}>
                    <FontAwesomeIcon icon={xIcon} className={styles.icon}/>
                </Container>
                <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                <Container className={styles.headerIcon}>
                    <FontAwesomeIcon icon={downloadIcon} className={styles.icon}/>
                </Container>    
             </Container>
             <Column className={styles.heading}>
            <Heading />
             </Column>
             <Column className={styles.linkContainer}>
                <Column className={styles.qrCodeContainer}>
                    <QrCode url={`${BASE}/${gallery.path}`} color={color}/>
                </Column>
                <ColorContainer color={color} setColor={setColor}/>
             </Column>
        </Column>
    ) : <></>
}

const ColorContainer: FC<{color: Color, setColor: (color: Color) => void}> = ({color, setColor}) => {
    return (
        <Container className={styles.colorsContainer}>
            <Container className={`${styles.colorContainer} ${color === Color.PRIMARY ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.PRIMARY)} className={`${styles.color} ${color === Color.PRIMARY ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.SECONDARY ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.SECONDARY)} className={`${styles.color} ${color === Color.SECONDARY ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.PRIMARY_DARK ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.PRIMARY_DARK)} className={`${styles.color} ${color === Color.PRIMARY_DARK ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY_DARK}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.PRIMARY_LIGHT ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.PRIMARY_LIGHT)} className={`${styles.color} ${color === Color.PRIMARY_LIGHT ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY_LIGHT}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.SECONDARY_DARK ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.SECONDARY_DARK)} className={`${styles.color} ${color === Color.SECONDARY_DARK ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY_DARK}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.BACKGROUND_DARK ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.BACKGROUND_DARK)} className={`${styles.color} ${color === Color.BACKGROUND_DARK ? styles.active : ''}`} style={{backgroundColor: Color.BACKGROUND_DARK}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.BACKGROUND_LIGHT ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.BACKGROUND_LIGHT)} className={`${styles.color} ${color === Color.BACKGROUND_LIGHT ? styles.active : ''}`} style={{backgroundColor: Color.BACKGROUND_LIGHT}}/>
            </Container>
            <Container className={`${styles.colorContainer} ${color === Color.BACKGROUND_MEDIUM ? styles.activeContainer : ''}`}>
                <Container onClick={() => setColor(Color.BACKGROUND_MEDIUM)} className={`${styles.color} ${color === Color.BACKGROUND_MEDIUM ? styles.active : ''}`} style={{backgroundColor: Color.BACKGROUND_MEDIUM}}/>
            </Container>
        </Container>
    )
}

export default LinkPage;