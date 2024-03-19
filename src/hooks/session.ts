import { fetcher } from '@/lib/fetcher'
import { SessionSchema, type Session } from '@/schemas/session'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export const useSession = (): [
  sessionData: PossiblyUndefined<Readonly<Session>>,
  fetchingState: boolean,
] => {
  const [session, setSession] = useState<Readonly<Session>>()

  const { data, isLoading, mutate } = useSWR<Session>('/api/session', fetcher)

  const pathname = usePathname()

  useEffect(() => {
    if (data && SessionSchema.safeParse(data).success)
      setSession(Object.freeze(data))
  }, [data])

  useEffect(() => {
    mutate()
  }, [mutate, pathname])

  return [session, isLoading]
}
