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
    head: {
      title: 'Scoreboard - Placar Interativo',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/scoreboard/favicon.svg' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
      ],
      meta: [
        { name: 'description', content: 'Placar interativo para jogos entre amigos, competições e desafios.' },
        { name: 'theme-color', content: '#7c3aed' },
      ],
    },
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
