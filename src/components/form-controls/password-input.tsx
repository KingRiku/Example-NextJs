import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import EyeSlashIcon from '@heroicons/react/24/outline/EyeSlashIcon'
import capitalize from '@stdlib/string/capitalize'
import classNames from 'classnames'
import { Fragment, createElement, useId, useState } from 'react'
import type { Merge } from 'type-fest'

type PasswordInputProps = Merge<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  {
    wrapperClassName?: string
    allowVisibilityToggle?: boolean
    warningMessage?: string
    floatingLabel?: string
  }
>

export default function PasswordInput({
  wrapperClassName,
  allowVisibilityToggle = true,
  warningMessage,
  floatingLabel,
  ...inputProps
}: PasswordInputProps) {
  const inputId = useId()

  const [isPasswordVisible, setPasswordVisibility] = useState(false)

  return (
    <Fragment>
      <div className={classNames('relative inline-flex', wrapperClassName)}>
        <input
          id={inputId}
          {...inputProps}
          type={isPasswordVisible ? 'text' : 'password'}
          className={classNames(
            'inline-block w-full text-sm rounded appearance-none focus:outline-none focus:ring-0 peer',
            'text-gray-900 bg-transparent border-gray-300 focus:border-ring-light-blue',
            inputProps.className,
          )}
          placeholder={floatingLabel ? ' ' : inputProps.placeholder}
        />

        {floatingLabel && (
          <label
            htmlFor={inputId}
            className={classNames(
              'absolute text-base duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] px-2 left-1',
              'peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2',
              'peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4',
              'text-gray-500 bg-white peer-focus:text-blue-600',
            )}
          >
            {capitalize(floatingLabel)}
          </label>
        )}

        {allowVisibilityToggle && (
          <div className="absolute z-[2] inset-y-0 right-0 flex items-center">
            <button
              className={classNames(
                'h-full rounded-br-md border-0 py-0 px-3 focus:ring-0 text-sm',
                'bg-transparent text-gray-500',
              )}
              type="button"
              role="button"
              onClick={() => setPasswordVisibility((visibility) => !visibility)}
            >
              {createElement(isPasswordVisible ? EyeSlashIcon : EyeIcon, {
                className: 'text-gray-400 h-6 w-6',
                'aria-hidden': true,
              })}
            </button>
          </div>
        )}
      </div>

      {warningMessage && (
        <p className="-mt-3 mb-1 text-xs text-red-600">{warningMessage}</p>
      )}
    </Fragment>
  )
}
