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
      xs: 'h-7 px-3 text-xs rounded-full gap-1',
      sm: 'h-8 px-3.5 text-xs rounded-full gap-1.5',
      md: 'h-10 px-4 text-[13.5px] font-semibold rounded-full gap-2',
      lg: 'h-11 px-5 text-sm font-semibold rounded-full gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-full justify-center items-center',
    }

    // Corbel-style: light ink pill for primary, rimmed glass for secondary
    const variantClasses = {
      primary:
        'bg-[var(--pill)] text-[var(--on-pill)] hover:bg-[var(--btn-primary-hover)] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.7)] disabled:opacity-50 disabled:pointer-events-none',
      secondary:
        'glass-pill text-[var(--btn-secondary-fg)] disabled:opacity-50 disabled:pointer-events-none',
      outline:
        'bg-transparent text-text shadow-[inset_0_0_0_1px_var(--border-strong)] hover:bg-surface-sunken disabled:opacity-50',
      ghost:
        'text-text-muted hover:text-text hover:bg-surface-strong disabled:opacity-50',
      destructive:
        'bg-danger/15 text-danger shadow-[inset_0_0_0_1px_rgb(var(--danger-rgb)/0.35)] hover:bg-danger/25 disabled:opacity-50',
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
