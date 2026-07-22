import { brandCommunication } from '@/lib/brand'

const GSM_EXTENDED_CHARACTERS = new Set(['^', '{', '}', '\\', '[', ']', '~', '|'])

export function buildReminderSmsBody(body: string, galleryUrl: string): string {
  return brandCommunication(`${body.trim()}\n\nView & upload: ${galleryUrl}\nOr reply here with photos/videos to add them. Reply STOP to stop, HELP for help.`)
}

/** Conservative segment estimate: non-ASCII content is treated as UCS-2. */
export function estimateSmsSegments(message: string): number {
  const isAscii = /^[\x00-\x7F]*$/.test(message)
  if (!isAscii) {
    return Math.max(1, Math.ceil(message.length / (message.length <= 70 ? 70 : 67)))
  }
  const units = Array.from(message).reduce((total, character) =>
    total + (GSM_EXTENDED_CHARACTERS.has(character) ? 2 : 1), 0)
  return Math.max(1, Math.ceil(units / (units <= 160 ? 160 : 153)))
}
