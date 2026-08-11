interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
