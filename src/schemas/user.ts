import { UserEventType, UserStatus, UserType } from '@/enums/user'
import type { userAgent } from 'next/server'
import type { Merge } from 'type-fest'
import validator from 'validator'
import { z } from 'zod'

export const NewPasswordRule = z
  .string({
    invalid_type_error: 'La contraseña debe ser un texto',
    required_error: 'Por favor, especifique una contraseña',
  })
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(64, 'La contraseña debe tener menos de 64 caracteres')
  .refine((input: string) => /[A-Z]/.test(input), {
    message: 'La contraseña debe tener al menos una letra mayúscula',
  })
  .refine((input: string) => /\d/.test(input), {
    message: 'La contraseña debe tener al menos un número',
  })
  .refine((input: string) => /[/%&$#@?*~]/.test(input), {
    message: 'La contraseña debe tener al menos un símbolo',
  })

export const PasswordResetSchema = z.strictObject({
  password: NewPasswordRule,
  passwordConfirmation: NewPasswordRule,
})

export type PasswordReset = z.infer<typeof PasswordResetSchema>

export const UserEventSchema = z.object({
  type: z.nativeEnum(UserEventType),
  telemetryDetails: z.object({
    ip: z.string().ip().optional(),
    userAgent: z
      .object({
        isBot: z.boolean().nullable().optional(),
        ua: z.string().nullable().optional(),
        browser: z
          .object({
            name: z.string().nullable().optional(),
            version: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        device: z
          .object({
            model: z.string().nullable().optional(),
            type: z.string().nullable().optional(),
            vendor: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        engine: z
          .object({
            name: z.string().nullable().optional(),
            version: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        os: z
          .object({
            name: z.string().nullable().optional(),
            version: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        cpu: z
          .object({
            architecture: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
      })
      .optional(),
    geolocation: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z
          .union([
            z.string().refine(validator.isISO31661Alpha2),
            z.string().refine(validator.isISO31661Alpha3),
            z.string(),
          ])
          .optional(),
      })
      .nullable()
      .optional(),
  }),
  createdAt: z.string().refine(validator.isISO8601),
})

type UserAgent = ReturnType<typeof userAgent>

export type UserEvent = Merge<
  z.infer<typeof UserEventSchema>,
  {
    telemetryDetails: Merge<
      z.infer<typeof UserEventSchema>['telemetryDetails'],
      {
        userAgent: UserAgent
      }
    >
  }
>

export const UserCredentialsSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'El email debe ser un correo electrónico válido',
      required_error: 'Por favor, especifique un email',
    })
    .email('Ingrese un email válido'),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser un texto',
    required_error: 'Por favor, especifique una contraseña',
  }),
})

export type UserCredentials = z.infer<typeof UserCredentialsSchema>

export const UserLoginSchema = UserCredentialsSchema.extend({
  remember: z.boolean().optional(),
})

export type UserLogin = z.infer<typeof UserLoginSchema>

export const UserSchema = z.object({
  name: z.string(),
  surname: z.string(),
  events: z.array(UserEventSchema).optional(),
  associatedClients: z.array(z.string().uuid()),
  type: z.nativeEnum(UserType),
  status: z.nativeEnum(UserStatus),
})

export type User = z.infer<typeof UserSchema>

export const UserWithCredentialsSchema = UserSchema.extend({
  credentials: UserCredentialsSchema,
}).strict()

export type UserWithCredentials = z.infer<typeof UserWithCredentialsSchema>
