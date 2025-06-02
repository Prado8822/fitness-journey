import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: "/fitness-journey/", // добавлено для правильной работы на GitHub Pages
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Fitness Journey',
      short_name: 'FitJourney',
      description: 'Progresywna aplikacja do śledzenia aktywności sportowych',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4F46E5',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  })],
});
