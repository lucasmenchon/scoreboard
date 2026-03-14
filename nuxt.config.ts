// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-10',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  app: {
    baseURL: '/scoreboard/',
  },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
  ],
  css: ['~/assets/css/main.css'],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
    },
  },
})
