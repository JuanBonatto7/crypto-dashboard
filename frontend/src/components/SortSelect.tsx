import type { SortOption } from '../types/coin'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'market_cap_desc', label: 'Market cap (mayor a menor)' },
  { value: 'price_desc', label: 'Precio (mayor a menor)' },
  { value: 'price_asc', label: 'Precio (menor a mayor)' },
  { value: 'change_desc', label: 'Variación 24h (mayor a menor)' },
  { value: 'change_asc', label: 'Variación 24h (menor a mayor)' },
]

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as SortOption)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
