export function pageTitle(...titleFragments: Array<string>) {
  const baseTitle = process.env.BRAND_NAME

  const title = [...titleFragments, baseTitle]
    .filter((fragment) => !!fragment)
    .join(' - ')

  return title
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
