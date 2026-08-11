export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_percentage_24h: number | null
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  description: { en: string }
  image: { large: string }
  market_cap_rank: number
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    high_24h: { usd: number }
    low_24h: { usd: number }
    price_change_percentage_24h: number | null
    price_change_percentage_7d: number | null
    ath: { usd: number }
    ath_change_percentage: { usd: number }
    circulating_supply: number
  }
  links: { homepage: string[] }
}

export interface MarketChartPoint {
  timestamp: number
  price: number
}

export type SortOption = 'market_cap_desc' | 'price_desc' | 'price_asc' | 'change_desc' | 'change_asc'
