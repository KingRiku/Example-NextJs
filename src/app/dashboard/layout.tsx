import { serverSessionGuard } from '@/guards/server/session'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Sidebar = dynamic(() => import('@/components/global/sidebar'), {
  ssr: false,
})

export default async function RootLayout({
  children,
}: React.PropsWithChildren<WithoutProps>) {
  await serverSessionGuard()

  return (
    <div className="flex flex-col lg:flex-row flex-grow gap-y-6">
      <Suspense>
        <Sidebar />
      </Suspense>

      <div className="flex flex-col gap-6 p-6 w-full">{children}</div>
    </div>
  )
}
