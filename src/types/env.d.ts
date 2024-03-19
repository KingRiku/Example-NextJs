export {}

declare global {
  module NodeJS {
    interface ProcessEnv {
      //#region Session
      /**
       * @serverSide
       */
      SESSION_COOKIE_NAME: string
      /**
       * @serverSide
       */
      SESSION_COOKIE_PASSWORD: string
      /**
       * @serverSide
       */
      SESSION_COOKIE_SEAL_KEY: string
      //#endregion


      //#region Other session cookies
      NEXT_PUBLIC_SESSION_ACTIVE_CLIENT_COOKIE_NAME: string
      //#endregion

      //#region  MongoDB config
      /**
       * @serverSide
       */
      MONGODB_URI: string
      /**
       * @serverSide
       */
      MONGODB_NAME: string
      //#endregion

      //#region Google Maps API
      /**
       * @serverSide
       */
      GOOGLE_MAPS_API_KEY: string
      //#endregion

      //#region Geolocation API
      /**
       * @serverSide
       */
      IP_GEOLOCATION_API_URL: string
      /**
       * @serverSide
       */
      IP_GEOLOCATION_API_PATH: string
      /**
       * @serverSide
       */
      IP_GEOLOCATION_API_KEY: string
      //#endregion

      //#region Recaptcha
      /**
       * @serverSide
       */
      RECAPTCHA_VERIFICATION_URL: string
      /**
       * @serverSide
       */
      RECAPTCHA_SECRET_KEY: string
      /**
       * @serverSide
       */
      RECAPTCHA_MIN_SCORE: `${number}`
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string
      //#endregion
    }
  }
}
