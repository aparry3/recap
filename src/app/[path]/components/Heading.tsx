"use client";
import Button from "@/components/Button"
import { qrcodeIcon } from "@/lib/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Column, Container, Row, Text } from "react-web-layout-components"
import styles from './Heading.module.scss'
import { FC } from "react";
import { usePathname } from "next/navigation";

const Heading: FC<{onQrClick?: () => void}> = ({onQrClick}) => {
    const pathname = usePathname()
    const name = pathname.replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <Container className={styles.heading} justify="space-between">
        <Column className={styles.titleContainer} padding>
            <Row className={styles.title}>
                <Text className={styles.titleText} size={3}>{name}</Text>
            </Row>
            <Row className={styles.subtitleContainer} padding={[0, 0.5]}>
                <Container className={styles.subtitle} padding={[0, 1, 0, 0]}>
                    <Text className={styles.subtitleText} size={1.2}>{new Date().toDateString()}</Text>
                </Container>
                <Container className={styles.dashVertical}/>
                <Container className={styles.subtitle} padding={[0, 0, 0, 1]}>
                    <Text className={styles.subtitleText} size={1.2}>10 Contributors</Text>
                </Container>
            </Row>
        </Column>
        {onQrClick && (
        <Container className={styles.actionContainer} padding>
            <Container padding={[0, 0.5]}>
                <Container padding={0.5} className={styles.iconContainer} onClick={onQrClick}>
                    <FontAwesomeIcon icon={qrcodeIcon} className={styles.icon} />
                </Container>
            </Container>
            <Container padding={[0, 0.5]}>
                <Button onClick={() => {}}>
                    <Text size={1} weight={500}>+ Upload</Text>
                </Button>
            </Container>
        </Container>)}
    </Container>
    )
}

export default Heading