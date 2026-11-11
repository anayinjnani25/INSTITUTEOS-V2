import React, { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  ChevronDown,
  User,
  Shield,
  Check,
  LogOut,
  ChevronRight,
  Sparkles,
  Home as HomeIcon,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext'
import { UserRole, Branch } from '@/types'
import { cn } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabase'

export const TopBar: React.FC = () => {
  const {
    role,
    setRole,
    branch,
    setBranch,
    toggleCopilot,
    setCommandPaletteOpen,
    unreadApprovalsCount,
    logout,
  } = useApp()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [branchMenuOpen, setBranchMenuOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false)
      }
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  const pathnames = location.pathname.split('/').filter((x) => x)
  const breadcrumbNameMap: Record<string, string> = {
    approvals: 'Approvals',
    timetable: 'Timetable',
    attendance: 'Sessions & attendance',
    recordings: 'Recordings',
    students: 'Students',
    risk: 'Risk',
    trainers: 'Trainers',
    courses: 'Courses',
    batches: 'Batches',
    certificates: 'Certificates',
    fees: 'Fees & EMIs',
    payments: 'Payments',
    analytics: 'Analytics',
    messages: 'Messages',
    audit: 'Audit log',
    settings: 'Settings',
    setup: 'Setup',
    me: 'Profile',
  }

  const allRoles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'owner', label: 'Owner (Rajesh Sharma)', desc: 'Full institute operations' },
    { id: 'admin', label: 'Admin (System Admin)', desc: 'Academic and operations coordinator' },
    { id: 'trainer', label: 'Trainer (Arjun Mehta)', desc: 'Zero fee visibility' },
    { id: 'counselor', label: 'Counselor (Snehal K.)', desc: 'Student risk and attendance' },
    { id: 'accounts', label: 'Accounts (Sunita A.)', desc: 'Dues and reconciliation' },
    { id: 'student', label: 'Student (Priya Nair)', desc: 'Student portal view' },
  ]

  const branches: (Branch | 'All')[] = ['All', 'Kothrud', 'Baner']

  const iconBtn =
    'glass-pill relative w-10 h-10 flex items-center justify-center text-text hover:text-text shrink-0'

  return (
    <header className="sticky top-0 z-20 px-3 sm:px-5 md:px-8 pt-3 pb-2 select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="glass-pill h-10 pl-1.5 pr-4 flex items-center gap-1.5 text-[13px] min-w-0"
        >
          <Link
            to="/"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-strong text-text hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-fg)] transition-colors shrink-0"
            aria-label="Home"
          >
            <HomeIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
          <span className="text-text-muted hidden sm:inline">Home</span>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1
            const title = breadcrumbNameMap[value] || value

            return (
              <React.Fragment key={to}>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted/60 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {isLast ? (
                  <span className="font-medium text-text truncate" aria-current="page">
                    {title}
                  </span>
                ) : (
                  <Link to={to} className="text-text-muted hover:text-text transition-colors truncate">
                    {title}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        {/* Centre: Search field "Search or ask… ⌘K" */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="glass-pill w-full h-10 flex items-center justify-between pl-4 pr-2 text-[13px] text-text-muted hover:text-text group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
              <span>Search or ask…</span>
            </div>
            <kbd className="font-mono text-[10.5px] px-2 py-0.5 rounded-full bg-surface-strong border border-border text-text-muted">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isSupabaseConfigured && (
            <span className="hidden xl:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[10.5px] font-medium bg-warning/15 text-warning border border-warning/25">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-[pulse_2s_ease-in-out_infinite]" />
              Demo data
            </span>
          )}

          {/* Search (compact screens) */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className={cn(iconBtn, 'lg:hidden')}
            aria-label="Search or ask"
            title="Search or ask (⌘K)"
          >
            <Search className="w-4 h-4" strokeWidth={1.75} />
          </button>

          {/* Branch Switcher */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchMenuOpen(!branchMenuOpen)}
              className="glass-pill h-10 px-2.5 sm:px-3.5 flex items-center gap-2 text-[13px] text-text"
              title="Branch scope"
            >
              <Building2 className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">{branch === 'All' ? 'All branches' : branch}</span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 text-text-muted transition-transform duration-200', branchMenuOpen && 'rotate-180')}
                strokeWidth={1.75}
              />
            </button>

            {branchMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-[20px] glass-strong shadow-popover p-1.5 z-50 text-[13px] text-text">
                <div className="px-3 pt-1.5 pb-1 text-[10.5px] uppercase tracking-[0.08em] text-text-muted">Pune branches</div>
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBranch(b)
                      setBranchMenuOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors',
                      branch === b ? 'bg-surface-strong text-text' : 'text-text hover:bg-surface-sunken'
                    )}
                  >
                    <span>{b === 'All' ? 'All branches' : `${b} campus`}</span>
                    {branch === b && <Check className="w-4 h-4 text-accent" strokeWidth={2} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "Ask" (⌘J) */}
          <button
            onClick={toggleCopilot}
            className="glass-pill h-10 px-3 sm:px-3.5 flex items-center gap-2 text-[13px] font-medium text-text"
            title="Ask Copilot (⌘J)"
          >
            <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.75} />
            <span className="hidden sm:inline">Ask</span>
            <kbd className="hidden md:inline font-mono text-[10.5px] text-text-muted">⌘J</kbd>
          </button>

          {/* Notifications */}
          <Link
            to="/approvals"
            className={iconBtn}
            title="Approvals and alerts"
            aria-label="Approvals and alerts"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            {unreadApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F0445B] text-white text-[10px] font-semibold flex items-center justify-center tnum shadow-[0_4px_10px_-2px_rgba(240,68,91,0.6)]">
                {unreadApprovalsCount > 9 ? '9+' : unreadApprovalsCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(iconBtn, 'hidden sm:flex')}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            <span key={resolvedTheme} className="animate-[io-pop_360ms_cubic-bezier(0.22,1,0.36,1)_backwards]">
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4" strokeWidth={1.75} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.75} />
              )}
            </span>
          </button>

          {/* Avatar Menu with Demo Role Switcher */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className="relative w-10 h-10 rounded-full transition-transform duration-200 hover:scale-105"
              aria-label="User account and role menu"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(242,118,58,0.7),inset_0_1px_0_rgba(255,255,255,0.35)]">
                {role.substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success ring-2 ring-[var(--surface-solid)]" />
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[22px] glass-strong shadow-popover p-1.5 z-50 text-[13px] text-text">
                <div className="flex items-center gap-3 px-3 pt-2 pb-3 border-b border-border">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                    {role.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-text">CodeCraft Academy</div>
                    <div className="text-[11px] text-text-muted font-mono">Role: {role}</div>
                  </div>
                </div>

                {/* Demo Role Switcher */}
                <div className="py-1.5">
                  <div className="px-3 pb-1.5 pt-1 text-[10.5px] uppercase tracking-[0.08em] text-text-muted font-medium flex items-center gap-1.5">
                    <Shield className="w-3 h-3" strokeWidth={1.75} />
                    Demo role switcher
                  </div>
                  {allRoles.map((r) => {
                    const isCurrent = role === r.id
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id)
                          setAvatarMenuOpen(false)
                        }}
                        className={cn(
                          'w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-colors',
                          isCurrent ? 'bg-surface-strong' : 'hover:bg-surface-sunken'
                        )}
                      >
                        <span
                          className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                            isCurrent ? 'border-accent bg-accent' : 'border-border-strong'
                          )}
                        >
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <div className="min-w-0">
                          <div className={cn('text-[13px] text-text', isCurrent && 'font-medium')}>{r.label}</div>
                          <div className="text-[11px] text-text-muted">{r.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="pt-1.5 border-t border-border space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-sunken text-text transition-colors"
                  >
                    <User className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setAvatarMenuOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-danger/10 text-danger transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.75} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
