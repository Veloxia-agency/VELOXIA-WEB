import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Metric } from '@/types/os'
import { clsx } from 'clsx'

interface Props {
  metric: Metric
}

export default function MetricCard({ metric }: Props) {
  const TrendIcon =
    metric.trend === 'up'   ? TrendingUp :
    metric.trend === 'down' ? TrendingDown : Minus

  const trendColor =
    metric.trend === 'up'   ? 'text-green-400' :
    metric.trend === 'down' ? 'text-red-400' : 'text-muted'

  return (
    <div className="border border-gold/[0.18] bg-surface p-4 hover:border-gold/40
                    transition-colors duration-200 group">
      <p className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase mb-3">
        {metric.label}
      </p>
      <p className="font-display text-3xl text-white tracking-wide mb-2">
        {metric.value}
        {metric.unit && <span className="text-lg text-muted ml-1">{metric.unit}</span>}
      </p>
      {metric.delta && (
        <div className={clsx('flex items-center gap-1', trendColor)}>
          <TrendIcon size={12} />
          <span className="font-mono-os text-[11px]">{metric.delta}</span>
        </div>
      )}
    </div>
  )
}
