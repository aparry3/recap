import { generateCustomQRCodePNG } from "@/helpers/qrCode"
import { FC, useEffect, useState } from "react"
import { Container } from "react-web-layout-components"
import styles from './QrCode.module.scss'


const QrCode: FC<{url: string, color: string}> = ({url, color}) => {
    
    const [qrCode, setQrCode] = useState<string | null>(null)
    
    const homeQr = '/qrcode.png'
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

    useEffect(() => {
        console.log(qrCode)
    }, [qrCode])
    return (
        <Container className={styles.qrCodeContainer}>
            <img className={styles.qrCode} src={qrCode || homeQr} alt="QR Code" />
        </Container>
    )
}
export default QrCode