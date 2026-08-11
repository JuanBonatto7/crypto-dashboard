import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { fetchCoinsByIds } from '../api/backend'
import type { Coin } from '../types/coin'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { CoinGrid } from '../components/CoinGrid'

export function Favorites() {
  const { favorites } = useFavorites()
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCoinsByIds(favorites)
        if (!cancelled) setCoins(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error inesperado')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [favorites])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Tus favoritos</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Guardados en el servidor, persistidos en la base de datos del backend.
      </p>

      {favorites.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
          Todavía no agregaste ninguna moneda a favoritos.{' '}
          <Link to="/" className="text-brand-600 hover:underline dark:text-brand-400">
            Explorá el dashboard
          </Link>
          .
        </div>
      )}

      {favorites.length > 0 && loading && <Loader label="Cargando favoritos..." />}
      {favorites.length > 0 && !loading && error && <ErrorMessage message={error} />}
      {favorites.length > 0 && !loading && !error && <CoinGrid coins={coins} />}
    </div>
  )
}
