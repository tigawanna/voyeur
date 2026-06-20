import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from './-components/AppShell'

export const Route = createFileRoute('/_app')({
  ssr: false,
  beforeLoad: ({ context, location }) => {
    if (!context.viewer?.user) {
      throw redirect({
        to: '/login',
        search: { returnTo: location.pathname },
      })
    }
  },
  component: AppShell,
})
