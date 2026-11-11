import React, { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/app/Sidebar'
import { TopBar } from '@/components/app/TopBar'
import { CommandPalette } from '@/components/app/CommandPalette'
import { ShortcutsModal } from '@/components/app/ShortcutsModal'
import { CopilotDrawer } from '@/components/app/CopilotDrawer'
import { useRouteMotion } from '@/lib/useMotion'

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const pageRef = useRef<HTMLDivElement>(null)
  useRouteMotion(pageRef, location.pathname)

  return (
    <div className="min-h-screen text-text flex overflow-x-clip font-sans">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Global Keyboard Shortcuts Sheet */}
      <ShortcutsModal />

      {/* Global 440px Copilot Slide-over Drawer (⌘J) */}
      <CopilotDrawer />

      {/* Floating dock / sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar />
        <main className="flex-1 px-3 pb-10 pt-3 sm:px-5 md:px-8 md:pt-5 max-w-[1440px] w-full mx-auto overflow-y-auto">
          <div ref={pageRef}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
