// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },
  devtools: { enabled: true, },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/config.scss']
})
