import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/', // <-- هذا هو السطر الذي سيعيد الموقع للعمل
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Altaleblogo-website.png'],
      manifest: {
        name: 'شركة الطالب للإتصالات',
        short_name: 'Al-Taleb',
        description: 'متجر شركة الطالب لبيع وشراء الأجهزة المكفولة',
        theme_color: '#0095D9',
        background_color: '#050507',
        display: 'standalone',
        icons: [
          {
            src: 'Altaleblogo-website.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Altaleblogo-website.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})