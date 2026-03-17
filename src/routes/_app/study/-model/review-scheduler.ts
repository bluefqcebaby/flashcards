import type { StudyRating } from "@/features/cards/model/contracts"

type ReviewScheduleState = {
  intervalDays: number
  reviewCount: number
  lapseCount: number
}

type ReviewScheduleUpdate = {
  dueAt: Date
  lastReviewedAt: Date
  reviewCount: number
  lapseCount: number
  intervalDays: number
  lastRating: StudyRating
}

export const scheduleNextReview = (
  state: ReviewScheduleState,
  rating: StudyRating,
  now: Date
): ReviewScheduleUpdate => {
  if (rating === "again") {
    return {
      dueAt: new Date(now.getTime() + 10 * 60 * 1000),
      lastReviewedAt: now,
      reviewCount: state.reviewCount + 1,
      lapseCount: state.lapseCount + 1,
      intervalDays: 0,
      lastRating: rating,
    }
  }

  if (rating === "hard") {
    const intervalDays = Math.max(
      1,
      Math.ceil(Math.max(state.intervalDays, 1) * 1.5)
    )

    return {
      dueAt: addDays(now, intervalDays),
      lastReviewedAt: now,
      reviewCount: state.reviewCount + 1,
      lapseCount: state.lapseCount,
      intervalDays,
      lastRating: rating,
    }
  }

  const intervalDays =
    state.intervalDays === 0 ? 3 : Math.ceil(state.intervalDays * 2.5)

  return {
    dueAt: addDays(now, intervalDays),
    lastReviewedAt: now,
    reviewCount: state.reviewCount + 1,
    lapseCount: state.lapseCount,
    intervalDays,
    lastRating: rating,
  }
}

const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
