import { getAuth } from '#/lib/auth'
import { bypassViewer, isAuthBypassEnabled } from '#/data-access-layer/auth/auth-bypass'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  if (isAuthBypassEnabled()) {
    return bypassViewer
  }

  const headers = getRequestHeaders()
  return getAuth().api.getSession({ headers })
})
