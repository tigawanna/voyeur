import { viewerMiddleware } from '#/data-access-layer/auth/viewer'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from './-components/AppShell'

export const Route = createFileRoute('/_app')({
  ssr: false,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: ({ context, location, serverContext }) => {
    if (!serverContext?.isServer && !context.viewer?.user) {
      throw redirect({
        to: '/login',
        search: { returnTo: location.pathname },
      })
    }
  },
  component: AppShell,
})
