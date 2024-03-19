'use client'

import Spinner from '@/components/common/spinner'
import { UserLoginSchema, type UserLogin } from '@/schemas/user'
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon'
import capitalize from '@stdlib/string/capitalize'
import classNames from 'classnames'
import { useFormik } from 'formik'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import useAsyncFn from 'react-use/lib/useAsyncFn'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const WrongCredentialsModal = dynamic(
  () => import('@/components/modals/wrong-credentials-modal'),
  { ssr: false },
)

const ForgotPasswordModal = dynamic(
  () => import('@/components/modals/forgot-password-modal'),
  { ssr: false },
)

const Input = dynamic(() => import('@/components/form-controls/input'))

const PasswordInput = dynamic(
  () => import('@/components/form-controls/password-input'),
)

type CredentialsFormProps = {
  returnUrl?: string
}

export default function CredentialsForm({ returnUrl }: CredentialsFormProps) {
  const router = useRouter()

  const { executeRecaptcha } = useGoogleReCaptcha()

  const [formattedCredentials, setFormattedCredentials] = useState<UserLogin>()

  const [isForgotPasswordModalOpen, setForgotPasswordVisibility] =
    useState(false)

  const [wrongCredentials, setWrongCredentials] = useState(false)

  const [isWrongCredentialsModalOpen, setWrongCredentialsVisibility] =
    useState(false)

  const [{ loading: submittingCredentials }, submitCredentials] =
    useAsyncFn(async () => {
      if (!formattedCredentials) return void 0

      const reCaptchaLoginToken = await executeRecaptcha?.('login')

      if (reCaptchaLoginToken) {
        const geolocation = await (() =>
          new Promise<PossiblyUndefined<GeolocationPosition>>((resolve) => {
            try {
              navigator.geolocation.getCurrentPosition(
                (coordinates) => resolve(coordinates),
                () => resolve(undefined),
              )
            } catch {
              resolve(undefined)
            }
          }))()

        const authResponse = await fetch('/api/session', {
          method: 'POST',
          headers: {
            Authorization: reCaptchaLoginToken,
            Geolocation: geolocation
              ? [
                  geolocation.coords.latitude,
                  geolocation.coords.longitude,
                ].join(',')
              : '',
          },
          body: JSON.stringify({ ...formattedCredentials }),
          cache: 'no-cache',
        })

        const { success } = (await authResponse.json()) as {
          success: boolean
        }

        if (success) {
          if (returnUrl) {
            const decodedReturnUrl = Buffer.from(returnUrl, 'base64').toString(
              'utf-8',
            )

            router.replace(decodedReturnUrl)
          } else {
            router.push('/login/handler')
          }
        } else setWrongCredentials(true)
      }
    }, [executeRecaptcha, formattedCredentials, returnUrl, router])

  const {
    errors,
    handleChange,
    isSubmitting: isSubmittingForm,
    handleSubmit,
    values,
  } = useFormik<UserLogin>({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    onSubmit: () => submitCredentials(),
    validationSchema: toFormikValidationSchema(UserLoginSchema),
  })

  const submitting = useMemo(
    () => submittingCredentials || isSubmittingForm,
    [isSubmittingForm, submittingCredentials],
  )

  useEffect(() => {
    const credentials = { ...values }

    setFormattedCredentials(credentials)
  }, [values])

  useEffect(
    () => (wrongCredentials ? setWrongCredentialsVisibility(true) : void 0),
    [wrongCredentials],
  )

  useEffect(
    () => (!isWrongCredentialsModalOpen ? setWrongCredentials(false) : void 0),
    [isWrongCredentialsModalOpen],
  )

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
      <div className="inline-flex flex-col rounded-md shadow-sm bg-white">
        <Suspense>
          <Input
            name="email"
            type="email"
            autoComplete="off"
            autoFocus={false}
            onChange={handleChange}
            value={values.email as string}
            required
            className={classNames(
              'relative rounded-t-md !rounded-b-none text-gray-900',
              'border border-gray-300 placeholder:text-gray-400',
              'focus:border-blue-600 focus:z-[1]',
            )}
            placeholder="Correo electrónico"
            allowFloatingLabel={false}
            disabled={submitting}
          />

          <PasswordInput
            name="password"
            autoComplete="off"
            autoFocus={false}
            onChange={handleChange}
            value={values.password as string}
            required
            className={classNames(
              'rounded-b-md !rounded-t-none text-gray-900',
              'border border-gray-300 placeholder:text-gray-400',
              'focus:border-blue-600 focus:z-[1]',
            )}
            placeholder="Contraseña"
            disabled={submitting}
          />
        </Suspense>
      </div>

      {Object.values(errors).length > 0 && (
        <div className="rounded bg-red-100 ring-1 ring-red-600 p-2">
          {Object.values(errors).map((error, key) => (
            <div key={key} className="py-1 text-red-500 text-sm">
              {capitalize(error as string)}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            onChange={handleChange}
            value={String(values.remember ?? 'false')}
            checked={!!values.remember}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-800"
            disabled={submitting}
          />

          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <button
            type="button"
            role="button"
            onClick={() => setForgotPasswordVisibility(true)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Olvidé mi contraseña
          </button>
        </div>
      </div>

      <div className="inline-flex flex-col">
        <button
          type="submit"
          className={classNames(
            'group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold',
            'bg-blue-600 text-white',
            '[&:not(:disabled)]:hover:bg-blue-500 transition ease-in-out duration-200',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
          )}
          disabled={submitting}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon
              className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition ease-in-out duration-200"
              aria-hidden="true"
            />
          </span>

          {submitting ? (
            <Spinner size={1.5} sizeUnit="em" />
          ) : (
            <span>Entrar</span>
          )}
        </button>
      </div>

      <small className="text-gray-500 text-balance">
        Este sitio cuenta con la protección de Google reCAPTCHA&reg;, según los{' '}
        <a href="https://policies.google.com/terms?hl=es-419">
          términos de servicio
        </a>{' '}
        y la{' '}
        <a href="https://policies.google.com/privacy?hl=es-419">
          política de privacidad
        </a>{' '}
        de Google.
      </small>

      <WrongCredentialsModal
        open={isWrongCredentialsModalOpen}
        onClose={() => setWrongCredentialsVisibility(false)}
      />

      <ForgotPasswordModal
        open={isForgotPasswordModalOpen}
        onClose={() => setForgotPasswordVisibility(false)}
      />
    </form>
  )
}
