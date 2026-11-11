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
  LucideIcon,
  School,
  FileCheck,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useStore } from '@/mocks/store'
import { UserRole } from '@/types'
import { canAccess } from '@/lib/permissions'

/**
 * Single source of truth for app navigation.
 * Same items, routes, badges and role filtering the sidebar used; the shell
 * (tab bar, group menus, utility dock) only decides how they're presented.
 */
export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number | string
  allowedRoles?: UserRole[]
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export function useNavGroups(): NavGroup[] {
  const { role, unreadApprovalsCount } = useApp()
  const submissions = useStore((s) => s.submissions)
  const submissionsWaitingCount = submissions.filter(
    (s) =>
      s.status === 'submitted' ||
      s.status === 'late' ||
      s.status === 'graded_draft' ||
      s.status === 'resubmit_requested'
  ).length

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

  const filteredGroups = navGroups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) => canAccess(role, item.to)),
    }))
    .filter((grp) => grp.items.length > 0)

  return filteredGroups
}

/** Mirrors the sidebar's original active-link rule. */
export function isNavItemActive(to: string, pathname: string) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

/** Groups that live in the utility dock rather than the tab bar. */
export const DOCK_GROUP_TITLES = ['Admin']
