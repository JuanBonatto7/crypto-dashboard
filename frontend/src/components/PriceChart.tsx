import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MarketChartPoint } from '../types/coin'
import { formatCurrency, formatDate } from '../utils/format'

interface PriceChartProps {
  data: MarketChartPoint[]
  days: number
}

export function PriceChart({ data, days }: PriceChartProps) {
  return (
    <div className="h-72 w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value: number) => formatDate(value, days)}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            width={80}
          />
          <Tooltip
            labelFormatter={(value: number) => formatDate(value, days)}
            formatter={(value: number) => [formatCurrency(value), 'Precio']}
          />
          <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="url(#priceColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
