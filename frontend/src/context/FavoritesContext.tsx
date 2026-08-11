import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface FavoritesContextValue {
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

const STORAGE_KEY = 'crypto-dashboard-favorites'

function getInitialFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as string[]) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(getInitialFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function isFavorite(id: string) {
    return favorites.includes(id)
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider')
  return context
}
