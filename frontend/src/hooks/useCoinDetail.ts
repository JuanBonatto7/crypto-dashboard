import { useEffect, useState } from 'react'
import { fetchCoinDetail, fetchMarketChart } from '../api/coingecko'
import type { CoinDetail, MarketChartPoint } from '../types/coin'

interface UseCoinDetailResult {
  coin: CoinDetail | null
  chart: MarketChartPoint[]
  loading: boolean
  error: string | null
}

export function useCoinDetail(id: string | undefined, days: number): UseCoinDetailResult {
  const [coin, setCoin] = useState<CoinDetail | null>(null)
  const [chart, setChart] = useState<MarketChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [detail, chartData] = await Promise.all([
          fetchCoinDetail(id as string),
          fetchMarketChart(id as string, days),
        ])
        if (!cancelled) {
          setCoin(detail)
          setChart(chartData)
        }
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
  }, [id, days])

  return { coin, chart, loading, error }
}
