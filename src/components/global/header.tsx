'use client'

import { useSession } from '@/hooks/session'
import {
  globalLayoutActions,
  globalLayoutSelector,
} from '@/lib/redux/features/global-layout'
import { sessionSelector } from '@/lib/redux/features/session'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { Dialog } from '@headlessui/react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'

const ClientSelector = dynamic(
  () => import('@/components/session/client-selector'),
)

const UserMenu = dynamic(() => import('@/components/session/menu'))

export default function Header() {
  const pathname = usePathname()

  const [session] = useSession()

  const { isSessionSidebarOpen } = useAppSelector(globalLayoutSelector)

  const { showClientSelector } = useAppSelector(sessionSelector)

  const dispatch = useAppDispatch()

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  return (
    <header className="bg-white">
      <nav
        className={classNames(
          'flex items-center justify-between py-4 px-6 lg:gap-x-6',
          session ? 'w-full' : 'mx-auto max-w-7xl',
        )}
      >
        <div className="flex items-center gap-6">
          {session && (
            <button
              className="flex flex-col h-full justify-center items-center group"
              onClick={() =>
                dispatch(
                  isSessionSidebarOpen
                    ? globalLayoutActions.closeSessionSidebar()
                    : globalLayoutActions.openSessionSidebar(),
                )
              }
            >
              <span className="sr-only">Open menu</span>

              {/* Creates the hamburger icon */}
              {Array.from({ length: 3 }).map((_, key) => (
                <div
                  key={key}
                  className={classNames(
                    'h-1.5 w-6 my-0.5 rounded-full transition ease transform duration-300',
                    'bg-gray-800 dark:bg-gray-200',
                    isSessionSidebarOpen
                      ? [
                          'rotate-45 translate-y-[1.03rem] opacity-75 group-hover:opacity-100',
                          'opacity-0',
                          '-rotate-45 -translate-y-[1.03rem] opacity-75 group-hover:opacity-100',
                        ][key]
                      : 'opacity-75 group-hover:opacity-100',
                  )}
                />
              ))}
            </button>
          )}

          <Link
            href="/"
            className="inline-flex gap-4 items-center group text-inherit"
          >
            <Image
              className="h-10 w-auto"
              src="https://stratego-public-assets.s3.amazonaws.com/landing/icon.svg"
              height={64}
              width={64}
              alt={process.env.BRAND_NAME ?? ''}
            />

            <span className="font-extrabold text-xl group-hover:text-blue-600 transition-colors duration-300">
              Monitor
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!pathname.includes('/login') && !session && (
            <Link
              href="/login"
              className="inline-flex gap-1 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
            >
              <span>Iniciar sesión</span>

              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}

          {session && (
            <div className="inline-flex gap-4 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              <Suspense>
                {showClientSelector && <ClientSelector />}

                <UserMenu />
              </Suspense>
            </div>
          )}
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />

        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">{process.env.BRAND_NAME}</span>

              <Image
                className="h-8 w-auto"
                src="/images/brand/logo.svg"
                height={48}
                width={48}
                alt={process.env.BRAND_NAME ?? ''}
              />
            </a>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>

              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                {!pathname.includes('/login') && (
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
