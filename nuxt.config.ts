export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@vite-pwa/nuxt',
  ],
  css: [
    '@/assets/scss/fonts.scss',
    '@/assets/scss/null.scss',
    '@/assets/scss/highlight.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/globals.scss" as *;',
          silenceDeprecations: ['import'],
        },
      },
    },
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    githubToken: process.env.NUXT_GITHUB_TOKEN,
    endpoint: process.env.NUXT_GITHUB_ENDPOINT,
    model: process.env.NUXT_GITHUB_MODEL,
  },
  devServer: {
    port: 3000,
    host: 'localhost',
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: { navigateFallback: null, globPatterns: ['**/*.{js,css,svg,ico}'] },
    client: { installPrompt: true, periodicSyncForUpdates: 100000 },
    manifest: {
      name: 'Tresk AI',
      short_name: 'Tresk AI',
      description: 'TreskAI - современный чат-ассистент на основе искусственного интеллекта',
      theme_color: '#ffffff',
      lang: 'ru',
      icons: [
        {
          src: '/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          src: 'screenshot.png',
          sizes: '3840x2160',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Tresk AI',
        },
        {
          src: 'screenshot-mobile.png',
          sizes: '1290x2796',
          type: 'image/png',
          label: 'Tresk AI Mobile',
        },
      ],
    },
  },
})
