export function Loader({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-brand-600 dark:border-slate-700" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
