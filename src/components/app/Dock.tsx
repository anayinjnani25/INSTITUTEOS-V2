import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Search, Sparkles, Sun, Moon, UserRound, LucideIcon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { useNavGroups, isNavItemActive, DOCK_GROUP_TITLES } from '@/components/app/navigation'

/**
 * Corbel-style floating utility dock.
 * Desktop/tablet: vertical pill at the left edge, vertically centred.
 * Phone: horizontal pill fixed to the bottom centre.
 * Holds global actions (search, Ask, theme) and the admin destinations.
 */

const btn =
  'group relative w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-text transition-all duration-200 ease-out hover:bg-surface-strong active:scale-95'
const btnActive = 'bg-[var(--pill)] text-[var(--on-pill)] hover:bg-[var(--pill)]'

const Divider = () => <span className="block shrink-0 bg-border w-px h-6 md:w-6 md:h-px mx-0.5 md:mx-0 md:my-0.5" />

export const Dock: React.FC = () => {
  const { setCommandPaletteOpen, toggleCopilot } = useApp()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const groups = useNavGroups()
  const adminItems = groups.filter((g) => DOCK_GROUP_TITLES.includes(g.title || '')).flatMap((g) => g.items)

  // Presentation-only floating tooltip (desktop)
  const [tip, setTip] = useState<{ label: string; top: number; left: number } | null>(null)
  useEffect(() => setTip(null), [location.pathname])
  const show = (label: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 768) return
    const r = e.currentTarget.getBoundingClientRect()
    setTip({ label, top: r.top + r.height / 2, left: r.right + 14 })
  }
  const hide = () => setTip(null)

  const ico = (I: LucideIcon) => <I className="w-[19px] h-[19px]" strokeWidth={1.8} />

  return (
    <>
      <nav
        aria-label="Utilities"
        className={cn(
          'dock fixed z-40 rounded-full p-2 flex items-center gap-1',
          // phone: bottom centre, horizontal
          'bottom-4 left-1/2 -translate-x-1/2 flex-row',
          // tablet+: left edge, vertical, centred
          'md:bottom-auto md:left-5 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col'
        )}
      >
        <button
          type="button"
          className={btn}
          onClick={() => setCommandPaletteOpen(true)}
          onMouseEnter={show('Search  ⌘K')}
          onMouseLeave={hide}
          aria-label="Search or ask (⌘K)"
        >
          {ico(Search)}
        </button>

        {adminItems.length > 0 && <Divider />}
        {adminItems.map((item) => {
          const active = isNavItemActive(item.to, location.pathname)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(btn, active && btnActive)}
              onMouseEnter={show(item.label)}
              onMouseLeave={hide}
              aria-label={item.label}
            >
              {ico(item.icon)}
              {item.badge !== undefined && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#3A3A38] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--bg-base)]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}

        <NavLink
          to="/me"
          className={cn(btn, isNavItemActive('/me', location.pathname) && btnActive)}
          onMouseEnter={show('Account profile')}
          onMouseLeave={hide}
          aria-label="Account profile"
        >
          {ico(UserRound)}
        </NavLink>

        <Divider />

        <button
          type="button"
          className={btn}
          onClick={toggleCopilot}
          onMouseEnter={show('Ask Copilot  ⌘J')}
          onMouseLeave={hide}
          aria-label="Ask Copilot (⌘J)"
        >
          {ico(Sparkles)}
        </button>
        <button
          type="button"
          className={btn}
          onClick={toggleTheme}
          onMouseEnter={show(resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode')}
          onMouseLeave={hide}
          aria-label="Toggle theme"
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span key={resolvedTheme} className="animate-[io-pop_360ms_cubic-bezier(0.2,0.8,0.2,1)_backwards]">
            {ico(resolvedTheme === 'dark' ? Sun : Moon)}
          </span>
        </button>
      </nav>

      {tip && (
        <div
          role="tooltip"
          className="fixed z-[60] pointer-events-none -translate-y-1/2 h-8 px-3 inline-flex items-center rounded-full glass-strong text-[12.5px] font-semibold text-text whitespace-pre animate-[io-tooltip_180ms_cubic-bezier(0.2,0.8,0.2,1)_backwards]"
          style={{ top: tip.top, left: tip.left }}
        >
          {tip.label}
        </div>
      )}
    </>
  )
}
