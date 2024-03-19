export function fetcher<T = any>(...args: Parameters<typeof fetch>) {
  return fetch(...args).then((res) => res.json()) as Promise<T>
}

export function fetcherWithCustomHeaders<T = any>(
  headers: Record<string, string>,
) {
  return (...args: Parameters<typeof fetch>) =>
    fetch(args[0], {
      ...args[1],
      headers: {
        ...args[1]?.headers,
        ...headers,
      },
    }).then((response) => response.json()) as Promise<T>
}
