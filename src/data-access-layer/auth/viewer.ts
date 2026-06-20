import { getSession } from '#/data-access-layer/auth/auth.functions'
import { authClient, type BetterAuthSession } from '#/lib/better-auth/client'
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

type ViewerUser = BetterAuthSession['user']
type ViewerSession = BetterAuthSession['session']

export type Viewer = {
  user?: ViewerUser
  session?: ViewerSession
}

export const viewerQueryOptions = queryOptions({
  queryKey: ['viewer'],
  queryFn: async () => {
    const session = await getSession()
    if (!session) {
      return null
    }
    return { user: session.user, session: session.session }
  },
})

export function useViewer() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut()
      await queryClient.invalidateQueries(viewerQueryOptions)
      await router.invalidate()
      void router.navigate({ to: '/' })
    },
  })

  return { logoutMutation }
}
