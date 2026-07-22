import { Column, Container, Text } from 'react-web-layout-components';
import styles from '@/app/verification/[verificationId]/Verification.module.scss';

export default async function AdminVerificationPage({
  params,
}: {
  params: Promise<{verificationId: string}>;
}) {
  const {verificationId} = await params;
  return (
    <Container as="main" className={styles.page}>
      <Column className={styles.card}>
        <Text size={1.1} className={styles.eyebrow}>Our Wedding Recap</Text>
        <Text size={2.2} weight={600}>Admin sign in</Text>
        <Text size={1.1}>Confirm to securely continue to the admin dashboard.</Text>
        <form action={`/api/admin/verify/${verificationId}`} method="post">
          <button type="submit" className={styles.button}>Continue to Admin</button>
        </form>
        <Text size={0.9}>Sign-in links expire after 24 hours and can only be used once.</Text>
      </Column>
    </Container>
  );
}
