import type { Coin } from '../types/coin'
import { CoinCard } from './CoinCard'

interface CoinGridProps {
  coins: Coin[]
}

export function CoinGrid({ coins }: CoinGridProps) {
  if (coins.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
        No se encontraron resultados.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  )
}
