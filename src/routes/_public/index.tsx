import { createFileRoute, redirect } from "@tanstack/react-router"

import { getViewerState } from "@/features/viewer/api/get-viewer-state"
import { HomeSignedOutLanding } from "@/routes/index/-ui/home-signed-out-landing"

export const Route = createFileRoute("/_public/")({
  beforeLoad: async () => {
    const viewerState = await getViewerState()

    if (viewerState.status === "needs-onboarding") {
      throw redirect({ to: "/onboarding" })
    }

    if (viewerState.status === "ready") {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: HomeSignedOutLanding,
})
