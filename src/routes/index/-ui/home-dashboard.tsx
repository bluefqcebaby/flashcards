import { useState } from "react"
import {
  IconArrowRight,
  IconBook2,
  IconLogout,
  IconSparkles,
} from "@tabler/icons-react"
import { useRouter } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import {
  formatLanguagePair,
  getInitials,
  type ViewerIdentity,
  type ViewerPreferences,
} from "@/routes/onboarding/-model/contracts"

type HomeDashboardProps = {
  preferences: ViewerPreferences
  user: ViewerIdentity
}

export function HomeDashboard({ preferences, user }: HomeDashboardProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    try {
      setIsSigningOut(true)
      await authClient.signOut()
      await router.invalidate()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Flashards</CardTitle>
            <CardDescription>
              Your language pair is ready. The next step is creating the first
              study flow on top of it.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage alt={user.name} src={user.image ?? undefined} />
                <AvatarFallback>
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {preferences.learningLanguageName}
              </Badge>
              <Badge variant="outline">
                Base: {preferences.baseLanguageName}
              </Badge>
              <Badge variant="outline">{formatLanguagePair(preferences)}</Badge>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              disabled={isSigningOut}
              onClick={handleSignOut}
              variant="outline"
            >
              {isSigningOut ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <IconLogout data-icon="inline-start" />
              )}
              Sign out
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your first deck is next</CardTitle>
            <CardDescription>
              We now know what language you are learning and which language
              should power explanations and translations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty className="border bg-muted/30">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconBook2 />
                </EmptyMedia>
                <EmptyTitle>No decks yet</EmptyTitle>
                <EmptyDescription>
                  The onboarding is complete. Next we will build the first deck
                  creation flow on top of this language pair.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Badge variant="secondary">Coming next</Badge>
                <Button disabled={true} variant="outline">
                  <IconSparkles data-icon="inline-start" />
                  Create your first deck
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
          <CardFooter>
            <Button disabled={true} variant="ghost">
              Explore next step
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
