import { describe, expect, it } from "vitest"

import { scheduleNextReview } from "@/routes/_app/study/-model/review-scheduler"

describe("scheduleNextReview", () => {
  const now = new Date("2026-03-16T09:00:00.000Z")

  it("resets the card on again", () => {
    const result = scheduleNextReview(
      {
        intervalDays: 5,
        reviewCount: 2,
        lapseCount: 1,
      },
      "again",
      now
    )

    expect(result.intervalDays).toBe(0)
    expect(result.reviewCount).toBe(3)
    expect(result.lapseCount).toBe(2)
    expect(result.lastRating).toBe("again")
    expect(result.dueAt.toISOString()).toBe("2026-03-16T09:10:00.000Z")
  })

  it("grows the interval conservatively on hard", () => {
    const result = scheduleNextReview(
      {
        intervalDays: 4,
        reviewCount: 3,
        lapseCount: 0,
      },
      "hard",
      now
    )

    expect(result.intervalDays).toBe(6)
    expect(result.reviewCount).toBe(4)
    expect(result.lapseCount).toBe(0)
    expect(result.lastRating).toBe("hard")
    expect(result.dueAt.toISOString()).toBe("2026-03-22T09:00:00.000Z")
  })

  it("starts a fresh card at three days on good", () => {
    const result = scheduleNextReview(
      {
        intervalDays: 0,
        reviewCount: 0,
        lapseCount: 0,
      },
      "good",
      now
    )

    expect(result.intervalDays).toBe(3)
    expect(result.reviewCount).toBe(1)
    expect(result.lapseCount).toBe(0)
    expect(result.lastRating).toBe("good")
    expect(result.dueAt.toISOString()).toBe("2026-03-19T09:00:00.000Z")
  })
})
