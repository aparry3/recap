// One-off smoke test: sends a real verification email through the app's Resend client.
// Usage: pnpm exec tsx --env-file=.env.production.local scripts/send-test-verification.ts you@example.com
import { emailClient } from '../src/lib/email'

const to = process.argv[2]
if (!to) {
  console.error('Usage: tsx scripts/send-test-verification.ts <recipient-email>')
  process.exit(1)
}

emailClient.sendVerificationEmail(to, {
  galleryName: 'Verification Smoke Test',
  name: 'Aaron',
  buttonUrl: 'https://www.ourweddingrecap.com/create',
}).then((sent) => {
  console.log(sent ? `Verification email accepted by Resend for ${to}` : 'Resend send FAILED — see error above')
  process.exit(sent ? 0 : 1)
})
