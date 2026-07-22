// One-off smoke test: sends a real verification email through the app's SendGrid client.
// Usage: pnpm exec tsx --env-file=.env.production.local scripts/send-test-verification.ts you@example.com
import { sendGridClient } from '../src/lib/email'

const to = process.argv[2]
if (!to) {
  console.error('Usage: tsx scripts/send-test-verification.ts <recipient-email>')
  process.exit(1)
}

sendGridClient.sendVerificationEmail(to, {
  galleryName: 'Verification Smoke Test',
  name: 'Aaron',
  buttonUrl: 'https://www.ourweddingrecap.com/create',
}).then((sent) => {
  console.log(sent ? `Verification email accepted by SendGrid for ${to}` : 'SendGrid send FAILED — see error above')
  process.exit(sent ? 0 : 1)
})
