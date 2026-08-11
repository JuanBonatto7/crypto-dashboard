import { Link } from 'react-router-dom'
import type { Coin } from '../types/coin'
import { formatCompactNumber, formatCurrency, formatPercentage } from '../utils/format'
import { useFavorites } from '../context/FavoritesContext'

interface CoinCardProps {
  coin: Coin
}

export function CoinCard({ coin }: CoinCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(coin.id)
  const change = coin.price_change_percentage_24h
  const positive = (change ?? 0) >= 0

  return (
    <Link
      to={`/coin/${coin.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="h-9 w-9" loading="lazy" />
          <div>
            <p className="font-semibold leading-tight">{coin.name}</p>
            <p className="text-xs uppercase text-slate-400">{coin.symbol}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            toggleFavorite(coin.id)
          }}
          aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="text-xl transition-transform hover:scale-110"
        >
          {favorite ? '⭐' : '☆'}
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold">{formatCurrency(coin.current_price)}</p>
          <p className={positive ? 'text-sm font-medium text-emerald-500' : 'text-sm font-medium text-rose-500'}>
            {formatPercentage(change)}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Market cap</p>
          <p className="font-medium text-slate-500 dark:text-slate-300">{formatCompactNumber(coin.market_cap)}</p>
        </div>
      </div>
    </Link>
  )
}
