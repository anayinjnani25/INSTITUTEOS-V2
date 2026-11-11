import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Building2,
  ChevronDown,
  User,
  Shield,
  Check,
  LogOut,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { UserRole, Branch } from '@/types'
import { cn } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabase'
import { PrimaryNav } from '@/components/app/PrimaryNav'

export const TopBar: React.FC = () => {
  const {
    role,
    setRole,
    branch,
    setBranch,
    unreadApprovalsCount,
    logout,
  } = useApp()

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
    'glass-pill relative w-11 h-11 flex items-center justify-center text-text shrink-0'

  return (
    <header className="sticky top-0 z-30 select-none before:absolute before:inset-0 before:-z-10 before:pointer-events-none before:[background:linear-gradient(to_bottom,var(--bg-base),transparent)] before:opacity-70">
      <div className="max-w-[1840px] mx-auto px-[var(--gut)] md:pl-[calc(var(--side-w)+var(--gut))] pt-[18px] pb-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 min-w-0 shrink-0 group" aria-label="CodeCraft Academy home">
            <span className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-bold text-[13px] flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(242,118,58,0.9),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform duration-300 ease-spring group-hover:rotate-[-4deg] group-hover:scale-105">
              IO
            </span>
            <span className="hidden sm:flex xl:hidden 2xl:flex flex-col min-w-0 leading-tight">
              <span className="text-[17px] font-bold text-text truncate">CodeCraft Academy</span>
              <span className="text-[12px] font-medium text-text-muted truncate">
                Institute OS{!isSupabaseConfigured && ' · Demo data'}
              </span>
            </span>
          </Link>

          {/* Primary tabs (wide screens: inline, centred) */}
          <div className="hidden xl:flex flex-1 justify-center min-w-0 px-2">
            <PrimaryNav />
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Branch Switcher */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchMenuOpen(!branchMenuOpen)}
              className="glass-pill h-11 px-3 sm:px-4 flex items-center gap-2 text-[13.5px] font-semibold text-text"
              title="Branch scope"
            >
              <Building2 className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden sm:inline xl:hidden 2xl:inline">{branch === 'All' ? 'All branches' : branch}</span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 text-text-muted transition-transform duration-200', branchMenuOpen && 'rotate-180')}
                strokeWidth={1.75}
              />
            </button>

            {branchMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-[20px] glass-strong shadow-popover p-1.5 z-50 text-[13px] text-text">
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

          {/* Notifications */}
          <Link to="/approvals" className={iconBtn} title="Approvals and alerts" aria-label="Approvals and alerts">
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {unreadApprovalsCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-[#F2937C] ring-2 ring-[var(--bg-base)]" />
            )}
          </Link>

          {/* Avatar Menu with Demo Role Switcher */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className="relative w-11 h-11 rounded-full p-[3px] glass-pill transition-transform duration-200 hover:scale-105"
              aria-label="User account and role menu"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(242,118,58,0.7),inset_0_1px_0_rgba(255,255,255,0.35)]">
                {role.substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success ring-2 ring-[var(--bg-base)]" />
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

        {/* Primary tabs (narrower screens: own scrollable row, like Corbel on mobile) */}
        <div className="xl:hidden mt-3 -mx-[var(--gut)] px-[var(--gut)] md:mx-0 md:px-0">
          <PrimaryNav className="w-fit" />
        </div>
      </div>
    </header>
  )
}
