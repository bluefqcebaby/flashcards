import { createFileRoute, redirect } from "@tanstack/react-router"

import { getViewerState } from "@/features/viewer/api/get-viewer-state"
import { OnboardingPage } from "@/routes/onboarding/-ui/onboarding-page"

export const Route = createFileRoute("/_public/onboarding")({
  beforeLoad: async () => {
    const viewerState = await getViewerState()

    if (viewerState.status === "ready") {
      throw redirect({ to: "/dashboard" })
    }

    if (viewerState.status === "signed-out") {
      throw redirect({ to: "/" })
    }

    return { viewerState }
  },
  component: OnboardingRoute,
})

function OnboardingRoute() {
  const { viewerState } = Route.useRouteContext()

  return <OnboardingPage user={viewerState.user} />
}
