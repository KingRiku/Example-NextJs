import { pageTitle } from '@/lib/format'

export const metadata = {
  title: pageTitle('Login'),
}

export default async function LoginLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <div className="grid min-h-full">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-md gap-y-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Ingrese sus credenciales para continuar
          </h2>

          {children}
        </div>
      </div>
    </div>
  )
}
