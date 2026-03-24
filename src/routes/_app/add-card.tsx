import { createFileRoute } from "@tanstack/react-router"

import { Route as AppRoute } from "@/routes/_app"
import { getAddCardRouteData } from "@/routes/_app/add-card/-api/get-add-card-route-data"
import { AddCardInputSection } from "@/routes/_app/add-card/-ui/add-card-input-section"
import { AddCardPendingPage } from "@/routes/_app/add-card/-ui/add-card-pending-page"
import { AddCardPreviewSection } from "@/routes/_app/add-card/-ui/add-card-preview-section"
import { AddCardStatusSection } from "@/routes/_app/add-card/-ui/add-card-status-section"
import { useAddCardFlow } from "@/routes/_app/add-card/-ui/use-add-card-flow"

export const Route = createFileRoute("/_app/add-card")({
  loader: () => getAddCardRouteData(),
  pendingComponent: AddCardPendingPage,
  pendingMs: 0,
  component: AddCardPage,
})

function AddCardPage() {
  const { viewerState } = AppRoute.useLoaderData()
  const { drafts } = Route.useLoaderData()
  const flow = useAddCardFlow({ initialDrafts: drafts })

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-6 overflow-hidden px-4 py-6 lg:flex-row lg:items-stretch lg:gap-8 lg:px-6">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:shrink-0">
        <AddCardInputSection
          clearFeedbackMessages={flow.clearFeedbackMessages}
          form={flow.form}
          isCreatingDraft={flow.isCreatingDraft}
          preferences={viewerState.preferences}
        />
        <AddCardStatusSection
          dismissError={flow.dismissError}
          generationError={flow.submitError}
          saveError={flow.saveError}
          successMessage={flow.successMessage}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-[2] flex-col overflow-hidden">
        <AddCardPreviewSection
          drafts={flow.drafts}
          dismissingDraftIds={flow.dismissingDraftIds}
          onDismissDraft={flow.handleDismissDraft}
          onGenerateDraft={flow.handleGenerateDraft}
          onSaveDraft={flow.handleSaveDraft}
          preferences={viewerState.preferences}
          savingDraftIds={flow.savingDraftIds}
        />
      </div>
    </div>
  )
}
