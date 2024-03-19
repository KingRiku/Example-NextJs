import classNames from 'classnames'

type ContainerCardProps = React.PropsWithChildren<{
  className?: string
  title?: React.ReactNode
}>

export default function ContainerCard({
  children,
  className,
  title,
}: ContainerCardProps) {
  return (
    <div
      className={classNames(
        'flex flex-col gap-6 p-6 shadow-lg rounded-md bg-white !w-[inherit]',
        className,
      )}
    >
      <div className="inline-flex flex-col gap-6">
        {title && <h1 className="text-2xl font-extrabold">{title}</h1>}

        {children}
      </div>
    </div>
  )
}
