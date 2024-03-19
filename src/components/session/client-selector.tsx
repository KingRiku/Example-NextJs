'use client'

import Spinner from '@/components/common/spinner'
import Listbox from '@/components/form-controls/listbox'
import { useClients } from '@/hooks/clients'
import { useUser } from '@/hooks/user'
import { useEffect } from 'react'

export default function ClientSelector() {
  const [user] = useUser()

  const [activeClient, selectClient, availableClients, isFetching] =
    useClients()

  useEffect(() => {
    if (!isFetching && !activeClient && availableClients.length > 0)
      selectClient(availableClients[0].id)
  }, [activeClient, availableClients, isFetching, selectClient])

  return user ? (
    <Listbox
      className="max-w-56"
      name="activeClient"
      placeholder={
        isFetching ? (
          <Spinner size={1} sizeUnit="em" />
        ) : (
          'Seleccione un cliente'
        )
      }
      onChange={selectClient}
      value={activeClient ?? ''}
      options={availableClients.map(({ id, name }) => ({
        label: name,
        value: id,
      }))}
      disabled={
        isFetching ||
        !(availableClients instanceof Array) ||
        availableClients.length <= 1
      }
    />
  ) : null
}
