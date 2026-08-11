export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value)
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

export function formatDate(timestamp: number, days: number): string {
  const date = new Date(timestamp)
  if (days <= 1) {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}
