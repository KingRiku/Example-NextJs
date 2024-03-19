import ContainerCard from '@/components/common/container-card'
import { pageTitle } from '@/lib/format'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
import classNames from 'classnames'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: pageTitle('Dashboard'),
}

export default async function DashboardPage() {
  const links = [
    {
      icon: ChartBarIcon,
      name: 'Uso y estado de recursos',
      description:
        'Aquí puede revisar el rendimiento y calidad de uso del inventario de equipos y servidores bajo monitorización.',
      href: '/dashboard/observability',
    },
    {
      icon: LockClosedIcon,
      name: 'Seguridad informática',
      description:
        'Conozca todos los detalles sobre los riesgos y estado de seguridad de la infraestructura de su empresa.',
      href: '/dashboard/security',
    },
  ]

  return (
    <ContainerCard title="Dashboard">
      <div className="grid grid-cols-4 gap-6">
        {links.map(({ description, href, icon: Icon, name }, index) => (
          <Link
            key={index}
            href={href}
            className={classNames(
              'inline-flex flex-row gap-6 col-span-4 lg:col-span-2 p-6 border rounded-md cursor-pointer',
              'bg-white text-inherit hover:shadow-lg group',
            )}
          >
            <Icon className="size-24 group-hover:text-black transition-colors" />

            <div className="inline-flex flex-col">
              <h2 className="inline-flex text-xl font-extrabold items-center justify-between">
                <span>{name}</span>

                <span className="inline-flex gap-1 text-base font-normal group-hover:text-blue-600 transition-colors">
                  <span>Revisar</span>

                  <span aria-hidden="true">&rarr;</span>
                </span>
              </h2>

              <p className="text-gray-500 text-balance">{description}</p>
            </div>
          </Link>
        ))}

        <section
          className={classNames(
            'inline-flex flex-col gap-6 col-span-4 lg:col-span-2 p-6 border rounded-md bg-white',
          )}
        >
        </section>

        <section
          className={classNames(
            'inline-flex flex-col gap-6 col-span-4 lg:col-span-2 p-6 border rounded-md bg-white',
          )}
        >
          <h2 className="text-xl font-extrabold">Últimas publicaciones</h2>

          <p className="text-gray-500">No hay publicaciones recientes.</p>

          <small className="text-gray-500">
            Puede revisar más tarde para más información
          </small>
        </section>
      </div>
    </ContainerCard>
  )
}
