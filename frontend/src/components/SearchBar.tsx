interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre o símbolo..."
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
      />
    </div>
  )
}
