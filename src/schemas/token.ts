import { TokenRole } from '@/enums/roles'
import validator from 'validator'
import { z } from 'zod'

export const TokenValueDataSchema = z.object({
  /**
   * User id
   */
  id: z.string(),
  /**
   * Token UUID
   */
  instance: z.string().uuid(),
})

export type TokenValueData = z.infer<typeof TokenValueDataSchema>

export const TerminalTokenSchema = z.object({
  value: z.string(),
  role: z.literal(TokenRole.ObserverAccess),
  /**
   * Observer id
   */
  observerId: z.string().uuid(),
  createdAt: z.string().refine(validator.isISO8601),
  expiresAt: z.string().refine(validator.isISO8601),
})

export type TerminalToken = z.infer<typeof TerminalTokenSchema>

export const RegularTokenSchema = z.object({
  value: z.string(),
  role: z.nativeEnum(TokenRole),
  createdAt: z.string().refine(validator.isISO8601),
  expiresAt: z.string().refine(validator.isISO8601),
})

export const TokenSchema = z.union([RegularTokenSchema, TerminalTokenSchema])

export type Token = z.infer<typeof TokenSchema>
