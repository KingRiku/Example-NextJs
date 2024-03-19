export default function Footer() {
  return (
    <footer className="inline-flex w-full gap-1 justify-center p-4 text-xs bg-gray-700 text-gray-400">
      <span>{new Date().getFullYear()} - Stratego Monitor</span>

      <span>|</span>

      <span>Stratego Technologies</span>
    </footer>
  )
}
