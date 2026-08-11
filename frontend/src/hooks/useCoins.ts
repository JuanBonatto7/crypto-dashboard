import { useEffect, useState } from 'react'
import { fetchCoinMarkets } from '../api/coingecko'
import type { Coin } from '../types/coin'

interface UseCoinsResult {
  coins: Coin[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useCoins(): UseCoinsResult {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCoinMarkets()
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
  }, [attempt])

  function reload() {
    setAttempt((prev) => prev + 1)
  }

  return { coins, loading, error, reload }
}
