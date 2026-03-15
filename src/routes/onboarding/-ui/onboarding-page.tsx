import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ViewerIdentity } from "@/routes/onboarding/-model/contracts"
import { LanguagePairForm } from "@/routes/onboarding/-ui/language-pair-form"

type OnboardingPageProps = {
  user: ViewerIdentity
}

export function OnboardingPage({ user }: OnboardingPageProps) {
  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-start">
        <LanguagePairForm user={user} />

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <Badge variant="outline">Required for MVP</Badge>
            </div>
            <CardTitle>One small setup, then you are in.</CardTitle>
            <CardDescription>
              This first pass keeps onboarding deliberately tiny so we can get
              to the real learning flow faster.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <p>
              The learning language tells Flashards what you are studying.
            </p>
            <p>
              The base language tells Flashards how to explain words, examples,
              and translations.
            </p>
            <p>
              You can choose the same language for both if you want an
              English-to-English style learning flow later.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
