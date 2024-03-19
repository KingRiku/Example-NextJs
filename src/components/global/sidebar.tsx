'use client'

import { UserType } from '@/enums/user'
import { useUser } from '@/hooks/user'
import {
  globalLayoutActions,
  globalLayoutSelector,
} from '@/lib/redux/features/global-layout'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { Transition } from '@headlessui/react'
import AdjustmentsHorizontalIcon from '@heroicons/react/24/solid/AdjustmentsHorizontalIcon'
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon'
import HomeIcon from '@heroicons/react/24/solid/HomeIcon'
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useMemo } from 'react'
import useEffectOnce from 'react-use/esm/useEffectOnce'
import useLocalStorage from 'react-use/esm/useLocalStorage'
import type { Merge } from 'type-fest'

type MenuItem = {
  label: string
  href: string
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined
      titleId?: string | undefined
    } & React.RefAttributes<SVGSVGElement>
  >
  subItems?: Array<Omit<MenuItem, 'subItems'>>
}

export default function Sidebar() {
  const pathname = usePathname()

  const [user] = useUser()

  const { isSessionSidebarOpen } = useAppSelector(globalLayoutSelector)

  const [isStoredSessionSidebarOpen, setStoredSessionSidebarOpen] =
    useLocalStorage('sidebar-open', isSessionSidebarOpen)

  const dispatch = useAppDispatch()

  const menu = useMemo(() => {
    const regularUserMenu: Array<MenuItem> = [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
      },
      {
        label: 'Observabilidad',
        href: '/dashboard/observability',
        icon: ChartBarIcon,
        subItems: [
          {
            label: 'Alertas',
            href: '/dashboard/observability/alerts',
          },
          {
            label: 'Casos',
            href: '/dashboard/observability/cases',
          },
          {
            label: 'Inventario',
            href: '/dashboard/observability/inventory',
          },
        ],
      },
      {
        label: 'Seguridad',
        href: '/dashboard/security',
        icon: LockClosedIcon,
        subItems: [
          {
            label: 'Alertas',
            href: '/dashboard/security/alerts',
          },
          {
            label: 'Casos',
            href: '/dashboard/security/cases',
          },
          {
            label: 'Informes',
            href: '/dashboard/security/reports',
          },
          {
            label: 'Redes y Trafico',
            href: '/dashboard/security/traffic',
          },
        ],
      },
    ]

    const adminUserMenu: Array<MenuItem> = [
      {
        label: 'Administración',
        href: '/system',
        icon: AdjustmentsHorizontalIcon,
        subItems: [
          {
            label: 'Clientes',
            href: '/system/admin/clients',
          },
          {
            label: 'Observadores',
            href: '/system/observers',
          },
        ],
      },
    ]

    let $menu = regularUserMenu

    if (user?.type === UserType.PlatformAdmin) {
      $menu.push(...adminUserMenu)
    }

    return $menu.flatMap((item) =>
      item.subItems instanceof Array
        ? [
            item,
            ...item.subItems.map((subItem) => ({
              ...subItem,
              isSecondary: true,
            })),
          ]
        : item,
    ) as Array<
      Merge<
        MenuItem,
        {
          isSecondary?: boolean
        }
      >
    >
  }, [user?.type])

  useEffectOnce(() => {
    dispatch(
      isStoredSessionSidebarOpen
        ? globalLayoutActions.openSessionSidebar()
        : globalLayoutActions.closeSessionSidebar(),
    )
  })

  useEffect(() => {
    setStoredSessionSidebarOpen(isSessionSidebarOpen)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionSidebarOpen])

  return (
    <Transition as={Fragment} show={isSessionSidebarOpen}>
      <Transition.Child
        as={Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <aside className="relative flex flex-[1] flex-col flex-grow py-6 min-w-56 bg-gray-800">
          <div className="sticky top-0 flex flex-col">
            <ul className="h-full space-y-1">
              {menu.map(({ icon: Icon, label, href, isSecondary }, index) => (
                <Link
                  key={index}
                  href={href}
                  className={classNames(
                    'flex gap-2 items-center gap-x-4 text-sm',
                    'border-l-4 border-transparent',
                    'text-white hover:text-white hover:border-white hover:brightness-90',
                    isSecondary
                      ? 'py-2 ps-12 font-normal'
                      : 'py-4 ps-4 font-black',
                    pathname === href && 'border-white bg-gray-700',
                  )}
                >
                  {Icon && <Icon className="size-4" />}

                  <span
                    className={classNames(
                      'origin-left duration-200',
                      !isSessionSidebarOpen && 'scale-0',
                    )}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </ul>
          </div>
        </aside>
      </Transition.Child>
    </Transition>
  )
}
