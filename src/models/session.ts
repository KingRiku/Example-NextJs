import { SupportedHeaderSchema } from '@/enums/session'
import Token from '@/models/token'
import { SessionSchema, type Session as TSession } from '@/schemas/session'
import { hoursToSeconds } from 'date-fns/hoursToSeconds'
import { getIronSession, unsealData, type SessionOptions } from 'iron-session'
import { cookies, headers } from 'next/headers'
import { z } from 'zod'

type CookieOptions = SessionOptions['cookieOptions']

export default class Session {
  /**
   * @param maxAge Seconds until the cookie expires
   */
  private static createCookieOptions(maxAge?: number): CookieOptions {
    if (maxAge !== 0 && !z.number().positive().safeParse(maxAge).success)
      throw new TypeError('maxAge must be a number if defined')

    return {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge,
    }
  }

  /**
   * Expect to find a token in the Authorization header
   *
   * If the header is provided using the Bearer schema, the token is extracted and returned as it is
   *
   * if the header is provided using the AppKey schema, the token is validated and returned as unsealed
   */
  private static async readAuthorizationToken(): Promise<
    PossiblyUndefined<TSession>
  > {
    const token = headers().get('authorization')

    if (!token) return undefined

    const headerSchemaValidator: Record<
      SupportedHeaderSchema,
      {
        matchers: Array<RegExp>
        parse: (input: string) => Promise<PossiblyUndefined<string>>
      }
    > = {
      [SupportedHeaderSchema.Bearer]: {
        matchers: [
          /^(Bearer )+(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i,
        ],
        parse: async (input) =>
          input.replace(`${SupportedHeaderSchema.Bearer} `, '').trim(),
      },
      [SupportedHeaderSchema.AppKey]: {
        matchers: [/^(AppKey )*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i],
        parse: async (input) =>
          unsealData(
            input.replace(`${SupportedHeaderSchema.AppKey} `, '').trim(),
            {
              password: process.env.SESSION_COOKIE_SEAL_KEY,
            },
          ),
      },
    }

    const schema = Object.keys(SupportedHeaderSchema).find((key) =>
      headerSchemaValidator[key as SupportedHeaderSchema].matchers.some(
        (matcher) => matcher.test(token),
      ),
    ) as PossiblyUndefined<SupportedHeaderSchema>

    if (!schema) return undefined

    const parsedToken = await headerSchemaValidator[schema].parse(token)

    if (!parsedToken) return undefined

    return {
      token: parsedToken,
    }
  }

  static async create(data: TSession, extended?: boolean): Promise<boolean> {
    if (!SessionSchema.safeParse(data).success) return false

    const maxAge = extended ? hoursToSeconds(72) : hoursToSeconds(8)

    const options = Session.createCookieOptions(maxAge)

    const session = await getIronSession<TSession>(cookies(), {
      password: process.env.SESSION_COOKIE_SEAL_KEY,
      cookieName: process.env.SESSION_COOKIE_NAME,
      cookieOptions: options,
    })

    session.token = data.token

    await session.save()

    return true
  }

  static async read(): Promise<PossiblyUndefined<TSession>> {
    const headerBasedSession = await Session.readAuthorizationToken()

    if (headerBasedSession) return headerBasedSession

    const session = await getIronSession<TSession>(cookies(), {
      password: process.env.SESSION_COOKIE_SEAL_KEY,
      cookieName: process.env.SESSION_COOKIE_NAME,
    })

    const { success } = await SessionSchema.strict().safeParseAsync(session)

    return success ? session : undefined
  }

  static async readData() {
    const session = await Session.read()

    if (!session) return undefined

    const tokenData = await Token.getByValue(session.token)

    if (!tokenData) return undefined

    return tokenData
  }

  static async delete(): Promise<void> {
    const session = await getIronSession<TSession>(cookies(), {
      password: process.env.SESSION_COOKIE_SEAL_KEY,
      cookieName: process.env.SESSION_COOKIE_NAME,
      cookieOptions: Session.createCookieOptions(0), // Ensure cookie is deleted
    })

    session.destroy()
  }
}
