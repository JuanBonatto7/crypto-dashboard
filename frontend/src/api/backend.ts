import type { Coin, CoinDetail, Favorite, MarketChartPoint } from '../types/coin'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init)

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Error al consultar la API (${response.status})`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function fetchCoinMarkets(): Promise<Coin[]> {
  return request<Coin[]>('/coins')
}

export function fetchCoinsByIds(ids: string[]): Promise<Coin[]> {
  if (ids.length === 0) return Promise.resolve([])
  return request<Coin[]>(`/coins?ids=${ids.join(',')}`)
}

export function fetchCoinDetail(id: string): Promise<CoinDetail> {
  return request<CoinDetail>(`/coins/${id}`)
}

export function fetchMarketChart(id: string, days: number): Promise<MarketChartPoint[]> {
  return request<MarketChartPoint[]>(`/coins/${id}/chart?days=${days}`)
}

export function fetchFavorites(): Promise<Favorite[]> {
  return request<Favorite[]>('/favorites')
}

export function addFavorite(coinId: string): Promise<Favorite> {
  return request<Favorite>(`/favorites/${coinId}`, { method: 'POST' })
}

export function removeFavorite(coinId: string): Promise<void> {
  return request<void>(`/favorites/${coinId}`, { method: 'DELETE' })
}
