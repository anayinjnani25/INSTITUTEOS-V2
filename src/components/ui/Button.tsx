import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-7 px-2.5 text-xs rounded-full gap-1',
      sm: 'h-8 px-3 text-xs rounded-full gap-1.5',
      md: 'h-9 px-4 text-[13px] font-medium rounded-full gap-2',
      lg: 'h-11 px-5 text-sm font-medium rounded-full gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-full justify-center items-center',
    }

    const variantClasses = {
      primary:
        'bg-accent text-white border border-white/10 shadow-[0_8px_22px_-10px_rgb(var(--accent-rgb)/0.9),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 hover:shadow-[0_12px_28px_-10px_rgb(var(--accent-rgb)/0.95),inset_0_1px_0_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:pointer-events-none',
      secondary:
        'glass-pill text-[var(--btn-secondary-fg)] disabled:opacity-50 disabled:pointer-events-none',
      outline:
        'border border-border-strong text-text bg-transparent hover:bg-surface-sunken hover:border-text-muted disabled:opacity-50',
      ghost:
        'text-text-muted hover:text-text hover:bg-surface-strong disabled:opacity-50',
      destructive:
        'bg-[#E5484D] text-white border border-white/10 shadow-[0_8px_22px_-10px_rgba(229,72,77,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#EC5D62] disabled:opacity-50',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center select-none font-medium whitespace-nowrap transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
