import { Container, Row, Text } from "react-web-layout-components"
import styles from './SyncStatus.module.scss'
import { FC } from "react"
import Notification from "../Notification"


const SyncStatusComponent: FC<{open: boolean}> = ({open}) => {

  return (
      <Notification open={open}>
        <Row className={styles.refreshStatus} justify="space-between">
            <Container className={styles.status} padding={0.5}>
              <Container className={styles.refreshingIcon} />
            </Container>
            <Container>
                <Text size={1.4}>Syncing wedding website...</Text>
            </Container>
            <Container className={styles.status} padding={0.5}>
            </Container>
        </Row>
      </Notification>
    )  
}

export default SyncStatusComponent