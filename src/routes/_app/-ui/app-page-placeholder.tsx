import { IconArrowRight, IconSparkles } from "@tabler/icons-react"

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

type PlaceholderMetric = {
  help: string
  label: string
  value: string
}

type AppPagePlaceholderProps = {
  ctaLabel: string
  description: string
  eyebrow: string
  highlights: PlaceholderMetric[]
  notes: string[]
  title: string
}

export function AppPagePlaceholder({
  ctaLabel,
  description,
  eyebrow,
  highlights,
  notes,
  title,
}: AppPagePlaceholderProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <Card className="overflow-hidden border-border/70 bg-card/95">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{eyebrow}</Badge>
            <Badge variant="outline">Placeholder</Badge>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6">
                {description}
              </CardDescription>
            </div>
            <Button disabled={true} size="lg">
              <IconSparkles data-icon="inline-start" />
              {ctaLabel}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.help}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>What will live here</CardTitle>
            <CardDescription>
              Enough structure to compare direction now, without committing to
              product logic too early.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {notes.map((note, index) => (
              <div
                key={note}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/50 p-3"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prototype intent</CardTitle>
            <CardDescription>
              This page is deliberately honest about being a shell, so we can
              judge navigation and visual hierarchy before deeper
              implementation.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-between">
            <Button disabled={true} variant="outline">
              Compare layouts
            </Button>
            <Button disabled={true} variant="ghost">
              Next iteration
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
