import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { getActiveFlashcardDrafts } from "@/routes/_app/add-card/-api/queries"
import {
  type AddCardRouteData,
  addCardRouteDataSchema,
} from "@/routes/_app/add-card/-model/add-card-types"

export const getAddCardRouteData = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AddCardRouteData> => {
    const drafts = await getActiveFlashcardDrafts(context.session.user.id)

    return addCardRouteDataSchema.parse({ drafts })
  })
