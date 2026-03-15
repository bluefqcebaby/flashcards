"use client"

import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import type {
  ViewerIdentity,
  ViewerPreferences,
} from "@/features/viewer/model/contracts"
import { AppHeader } from "@/routes/_app/-ui/app-header"
import { AppSidebar } from "@/routes/_app/-ui/app-sidebar"

type AppShellProps = {
  children: ReactNode
  preferences: ViewerPreferences
  user: ViewerIdentity
}

export function AppShell({ children, preferences, user }: AppShellProps) {
  return (
    <TooltipProvider delay={150}>
      <SidebarProvider className="min-h-svh bg-background">
        <AppSidebar preferences={preferences} user={user} />
        <SidebarInset className="min-h-svh">
          <AppHeader preferences={preferences} />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
