import { z } from 'zod'

export const SessionSchema = z.object({
  token: z.string(),
})

export type Session = z.infer<typeof SessionSchema>
