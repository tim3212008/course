import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path depends on where it's hosted:
//  - Netlify / Vercel serve from the domain root  -> '/'
//  - GitHub Pages serves from https://<user>.github.io/course/ -> '/course/'
//  - Local dev / preview -> '/'
// Netlify sets NETLIFY=true and Vercel sets VERCEL=1 during their builds.
export default defineConfig(({ command }) => {
  const isRootHost =
    process.env.NETLIFY || process.env.VERCEL || process.env.DEPLOY_BASE === '/'
  const base = command === 'build' && !isRootHost ? '/course/' : '/'
  return { base, plugins: [react()] }
})
