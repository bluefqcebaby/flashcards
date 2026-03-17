import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

type SessionUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

type SessionContext = {
  session: {
    user: SessionUser
  } | null
}

export const sessionMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const { auth } = await import("@/lib/server/auth")

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    return next({
      context: {
        session: session
          ? {
              user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image ?? null,
              },
            }
          : null,
      } satisfies SessionContext,
    })
  }
)

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ context, next }) => {
    if (!context?.session) {
      throw redirect({ to: "/" })
    }

    return next({
      context: {
        session: context.session,
      } satisfies { session: NonNullable<SessionContext["session"]> },
    })
  })
