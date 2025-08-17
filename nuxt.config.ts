export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
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
})
