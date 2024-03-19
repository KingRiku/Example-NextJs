import { fetcher } from '@/lib/fetcher'
import { sessionActions, sessionSelector } from '@/lib/redux/features/session'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { ClientSchema, type Client } from '@/schemas/client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useCookie from 'react-use/esm/useCookie'
import useSWR from 'swr'

type SelectableClient = {
  id: Client['id']
  name: string
}

type ClientsHookResultMode = 'object' | 'tuple'

type ClientState<T extends ClientsHookResultMode = 'tuple'> = T extends 'object'
  ? {
      activeClient: PossiblyUndefined<string>
      selectClient: React.Dispatch<
        React.SetStateAction<PossiblyUndefined<string>>
      >
      availableClients: Readonly<Array<SelectableClient>>
      isLoading: boolean
    }
  : [
      activeClient: PossiblyUndefined<string>,
      selectClient: React.Dispatch<
        React.SetStateAction<PossiblyUndefined<string>>
      >,
      availableClients: Readonly<Array<SelectableClient>>,
      isLoading: boolean,
    ]

export const useClients = <T extends ClientsHookResultMode = 'tuple'>(
  hookResultMode = 'array' as T,
): ClientState<T> => {
  const { activeClient } = useAppSelector(sessionSelector)

  const dispatch = useAppDispatch()

  const [selectedClient, setSelectedClient] = useState<Readonly<Client['id']>>()

  const [storedClient, setStoredClient] = useCookie(
    process.env.NEXT_PUBLIC_SESSION_ACTIVE_CLIENT_COOKIE_NAME,
  )

  const [availableClients, setAvailableClients] = useState<
    Readonly<Array<SelectableClient>>
  >([])

  const {
    data: clients,
    isLoading,
    mutate,
  } = useSWR<Array<Client>>('/api/clients', fetcher)

  const pathname = usePathname()

  useEffect(() => {
    if (clients)
      setAvailableClients(
        Object.freeze(
          clients
            .filter((client) => ClientSchema.safeParse(client).success)
            .map(({ id, profile: { name, lastName } }) => ({
              id,
              name: `${name} ${lastName}`,
            })),
        ),
      )
  }, [clients])

  useEffect(() => {
    if ((storedClient || availableClients.length > 0) && !isLoading)
      setSelectedClient(storedClient ?? availableClients.at(0)!.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, storedClient])

  useEffect(() => {
    if (selectedClient) {
      dispatch(sessionActions.setActiveClient(selectedClient))
      setStoredClient(selectedClient, {
        sameSite: 'strict',
        secure: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedClient])

  useEffect(() => {
    mutate()
  }, [mutate, pathname])

  if (hookResultMode === 'object')
    return {
      activeClient,
      selectClient: setSelectedClient,
      availableClients,
      isLoading,
    } as ClientState<T>

  return [
    activeClient ?? undefined,
    setSelectedClient,
    availableClients,
    isLoading,
  ] as ClientState<T>
}
