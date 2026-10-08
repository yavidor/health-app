import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { mockApiPlugin } from './vite/mockApiPlugin.js';

const latency = Number.parseInt(process.env.VITE_MOCK_LATENCY_MS ?? '', 10);

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // QA fixtures served over real HTTP. Dev/preview only — never shipped.
    ...(mode === 'mock' ? [mockApiPlugin({ latencyMs: Number.isNaN(latency) ? 0 : latency })] : []),
    // Installable PWA. The app is online-first: only the app shell is
    // precached and there is deliberately no runtime caching, so `/api/*`
    // responses are never served from a cache when the network is down.
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Health App',
        short_name: 'Health',
        description: 'Workout planning, nutrition tracking, and squad challenges.',
        theme_color: '#0e341f',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        // No runtimeCaching: API data must fail when the network fails.
      },
    }),
  ],
  test: {
    environment: 'node',
  },
}));
