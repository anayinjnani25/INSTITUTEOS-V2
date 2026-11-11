import React, { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Dock } from '@/components/app/Dock'
import { TopBar } from '@/components/app/TopBar'
import { Breadcrumbs } from '@/components/app/Breadcrumbs'
import { CommandPalette } from '@/components/app/CommandPalette'
import { ShortcutsModal } from '@/components/app/ShortcutsModal'
import { CopilotDrawer } from '@/components/app/CopilotDrawer'
import { useRouteMotion } from '@/lib/useMotion'

/**
 * App shell (Corbel structure):
 *   ┌ dock ┐ ┌ brand ─── pill tab bar ─── tools ┐
 *   │      │ │ breadcrumbs (nested pages only)   │
 *   │      │ │ page content                      │
 * The dock floats at the left edge (bottom bar on phones); header and
 * content share one gutter so everything aligns to the same column.
 */
export const AppLayout: React.FC = () => {
  const location = useLocation()
  const pageRef = useRef<HTMLDivElement>(null)
  useRouteMotion(pageRef, location.pathname)

  return (
    <div className="min-h-screen text-text flex flex-col overflow-x-clip font-sans">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Global Keyboard Shortcuts Sheet */}
      <ShortcutsModal />

      {/* Global 440px Copilot Slide-over Drawer (⌘J) */}
      <CopilotDrawer />

      {/* Floating utility dock */}
      <Dock />

      <TopBar />

      <main className="flex-1 w-full max-w-[1840px] mx-auto px-[var(--gut)] md:pl-[calc(var(--side-w)+var(--gut))] pt-2 md:pt-4 pb-28 md:pb-14 overflow-y-auto">
        <div ref={pageRef}>
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
