import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Float } from '@headlessui-float/react'
import { Listbox as LibListbox, Transition } from '@headlessui/react'
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon'
import classNames from 'classnames'
import { Fragment, useId } from 'react'

type Option = {
  label: string
  value: string
}

type ListboxProps = {
  className?: string
  name: string
  label?: string
  placeholder?: React.ReactNode
  options: Array<Option>
  value?: Option['value']
  onChange: (value: Option['value']) => void
  disabled?: boolean
}

export default function Listbox({
  className,
  name,
  label: controlLabel,
  options,
  placeholder,
  value,
  onChange,
  disabled,
}: ListboxProps) {
  const controlId = useId()

  return (
    <LibListbox
      as="div"
      name={name}
      className="relative"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {({ open }) => (
        <Float
          as="div"
          className={classNames('relative')}
          placement="bottom"
          offset={4}
          floatingAs={Fragment}
        >
          <div className="">
            <LibListbox.Button
              id={controlId}
              as="div"
              className={classNames(
                'relative py-2 pl-3 pr-12 w-full max-w-48 text-sm cursor-default rounded-md text-left border peer',
                'text-gray-900 border-gray-300',
                open && 'border-light-blue',
                'focus:border-ring-light-blue focus:outline-none',
                className,
                disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
              )}
            >
              <span className="inline-flex gap-2 w-full">
                <span className="relative inline-flex flex-wrap gap-1 truncate">
                  {value
                    ? options.find((option) => option.value === value)?.label
                    : placeholder ?? controlLabel}
                </span>

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </LibListbox.Button>

            <label
              htmlFor={controlId}
              className={classNames(
                'absolute text-sm duration-300 top-1 z-[1] origin-[0] px-2 rounded-lg left-1',
                'transform -translate-y-4 scale-75',
                'peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2',
                'peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4',
                'text-gray-500 bg-white',
                open && 'text-light-blue',
              )}
            >
              {controlLabel}
            </label>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <LibListbox.Options
              className={classNames(
                'absolute z-1 max-h-60 w-auto overflow-auto rounded py-1 text-sm shadow-xl ring-1',
                'focus:outline-none',
                'bg-white ring-gray-200',
              )}
            >
              {options.map(({ label, value: possibleValue }, key) => (
                <LibListbox.Option
                  key={key}
                  value={possibleValue}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-300 text-deep-blue' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <Fragment>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {label}
                      </span>

                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-light-blue">
                          <FontAwesomeIcon icon={faCheck} height="1em" />
                        </span>
                      )}
                    </Fragment>
                  )}
                </LibListbox.Option>
              ))}
            </LibListbox.Options>
          </Transition>
        </Float>
      )}
    </LibListbox>
  )
}
