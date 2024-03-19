import NotFoundErrorContent from '@/components/common/not-found-error'
import { pageTitle } from '@/lib/format'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: pageTitle('Recurso no encontrado'),
}

export default async function NotFound() {
  return (
    <main className="flex flex-col py-8 flex-grow align-center">
      <div className="inline-flex lg:mx-auto grow w-full max-w-7xl">
        <NotFoundErrorContent />
      </div>
    </main>
  )
}
