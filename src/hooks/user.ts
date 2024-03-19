import { fetcher } from '@/lib/fetcher'
import { UserSchema, type User } from '@/schemas/user'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export const useUser = (): [
  user: PossiblyUndefined<Readonly<User>>,
  isFetching: boolean,
] => {
  const [user, setUser] = useState<User>()

  const { data, isLoading, mutate } = useSWR<User>('/api/user', fetcher)

  const pathname = usePathname()

  useEffect(() => {
    const validation = UserSchema.safeParse(data)

    if (validation.success) setUser(Object.freeze(data))
  }, [data])

  useEffect(() => {
    mutate()
  }, [mutate, pathname])

  return [user, isLoading]
}
