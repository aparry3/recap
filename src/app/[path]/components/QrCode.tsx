"use client";

import { downloadIcon, xIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './QrCode.module.scss'
import Image from "next/image"
import Heading from "./Heading";

const QrCode: FC<{open: boolean, onClose: () => void}> = ({onClose, open}) => {
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
             <Column style={{ width: '100%', flexGrow: 1}} justify="center">
                <Container className={styles.qrcodeContainer} padding={2}>
                    <Image src='/qrcode.png' alt='qrcode' layout='intrinsic' height={150} width={150}/>
                </Container>
             </Column>
        </Column>
    ) : <></>
}

export default QrCode;