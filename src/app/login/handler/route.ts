import { TokenRole } from '@/enums/roles'
import Session from '@/models/session'
import Token from '@/models/token'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const parsedHeaders = headers()

  const postLoginHandler = (pathname: string) => {
    const hostname = parsedHeaders.get('host')

    const postLoginUrl = new URL(pathname, `https://${hostname}`)

    return NextResponse.redirect(postLoginUrl.toString())
  }

  const session = await Session.read()

  if (!session) return postLoginHandler('/login')

  const tokenData = await Token.getByValue(session.token)

  if (!tokenData) return postLoginHandler('/login')

  if ([TokenRole.Admin].includes(tokenData.role))
    return postLoginHandler('/system')
  else return postLoginHandler('/dashboard')
}
