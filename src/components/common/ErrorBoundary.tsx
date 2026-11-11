import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-text text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/25 text-danger flex items-center justify-center mb-5 shadow-[0_0_40px_-8px_rgb(var(--danger-rgb)/0.5)] io-rise">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <h1 className="page-title">Something went wrong</h1>
          <p className="text-xs text-text-muted mt-1.5 max-w-md leading-relaxed">
            An unexpected error occurred while rendering this interface. Your data in the local store is preserved.
          </p>
          {this.state.error && (
            <pre className="mt-3 p-3 rounded-control bg-surface-sunken border border-border text-[11px] font-mono text-danger max-w-lg overflow-x-auto text-left">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            className="mt-5 inline-flex items-center gap-2 h-9 px-4 text-xs font-medium rounded-full glass-pill transition-all text-text shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload application</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
