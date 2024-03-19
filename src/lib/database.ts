import { MongoClient, type MongoClientOptions } from 'mongodb'

let mongoConnector!: Promise<MongoClient>

function getConnection() {
  const uri = process.env.MONGODB_URI

  const options: Readonly<MongoClientOptions> = Object.freeze({
    rejectUnauthorized: true,
  })

  return new MongoClient(uri, options).connect()
}

if (!process.env.MONGODB_URI) throw new Error('Please add MONGODB_URI to env.')

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) global._mongoClientPromise = getConnection()

  mongoConnector = global._mongoClientPromise
}
// In production mode, it's best to not use a global variable.
else mongoConnector = getConnection()

/**
 * @serverOnly
 */
export default class DataBase {
  /**
   * @serverOnly
   */
  static async connect() {
    const connector = await mongoConnector

    const client = connector.db(process.env.MONGODB_NAME)

    return client
  }
}
