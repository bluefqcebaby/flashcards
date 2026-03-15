import { useState } from "react"
import {
  IconArrowRight,
  IconBrandGoogle,
  IconLanguage,
  IconSparkles,
} from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
          : "Google sign-in could not be started.",
      )
      setIsSigningIn(false)
    }
  }

  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">MVP onboarding</Badge>
              <Badge variant="outline">Google auth ready</Badge>
            </div>
            <CardTitle>Learn new vocabulary with a clean language pair setup.</CardTitle>
            <CardDescription>
              Sign in, choose the language you are learning and your base
              language, then we can build the first deck flow on top of that.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card size="sm">
                <CardHeader>
                  <CardTitle>1. Sign in</CardTitle>
                  <CardDescription>
                    Use Google to create your learner profile.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>2. Pick languages</CardTitle>
                  <CardDescription>
                    Set your learning language and your base language.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>3. Start building</CardTitle>
                  <CardDescription>
                    Use that pair for translations, explanations, and cards.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {authError ? (
              <Alert variant="destructive">
                <IconSparkles />
                <AlertTitle>Sign-in failed</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button disabled={isSigningIn} onClick={handleSignIn}>
              {isSigningIn ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <IconBrandGoogle data-icon="inline-start" />
              )}
              Continue with Google
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why the language pair matters</CardTitle>
            <CardDescription>
              This tiny setup step gives the app enough context to generate a
              useful learning experience later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline">
                <IconLanguage data-icon="inline-start" />
                Learning language
              </Badge>
              <p className="text-sm text-muted-foreground">
                The language of words, phrases, and examples you want to study.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Base language</Badge>
              <p className="text-sm text-muted-foreground">
                The language used for translations and explanations in the MVP.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled variant="ghost">
              Deck creation follows next
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
