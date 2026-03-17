import { useState } from "react"
import { IconBrandGoogle, IconSparkles } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export function HomeSignedOutLanding() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleSignIn() {
    try {
      setAuthError(null)
      setIsSigningIn(true)
      await authClient.signIn.social({
        provider: "google",
      })
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started."
      )
      setIsSigningIn(false)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,181,88,0.18),transparent_34%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.05),transparent_32%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <Card className="relative w-full max-w-xl overflow-hidden border-white/10 bg-card/85 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

        <CardHeader className="space-y-4 px-6 pt-10 pb-6 text-center sm:px-10 sm:pt-12">
          <CardTitle className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Log in and let&apos;s get you studying.
          </CardTitle>
          <CardDescription className="mx-auto max-w-md text-base leading-7 text-muted-foreground text-pretty sm:text-lg">
            One tap with Google, then pick your languages and start making
            cards.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-6 pb-8 sm:px-10 sm:pb-10">
          <Button
            className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/15 transition-transform duration-200 hover:-translate-y-0.5"
            disabled={isSigningIn}
            onClick={handleSignIn}
          >
            {isSigningIn ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <IconBrandGoogle data-icon="inline-start" />
            )}
            Continue with Google
          </Button>

          {authError ? (
            <Alert variant="destructive">
              <IconSparkles />
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}
