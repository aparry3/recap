import { FC } from "react"
import { Container } from "react-web-layout-components"
import styles from './QrCode.module.scss'


const QrCode: FC<{src?: string}> = ({src}) => {
    
    const homeQr = '/qrcode.png'

    return (
        <Container className={styles.qrCodeContainer}>
            <img className={styles.qrCode} src={src || homeQr} alt="QR Code" />
        </Container>
    )
}
export default QrCode