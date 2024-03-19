import type { MongoClient } from 'mongodb'

export {}

declare global {
  /**
   * @server-side-only
   *
   * @development-only
   *
   * This allows the Mongo client to be reused across API calls.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}
