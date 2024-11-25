import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './UploadStatus.module.scss'
import { FC } from "react"
import Notification from "../Notification"
import { CircularProgress } from "../Notification/CircleProgress"

const UploadStatus:FC<{total?: number, complete?: number}> = ({total, complete}) => {
    return (
        <Notification open={total !== undefined && total > 0 && complete !== undefined}>
        <Row className={styles.uploadStatus}>
          <Container className={styles.status} padding={0.5}>
            <CircularProgress percentage={(complete || 0) / (total || 1) * 100 || 0}>
              <span id="percentage">{complete}</span>/<span>{total}</span>
            </CircularProgress>
          </Container>
          <Column className={styles.detailsmedia} padding={0.5}>
            <Container>
                <Text size={1.4}>Uploading Media</Text>
            </Container>
            <Container className={styles.subtext}>
                <Text className={styles.subtext} size={0.9}>Please do not refresh or close this window</Text>
            </Container>
          </Column>
        </Row>
      </Notification>
    )  
}

export default UploadStatus