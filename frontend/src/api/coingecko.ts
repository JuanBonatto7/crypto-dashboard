import type { Coin, CoinDetail, MarketChartPoint } from '../types/coin'

const BASE_URL = 'https://api.coingecko.com/api/v3'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Se alcanzó el límite de peticiones a la API. Esperá unos segundos y volvé a intentar.')
    }
    throw new Error(`Error al consultar la API (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function fetchCoinMarkets(): Promise<Coin[]> {
  return request<Coin[]>(
    '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h',
  )
}

export function fetchCoinsByIds(ids: string[]): Promise<Coin[]> {
  if (ids.length === 0) return Promise.resolve([])
  return request<Coin[]>(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&ids=${ids.join(',')}`,
  )
}

export function fetchCoinDetail(id: string): Promise<CoinDetail> {
  return request<CoinDetail>(
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  )
}

interface MarketChartResponse {
  prices: [number, number][]
}

export async function fetchMarketChart(id: string, days: number): Promise<MarketChartPoint[]> {
  const data = await request<MarketChartResponse>(
    `/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
  )
  return data.prices.map(([timestamp, price]) => ({ timestamp, price }))
}
