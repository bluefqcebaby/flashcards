import { createStart } from "@tanstack/react-start"

import { sessionMiddleware } from "@/lib/server/server-fn-middleware"

export const startInstance = createStart(() => ({
  requestMiddleware: [sessionMiddleware],
}))

declare module "@tanstack/react-start" {
  interface Register {
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
