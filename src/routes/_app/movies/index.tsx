import { browseSearchSchema } from '#/types/browse'
import { createFileRoute } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import { MoviesList } from './-components/MoviesList'

export const Route = createFileRoute('/_app/movies/')({
  validateSearch: browseSearchSchema,
  component: BrowsePage,
  ssr: false,
})



function BrowsePage() {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-20">
            <Loader className="size-6 animate-spin text-primary" />
          </div>
        }
      >
        <MoviesList />
      </Suspense>
    </section>
  )
}
