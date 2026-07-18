import { describe, expect, it } from 'vitest'
import { resolveGalleryLocalDateTime } from '@/lib/reminders/time'

describe('gallery-local reminder timestamps', () => {
  it('converts standard and daylight times using the gallery timezone', () => {
    expect(resolveGalleryLocalDateTime('2027-01-15T09:00', 'America/New_York').utc)
      .toBe('2027-01-15T14:00:00.000Z')
    expect(resolveGalleryLocalDateTime('2027-07-15T09:00', 'America/New_York').utc)
      .toBe('2027-07-15T13:00:00.000Z')
  })

  it('rejects a nonexistent spring-forward local time', () => {
    const result = resolveGalleryLocalDateTime('2027-03-14T02:30', 'America/New_York')
    expect(result.utc).toBeNull()
    expect(result.error).toContain('does not exist')
  })

  it('requires an offset for an ambiguous fall-back local time', () => {
    expect(resolveGalleryLocalDateTime('2027-11-07T01:30', 'America/New_York').error).toContain('occurs twice')
    expect(resolveGalleryLocalDateTime('2027-11-07T01:30:00-04:00', 'America/New_York').utc)
      .toBe('2027-11-07T05:30:00.000Z')
    expect(resolveGalleryLocalDateTime('2027-11-07T01:30:00-05:00', 'America/New_York').utc)
      .toBe('2027-11-07T06:30:00.000Z')
  })

  it('rejects an offset that does not match the gallery timezone', () => {
    expect(resolveGalleryLocalDateTime('2027-07-15T09:00:00-05:00', 'America/New_York').error)
      .toContain('does not match')
  })
})
