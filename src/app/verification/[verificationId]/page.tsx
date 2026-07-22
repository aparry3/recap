import { Column, Container, Text } from 'react-web-layout-components'
import styles from './Verification.module.scss'

const VerificationPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{verificationId: string}>,
    searchParams: Promise<{gallery?: string}>,
}) => {
    const [{ verificationId }, query] = await Promise.all([params, searchParams])
    const action = query.gallery
        ? `/api/auth/verify/${verificationId}?gallery=${encodeURIComponent(query.gallery)}`
        : `/api/auth/verify/${verificationId}`
    return (
        <Container as="main" className={styles.page}>
            <Column className={styles.card}>
                <Text size={1.1} className={styles.eyebrow}>Our Wedding Recap</Text>
                <Text size={2.2} weight={600}>Verify your email</Text>
                <Text size={1.1}>Confirm to securely continue to your galleries on Our Wedding Recap.</Text>
                <form action={action} method="post">
                    <button type="submit" className={styles.button}>Verify email</button>
                </form>
                <Text size={0.9}>Verification links expire after 24 hours and can only be used once.</Text>
            </Column>
        </Container>
    )
}

export default VerificationPage
