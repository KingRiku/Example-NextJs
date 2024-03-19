'use client'

import { useUser } from '@/hooks/user'
import { Menu, Transition } from '@headlessui/react'
import ChevronDownIcon from '@heroicons/react/16/solid/ChevronDownIcon'
import classNames from 'classnames'
import { Fragment } from 'react'

export default function SessionMenu() {
  const [user] = useUser()

  return user ? (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600">
          <span>
            {user.name} {user.surname}
          </span>

          <ChevronDownIcon
            className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  )}
                  onClick={() => {
                    fetch('/api/session', {
                      method: 'DELETE',
                    }).then(() => (window.location.href = '/login'))
                  }}
                >
                  Cerrar sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  ) : null
}
