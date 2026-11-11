import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  ShieldAlert,
  User,
  BookOpen,
  Building2,
  Hash,
  Phone,
  Mail,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/context/ToastContext'
import { useApp } from '@/context/AppContext'
import { useStore, store } from '@/mocks/store'

export const HeadApprovalPendingView: React.FC = () => {
  const { logout } = useApp()
  const { success, info } = useToast()
  const navigate = useNavigate()
  const currentUser = useStore((s) => s.currentUser)
  const approvals = useStore((s) => s.approvals)
  const [isChecking, setIsChecking] = useState(false)

  // Find approval record for this student if available
  const studentApproval = approvals.find(
    (a) =>
      a.type === 'student_registration' &&
      (a.studentRegistration?.email.toLowerCase() === (currentUser.email || '').toLowerCase() ||
        a.studentRegistration?.studentId === currentUser.id)
  )

  const profile = currentUser.studentProfile || studentApproval?.studentRegistration

  const handleCheckStatus = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      // Check latest store state
      const updatedUser = store.currentUser
      const reg = store.studentRegistrations.find(
        (r) => r.email.toLowerCase() === (updatedUser.email || '').toLowerCase()
      )

      if (reg?.status === 'approved' || updatedUser.approvalStatus === 'approved') {
        success('Approval Granted!', 'The Head has approved your registration. Loading dashboard...')
        navigate('/s', { replace: true })
      } else if (reg?.status === 'rejected' || updatedUser.approvalStatus === 'rejected') {
        info('Registration Status', `Your registration was reviewed: ${reg?.rejectionReason || 'Rejected'}. Please contact admissions.`)
      } else {
        info(
          'Head approval pending',
          'Your profile is still awaiting authorization by a Head (Trainer or Owner).'
        )
      }
    }, 600)
  }

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="w-full max-w-xl bg-surface text-text rounded-dialog shadow-dialog border border-border overflow-hidden">
        {/* Header Banner */}
        <div className="text-text p-6 sm:p-8 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-control bg-surface-strong border border-border text-text font-semibold text-xs flex items-center justify-center">
                IO
              </div>
              <div>
                <span className="font-semibold text-sm text-text leading-tight block">
                  CodeCraft Academy
                </span>
                <span className="text-[11px] text-text-muted">Student Portal Access</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-medium text-warning flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Head approval pending</span>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="page-title">
              Head Approval Pending
            </h1>
            <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
              Your student profile has been submitted and is currently waiting for authorization by an
              institute head (Trainer or Owner). Once approved, your student dashboard and courses will
              become accessible automatically.
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="bg-surface-sunken rounded-card border border-border p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-border">
              <span className="card-title">
                Submitted Student Details
              </span>
              <span className="text-[11px] text-text-muted font-mono">
                Status:{' '}
                <strong className="text-warning uppercase font-semibold">
                  {currentUser.approvalStatus || 'Pending'}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-muted">
                <User className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Name:{' '}
                  <strong className="text-text font-medium">
                    {profile?.name || currentUser.name}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-muted">
                <Hash className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Roll No:{' '}
                  <strong className="text-text font-mono font-medium">
                    {profile?.rollNo || 'ST-2026-PENDING'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-muted sm:col-span-2">
                <BookOpen className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Class / Course:{' '}
                  <strong className="text-text font-medium">
                    {profile?.className || 'Java Full-Stack B3 (Kothrud)'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-muted">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Branch:{' '}
                  <strong className="text-text font-medium">
                    {profile?.branch || currentUser.branch || 'Kothrud'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-muted">
                <Phone className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Phone:{' '}
                  <strong className="text-text font-mono font-medium">
                    {profile?.phone || 'Pending'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-muted sm:col-span-2">
                <Mail className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <span>
                  Google Email:{' '}
                  <strong className="text-text font-mono font-medium">
                    {profile?.email || currentUser.email}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Review Notice */}
          <div className="p-3.5 rounded-control bg-surface-sunken border border-border space-y-1.5 text-xs text-text-muted">
            <div className="flex items-center gap-2 font-semibold text-text">
              <AlertCircle className="w-4 h-4 text-warning shrink-0" />
              <span>Who can approve this?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Any authorized institute head can review and approve your registration, including:
            </p>
            <ul className="text-[11px] list-disc list-inside space-y-0.5 text-text font-medium pl-1">
              <li>Arjun Mehta (Senior Trainer & Academic Head)</li>
              <li>Rajesh Sharma (Owner & Institute Director)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleCheckStatus}
              isLoading={isChecking}
              className="w-full sm:flex-1 bg-accent hover:brightness-110 text-white py-2.5 flex items-center justify-center gap-2 text-xs font-semibold"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />}
            >
              Check approval status
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleSignOut}
              className="w-full sm:w-auto glass-pill text-text py-2.5 flex items-center justify-center gap-1.5 text-xs"
              leftIcon={<LogOut className="w-3.5 h-3.5 text-text-muted" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
