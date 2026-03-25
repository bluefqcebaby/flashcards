import type { ComponentType, SVGProps } from "react"
import {
  IconDashboard,
  IconEditCircle,
  IconPlayerTrackNext,
  IconSettings2,
} from "@tabler/icons-react"

export type AppRoutePath =
  | "/dashboard"
  | "/add-card"
  | "/study"
  | "/study/browse"
  | "/study/review"
  | "/study/shuffle"
  | "/settings"

export type AppNavItem = {
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  to: AppRoutePath
}

export const appNavItems: AppNavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    description: "Pulse check on your study flow and future quick actions.",
    icon: IconDashboard,
  },
  {
    label: "Add Card",
    to: "/add-card",
    description: "The future AI-assisted card creation workspace.",
    icon: IconEditCircle,
  },
  {
    label: "Study",
    to: "/study",
    description: "Where reviews, streaks, and spaced repetition will live.",
    icon: IconPlayerTrackNext,
  },
  {
    label: "Settings",
    to: "/settings",
    description: "Account controls and learning preferences.",
    icon: IconSettings2,
  },
]
