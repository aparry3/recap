"use client";

import { checkIcon, downloadIcon, leftIcon, linkIcon, rightIcon, xIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Text, Column, Container, Row } from "react-web-layout-components"
import styles from './LinkPage.module.scss'
import Image from "next/image"
import Heading from "../Heading";
import useGallery from "@/helpers/providers/gallery";
import QrCode from "@/components/QrCode";
import { generateCustomQRCodePNG } from "@/helpers/qrCode";
import { downloadDataUrlAsPng } from "@/helpers/files";


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
    const {gallery, album} = useGallery()
    const [color, setColor] = useState(Color.PRIMARY)
    const [backgroundColor, setBackgroundColor] = useState(Color.BACKGROUND_LIGHT)
    const [copied, setCopied] = useState(false);
    const albumQP = useMemo(() => album ? `&album=${album.id}` : '', [album])
    const url = useMemo(() => `${BASE}/${gallery.path}?password=${gallery.password}${albumQP}`, [gallery, albumQP])

    const copyToClipboard = useCallback(async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset state after 2 seconds
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      }, [url]);
  
  
    const [qrCode, setQrCode] = useState<string | undefined>()
    
    const logo = '/branding/icon.svg'


    const generate = async () => {
        const qrCode = await generateCustomQRCodePNG(url, {
            size: 1000,
            foregroundColor: color,
            backgroundColor: '#00000000',
            imageSrc: logo,
            imageSize: 0.2,
        })
        setQrCode(qrCode)
    }

    useEffect(() => {
        generate()
    }, [color, window])


    const downloadQr = useCallback(() => {
        if (qrCode) {
            downloadDataUrlAsPng(qrCode)
        }
    }, [qrCode])

    return open ?(
        <Column className={styles.qrcodePage}>
            <Container className={`${styles.notificationContainer} ${copied ? styles.show : ''}`}>
                <Container className={styles.notification}>
                    <Container className={styles.notificationIcon}>
                        <FontAwesomeIcon icon={checkIcon} className={styles.icon}/>
                    </Container>
                    <Text size={1.1} weight={600}>Copied to clipboard</Text>
                </Container>
            </Container>
            <Container className={styles.header} padding justify="space-between">
                <Container className={styles.headerIcon} onClick={onClose}>
                    <FontAwesomeIcon icon={xIcon} className={styles.icon}/>
                </Container>
                <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                <Container className={styles.headerIcon} onClick={() => downloadQr()}>
                    {qrCode ? <FontAwesomeIcon icon={downloadIcon} className={styles.icon}/> : <Container />}
                </Container>    
             </Container>
             <Column className={styles.heading}>
                <Heading />
             </Column>
             <Container className={styles.contentContainer}>
                <Column className={styles.shareContainer}>
                    <Container className={styles.section}>
                        <Container className={styles.linkContainer} onClick={copyToClipboard}>
                            <Container className={styles.linkIcon}>
                                <FontAwesomeIcon icon={linkIcon} className={styles.icon}/>
                            </Container>
                            <Container className={styles.text}>
                                <Text size={1.1}>
                                {gallery.path}
                                </Text>
                            </Container>
                        </Container>
                        <Container className={styles.buttonContainer}>
                            <Container className={styles.button} onClick={downloadQr}>
                                <FontAwesomeIcon icon={downloadIcon} className={styles.icon}/>
                            </Container>
                        </Container>
                    </Container>
                    <Column className={styles.qrCodeContainer}>
                        <Column className={styles.qrCode} style={{background: backgroundColor}}>
                            <QrCode src={qrCode}/>
                        </Column>
                        <Container className={styles.qrOptions}>
                            <ColorContainer foregroundColor={color} backgroundColor={color} setForeground={setColor} setBackground={setBackgroundColor}/>
                        </Container>
                    </Column>
                    <Container className={styles.rightIcon}>
                        <FontAwesomeIcon icon={rightIcon} className={styles.icon}/>
                    </Container>
                </Column>
                <Column className={styles.passcodeContainer}>
                    <Container className={styles.section}>
                        <Text size={2.5}>
                            Passcode
                        </Text>
                    </Container>
                    <Container className={styles.lettersContainer}>
                        <Container className={styles.letterContainer}>
                            <Container className={styles.letter}>
                                <Text className={styles.letterText}>{gallery.password.charAt(0)}</Text>
                            </Container>
                        </Container>
                        <Container className={styles.letterContainer}>
                            <Container className={styles.letter}>
                                <Text className={styles.letterText}>{gallery.password.charAt(1)}</Text>
                            </Container>
                        </Container>
                        <Container className={styles.letterContainer}>
                            <Container className={styles.letter}>
                                <Text className={styles.letterText}>{gallery.password.charAt(2)}</Text>
                            </Container>
                        </Container>
                        <Container className={styles.letterContainer}>
                            <Container className={styles.letter}>
                                <Text className={styles.letterText}>{gallery.password.charAt(3)}</Text>
                            </Container>
                        </Container>
                    </Container>
                    <Container className={styles.leftIcon}>
                        <FontAwesomeIcon icon={leftIcon} className={styles.icon}/>
                    </Container>
                </Column>
             </Container>
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