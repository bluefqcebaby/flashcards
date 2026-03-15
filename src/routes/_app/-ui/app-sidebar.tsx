"use client"

import { useState } from "react"
import { IconLogout, IconSparkles } from "@tabler/icons-react"
import { Link, useRouter, useRouterState } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import type {
  ViewerIdentity,
  ViewerPreferences,
} from "@/features/viewer/model/contracts"
import {
  formatLanguagePair,
  getInitials,
} from "@/features/viewer/model/contracts"
import { authClient } from "@/lib/auth-client"
import { appNavItems } from "@/routes/_app/-model/app-nav"

type AppSidebarProps = {
  preferences: ViewerPreferences
  user: ViewerIdentity
}

export function AppSidebar({ preferences, user }: AppSidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    try {
      setIsSigningOut(true)
      await authClient.signOut()
      await router.invalidate()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-4 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <IconSparkles />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">Flashards</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              Learn with AI-made examples
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/60 p-3 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-medium tracking-[0.2em] text-sidebar-foreground/55 uppercase">
            Active pair
          </p>
          <p className="mt-2 text-sm font-medium">
            {formatLanguagePair(preferences)}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarMenu>
            {appNavItems.map((item) => {
              const isActive = pathname === item.to
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setOpenMobile(false)}
                    render={<Link to={item.to} />}
                    tooltip={item.label}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback>
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
            <Badge variant="outline">Ready</Badge>
            <Button
              disabled={isSigningOut}
              onClick={handleSignOut}
              size="sm"
              variant="ghost"
            >
              {isSigningOut ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <IconLogout data-icon="inline-start" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
