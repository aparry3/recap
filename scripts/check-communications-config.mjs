import { existsSync } from 'node:fs'
import { resolveMx, resolveTxt } from 'node:dns/promises'
import process from 'node:process'

const args = process.argv.slice(2)
const environment = args.find((arg) => arg.startsWith('--environment='))?.split('=')[1] || 'production'
const envFile = args.find((arg) => arg.startsWith('--env-file='))?.split('=')[1] || '.env.local'
const networkEnabled = args.includes('--network')

if (!['production', 'staging'].includes(environment)) {
  console.error('Use --environment=production or --environment=staging')
  process.exit(2)
}

if (args.includes('--help')) {
  console.log('Usage: pnpm communications:check -- --environment=production|staging [--env-file=.env.local] [--network]')
  console.log('Checks presence and shape without printing secret values. --network also checks public policy pages, MX, and DMARC.')
  process.exit(0)
}

if (existsSync(envFile)) process.loadEnvFile(envFile)

const results = []
const record = (status, label, detail) => results.push({ status, label, detail })
const pass = (label, detail) => record('pass', label, detail)
const fail = (label, detail) => record('fail', label, detail)
const warn = (label, detail) => record('warn', label, detail)

function isPlaceholder(value) {
  return !value
    || /\[(?:secret|value|integer|address|token|key)|changeme|replace.?me|\.\.\./i.test(value)
}

function requireValue(name, options = {}) {
  const value = process.env[name]?.trim()
  if (isPlaceholder(value)) {
    fail(name, 'missing or still contains a placeholder')
    return null
  }
  if (options.minLength && value.length < options.minLength) {
    fail(name, `must contain at least ${options.minLength} characters`)
    return null
  }
  if (options.pattern && !options.pattern.test(value)) {
    fail(name, options.patternMessage || 'has an unexpected format')
    return null
  }
  pass(name, options.detail || 'configured')
  return value
}

function requireEmail(name) {
  return requireValue(name, {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'must be a valid email address',
  })
}

function requireHttpsUrl(name) {
  const value = process.env[name]?.trim()
  if (isPlaceholder(value)) {
    fail(name, 'missing or still contains a placeholder')
    return null
  }
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') throw new Error('not HTTPS')
    pass(name, 'configured as HTTPS')
    return url
  } catch {
    fail(name, 'must be a valid HTTPS URL')
    return null
  }
}

for (const name of [
  'POSTGRES_HOST',
  'POSTGRES_DATABASE',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET',
]) requireValue(name)

requireHttpsUrl('AWS_CLOUDFRONT_URL')
requireValue('OPENAI_API_KEY')

requireValue('TWILIO_ACCOUNT_SID', { pattern: /^AC[0-9a-f]{32}$/i, patternMessage: 'must be an AC-prefixed Twilio Account SID' })
requireValue('TWILIO_AUTH_TOKEN', { minLength: 20 })
requireValue('TWILIO_MESSAGING_SERVICE_SID', { pattern: /^MG[0-9a-f]{32}$/i, patternMessage: 'must be an MG-prefixed Messaging Service SID' })
requireValue('TWILIO_API_KEY', { pattern: /^SK[0-9a-f]{32}$/i, patternMessage: 'must be an SK-prefixed Twilio API Key SID' })
requireValue('TWILIO_API_SECRET', { minLength: 20 })

requireValue('SENDGRID_API_KEY', { pattern: /^SG\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, patternMessage: 'must look like a SendGrid API key' })
const sendgridEmail = requireEmail('SENDGRID_EMAIL')
const sendgridFromName = requireValue('SENDGRID_FROM_NAME')
requireEmail('SENDGRID_REPLY_TO_EMAIL')
const inboundEmail = requireEmail('SENDGRID_INBOUND_EMAIL')
requireEmail('ORDER_NOTIFICATION_EMAIL')
requireValue('SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID', { pattern: /^[1-9]\d*$/, patternMessage: 'must be a positive integer' })
requireValue('SENDGRID_EVENT_WEBHOOK_VERIFICATION_KEY', { minLength: 64 })
requireValue('SENDGRID_INBOUND_PARSE_VERIFICATION_KEY', { minLength: 64 })

if (sendgridFromName && sendgridFromName !== 'Our Wedding Recap') {
  fail('SENDGRID_FROM_NAME identity', 'must exactly match Our Wedding Recap')
} else if (sendgridFromName) {
  pass('SENDGRID_FROM_NAME identity', 'matches the campaign sender identity')
}
if (sendgridEmail && inboundEmail && sendgridEmail.toLowerCase() === inboundEmail.toLowerCase()) {
  fail('SendGrid address separation', 'SENDGRID_EMAIL and SENDGRID_INBOUND_EMAIL must be different')
} else if (sendgridEmail && inboundEmail) {
  pass('SendGrid address separation', 'outbound and Inbound Parse addresses are distinct')
}

const signingSecrets = ['AUTH_SESSION_SECRET', 'PREFERENCE_TOKEN_SECRET', 'CRON_SECRET']
  .map((name) => [name, requireValue(name, { minLength: 32 })])
  .filter(([, value]) => value)
if (new Set(signingSecrets.map(([, value]) => value)).size !== signingSecrets.length) {
  fail('Signing-secret separation', 'session, preference, and cron secrets must be unique')
} else if (signingSecrets.length === 3) {
  pass('Signing-secret separation', 'session, preference, and cron secrets are unique')
}

const postalAddress = requireValue('BUSINESS_POSTAL_ADDRESS')
if (postalAddress && (!/\d/.test(postalAddress) || /^united states$/i.test(postalAddress))) {
  fail('BUSINESS_POSTAL_ADDRESS completeness', 'must be a full physical address, registered PO Box, or registered commercial mailbox')
} else if (postalAddress) {
  pass('BUSINESS_POSTAL_ADDRESS completeness', 'contains a deliverable-address indicator')
}

const baseUrl = requireHttpsUrl('BASE_URL')
const publicBaseUrl = requireHttpsUrl('NEXT_PUBLIC_BASE_URL')
const expectedOrigin = environment === 'production'
  ? 'https://www.ourweddingrecap.com'
  : 'https://staging.ourweddingrecap.com'
for (const [name, url] of [['BASE_URL', baseUrl], ['NEXT_PUBLIC_BASE_URL', publicBaseUrl]]) {
  if (!url) continue
  if (url.origin !== expectedOrigin || url.pathname !== '/') {
    fail(`${name} canonical origin`, `must be exactly ${expectedOrigin}`)
  } else {
    pass(`${name} canonical origin`, `matches ${expectedOrigin}`)
  }
}
if (baseUrl && publicBaseUrl && baseUrl.origin !== publicBaseUrl.origin) {
  fail('Base URL agreement', 'BASE_URL and NEXT_PUBLIC_BASE_URL must use the same origin')
} else if (baseUrl && publicBaseUrl) {
  pass('Base URL agreement', 'server and public origins match')
}

const messagingEnabled = process.env.MESSAGING_ENABLED?.trim()
if (!['true', 'false'].includes(messagingEnabled)) {
  fail('MESSAGING_ENABLED', 'must be explicitly true or false')
} else if (messagingEnabled === 'true') {
  warn('MESSAGING_ENABLED', 'true: use only after the provider and end-to-end launch checklists pass')
} else {
  pass('MESSAGING_ENABLED', 'false: outbound delivery remains safely disabled')
}

if (environment === 'staging') {
  requireValue('VERCEL_AUTOMATION_BYPASS_SECRET', { minLength: 16 })
}

async function checkPublicPage(pathname, marker) {
  if (!baseUrl) return
  const url = new URL(pathname, baseUrl)
  if (environment === 'staging' && process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    url.searchParams.set('x-vercel-protection-bypass', process.env.VERCEL_AUTOMATION_BYPASS_SECRET)
  }
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
    if (response.status !== 200) {
      fail(`Public page ${pathname}`, `returned HTTP ${response.status}; expected 200 without a redirect`)
      return
    }
    const body = await response.text()
    if (!body.includes(marker)) {
      fail(`Public page ${pathname}`, 'returned 200 but did not contain the expected disclosure text')
      return
    }
    pass(`Public page ${pathname}`, 'publicly reachable with expected disclosure text')
  } catch (error) {
    fail(`Public page ${pathname}`, error instanceof Error ? error.message : 'request failed')
  }
}

async function checkDns() {
  const rootDomain = 'ourweddingrecap.com'
  try {
    const records = await resolveMx(rootDomain)
    records.length ? pass('Root-domain MX', 'published; do not replace it with SendGrid Inbound Parse') : fail('Root-domain MX', 'no records found')
  } catch {
    fail('Root-domain MX', 'DNS lookup failed')
  }

  const inboundHost = inboundEmail?.split('@')[1]
  if (inboundHost) {
    try {
      const records = await resolveMx(inboundHost)
      const hasSendGrid = records.some((record) => record.exchange.replace(/\.$/, '').toLowerCase() === 'mx.sendgrid.net')
      hasSendGrid
        ? pass('Inbound Parse MX', `${inboundHost} routes to mx.sendgrid.net`)
        : fail('Inbound Parse MX', `${inboundHost} does not route to mx.sendgrid.net`)
    } catch {
      fail('Inbound Parse MX', `DNS lookup failed for ${inboundHost}`)
    }
  }

  try {
    const records = (await resolveTxt(`_dmarc.${rootDomain}`)).map((parts) => parts.join(''))
    records.some((record) => /^v=DMARC1;/i.test(record))
      ? pass('DMARC', 'a DMARC policy is published')
      : fail('DMARC', 'no v=DMARC1 policy found')
  } catch {
    fail('DMARC', 'DNS lookup failed')
  }
}

if (networkEnabled) {
  await Promise.all([
    checkPublicPage('/privacy', 'We do not share mobile information'),
    checkPublicPage('/terms', 'Optional Email and SMS Updates'),
    checkPublicPage('/sms-consent', 'How wedding guests opt in to Our Wedding Recap texts'),
    checkDns(),
  ])
} else {
  warn('Network verification', 'skipped; add --network before provider submission')
}

const symbols = { pass: '✓', fail: '✗', warn: '!' }
console.log(`Communications preflight (${environment})`)
for (const result of results) console.log(`${symbols[result.status]} ${result.label}: ${result.detail}`)
const counts = results.reduce((summary, result) => ({ ...summary, [result.status]: summary[result.status] + 1 }), { pass: 0, fail: 0, warn: 0 })
console.log(`Summary: ${counts.pass} passed, ${counts.fail} failed, ${counts.warn} warning(s)`)
process.exitCode = counts.fail ? 1 : 0
