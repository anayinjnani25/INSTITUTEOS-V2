import React from 'react'
import { ArrowUpRight, ArrowUp, ArrowDown, Info } from 'lucide-react'
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
        'kpi-tile group relative flex flex-col pt-[18px] px-5 pb-4 rounded-card border border-border bg-surface select-none text-left overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-text-muted min-w-0">
          {icon && <span className="shrink-0 text-text-muted [&_svg]:w-4 [&_svg]:h-4">{icon}</span>}
          <span className="truncate">{label}</span>
          <Info className="w-3.5 h-3.5 shrink-0 opacity-60" strokeWidth={2} aria-hidden="true" />
        </span>
        {onClick && (
          <ArrowUpRight
            className="w-4 h-4 shrink-0 text-text-muted transition-all duration-300 ease-out group-hover:text-text group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        )}
      </div>

      <div className="mt-2.5 font-display text-[30px] leading-9 font-semibold tracking-[-0.02em] text-text tnum">
        {value}
      </div>

      {trendText && (
        <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-text-muted">
          <span
            className={cn(
              'inline-flex items-start gap-1 min-h-6 py-0.5 px-2 rounded-[12px] text-[12px] leading-[18px] font-semibold',
              isPos === true
                ? 'text-success bg-white/70'
                : isPos === false
                ? 'text-danger bg-white/70'
                : 'text-text-muted bg-white/50'
            )}
          >
            {isPos === true ? (
              <ArrowUp className="w-3 h-3 mt-[3px] shrink-0" strokeWidth={2.5} />
            ) : isPos === false ? (
              <ArrowDown className="w-3 h-3 mt-[3px] shrink-0" strokeWidth={2.5} />
            ) : null}
            {trendText}
          </span>
        </div>
      )}

      {(target || subtext) && (
        <div className="mt-auto pt-3">
          <div className="border-t border-dashed border-border pt-2.5 text-[13px] font-medium text-text-muted truncate">
            {target || subtext}
          </div>
        </div>
      )}
    </div>
  )
}
