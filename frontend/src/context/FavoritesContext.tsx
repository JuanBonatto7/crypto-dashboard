import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { addFavorite, fetchFavorites, removeFavorite } from '../api/backend'

interface FavoritesContextValue {
  favorites: string[]
  loading: boolean
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchFavorites()
      .then((data) => {
        if (!cancelled) setFavorites(data.map((favorite) => favorite.coinId))
      })
      .catch(() => {
        // Favorites are non-critical: if the backend is down, the rest of the app still works.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function isFavorite(id: string) {
    return favorites.includes(id)
  }

  function toggleFavorite(id: string) {
    const wasFavorite = favorites.includes(id)

    // Optimistic update: reflect the change immediately, roll back if the request fails.
    setFavorites((prev) => (wasFavorite ? prev.filter((f) => f !== id) : [...prev, id]))

    const request = wasFavorite ? removeFavorite(id) : addFavorite(id).then(() => undefined)
    request.catch(() => {
      setFavorites((prev) => (wasFavorite ? [...prev, id] : prev.filter((f) => f !== id)))
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider')
  return context
}
