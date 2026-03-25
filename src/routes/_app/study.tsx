import { Outlet, createFileRoute } from "@tanstack/react-router"

const StudyLayout = () => {
  return (
    <main className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl flex-col gap-5">
        <Outlet />
      </div>
    </main>
  )
}

export const Route = createFileRoute("/_app/study")({
  component: StudyLayout,
})
