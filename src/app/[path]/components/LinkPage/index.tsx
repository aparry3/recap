"use client";

import { albumIcon, checkIcon, copyIcon, downloadIcon, leftIcon, linkIcon, rightIcon, xIcon } from "@/lib/icons"
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
import useAlbums from "@/helpers/providers/albums";
import AlbumSelect from "@/components/AlbumSelect";


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
    const {albums, setAlbum, createAlbum: createNewAlbum} = useAlbums()
    const [color, setColor] = useState(Color.PRIMARY)
    const [backgroundColor, setBackgroundColor] = useState(Color.BACKGROUND_LIGHT)
    const [copied, setCopied] = useState(false);
    const [showAlbumSelect, setShowAlbumSelect] = useState(false);
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
    const [inverseQrCode, setInverseQrCode] = useState<string | undefined>()

    const logo = '/branding/icon.svg'

    const chooseAlbum = useCallback(() => {
        setShowAlbumSelect(true);
    }, []);
    
    const confirmAlbum = useCallback((confirmedAlbumIds: string[]) => {
        if (confirmedAlbumIds.length > 0) {
            // With singleSelect=true, there will only be one album in the array
            setAlbum(confirmedAlbumIds[0]);
        }
        setShowAlbumSelect(false);
    }, [setAlbum]);
    
    const cancelAlbumSelect = useCallback(() => {
        setShowAlbumSelect(false);
    }, []);

    const clearAlbum = useCallback(() => {
        setAlbum(undefined);
    }, [setAlbum]);

    const generate = async () => {
        const _qrCode = await generateCustomQRCodePNG(url, {
            size: 1000,
            foregroundColor: color,
            backgroundColor: '#00000000',
            imageSrc: logo,
            imageSize: 0.2,
        })

        const _inverseQrCode = await generateCustomQRCodePNG(url, {
            size: 1000,
            foregroundColor: Color.BACKGROUND_LIGHT,
            backgroundColor: '#00000000',
            imageSrc: logo,
            imageSize: 0.2,
        })

        setQrCode(_qrCode)
        setInverseQrCode(_inverseQrCode)
    }

    useEffect(() => {
        generate()
    }, [color, window, album])


    const downloadQr = useCallback(() => {
        if (qrCode) {
            downloadDataUrlAsPng(qrCode)
        }
    }, [qrCode])

    const copyQrToClipboard = useCallback(async () => {
        if (qrCode) {
            try {
                // Convert base64 to blob
                const response = await fetch(qrCode);
                const blob = await response.blob();
                
                // Copy to clipboard
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ]);
                
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy QR code: ', err);
            }
        }
    }, [qrCode]);

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
                <Heading showGalleryName={true}/>
             </Column>
             <Container className={styles.contentContainer}>
                <Column className={styles.shareContainer}>
                    <Container className={styles.section}>
                        <Container className={styles.buttonContainer}>
                            <Container className={styles.button} onClick={chooseAlbum}>
                                <Container className={styles.buttonIcon}>
                                    <FontAwesomeIcon icon={albumIcon} className={styles.icon}/>
                                </Container>
                                <Container className={styles.buttonText}>
                                    <Text>{album ? album.name : 'Choose Album'}</Text>
                                </Container>
                                {album && (
                                    <Container className={styles.clearButton} onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering chooseAlbum
                                        clearAlbum();
                                    }}>
                                        <FontAwesomeIcon icon={xIcon} className={`${styles.icon} ${styles.clearIcon}`}/>
                                    </Container>
                                )}
                            </Container>
                        </Container>
                    </Container>
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
                        <Column className={`${styles.qrCode}`} style={{background: backgroundColor}} onClick={copyQrToClipboard} >
                            <QrCode src={qrCode} className={styles.qrCodeImage}/>
                            <QrCode src={inverseQrCode} className={styles.inverseQrCode}/>
                            <Container className={styles.copy} style={{background: backgroundColor}}>
                                <FontAwesomeIcon icon={copyIcon} className={styles.copyIcon}/>
                            </Container>
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
            {showAlbumSelect && 
                <Container className={styles.albumSelectOverlay}>
                    <AlbumSelect 
                        albums={albums} 
                        createAlbum={createNewAlbum} 
                        onConfirm={confirmAlbum} 
                        onCancel={cancelAlbumSelect}
                        singleSelect={true}
                    />
                </Container>
            }
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
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.TEXT_DARK ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.BACKGROUND_LIGHT)} className={`${styles.color} ${foregroundColor === Color.BACKGROUND_LIGHT ? styles.active : ''}`} style={{backgroundColor: Color.BACKGROUND_LIGHT}}/>
                    </Container>
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.SECONDARY ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.SECONDARY)} className={`${styles.color} ${foregroundColor === Color.SECONDARY ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY}}/>
                    </Container>
                    <Container className={`${styles.colorContainer} ${foregroundColor === Color.SECONDARY_DARK ? styles.activeContainer : ''}`}>
                        <Container onClick={() => setForeground(Color.SECONDARY_DARK)} className={`${styles.color} ${foregroundColor === Color.SECONDARY_DARK ? styles.active : ''}`} style={{backgroundColor: Color.SECONDARY_DARK}}/>
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