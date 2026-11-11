import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * Slim breadcrumb trail shown above nested pages (e.g. /students/:id).
 * Same names and links the header breadcrumb used; top-level pages rely on
 * the tab bar and their display title instead.
 */
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

export const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)
  if (pathnames.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] font-medium mb-3 min-w-0 overflow-x-auto [scrollbar-width:none]">
      <Link to="/" className="text-text-muted hover:text-text transition-colors shrink-0">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const title = breadcrumbNameMap[value] || value
        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-text-faint shrink-0" strokeWidth={2} aria-hidden="true" />
            {isLast ? (
              <span className="text-text truncate" aria-current="page">
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
  )
}
