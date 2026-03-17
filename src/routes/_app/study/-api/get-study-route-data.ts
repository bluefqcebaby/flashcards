import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  getCurrentStudyCard,
  getDueStudyCardCount,
  getTotalStudyCardCount,
} from "@/routes/_app/study/-api/queries"
import type { StudyRouteData } from "@/routes/_app/study/-model/study-types"

export const getStudyRouteData = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudyRouteData> => {
    const { session } = context
    const now = new Date()

    const [currentCard, dueCardCount, totalCardCount] = await Promise.all([
      getCurrentStudyCard(session.user.id, now),
      getDueStudyCardCount(session.user.id, now),
      getTotalStudyCardCount(session.user.id),
    ])

    return {
      currentCard,
      dueCardCount,
      totalCardCount,
    }
  })
