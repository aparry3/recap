"use client";

import { downloadIcon, xIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useState } from "react"
import { Column, Container, Row } from "react-web-layout-components"
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
    const [backgroundColor, setBackgroundColor] = useState(Color.BACKGROUND_LIGHT)

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
                <Column className={styles.qrCodeContainer} style={{background: backgroundColor}}>
                    <QrCode url={`${BASE}/${gallery.path}`} color={color}/>
                </Column>
                <ColorContainer foregroundColor={color} backgroundColor={color} setForeground={setColor} setBackground={setBackgroundColor}/>
             </Column>
        </Column>
    ) : <></>
}

const ColorContainer: FC<{foregroundColor: Color, backgroundColor: Color, setForeground: (color: Color) => void, setBackground: (color: Color) => void}> = ({foregroundColor, backgroundColor, setForeground, setBackground}) => {
    return (
        <Container className={styles.colorChooserContainer}>
            <Column className={styles.colorsContainer} >
                <Row>
                <Container className={`${styles.colorContainer} ${foregroundColor === Color.PRIMARY_LIGHT ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.PRIMARY_LIGHT)} className={`${styles.color} ${foregroundColor === Color.PRIMARY_LIGHT ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY_LIGHT}}/>
                    </Container>
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.PRIMARY ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.PRIMARY)} className={`${styles.color} ${foregroundColor === Color.PRIMARY ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY}}/>
                    </Container>
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.PRIMARY_DARK ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.PRIMARY_DARK)} className={`${styles.color} ${foregroundColor === Color.PRIMARY_DARK ? styles.active : ''}`} style={{backgroundColor: Color.PRIMARY_DARK}}/>
                    </Container>
                </Row>
                <Row>
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.SECONDARY ? styles.activeContainer : ''}`}>
                            <Container onClick={() => setForeground(Color.SECONDARY)} className={`${styles.color} ${foregroundColor === Color.SECONDARY ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY}}/>
                        </Container>
                        <Container className={`${styles.colorContainer} ${foregroundColor === Color.SECONDARY_DARK ? styles.activeContainer : ''}`}>
                            <Container onClick={() => setForeground(Color.SECONDARY_DARK)} className={`${styles.color} ${foregroundColor === Color.SECONDARY_DARK ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY_DARK}}/>
                        </Container>
                        <Container className={`${styles.colorContainer} ${foregroundColor === Color.TEXT_DARK ? styles.activeContainer : ''}`}>
                            <Container onClick={() => setForeground(Color.TEXT_DARK)} className={`${styles.color} ${foregroundColor === Color.TEXT_DARK ? styles.active : ''}`} style={{backgroundColor: Color.TEXT_DARK}}/>
                        </Container>
                </Row>
            </Column>
            <Container className={styles.verticalDash} />
            <Column className={styles.colorsContainer} >
                <Container className={`${styles.colorContainer} ${backgroundColor === Color.BACKGROUND_LIGHT ? styles.activeContainer : ''}`}>
                    <Container onClick={() => setBackground(Color.BACKGROUND_LIGHT)} className={`${styles.color} ${backgroundColor === Color.BACKGROUND_LIGHT ? styles.active : ''}`} style={{backgroundColor: Color.BACKGROUND_LIGHT}}/>
                </Container>
                <Container className={`${styles.colorContainer} ${backgroundColor === Color.TEXT_DARK ? styles.activeContainer : ''}`}>
                    <Container onClick={() => setBackground(Color.TEXT_DARK)} className={`${styles.color} ${backgroundColor === Color.TEXT_DARK ? styles.active : ''}`} style={{backgroundColor: Color.TEXT_DARK}}/>
                </Container>
            </Column>

        </Container>
    )
}

export default LinkPage;