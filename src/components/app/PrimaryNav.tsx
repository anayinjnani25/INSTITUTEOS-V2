import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavItem, useNavGroups, isNavItemActive, DOCK_GROUP_TITLES } from '@/components/app/navigation'

/**
 * Corbel-style primary navigation: a rimmed pill track of tabs.
 * Single-destination tabs link directly; multi-page groups open a menu.
 * Uses the same items/routes/badges as before (see navigation.ts).
 */

interface Tab {
  key: string
  label: string
  items: NavItem[]
}

const sumBadges = (items: NavItem[]) =>
  items.reduce((n, i) => n + (typeof i.badge === 'number' ? i.badge : i.badge ? 1 : 0), 0)

const tabBase =
  'relative inline-flex items-center gap-1.5 h-10 px-3.5 2xl:px-4 rounded-full text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-200 ease-out select-none'
const tabActive = 'bg-[var(--pill)] text-[var(--on-pill)] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)]'
const tabIdle = 'text-text hover:bg-surface-strong'

const Count: React.FC<{ n: number; active: boolean }> = ({ n, active }) => (
  <span
    className={cn(
      'min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-bold tnum',
      active ? 'bg-black/10 text-[var(--on-pill)]' : 'bg-surface-strong text-text'
    )}
  >
    {n}
  </span>
)

export const PrimaryNav: React.FC<{ className?: string }> = ({ className }) => {
  const groups = useNavGroups()
  const location = useLocation()
  const [open, setOpen] = useState<{ key: string; left: number; top: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Build tabs: Home stands alone, dock-only groups are excluded.
  const tabs: Tab[] = []
  groups
    .filter((g) => !DOCK_GROUP_TITLES.includes(g.title || ''))
    .forEach((g) => {
      const home = g.items.find((i) => i.to === '/')
      if (home) tabs.push({ key: 'home', label: home.label, items: [home] })
      const rest = g.items.filter((i) => i.to !== '/')
      if (rest.length) tabs.push({ key: g.title || rest[0].to, label: g.title || rest[0].label, items: rest })
    })

  // Close on navigation, outside click, Escape, resize/scroll
  useEffect(() => setOpen(null), [location.pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || trackRef.current?.contains(t)) return
      setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const close = () => setOpen(null)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    trackRef.current?.addEventListener('scroll', close)
    const track = trackRef.current
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      track?.removeEventListener('scroll', close)
    }
  }, [open])

  // Keep the menu inside the viewport
  const [menuLeft, setMenuLeft] = useState<number | null>(null)
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return setMenuLeft(null)
    const w = menuRef.current.offsetWidth
    setMenuLeft(Math.max(12, Math.min(open.left, window.innerWidth - w - 12)))
  }, [open])

  const openTab = tabs.find((t) => t.key === open?.key)

  return (
    <>
      <div
        ref={trackRef}
        className={cn(
          'tabbar rounded-full p-1 flex items-center gap-0.5 overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className
        )}
        role="navigation"
        aria-label="Primary"
      >
        {tabs.map((tab) => {
          const active = tab.items.some((i) => isNavItemActive(i.to, location.pathname))
          const badge = sumBadges(tab.items)

          if (tab.items.length === 1) {
            const item = tab.items[0]
            return (
              <NavLink key={tab.key} to={item.to} className={cn(tabBase, active ? tabActive : tabIdle)}>
                {item.label}
                {badge > 0 && <Count n={badge} active={active} />}
              </NavLink>
            )
          }

          const isOpen = open?.key === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={(e) => {
                if (isOpen) return setOpen(null)
                const r = e.currentTarget.getBoundingClientRect()
                setOpen({ key: tab.key, left: r.left, top: r.bottom + 8 })
              }}
              className={cn(tabBase, active ? tabActive : tabIdle, isOpen && !active && 'bg-surface-strong')}
            >
              {tab.label}
              {badge > 0 && <Count n={badge} active={active} />}
              <ChevronDown
                className={cn('w-3.5 h-3.5 -mr-1 opacity-70 transition-transform duration-200', isOpen && 'rotate-180')}
                strokeWidth={2.25}
              />
            </button>
          )
        })}
      </div>

      {open && openTab && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={openTab.label}
          className="fixed z-[70] min-w-[240px] p-1.5 rounded-[20px] glass-strong shadow-popover"
          style={{ top: open.top, left: menuLeft ?? open.left }}
        >
          <div className="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-faint">
            {openTab.label}
          </div>
          {openTab.items.map((item) => {
            const Icon = item.icon
            const active = isNavItemActive(item.to, location.pathname)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                role="menuitem"
                className={cn(
                  'group flex items-center gap-3 h-11 px-2.5 rounded-[14px] text-[14px] font-semibold transition-colors',
                  active ? 'bg-surface-strong text-text' : 'text-text hover:bg-surface-sunken'
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                    active ? 'bg-[var(--pill)] text-[var(--on-pill)]' : 'bg-surface-strong text-text-muted group-hover:text-text'
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.9} />
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-bold bg-[#F2937C] text-[#111] tnum">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      )}
    </>
  )
}
