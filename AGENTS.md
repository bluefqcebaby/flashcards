# AI Flashcards Project Rules

## What we are building
- Language-learning flashcards app.
- User enters a word/phrase in target language.
- AI returns translation + 2 short examples.
- User accepts/regenerates, saves card, then studies with spaced repetition ratings.

## Tooling defaults
- Use `bun` and `bunx` for package management, scripts, and CLI tooling.
- Do not use `npm`, `npx`, `pnpm`, or `yarn` unless explicitly requested.

## Architecture (simple and strict)
- Prefer route-local organization by default.
- Keep code close to the route that owns it.
- Use shared modules only for code that is genuinely reused.
- Use `src/features` only for code that is reused across multiple routes/screens.
- Current shared areas:
  - `src/db` for database schema exports.
  - `src/lib` for app-level auth, env, and shared helpers.
  - `src/components/ui` for `shadcn/ui` primitives.

## Folder conventions
- For route-owned code, colocate folders next to the route:
  - `-ui/` for route-local UI components.
  - `-model/` for route-local types, contracts, and static config.
  - `-api/` or `-server/` for route-local server logic.
- In TanStack Start route trees, prefer prefixing the folder with `-` instead of prefixing every file inside it.
- Do not move code into `src/features` unless it is clearly reused by more than one route.
- Promote code upward only after confirmed reuse across at least 2 routes/screens.

## Dependency direction
- Allowed: `routes -> route-local modules`.
- Allowed: `routes -> shared modules`.
- Allowed: `route-local modules -> shared modules`.
- Not allowed: shared modules depending on route-local modules.

## Coding patterns
- Keep routes thin: no business logic in route files.
- Keep code close to the page by default.
- Do not overcomplicate structure early.
- Keep server-only code out of client components.
- Prefer typed data contracts for feature boundaries.
- For forms, prefer `@tanstack/react-form`.
- For UI, build on top of `shadcn/ui`; do not introduce another UI library unless explicitly requested.
- Prefer flexible product constraints unless the restriction is clearly required.

## MVP planning defaults
- Bias toward the smallest useful flow that gets the user to value fast.
- Prefer one-screen onboarding over multi-step onboarding unless complexity is necessary.
- Do not add restrictive validation rules unless they are clearly required by the product.
