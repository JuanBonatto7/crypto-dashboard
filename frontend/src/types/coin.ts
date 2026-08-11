// These shapes mirror the DTOs returned by our own backend
// (backend/src/main/java/com/juanbonatto/cryptodashboard/dto), not CoinGecko's raw response.

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChangePercentage24h: number | null
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  description: string
  image: string
  marketCapRank: number
  currentPrice: number
  marketCap: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChangePercentage24h: number | null
  priceChangePercentage7d: number | null
  ath: number
  athChangePercentage: number
  circulatingSupply: number
  homepage: string
}

export interface MarketChartPoint {
  timestamp: number
  price: number
}

export interface Favorite {
  coinId: string
  createdAt: string
}

export type SortOption = 'market_cap_desc' | 'price_desc' | 'price_asc' | 'change_desc' | 'change_asc'
