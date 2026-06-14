import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deployed to GitHub Pages the app is served from
// https://<user>.github.io/course/, so assets must resolve under /course/.
// Locally (dev/preview) we use '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/course/' : '/',
  plugins: [react()],
}))
