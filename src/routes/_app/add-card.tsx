import { createFileRoute } from "@tanstack/react-router"

import { Route as AppRoute } from "@/routes/_app"
import { AddCardInputSection } from "@/routes/_app/add-card/-ui/add-card-input-section"
import { AddCardPreviewSection } from "@/routes/_app/add-card/-ui/add-card-preview-section"
import { AddCardStatusSection } from "@/routes/_app/add-card/-ui/add-card-status-section"
import { useAddCardFlow } from "@/routes/_app/add-card/-ui/use-add-card-flow"

export const Route = createFileRoute("/_app/add-card")({
  component: AddCardPage,
})

function AddCardPage() {
  const { viewerState } = AppRoute.useLoaderData()
  const flow = useAddCardFlow()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6">
      <AddCardInputSection
        clearFeedbackMessages={flow.clearFeedbackMessages}
        form={flow.form}
        isGenerating={flow.isGenerating}
        isSaving={flow.isSaving}
        preferences={viewerState.preferences}
      />
      <AddCardStatusSection
        generationError={flow.generationError}
        saveError={flow.saveError}
        successMessage={flow.successMessage}
      />
      {flow.draft ? (
        <AddCardPreviewSection
          detailsVisible={flow.detailsVisible}
          draft={flow.draft}
          draftIsStale={flow.draftIsStale}
          isGenerating={flow.isGenerating}
          isSaving={flow.isSaving}
          onRegenerate={() => void flow.handleGenerate()}
          onSave={flow.handleSave}
          onToggleDetails={flow.toggleDetails}
        />
      ) : null}
    </div>
  )
}
