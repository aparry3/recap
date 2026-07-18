import { DateTime, IANAZone } from 'luxon'

export interface GalleryLocalTimeResolution {
  utc: string | null
  local: string | null
  error?: string
}

const LOCAL_ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?([zZ]|[+-]\d{2}:\d{2})?$/

/**
 * Interpret a wall-clock date/time in the gallery's IANA timezone. Invalid and
 * ambiguous daylight-saving times are rejected instead of being shifted silently.
 */
export function resolveGalleryLocalDateTime(input: string, timezone: string): GalleryLocalTimeResolution {
  if (!input.trim()) {
    return { utc: null, local: null, error: 'A send date and time is required.' }
  }
  if (!IANAZone.isValidZone(timezone)) {
    return { utc: null, local: null, error: 'The gallery timezone is invalid.' }
  }

  const match = LOCAL_ISO_PATTERN.exec(input.trim())
  if (!match) {
    return { utc: null, local: null, error: 'The send date and time is invalid.' }
  }

  const [, year, month, day, hour, minute, second = '0', millisecond = '0', suppliedOffset] = match
  const components = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(millisecond.padEnd(3, '0')),
  }
  let local = DateTime.fromObject(components, { zone: timezone })
  if (!local.isValid) {
    return { utc: null, local: null, error: 'The send date and time is invalid.' }
  }

  // Luxon advances nonexistent spring-forward times. Comparing the requested
  // components catches that behavior so a reminder is never moved unexpectedly.
  if (local.year !== components.year || local.month !== components.month || local.day !== components.day
    || local.hour !== components.hour || local.minute !== components.minute || local.second !== components.second) {
    return {
      utc: null,
      local: null,
      error: 'That local time does not exist because of daylight saving time. Choose another time.',
    }
  }

  const possibleOffsets = local.getPossibleOffsets()
  if (possibleOffsets.length > 1) {
    if (!suppliedOffset) {
      return {
        utc: null,
        local: null,
        error: 'That local time occurs twice because of daylight saving time. Choose another time.',
      }
    }
    const supplied = DateTime.fromISO(input, { setZone: true })
    const matchingOffset = possibleOffsets.find((candidate) => candidate.offset === supplied.offset)
    if (!supplied.isValid || !matchingOffset) {
      return {
        utc: null,
        local: null,
        error: 'The supplied UTC offset does not match the gallery timezone at that time.',
      }
    }
    local = matchingOffset
  } else if (suppliedOffset) {
    const supplied = DateTime.fromISO(input, { setZone: true })
    if (!supplied.isValid || supplied.offset !== local.offset) {
      return {
        utc: null,
        local: null,
        error: 'The supplied UTC offset does not match the gallery timezone at that time.',
      }
    }
  }

  return {
    utc: local.toUTC().toISO(),
    local: local.toISO({ suppressMilliseconds: true }),
  }
}
