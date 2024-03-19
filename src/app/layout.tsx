import { ScrollToTop } from '@/components/global/scroll-to-top'
import { pageTitle } from '@/lib/format'
import CaptchaProvider from '@/providers/captcha'
import StoreProvider from '@/providers/store'
import '@/styles/global.sass'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Header = dynamic(() => import('@/components/global/header'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/global/footer'))

export const metadata = {
  title: pageTitle('Inicio'),
  description:
    'La plataforma de monitorización y gestión de seguridad de la información',
}

export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link rel="manifest" href="/manifest.json" />

        <meta name="msapplication-TileColor" content="#212529" />

        <meta name="theme-color" content="#212529" />
      </head>

      <body className="flex flex-col h-screen w-screen">
        <CaptchaProvider>
          <StoreProvider>
            <Suspense>
              <Header />
            </Suspense>

            <main className="flex flex-col flex-grow">{children}</main>

            <ScrollToTop />

            <Suspense>
              <Footer />
            </Suspense>
          </StoreProvider>
        </CaptchaProvider>
      </body>
    </html>
  )
}
