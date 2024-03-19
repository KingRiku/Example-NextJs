export enum UserStatus {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Banned = 'banned',
}

export enum UserType {
  ClientDerivative = 'client-derivative',
  PlatformAdmin = 'platform-admin',
}

export enum UserEventType {
  Created = 'created',
  EmailChanged = 'email-changed',
  PasswordReset = 'password-reset',
  LoginAttempt = 'login-attempt',
}
