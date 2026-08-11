import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCoinDetail } from '../hooks/useCoinDetail'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { PriceChart } from '../components/PriceChart'
import { StatCard } from '../components/StatCard'
import { useFavorites } from '../context/FavoritesContext'
import { formatCompactNumber, formatCurrency, formatPercentage, stripHtml } from '../utils/format'

const RANGES = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '1a', days: 365 },
]

export function CoinDetail() {
  const { id } = useParams<{ id: string }>()
  const [days, setDays] = useState(7)
  const { coin, chart, loading, error } = useCoinDetail(id, days)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (loading) return <Loader label="Cargando moneda..." />
  if (error || !coin) return <ErrorMessage message={error ?? 'No se encontró la moneda.'} />

  const favorite = isFavorite(coin.id)
  const change = coin.priceChangePercentage24h
  const positive = (change ?? 0) >= 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm text-brand-600 hover:underline dark:text-brand-400">
        ← Volver al dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold">
              {coin.name} <span className="text-slate-400 uppercase">{coin.symbol}</span>
            </h1>
            <p className="text-sm text-slate-500">Ranking #{coin.marketCapRank}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(coin.id)}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {favorite ? '⭐ En favoritos' : '☆ Agregar a favoritos'}
        </button>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <p className="text-3xl font-bold">{formatCurrency(coin.currentPrice)}</p>
        <p className={positive ? 'font-medium text-emerald-500' : 'font-medium text-rose-500'}>
          {formatPercentage(change)} (24h)
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        {RANGES.map((range) => (
          <button
            key={range.days}
            type="button"
            onClick={() => setDays(range.days)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              days === range.days
                ? 'bg-brand-600 text-white'
                : 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <PriceChart data={chart} days={days} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Market cap" value={formatCompactNumber(coin.marketCap)} />
        <StatCard label="Volumen 24h" value={formatCompactNumber(coin.totalVolume)} />
        <StatCard label="Máximo 24h" value={formatCurrency(coin.high24h)} />
        <StatCard label="Mínimo 24h" value={formatCurrency(coin.low24h)} />
        <StatCard label="Máximo histórico" value={formatCurrency(coin.ath)} />
        <StatCard label="Suministro circulante" value={formatCompactNumber(coin.circulatingSupply)} />
      </div>

      {coin.description && (
        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">Acerca de {coin.name}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {stripHtml(coin.description).split('. ').slice(0, 4).join('. ')}
          </p>
        </div>
      )}
    </div>
  )
}
