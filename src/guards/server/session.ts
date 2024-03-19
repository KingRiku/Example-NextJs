import { ejectGuest } from '@/helpers/eject-guest'
import Session from '@/models/session'

export async function serverSessionGuard() {
  const session = await Session.read()

  if (!session) ejectGuest()
}
