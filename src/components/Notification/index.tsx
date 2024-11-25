import {FC} from "react";
import { Container} from "react-web-layout-components";
import styles from './Notifications.module.scss'


const Notification: FC<{open: boolean, children: React.ReactNode}> = ({open, children}) => {
    return (
        <Container className={`${styles.notificationContainer} ${open ? styles.show : ''}`}>
            <Container className={styles.notification}>
                {children}
            </Container>
        </Container>
    )
}
export default Notification