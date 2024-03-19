import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type EjectionConfig = {
  /**
   * If true, the requested (but unauthorized) route will be provided as a `returnTo` query parameter
   *
   * @default true
   */
  allowReturn?: boolean
  /**
   * The pathname to redirect to
   *
   * @default '/login'
   */
  redirectPathname?: string
}

/**
 * Redirects the user to the login page using server-side redirection
 *
 * Must be called after a token or session check
 *
 * @serverSide
 */
export function ejectGuest(config?: EjectionConfig) {
  const { allowReturn = true, redirectPathname = '/login' } = { ...config }

  const parsedHeaders = headers()

  const hostname = parsedHeaders.get('host')

  const pathname = parsedHeaders.get('x-next-pathname')

  if (hostname && pathname) {
    const url = new URL(redirectPathname, `https://${hostname}`)

    if (allowReturn)
      url.searchParams.set('returnTo', Buffer.from(pathname).toString('base64'))

    redirect(url.toString())
  } else redirect(redirectPathname)
}
