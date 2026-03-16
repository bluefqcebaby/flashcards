import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { ViewerIdentity } from "@/features/viewer/model/contracts"
import { AppHeader } from "@/routes/_app/-ui/app-header"
import { AppSidebar } from "@/routes/_app/-ui/app-sidebar"

type AppShellProps = {
  children: ReactNode
  user: ViewerIdentity
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <TooltipProvider delay={150}>
      <SidebarProvider className="h-svh overflow-hidden bg-background">
        <AppSidebar user={user} />
        <SidebarInset className="h-svh min-h-0 overflow-hidden">
          <AppHeader />
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
