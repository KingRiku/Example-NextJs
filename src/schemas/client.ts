import { ClientTaxIdType } from '@/enums/client'
import { z } from 'zod'

export const ClientContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
})

export type ClientContact = z.infer<typeof ClientContactSchema>

export const ClientProfileSchema = z.object({
  name: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  taxId: z.object({
    type: z.nativeEnum(ClientTaxIdType),
    value: z.string(),
  }),
})

export type ClientProfile = z.infer<typeof ClientProfileSchema>

export const ClientSchema = z.object({
  id: z.string().uuid(),
  contact: ClientContactSchema,
  profile: ClientProfileSchema,
})

export type Client = z.infer<typeof ClientSchema>
