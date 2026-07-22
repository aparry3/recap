import { spawnSync } from 'node:child_process'

const isProduction = process.env.VERCEL_ENV === 'production'
const script = isProduction ? 'build:deploy' : 'build'

if (isProduction) {
  console.log('Production deployment detected; running database migrations before the application build.')
} else {
  console.log(`Skipping production database migrations for Vercel environment "${process.env.VERCEL_ENV || 'unknown'}".`)
}

const result = spawnSync('pnpm', [script], {
  env: process.env,
  stdio: 'inherit',
})

if (result.error) {
  console.error(`Failed to start "pnpm ${script}":`, result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
