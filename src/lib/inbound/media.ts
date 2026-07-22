import { createHash } from 'crypto'
import sharp from 'sharp'
import { uploadObject, WEBP_TYPE } from '@/lib/aws/s3'
import { completeInboundMedia, insertInboundMedia } from '@/lib/db/mediaService'
import { Media } from '@/lib/types/Media'

export const MAX_INBOUND_MEDIA_BYTES = 30 * 1024 * 1024
export const MAX_INBOUND_EMAIL_MEDIA_BYTES = 2 * 1024 * 1024

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
  'image/bmp',
])

const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/mpeg',
  'video/webm',
  'video/3gpp',
  'video/3gpp2',
  'video/h261',
  'video/h263',
  'video/h263-1998',
  'video/h263-2000',
  'video/h264',
  'video/h265',
])

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/tiff': 'tiff',
  'image/bmp': 'bmp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/mpeg': 'mpeg',
  'video/webm': 'webm',
  'video/3gpp': '3gp',
  'video/3gpp2': '3g2',
  'video/h261': 'h261',
  'video/h263': 'h263',
  'video/h263-1998': 'h263',
  'video/h263-2000': 'h263',
  'video/h264': 'h264',
  'video/h265': 'h265',
}

export function normalizeInboundContentType(contentType?: string | null): string {
  const normalized = contentType?.split(';')[0]?.trim().toLowerCase() || ''
  if (normalized === 'image/jpg') return 'image/jpeg'
  if (normalized === 'video/mpeg4') return 'video/mp4'
  return normalized
}

export function isSupportedInboundContentType(contentType?: string | null): boolean {
  const normalized = normalizeInboundContentType(contentType)
  return IMAGE_TYPES.has(normalized) || VIDEO_TYPES.has(normalized)
}

export function isSupportedInboundEmailContentType(contentType?: string | null): boolean {
  return IMAGE_TYPES.has(normalizeInboundContentType(contentType))
}

export function isWithinInboundEmailMediaLimit(byteLength: number): boolean {
  return Number.isFinite(byteLength) && byteLength > 0 && byteLength <= MAX_INBOUND_EMAIL_MEDIA_BYTES
}

export function inboundFileExtension(contentType: string): string {
  return EXTENSIONS[normalizeInboundContentType(contentType)] || 'bin'
}

export function buildInboundSourceId(
  providerMessageId: string,
  attachmentId: string,
  data: Uint8Array,
): string {
  const contentHash = createHash('sha256').update(data).digest('hex')
  return createHash('sha256')
    .update(`${providerMessageId}\u0000${attachmentId}\u0000${contentHash}`)
    .digest('hex')
}

async function imagePreview(data: Uint8Array): Promise<{ preview: Buffer; width: number; height: number }> {
  const image = sharp(Buffer.from(data), { failOn: 'error' })
  const metadata = await image.metadata()
  const shouldSwapDimensions = metadata.orientation !== undefined && metadata.orientation >= 5 && metadata.orientation <= 8
  const width = shouldSwapDimensions ? metadata.height : metadata.width
  const height = shouldSwapDimensions ? metadata.width : metadata.height
  const preview = await image
    .rotate()
    .resize({ width: 500, height: 500, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
  return { preview, width: width || 0, height: height || 0 }
}

async function videoPreview(): Promise<{ preview: Buffer; width: number; height: number }> {
  const preview = await sharp(Buffer.from(`
    <svg width="500" height="320" viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="320" rx="24" fill="#5f6650"/>
      <circle cx="250" cy="145" r="58" fill="#f5f0e9" fill-opacity="0.96"/>
      <path d="M235 112 L235 178 L284 145 Z" fill="#5f6650"/>
      <text x="250" y="245" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#f5f0e9">Wedding video</text>
    </svg>
  `)).webp({ quality: 88 }).toBuffer()
  return { preview, width: 500, height: 320 }
}

export interface UploadInboundMediaInput {
  provider: 'twilio' | 'resend'
  sourceId: string
  galleryId: string
  personId: string
  name: string
  contentType: string
  data: Uint8Array
}

export interface UploadInboundMediaResult {
  media: Media
  galleryId: string
  alreadyUploaded: boolean
}

export async function uploadInboundMedia(input: UploadInboundMediaInput): Promise<UploadInboundMediaResult> {
  const contentType = normalizeInboundContentType(input.contentType)
  if (!isSupportedInboundContentType(contentType)) throw new Error(`Unsupported inbound media type: ${contentType || 'unknown'}`)
  if (!input.data.byteLength) throw new Error('Inbound media attachment is empty')
  if (input.data.byteLength > MAX_INBOUND_MEDIA_BYTES) throw new Error('Inbound media attachment exceeds the 30 MB limit')

  const prepared = IMAGE_TYPES.has(contentType) ? await imagePreview(input.data) : await videoPreview()
  const record = await insertInboundMedia(input.galleryId, {
    personId: input.personId,
    name: input.name.trim().slice(0, 255) || `upload.${inboundFileExtension(contentType)}`,
    contentType,
    width: prepared.width,
    height: prepared.height,
    source: input.provider,
    sourceId: input.sourceId,
  })
  if (record.media.uploaded) {
    return { ...record, alreadyUploaded: true }
  }

  await Promise.all([
    uploadObject(record.media.url, input.data, contentType),
    uploadObject(
      record.media.preview,
      new Uint8Array(prepared.preview.buffer, prepared.preview.byteOffset, prepared.preview.byteLength),
      WEBP_TYPE,
    ),
  ])
  const media = await completeInboundMedia(record.galleryId, record.media.id)
  return { media, galleryId: record.galleryId, alreadyUploaded: false }
}
