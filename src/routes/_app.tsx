import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getViewerState } from "@/features/viewer/api/get-viewer-state"
import { AppShell } from "@/routes/_app/-ui/app-shell"

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const viewerState = await getViewerState()

    if (viewerState.status === "signed-out") {
      throw redirect({ to: "/" })
    }

    if (viewerState.status === "needs-onboarding") {
      throw redirect({ to: "/onboarding" })
    }

    return { viewerState }
  },
  component: AppRoute,
})

function AppRoute() {
  const { viewerState } = Route.useRouteContext()

  return (
    <AppShell preferences={viewerState.preferences} user={viewerState.user}>
      <Outlet />
    </AppShell>
  )
}
