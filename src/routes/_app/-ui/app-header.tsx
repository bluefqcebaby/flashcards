import { useRouterState } from "@tanstack/react-router"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { appNavItems } from "@/routes/_app/-model/app-nav"

export function AppHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const currentItem =
    appNavItems.find(
      (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
    ) ?? appNavItems[0]

  return (
    <header className="shrink-0 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <SidebarTrigger />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">
            {currentItem.label}
          </h1>
        </div>
      </div>
    </header>
  )
}
