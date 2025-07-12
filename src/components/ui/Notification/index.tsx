import {FC} from "react";
import { Container} from "react-web-layout-components";
import styles from './Notifications.module.scss'


const Notification: FC<{open: boolean, distance?: number,children: React.ReactNode}> = ({open, children, distance}) => {

    const translateY = !open && distance !== undefined
    ? `translateY(${Math.min(-100 + distance, 0)}%)` // Ensure it doesn't go beyond 0%
    : (open ? 'translateY(0)' : 'translateY(-100%)');

// Disable transition during dragging for smooth following
    const transitionStyle = distance !== undefined
        ? { transition: 'none' }
        : { transition: 'transform 0.5s ease-in-out' };

    return (
        <Container
            className={`${styles.notificationContainer} ${open && distance === undefined ? styles.show : ''}`}
            style={{
                transform: translateY,
                ...transitionStyle,
            }}
        >
            <Container className={styles.notification}>
                {children}
            </Container>
        </Container>
    )
}
export default Notification