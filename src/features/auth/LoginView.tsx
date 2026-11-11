import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  Lock,
  User,
  Plus,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { useApp } from '@/context/AppContext'
import { UserRole, Branch } from '@/types'
import { store } from '@/mocks/store'
import { canAccess } from '@/lib/permissions'
import { signInWithGoogle, isSupabaseConfigured } from '@/lib/supabase'

export const LoginView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { success, error: toastError } = useToast()
  const { login } = useApp()

  const [isLoading, setIsLoading] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [isCustomAccount, setIsCustomAccount] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')

  // Pre-configured Google Accounts for testing all roles seamlessly
  const GOOGLE_ACCOUNTS = [
    {
      id: 'acc-new-student',
      name: 'New Student (First-time Login)',
      email: 'student.new@gmail.com',
      role: 'student' as UserRole,
      badge: 'First-time Onboarding',
      badgeColor: 'bg-emerald-500/10 text-success border-emerald-500/20',
      avatar: '🎓',
      desc: 'Triggers basic info form (Name, Class, Branch, Roll No, Phone, Email) -> Head Approval Pending',
    },
    {
      id: 'acc-priya',
      name: 'Priya Nair',
      email: 'priya.nair@gmail.com',
      role: 'student' as UserRole,
      badge: 'Approved Student',
      badgeColor: 'bg-blue-500/10 text-info border-blue-500/20',
      avatar: '👩‍🎓',
      desc: 'Already approved student · Directly opens Student Dashboard',
    },
    {
      id: 'acc-arjun',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@codecraft.ac.in',
      role: 'trainer' as UserRole,
      badge: 'Academic Head / Trainer',
      badgeColor: 'bg-amber-500/10 text-warning border-amber-500/20',
      avatar: '👨‍🏫',
      desc: 'Head authorized to review and approve student admissions in Approvals',
    },
    {
      id: 'acc-rajesh',
      name: 'Rajesh Sharma',
      email: 'rajesh@codecraft.ac.in',
      role: 'owner' as UserRole,
      badge: 'Institute Head / Owner',
      badgeColor: 'bg-purple-500/10 text-ai-chip border-purple-500/20',
      avatar: '👑',
      desc: 'Executive Head authorized to review and approve student admissions',
    },
    {
      id: 'acc-sunita',
      name: 'Sunita Accounts',
      email: 'accounts@codecraft.ac.in',
      role: 'accounts' as UserRole,
      badge: 'Accounts Head',
      badgeColor: 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-300 border-cyan-500/20',
      avatar: '💼',
      desc: 'Financial ledger, fee payment extraction, and banking reconciliation',
    },
    {
      id: 'acc-snehal',
      name: 'Snehal Kulkarni',
      email: 'snehal@codecraft.ac.in',
      role: 'counselor' as UserRole,
      badge: 'Academic Counselor',
      badgeColor: 'bg-rose-500/10 text-danger border-rose-500/20',
      avatar: '🤝',
      desc: 'Student risk monitoring, academic counseling, and parent outreach',
    },
  ]

  const redirectAfterAuth = (userRole?: UserRole) => {
    const currentRole = userRole || store.currentUser.role
    if (currentRole === 'student') {
      navigate('/s', { replace: true })
      return
    }
    const from = (location.state as any)?.from?.pathname
    if (from && from !== '/login' && !from.startsWith('/s') && canAccess(currentRole, from)) {
      navigate(from, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }

  // Handle Google Sign In button click
  const handleGoogleClick = async () => {
    setShowAccountModal(true)
  }

  // Handle Account selection
  const handleSelectAccount = async (account: {
    name: string
    email: string
    role?: UserRole
    branch?: Branch | 'All'
    approvalStatus?: 'approved' | 'pending'
  }) => {
    setIsLoading(true)
    setShowAccountModal(false)

    try {
      const isNewStudentTest = account.email === 'student.new@gmail.com'
      const resolvedApproval = account.approvalStatus || (isNewStudentTest ? 'pending' : 'approved')

      const res = await login({
        email: account.email,
        name: account.name,
        role: account.role || 'student',
        branch: account.branch || 'Kothrud',
        isGoogleAuth: true,
        approvalStatus: resolvedApproval,
      })

      setIsLoading(false)

      if (res.success && res.user) {
        success('Signed in successfully', `Welcome, ${account.name}!`)
        redirectAfterAuth(res.user.role)
      } else {
        toastError('Login error', res.error || 'Failed to sign in.')
      }
    } catch (err: any) {
      setIsLoading(false)
      toastError('Authentication error', err?.message || 'Sign-in failed.')
    }
  }

  // Handle custom Google email sign-in
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail.trim() || !customEmail.includes('@')) {
      toastError('Invalid email', 'Please enter a valid Google email address.')
      return
    }
    handleSelectAccount({
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim().toLowerCase(),
      role: 'student',
      branch: 'Kothrud',
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 text-text select-none font-sans">
      {/* Left Brand Panel (5 cols) */}
      <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between text-text io-rise">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB36B] to-[#F2763A] text-white font-semibold text-xs flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(242,118,58,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
            IO
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-text leading-tight">Institute OS</span>
            <span className="text-[11px] text-text-muted">CodeCraft Academy · Enterprise</span>
          </div>
        </div>

        <div className="space-y-6 my-auto max-w-sm">
          <div>
            <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full glass-pill text-[11px] text-text-muted uppercase tracking-[0.1em] font-medium">
              Student & Faculty Platform
            </div>
            <h1 className="text-3xl md:text-[34px] md:leading-[42px] font-semibold text-text tracking-tight mt-3">
              Unified classroom learning, attendance, and student governance.
            </h1>
          </div>

          <div className="space-y-2.5 text-xs text-text-muted">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface border border-border">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-text">Single Sign-On with Google: </span>
                Instant authentication with your verified institutional or personal Google account.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface border border-border">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-text">Head Admission Approval: </span>
                First-time student registrations are routed to institute heads (Trainer or Owner) for authorization.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface border border-border">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-text">Zero-reprompt onboarding: </span>
                Fill your student admission profile once. Never asked again on subsequent logins.
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-text-muted flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>CodeCraft Academy · Pune Campuses (Kothrud & Baner)</span>
        </div>
      </div>

      {/* Right Login Panel (7 cols) - STRICTLY ONLY "CONTINUE WITH GOOGLE" */}
      <div className="md:col-span-7 p-6 sm:p-10 md:p-16 flex items-center justify-center text-text">
        <div className="w-full max-w-md space-y-7 text-center sm:text-left bg-surface border border-border rounded-dialog shadow-dialog p-7 sm:p-9 animate-[io-pop_640ms_cubic-bezier(0.22,1,0.36,1)_120ms_backwards]">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-sunken border border-border text-xs font-medium text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-text" />
              <span>Secure Institute Authentication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
              Sign in to CodeCraft
            </h2>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              Access your student portal, lecture schedules, QR check-in, and course materials.
            </p>
          </div>

          {/* Primary Action: ONLY "Continue with Google" */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full group bg-white hover:bg-white/90 text-[#1B1917] border border-white/40 font-medium text-sm h-12 px-5 rounded-full shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex items-center justify-center gap-3 cursor-pointer select-none disabled:opacity-70"
            >
              {/* Official Google G Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-semibold text-[#1B1917] text-[14px]">
                {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-text-muted">
                Protected by Google Identity & CodeCraft Academy RBAC policies.
              </p>
            </div>

            {/* Demo Accounts (Instant 1-Click Access Without Approval) */}
            <div className="pt-4 border-t border-border space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">
                  Demo Accounts (Instant access without approval):
                </span>
                <span className="text-[10px] text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded-full font-medium">
                  Pre-approved
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      name: 'Rajesh Sharma',
                      email: 'rajesh@codecraft.ac.in',
                      role: 'owner',
                      branch: 'All',
                      approvalStatus: 'approved',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-surface-sunken hover:bg-surface-strong border border-border hover:border-border-strong hover:-translate-y-0.5 text-left transition-all group cursor-pointer"
                >
                  <div className="font-semibold text-text group-hover:text-accent flex items-center gap-1.5">
                    <span>👑 Rajesh (Owner)</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate font-mono">
                    rajesh@codecraft.ac.in
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      name: 'Arjun Mehta',
                      email: 'arjun.mehta@codecraft.ac.in',
                      role: 'trainer',
                      branch: 'Kothrud',
                      approvalStatus: 'approved',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-surface-sunken hover:bg-surface-strong border border-border hover:border-border-strong hover:-translate-y-0.5 text-left transition-all group cursor-pointer"
                >
                  <div className="font-semibold text-text group-hover:text-accent flex items-center gap-1.5">
                    <span>👨‍🏫 Arjun (Trainer / Head)</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate font-mono">
                    arjun.mehta@codecraft.ac.in
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      name: 'Priya Nair',
                      email: 'priya.nair@gmail.com',
                      role: 'student',
                      branch: 'Kothrud',
                      approvalStatus: 'approved',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-surface-sunken hover:bg-surface-strong border border-border hover:border-border-strong hover:-translate-y-0.5 text-left transition-all group cursor-pointer"
                >
                  <div className="font-semibold text-text group-hover:text-accent flex items-center gap-1.5">
                    <span>👩‍🎓 Priya (Student)</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate font-mono">
                    priya.nair@gmail.com
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      name: 'Sunita Accounts',
                      email: 'accounts@codecraft.ac.in',
                      role: 'accounts',
                      branch: 'All',
                      approvalStatus: 'approved',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-surface-sunken hover:bg-surface-strong border border-border hover:border-border-strong hover:-translate-y-0.5 text-left transition-all group cursor-pointer"
                >
                  <div className="font-semibold text-text group-hover:text-accent flex items-center gap-1.5">
                    <span>💼 Sunita (Accounts)</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate font-mono">
                    accounts@codecraft.ac.in
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Guarantee Box */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-border space-y-2 text-xs text-text-muted">
            <div className="flex items-center gap-2 font-medium text-text">
              <Lock className="w-3.5 h-3.5 text-text-muted" />
              <span>Admission Verification Workflow</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>First-time Student:</strong> You'll enter your Name, Class, Branch, Roll No, Phone, and Email.
              Your profile is then forwarded to the Head (Trainer or Owner). While awaiting approval, your
              status is displayed as <em>"Head Approval Pending"</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Google Account Selector Dialog (Modal) */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-dialog shadow-dialog border border-border overflow-hidden text-text">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-sm text-text leading-tight">
                    Choose an account
                  </h3>
                  <p className="text-[11px] text-text-muted">to continue to CodeCraft Academy</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAccountModal(false)
                  setIsCustomAccount(false)
                }}
                className="p-1 rounded-full text-text-muted hover:text-text-muted hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account List */}
            {!isCustomAccount ? (
              <div className="p-3 space-y-1.5 max-h-[65vh] overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Select Google Account:
                </div>

                {GOOGLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full text-left p-3 rounded-2xl hover:bg-surface-strong border border-transparent hover:border-border transition-all flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-sunken border border-border flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-text truncate">
                          {acc.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${acc.badgeColor}`}
                        >
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted font-mono truncate">{acc.email}</div>
                      <div className="text-[11px] text-text-muted mt-1 leading-tight">{acc.desc}</div>
                    </div>
                  </button>
                ))}

                {/* Option to type custom Google email */}
                <button
                  type="button"
                  onClick={() => setIsCustomAccount(true)}
                  className="w-full text-left p-3 rounded-2xl hover:bg-surface-strong border border-dashed border-border hover:border-border transition-all flex items-center gap-3 cursor-pointer mt-2"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-sunken border border-border flex items-center justify-center text-text-muted">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-text">
                      Use another Google account
                    </div>
                    <div className="text-[11px] text-text-muted">
                      Enter any custom name and @gmail.com to test new student admission
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              /* Custom Account Form */
              <form onSubmit={handleCustomSubmit} className="p-5 space-y-4">
                <div className="text-xs text-text-muted">
                  Enter your Google account details to sign in as a student:
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="w-full bg-surface-sunken border border-border rounded-2xl p-2.5 text-xs text-text outline-none focus:border-accent focus:bg-surface-strong"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text">Google Email</label>
                  <input
                    type="email"
                    placeholder="rahul.sharma@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                    className="w-full bg-surface-sunken border border-border rounded-2xl p-2.5 text-xs text-text outline-none focus:border-accent focus:bg-surface-strong font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomAccount(false)}
                    className="h-9 px-4 rounded-full text-xs font-medium text-text-muted hover:text-text hover:bg-surface-strong transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 bg-accent hover:brightness-110 text-white font-semibold text-xs rounded-full shadow-[0_8px_22px_-10px_rgb(var(--accent-rgb)/0.9)] transition-all"
                  >
                    Continue with this account
                  </button>
                </div>
              </form>
            )}

            <div className="p-3 bg-surface-sunken border-t border-border text-[11px] text-text-muted text-center">
              Google Single Sign-On · CodeCraft Academy Security Gateway
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
