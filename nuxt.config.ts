export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    modules: ['@nuxtjs/tailwindcss'],
    tailwindcss: {
        configPath: '~/tailwind.config.js',
    },
    runtimeConfig: {
        githubToken: process.env.NUXT_GITHUB_TOKEN,
        endpoint: process.env.NUXT_GITHUB_ENDPOINT,
        model: process.env.NUXT_GITHUB_MODEL,
    },
})
