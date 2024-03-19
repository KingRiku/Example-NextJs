import Session from '@/models/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await Session.read()

  if (session) redirect('/login/handler')

  return (
    <div className="flex flex-grow items-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Stratego Monitor - Plataforma de seguridad
          </h1>

          <p>
            Por favor{' '}
            <Link
              href="/login"
              className="items-center font-bold text-base text-blue-500 hover:text-blue-700"
            >
              inicie sesión
            </Link>{' '}
            para continuar.
          </p>
        </div>
      </div>
    </div>
  )
}
