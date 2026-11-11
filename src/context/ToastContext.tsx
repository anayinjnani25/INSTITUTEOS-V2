import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive' | 'ai'
  onUndo?: () => void
  duration?: number
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void
  success: (title: string, description?: string, onUndo?: () => void) => void
  error: (title: string, description?: string) => void
  ai: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'default', onUndo, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const newToast: ToastItem = { id, title, description, variant, onUndo, duration }
      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, description?: string, onUndo?: () => void) => {
      toast({ title, description, variant: 'success', onUndo })
    },
    [toast]
  )

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'destructive' })
    },
    [toast]
  )

  const ai = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'ai' })
    },
    [toast]
  )

  const info = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'default' })
    },
    [toast]
  )

  return (
    <ToastContext.Provider value={{ toast, success, error, ai, info }}>
      {children}
      {/* Toast viewport */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-[18px] border glass-strong text-text text-sm animate-[io-pop_440ms_cubic-bezier(0.34,1.56,0.64,1)_backwards] transition-all ${
              t.variant === 'ai'
                ? 'border-[#A78BFA]/40'
                : t.variant === 'success'
                ? 'border-success/35'
                : t.variant === 'destructive'
                ? 'border-danger/35'
                : 'border-border'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.variant === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
              {t.variant === 'destructive' && <AlertCircle className="w-4 h-4 text-danger" />}
              {t.variant === 'ai' && <div className="w-2 h-2 rounded-full bg-[#A78BFA] animate-ping" />}
              {t.variant === 'default' && <Info className="w-4 h-4 text-accent" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs text-text leading-tight">{t.title}</div>
              {t.description && (
                <div className="text-[11px] text-text-muted mt-0.5 leading-snug">{t.description}</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {t.onUndo && (
                <button
                  onClick={() => {
                    t.onUndo?.()
                    removeToast(t.id)
                  }}
                  className="text-xs font-semibold text-accent hover:underline px-1 py-0.5"
                >
                  Undo
                </button>
              )}
              <button
                onClick={() => removeToast(t.id)}
                className="text-text-muted hover:text-text p-1 rounded-full hover:bg-surface-strong"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
