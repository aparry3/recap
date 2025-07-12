import { Container, Row, Text } from "react-web-layout-components"
import styles from './RefreshStatus.module.scss'
import { FC, useEffect, useMemo } from "react"
import Notification from "../Notification"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkIcon, downloadIcon } from "@/lib/icons"

export enum RefreshStatus {
  IDLE = 'Pull to refresh',
  REFRESHING = 'Refreshing...',
  DONE = 'Done'
}

const RefreshStatusComponent: FC<{open: boolean, distance?: number, refreshStatus: RefreshStatus}> = ({open, distance, refreshStatus}) => {

  const refreshIcon = useMemo(() => {
    switch (refreshStatus) {
      case RefreshStatus.IDLE:
        return <FontAwesomeIcon icon={downloadIcon} className={`${styles.icon} ${styles.idle}`}/>
      case RefreshStatus.REFRESHING:
        return <Container className={styles.refreshingIcon} />
      case RefreshStatus.DONE:
        return <FontAwesomeIcon icon={checkIcon} className={`${styles.icon} ${styles.done}`}/>
      default:
        return <></>
    }
  }, [refreshStatus])

  return (
        <Notification open={open} distance={distance}>
        <Row className={styles.refreshStatus} justify="space-between">
            <Container className={styles.status} padding={0.5}>
                {refreshIcon}
            </Container>
            <Container>
                <Text size={1.4}>{refreshStatus}</Text>
            </Container>
            <Container className={styles.status} padding={0.5}>
            </Container>
        </Row>
      </Notification>
    )  
}

export default RefreshStatusComponent