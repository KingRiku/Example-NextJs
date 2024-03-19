import classNames from 'classnames'
import { useId, useMemo } from 'react'
import type { Merge } from 'type-fest'

type InputProps = Merge<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  {
    allowFloatingLabel?: boolean
    wrapperClassName?: string
    label?: string
    name: string
    note?: string
    placeholder?: string
  }
>

const Input = ({
  allowFloatingLabel = true,
  wrapperClassName,
  className,
  label,
  note,
  placeholder,
  ...inputProps
}: InputProps) => {
  const $id = useId()

  const controlId = useMemo(() => inputProps.id ?? $id, [$id, inputProps.id])

  return (
    <div
      className={classNames(
        'relative inline-flex flex-col gap-1',
        wrapperClassName,
      )}
    >
      <div className="relative">
        <input
          {...inputProps}
          id={controlId}
          placeholder={allowFloatingLabel ? ' ' : placeholder}
          className={classNames(
            'block w-full text-sm rounded appearance-none focus:outline-none focus:ring-0 peer',
            'text-gray-900 bg-transparent border border-gray-300',
            className,
          )}
        />

        <label
          htmlFor={controlId}
          className={classNames(
            !allowFloatingLabel && 'sr-only',
            'absolute text-base top-1 z-[1] origin-[0] px-2 rounded-lg left-1',
            'duration-300 transform -translate-y-4 scale-75',
            'peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2',
            'peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4',
            'text-gray-500 bg-white peer-focus:text-light-blue',
          )}
        >
          {label}
        </label>
      </div>

      {!!note && (
        <span className="inline-flex text-xs text-gray-500">{note}</span>
      )}
    </div>
  )
}

export default Input
