import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getViewerState } from "@/features/viewer/api/get-viewer-state"
import { AppShell } from "@/routes/_app/-ui/app-shell"

export const Route = createFileRoute("/_app")({
  loader: async () => {
    const viewerState = await getViewerState()

    if (viewerState.status === "signed-out") {
      throw redirect({ to: "/" })
    }

    if (viewerState.status === "needs-onboarding") {
      throw redirect({ to: "/onboarding" })
    }

    return { viewerState }
  },
  staleTime: 60_000,
  component: AppRoute,
})

function AppRoute() {
  const { viewerState } = Route.useLoaderData()

  return (
    <AppShell user={viewerState.user}>
      <Outlet />
    </AppShell>
  )
}
