export const COMMUNICATION_BRAND_NAME = 'Our Wedding Recap'

export function brandCommunication(message: string): string {
  const trimmed = message.trim()
  const prefix = `${COMMUNICATION_BRAND_NAME}:`
  return trimmed.toLowerCase().startsWith(prefix.toLowerCase())
    ? trimmed
    : `${prefix} ${trimmed}`
}
