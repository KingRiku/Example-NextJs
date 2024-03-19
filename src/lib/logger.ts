import chalk from 'chalk'
import shortUUID from 'short-uuid'

type LogLevel = 'error' | 'warn' | 'info'

const defaultLogLevel: LogLevel = 'info'

const allowedLevels = new Set<LogLevel>(['error', 'warn', 'info'])

type OutputFormatter = (input: string) => string

const colorMap: Record<LogLevel, OutputFormatter> = {
  error: chalk.bgRed.white.bold,
  warn: chalk.bgYellow.black.bold,
  info: chalk.bgBlue.white.bold,
}

function parseOutputContent(input: unknown): string {
  if (!input) return ''

  if (typeof input === 'string') return input

  if (
    typeof input === 'bigint' ||
    typeof input === 'number' ||
    typeof input === 'boolean' ||
    typeof input === 'symbol'
  )
    return String(input)

  if (input instanceof Error) return input.stack || input.message

  if (input instanceof Array) return input.map(parseOutputContent).join(' ')

  return JSON.stringify(input, null, 2)
}

/**
 * @serverOnly
 */
export default class Logger {
  private readonly uuid: string

  private readonly level: LogLevel

  private readonly content: unknown

  constructor(content: unknown, level: LogLevel) {
    this.uuid = shortUUID.generate()
    this.level = level
    this.content = content
  }

  private async register() {
    const output = parseOutputContent(this.content)

    // TODO: Handle logging context
    console[this.level](
      colorMap[this.level](
        `${new Date().toISOString()} [${this.uuid} - ${this.level.toUpperCase()}]:`,
      ),
      output,
    )
  }

  /**
   * Handles a server log event.
   * @param content any content to be logged
   * @param level flag to indicate the log level of the output. By default it is set to 'info'
   * @serverOnly
   */
  static async emit(content: unknown, level: LogLevel = defaultLogLevel) {
    if (!content) return

    if (!allowedLevels.has(level)) level = defaultLogLevel

    const logger = new Logger(content, level)

    await logger.register()
  }
}
