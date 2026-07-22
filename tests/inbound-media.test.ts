import { describe, expect, it } from 'vitest'
import {
  buildInboundSourceId,
  inboundFileExtension,
  isSupportedInboundContentType,
  isSupportedInboundEmailContentType,
  isWithinInboundEmailMediaLimit,
  MAX_INBOUND_EMAIL_MEDIA_BYTES,
  normalizeInboundContentType,
} from '@/lib/inbound/media'

describe('inbound media metadata', () => {
  it('normalizes supported provider MIME aliases', () => {
    expect(normalizeInboundContentType('IMAGE/JPG; charset=binary')).toBe('image/jpeg')
    expect(normalizeInboundContentType('video/mpeg4')).toBe('video/mp4')
    expect(isSupportedInboundContentType('image/png')).toBe(true)
    expect(isSupportedInboundContentType('video/quicktime')).toBe(true)
    expect(isSupportedInboundEmailContentType('image/heic')).toBe(true)
    expect(isSupportedInboundEmailContentType('video/quicktime')).toBe(false)
    expect(isSupportedInboundContentType('application/pdf')).toBe(false)
    expect(inboundFileExtension('video/quicktime')).toBe('mov')
  })

  it('uses a conservative per-email media limit below Vercel request limits', () => {
    expect(isWithinInboundEmailMediaLimit(MAX_INBOUND_EMAIL_MEDIA_BYTES)).toBe(true)
    expect(isWithinInboundEmailMediaLimit(MAX_INBOUND_EMAIL_MEDIA_BYTES + 1)).toBe(false)
    expect(isWithinInboundEmailMediaLimit(0)).toBe(false)
  })

  it('creates deterministic provider attachment keys that include the content', () => {
    const first = buildInboundSourceId('message-1', 'attachment-1', new Uint8Array([1, 2, 3]))
    expect(buildInboundSourceId('message-1', 'attachment-1', new Uint8Array([1, 2, 3]))).toBe(first)
    expect(buildInboundSourceId('message-1', 'attachment-1', new Uint8Array([1, 2, 4]))).not.toBe(first)
    expect(buildInboundSourceId('message-2', 'attachment-1', new Uint8Array([1, 2, 3]))).not.toBe(first)
  })
})
