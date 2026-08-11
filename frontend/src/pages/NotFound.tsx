import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-500 dark:text-slate-400">La página que buscás no existe.</p>
      <Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Volver al dashboard
      </Link>
    </div>
  )
}
