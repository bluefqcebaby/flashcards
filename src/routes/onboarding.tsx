import { createFileRoute, redirect } from "@tanstack/react-router"
import { getViewerOnboardingState } from "@/routes/onboarding/-api/get-viewer-onboarding-state"
import { OnboardingPage } from "@/routes/onboarding/-ui/onboarding-page"

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const viewerState = await getViewerOnboardingState()

    if (viewerState.status !== "needs-onboarding") {
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
