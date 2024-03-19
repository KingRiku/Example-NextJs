import Session from '@/models/session'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const CredentialsForm = dynamic(
  () => import('@/components/forms/credentials-form'),
)

type LoginPageProps = WithSearchParams<{
  returnTo: string
}>

export default async function LoginPage({
  searchParams: { returnTo },
}: LoginPageProps) {
  const session = await Session.read()

  if (session) redirect('/login/handler')

  return (
    <Suspense>
      <CredentialsForm returnUrl={returnTo} />
    </Suspense>
  )
}
