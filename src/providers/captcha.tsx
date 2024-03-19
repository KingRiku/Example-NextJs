'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export default function CaptchaProvider({
  children,
}: React.PropsWithChildren<WithoutProps>) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      language="es_CL"
      scriptProps={{
        appendTo: 'body',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
