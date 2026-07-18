import { normalizeUsPhone } from '@/lib/db/communicationService'
import { z } from 'zod'

const optionalEmail = z.preprocess(
  (value) => typeof value === 'string' && !value.trim() ? undefined : value,
  z.string().trim().email().max(320).optional(),
)

const optionalUsPhone = z.preprocess(
  (value) => typeof value === 'string' && !value.trim() ? undefined : value,
  z.string().refine((value) => normalizeUsPhone(value) !== null, 'Enter a valid 10-digit US phone number').optional(),
)

export const personContactUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: optionalEmail,
  phone: optionalUsPhone,
}).strict()

export const newGuestPersonSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: optionalEmail,
  phone: optionalUsPhone,
  isAdmin: z.literal(false).optional(),
}).strict()
