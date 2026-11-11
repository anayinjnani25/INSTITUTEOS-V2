import React from 'react'
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KpiCardProps {
  label: string
  value: string | number
  target?: string
  trend?: string | { value: string; isPositive?: boolean; isNeutral?: boolean }
  delta?: { value: string; isPositive?: boolean; isNeutral?: boolean }
  trendPositive?: boolean | null // null for neutral
  subtext?: string
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  target,
  trend,
  delta,
  trendPositive = null,
  subtext,
  onClick,
  className,
  icon,
}) => {
  const deltaObj = typeof trend === 'object' ? trend : delta
  const trendText = typeof trend === 'string' ? trend : deltaObj?.value
  const isPos =
    trendPositive !== null
      ? trendPositive
      : deltaObj
      ? deltaObj.isNeutral
        ? null
        : deltaObj.isPositive ?? null
      : null
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'group relative p-5 rounded-card border border-border bg-surface select-none text-left overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <div className="w-9 h-9 rounded-xl bg-surface-strong border border-border flex items-center justify-center text-text transition-transform duration-300 ease-spring group-hover:scale-110 [&_svg]:w-[18px] [&_svg]:h-[18px]">
            {icon}
          </div>
        ) : (
          <span className="text-xs font-normal text-text-muted truncate">{label}</span>
        )}
        {onClick && (
          <ArrowUpRight
            className="w-4 h-4 text-text-muted transition-all duration-300 ease-out group-hover:text-text group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        )}
      </div>

      {icon && <div className="mt-4 text-xs font-normal text-text-muted truncate">{label}</div>}

      <div className={cn('flex items-baseline justify-between gap-2', icon ? 'mt-1' : 'mt-3')}>
        <div className="font-display text-[26px] leading-8 font-semibold tracking-tight text-text tnum">
          {value}
        </div>
      </div>

      {(trendText || target || subtext) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-text-muted">
          {trendText && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium',
                isPos === true
                  ? 'text-success bg-success/10 border-success/25'
                  : isPos === false
                  ? 'text-danger bg-danger/10 border-danger/25'
                  : 'text-text-muted bg-surface-sunken border-border'
              )}
            >
              {isPos === true ? (
                <TrendingUp className="w-3 h-3" strokeWidth={2} />
              ) : isPos === false ? (
                <TrendingDown className="w-3 h-3" strokeWidth={2} />
              ) : null}
              {trendText}
            </span>
          )}
          {target && <span className="text-text-muted ml-auto truncate">{target}</span>}
          {subtext && !target && <span className="text-text-muted ml-auto truncate">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
