import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  getDueStudyCardCount,
  getTotalStudyCardCount,
} from "@/routes/_app/study/-api/queries"

export type StudyHubData = {
  dueCardCount: number
  totalCardCount: number
}

export const getStudyHubData = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudyHubData> => {
    const { session } = context
    const now = new Date()

    const [dueCardCount, totalCardCount] = await Promise.all([
      getDueStudyCardCount(session.user.id, now),
      getTotalStudyCardCount(session.user.id),
    ])

    return { dueCardCount, totalCardCount }
  })
