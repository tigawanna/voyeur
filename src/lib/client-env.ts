import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_APP_URL: z.url().default('http://localhost:3072'),
})

export const clientEnv = clientEnvSchema.parse({
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
})
