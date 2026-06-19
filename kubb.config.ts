import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig({
  root: '.',
  input: {
    path: './src/data-access-layer/tmdb/openapi.json',
  },
  output: {
    path: './src/data-access-layer/tmdb/generated',
    clean: true,
    barrelType: false,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models', barrelType: false },
    }),
  ],
})
