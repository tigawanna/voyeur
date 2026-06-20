import { browseSearchSchema } from '#/types/browse'
import { createFileRoute } from '@tanstack/react-router'
import { MoviesList } from './-components/MoviesList'

export const Route = createFileRoute('/_app/browse/')({
  validateSearch: browseSearchSchema,
  component: BrowsePage,
})

function BrowsePage() {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <MoviesList />
    </section>
  )
}
