import { useMemo, useState } from 'react'
import { useCoins } from '../hooks/useCoins'
import { useDebounce } from '../hooks/useDebounce'
import { SearchBar } from '../components/SearchBar'
import { SortSelect } from '../components/SortSelect'
import { CoinGrid } from '../components/CoinGrid'
import { Pagination } from '../components/Pagination'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import type { SortOption } from '../types/coin'

const PAGE_SIZE = 12

export function Dashboard() {
  const { coins, loading, error, reload } = useCoins()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('market_cap_desc')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)

  const filteredAndSorted = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const filtered = term
      ? coins.filter(
          (coin) => coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term),
        )
      : coins

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price_desc':
          return b.current_price - a.current_price
        case 'price_asc':
          return a.current_price - b.current_price
        case 'change_desc':
          return (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
        case 'change_asc':
          return (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)
        case 'market_cap_desc':
        default:
          return b.market_cap - a.market_cap
      }
    })

    return sorted
  }, [coins, debouncedSearch, sort])

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filteredAndSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSortChange(value: SortOption) {
    setSort(value)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mercado de criptomonedas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Datos en vivo provistos por la API pública de CoinGecko.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={handleSearchChange} />
        <SortSelect value={sort} onChange={handleSortChange} />
      </div>

      {loading && <Loader label="Cargando mercado..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && (
        <>
          <CoinGrid coins={paginated} />
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
