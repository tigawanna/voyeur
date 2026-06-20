import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/movies/movie/$movieId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/movie/$movieId"!</div>
}
