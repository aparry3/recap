import { Column, Container, Text } from 'react-web-layout-components'
import styles from './Verification.module.scss'

const VerificationPage = async ({params}: {params: Promise<{verificationId: string}>}) => {
    const { verificationId } = await params
    return (
        <Container as="main" className={styles.page}>
            <Column className={styles.card}>
                <Text size={1.1} className={styles.eyebrow}>Recap</Text>
                <Text size={2.2} weight={600}>Verify your email</Text>
                <Text size={1.1}>Confirm to securely continue to your Recap galleries.</Text>
                <form action={`/api/auth/verify/${verificationId}`} method="post">
                    <button type="submit" className={styles.button}>Verify email</button>
                </form>
                <Text size={0.9}>Verification links expire after 24 hours and can only be used once.</Text>
            </Column>
        </Container>
    )
}

export default VerificationPage
