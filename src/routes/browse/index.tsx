import { browseSearchDefaults, browseSearchSchema } from '#/types/browse'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/browse/')({
  validateSearch: browseSearchSchema,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/movies',
      search: { ...browseSearchDefaults, ...search },
      replace: true,
    })
  },
})
