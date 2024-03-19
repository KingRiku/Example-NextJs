import { TokenRole } from '@/enums/roles'
import { UserType } from '@/enums/user'
import DataBase from '@/lib/database'
import Logger from '@/lib/logger'
import {
  TokenSchema,
  TokenValueDataSchema,
  type Token as TToken,
  type TokenValueData,
} from '@/schemas/token'
import { randomUUID } from 'crypto'
import { addHours } from 'date-fns/addHours'
import { ObjectId } from 'mongodb'

export default class Token {
  private static readonly collection = 'tokens'

  static async auth(token: string) {
    const db = await DataBase.connect()

    const authenticate = await db
      .collection<TToken>(Token.collection)
      .find({ value: token })
      .toArray()

    return authenticate.length === 1
  }

  static async read(token: string) {
    try {
      const decodedString = Buffer.from(token, 'base64').toString('utf-8')

      const decoded = JSON.parse(decodedString) as TokenValueData

      if (!TokenValueDataSchema.safeParse(decoded).success)
        throw new TypeError('Token data not valid')

      return decoded
    } catch (reason) {
      await Logger.emit(reason, 'error')

      return undefined
    }
  }

  static async create(
    userId: string,
    meta?: {
      /**
       * Must be provided when the token is not session-based
       */
      role?: TokenRole
      /**
       * Must be provided when role is not yet defined
       *
       * If `role` is provided, `type` will be ignored
       *
       * @default UserType.Default
       */
      type?: UserType
    },
  ) {
    try {
      const db = await DataBase.connect()

      const tokenValueData: TokenValueData = {
        id: userId,
        instance: randomUUID(),
      }

      if (!TokenValueDataSchema.safeParse(tokenValueData).success)
        return undefined

      const now = new Date()

      let tokenRole = TokenRole.Client

      if (meta?.role) tokenRole = meta.role
      else if (meta?.type)
        if ([UserType.PlatformAdmin].includes(meta.type))
          tokenRole = TokenRole.Admin

      const token: TToken = {
        value: Buffer.from(JSON.stringify(tokenValueData)).toString('base64'),
        role: tokenRole,
        createdAt: new Date().toISOString(),
        expiresAt: addHours(now, 24).toISOString(),
      }

      if (!TokenSchema.safeParse(token).success) return undefined

      const result = await db
        .collection<TToken>(Token.collection)
        .insertOne(token)

      return result.insertedId
    } catch (reason) {
      await Logger.emit(reason, 'error')

      return undefined
    }
  }

  static async getById(id: string) {
    try {
      const db = await DataBase.connect()

      const result = await db
        .collection<TToken>(Token.collection)
        .findOne({ _id: new ObjectId(id) })

      if (!TokenSchema.safeParse(result).success) return undefined

      return result
    } catch (reason) {
      await Logger.emit(reason, 'error')

      return undefined
    }
  }

  static async getByValue(value: string) {
    try {
      const db = await DataBase.connect()

      const result = await db
        .collection<TToken>(Token.collection)
        .findOne({ value })

      if (!TokenSchema.safeParse(result).success) return undefined

      return result ?? undefined
    } catch (reason) {
      await Logger.emit(reason, 'error')

      return undefined
    }
  }
}
