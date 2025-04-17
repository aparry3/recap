import React, { FC } from "react";
import Link from "next/link";
import { Container, Column, Row, Text } from "react-web-layout-components";
import styles from './Footer.module.scss';
import Image from "next/image";


const Footer: FC = () => {
    return (
        <Container  className={styles.footer} padding={2}>
            <Container style={{flexGrow: 1}}>
                <Column padding={1}>
                    <Text size={1.2} weight={600}>Ready to collect all your wedding photos?</Text>
                    <Container padding={1}>
                        <Link href='/create' className={styles.link}>
                            <Container className={styles.actionButton} padding={0.5}>
                                <Text size={1.2} weight={700}>Create Your Wedding Gallery</Text>
                            </Container>
                        </Link>
                    </Container>
                </Column>
            </Container>
            <Column className={styles.branding}>
                <Row className={styles.brandingRow}>
                    <Image src='/branding/wordmarkInverse.png' alt='Recap wedding photo sharing platform' layout='intrinsic' height={100} width={100}/>
                </Row>
                <Row className={styles.brandingRow}>
                    <Text>The ultimate wedding photo sharing platform that collects every moment from every guest in one beautiful gallery. No app required, unlimited uploads, and easy organization of all your cherished memories.</Text>
                </Row>    
                <Row className={styles.brandingRow}>
                    <Text>Recap is a property of Parry Technology and Media LLC</Text>
                </Row>
                <Row className={styles.brandingRow}>
                    <Link href="/terms" className={styles.link}>
                        <Text>Terms and Conditions</Text>
                    </Link>
                    <Text style={{ margin: '0 0.5rem' }}>|</Text>
                    <Link href="/privacy" className={styles.link}>
                        <Text>Privacy Policy</Text>
                    </Link>
                </Row>
            </Column>
        </Container>
    )
}

export default Footer;