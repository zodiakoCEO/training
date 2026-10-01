import { tmpdir } from 'node:os'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: join(tmpdir(), 'proyecto-training-frontend-vite'),
  plugins: [react()],
})
