import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckCheck,
  CalendarDays,
  ClipboardCheck,
  Video,
  Layers,
  GraduationCap,
  Activity,
  UserCog,
  BookOpen,
  Award,
  IndianRupee,
  Landmark,
  BarChart3,
  MessageSquare,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  School,
  FileCheck,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useStore } from '@/mocks/store'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'
import { canAccess } from '@/lib/permissions'

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number | string
  allowedRoles?: UserRole[]
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

export const Sidebar: React.FC = () => {
  const { role, unreadApprovalsCount } = useApp()
  const submissions = useStore((s) => s.submissions)
  const submissionsWaitingCount = submissions.filter(
    (s) =>
      s.status === 'submitted' ||
      s.status === 'late' ||
      s.status === 'graded_draft' ||
      s.status === 'resubmit_requested'
  ).length
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('batchwise-sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('batchwise-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Presentation-only: floating tooltip position for the icon dock
  const [tip, setTip] = useState<{ label: string; top: number; left: number } | null>(null)
  useEffect(() => {
    setTip(null)
  }, [location.pathname, collapsed])

  // Exact requested groups and order:
  // Today, Operations, People, Academics, Money, Reports, Admin
  const navGroups: NavGroup[] = [
    {
      title: 'Today',
      items: [
        {
          label: 'Home',
          to: '/',
          icon: LayoutDashboard,
        },
        {
          label: 'Approvals',
          to: '/approvals',
          icon: CheckCheck,
          badge: unreadApprovalsCount > 0 ? unreadApprovalsCount : undefined,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor', 'accounts'],
        },
        {
          label: 'Timetable',
          to: '/timetable',
          icon: CalendarDays,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          label: 'Sessions & attendance',
          to: '/attendance',
          icon: ClipboardCheck,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
        {
          label: 'Recordings',
          to: '/recordings',
          icon: Video,
          allowedRoles: ['owner', 'admin', 'trainer', 'student'],
        },
        {
          label: 'Batches',
          to: '/batches',
          icon: Layers,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
      ],
    },
    {
      title: 'People',
      items: [
        {
          label: 'Students',
          to: '/students',
          icon: GraduationCap,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
        {
          label: 'Risk',
          to: '/risk',
          icon: Activity,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
        {
          label: 'Trainers',
          to: '/trainers',
          icon: UserCog,
          allowedRoles: ['owner', 'admin'],
        },
      ],
    },
    {
      title: 'Academics',
      items: [
        {
          label: 'Courses',
          to: '/courses',
          icon: BookOpen,
          allowedRoles: ['owner', 'admin', 'trainer', 'counselor'],
        },
        {
          label: 'Certificates',
          to: '/certificates',
          icon: Award,
          allowedRoles: ['owner', 'admin', 'counselor'],
        },
      ],
    },
    {
      title: 'Classroom',
      items: [
        {
          label: 'Classes',
          to: '/classroom',
          icon: School,
          allowedRoles: ['owner', 'admin', 'trainer', 'student'],
        },
        {
          label: 'To review',
          to: '/classroom/review',
          icon: FileCheck,
          badge: submissionsWaitingCount > 0 ? submissionsWaitingCount : undefined,
          allowedRoles: ['owner', 'admin', 'trainer'],
        },
      ],
    },
    {
      title: 'Money',
      items: [
        {
          label: 'Fees & EMIs',
          to: '/fees',
          icon: IndianRupee,
          allowedRoles: ['owner', 'admin', 'accounts', 'counselor'],
        },
        {
          label: 'Payments',
          to: '/payments',
          icon: Landmark,
          allowedRoles: ['owner', 'admin', 'accounts'],
        },
      ],
    },
    {
      title: 'Reports',
      items: [
        {
          label: 'Analytics',
          to: '/analytics',
          icon: BarChart3,
          allowedRoles: ['owner', 'admin'],
        },
        {
          label: 'Messages',
          to: '/messages',
          icon: MessageSquare,
          allowedRoles: ['owner', 'admin', 'counselor'],
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          label: 'Audit log',
          to: '/audit',
          icon: ScrollText,
          allowedRoles: ['owner', 'admin'],
        },
        {
          label: 'Settings',
          to: '/settings',
          icon: Settings,
          allowedRoles: ['owner', 'admin'],
        },
      ],
    },
  ]

  // Filter out items not allowed for role using central canAccess helper
  const filteredGroups = navGroups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) => canAccess(role, item.to)),
    }))
    .filter((grp) => grp.items.length > 0)

  const displayName =
    role === 'trainer'
      ? 'Arjun Mehta'
      : role === 'counselor'
      ? 'Snehal Kulkarni'
      : role === 'accounts'
      ? 'Sunita Accounts'
      : 'Rajesh Sharma'

  const showTip = (label: string, e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTip({ label, top: r.top + r.height / 2, left: r.right + 12 })
  }
  const hideTip = () => setTip(null)

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen shrink-0 z-30 select-none flex py-3 pl-2 sm:pl-3 md:pl-4',
        collapsed ? 'items-center' : 'items-stretch'
      )}
    >
      <div
        className={cn(
          'glass rounded-[28px] flex flex-col overflow-hidden transition-[width] duration-sheet ease-out',
          collapsed ? 'w-[60px] max-h-full' : 'w-[60px] md:w-[236px] h-full'
        )}
      >
        {/* Brand + collapse toggle */}
        <div
          className={cn(
            'flex items-center gap-2 shrink-0 pt-2.5 pb-2',
            collapsed ? 'flex-col px-2' : 'flex-col md:flex-row px-2 md:pl-3 md:pr-2.5 md:justify-between'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-[0_6px_16px_-6px_rgba(242,118,58,0.7),inset_0_1px_0_rgba(255,255,255,0.35)]">
              IO
            </div>
            {!collapsed && (
              <div className="min-w-0 hidden md:block">
                <div className="font-semibold text-[13px] text-text truncate leading-tight">CodeCraft Academy</div>
                <div className="text-[11px] text-text-muted truncate">Institute OS</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={(e) => collapsed && showTip('Expand sidebar', e)}
            onMouseLeave={hideTip}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-strong shrink-0 hidden md:flex'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <div className="mx-3 h-px bg-border shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2.5 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {grp.title && !collapsed && (
                <div className="hidden md:block px-3 pt-1 pb-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-text-muted/80">
                  {grp.title}
                </div>
              )}
              {grp.title && gIdx > 0 && (
                <div className={cn('mx-auto w-5 h-px bg-border mb-2', !collapsed && 'md:hidden')} />
              )}
              {grp.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    onMouseEnter={(e) => (collapsed || window.innerWidth < 768) && showTip(item.label, e)}
                    onMouseLeave={hideTip}
                    className={cn(
                      'group relative flex items-center rounded-full text-[13px] transition-all duration-200 ease-out',
                      collapsed
                        ? 'w-10 h-10 mx-auto justify-center'
                        : 'w-10 h-10 mx-auto justify-center md:mx-0 md:w-full md:h-9 md:justify-start md:gap-3 md:px-3',
                      isActive
                        ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] font-medium shadow-[0_6px_18px_-8px_rgba(0,0,0,0.55)]'
                        : 'text-text-muted hover:text-text hover:bg-surface-strong'
                    )}
                  >
                    <Icon
                      className="w-[18px] h-[18px] shrink-0 transition-transform duration-200 ease-spring group-hover:scale-110"
                      strokeWidth={1.75}
                    />

                    {!collapsed && <span className="hidden md:block truncate flex-1">{item.label}</span>}

                    {/* Pill only for counts */}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          'hidden md:inline-flex min-w-[20px] h-5 px-1.5 items-center justify-center rounded-full text-[10.5px] font-semibold tnum',
                          isActive ? 'bg-accent text-white' : 'bg-danger text-white'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'absolute top-1 right-1 w-2 h-2 rounded-full bg-danger ring-2 ring-[var(--surface-solid)]',
                          !collapsed && 'md:hidden'
                        )}
                      />
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="mx-3 h-px bg-border shrink-0" />

        {/* User Card */}
        <div className="p-2 shrink-0">
          <NavLink
            to="/me"
            onMouseEnter={(e) => (collapsed || window.innerWidth < 768) && showTip('Account profile', e)}
            onMouseLeave={hideTip}
            className={cn(
              'flex items-center gap-2.5 rounded-full hover:bg-surface-strong transition-colors',
              collapsed ? 'justify-center p-0.5' : 'justify-center p-0.5 md:justify-start md:p-1.5 md:pr-3'
            )}
            title="Account profile"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                {role.substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-[var(--surface-solid)]" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 hidden md:block">
                <div className="text-[13px] font-medium text-text truncate capitalize leading-tight">
                  {displayName}
                </div>
                <div className="text-[11px] text-text-muted truncate capitalize">{role}</div>
              </div>
            )}
          </NavLink>
        </div>
      </div>

      {/* Floating tooltip (dock mode) */}
      {tip && (
        <div
          className="fixed z-[60] pointer-events-none -translate-y-1/2 px-3 py-1.5 rounded-full glass-strong text-xs font-medium text-text whitespace-nowrap animate-[io-tooltip_180ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
          style={{ top: tip.top, left: tip.left }}
          role="tooltip"
        >
          {tip.label}
        </div>
      )}
    </aside>
  )
}
