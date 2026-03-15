import { createFileRoute, redirect } from "@tanstack/react-router"

import { HomeDashboard } from "@/routes/index/-ui/home-dashboard"
import { HomeSignedOutLanding } from "@/routes/index/-ui/home-signed-out-landing"
import { getViewerOnboardingState } from "@/routes/onboarding/-api/get-viewer-onboarding-state"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const viewerState = await getViewerOnboardingState()

    if (viewerState.status === "needs-onboarding") {
      throw redirect({ to: "/onboarding" })
    }

    return { viewerState }
  },
  component: HomePage,
})

function HomePage() {
  const { viewerState } = Route.useRouteContext()

  if (viewerState.status === "signed-out") {
    return <HomeSignedOutLanding />
  }

  return (
    <HomeDashboard
      preferences={viewerState.preferences}
      user={viewerState.user}
    />
  )
}
