"use client"

import { useRouterState } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { ViewerPreferences } from "@/features/viewer/model/contracts"
import { formatLanguagePair } from "@/features/viewer/model/contracts"
import { appNavItems } from "@/routes/_app/-model/app-nav"

type AppHeaderProps = {
  preferences: ViewerPreferences
}

export function AppHeader({ preferences }: AppHeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const currentItem =
    appNavItems.find((item) => item.to === pathname) ?? appNavItems[0]

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="min-w-0">
            <p className="text-[0.7rem] font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Flashards
            </p>
            <h1 className="truncate text-lg font-semibold">
              {currentItem.label}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm text-muted-foreground">
            {currentItem.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {preferences.learningLanguageName}
            </Badge>
            <Badge variant="outline">
              Base: {preferences.baseLanguageName}
            </Badge>
            <Separator
              className="hidden h-5 w-px bg-border/70 sm:block"
              orientation="vertical"
            />
            <Badge variant="outline">{formatLanguagePair(preferences)}</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
