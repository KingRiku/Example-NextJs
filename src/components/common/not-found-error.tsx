import classNames from 'classnames'

export default function NotFoundErrorContent() {
  return (
    <section className="inline-flex flex-col w-full text-center m-auto gap-6">
      <h1 className="font-extrabold text-7xl">
        <span
          className={classNames(
            'supports-[background-clip]:bg-clip-text',
            'supports-[background-clip]:text-transparent supports-[background-clip]:bg-gradient-to-r',
            'supports-[background-clip]:from-blue-600 supports-[background-clip]:to-blue-500',
          )}
        >
          404
        </span>
      </h1>

      <p className="font-semibold text-2xl">
        No se pudo encontrar el recurso solicitado
      </p>

      <p className="text-sm">
        Por favor, verifique la URL e intente nuevamente
      </p>
    </section>
  )
}
