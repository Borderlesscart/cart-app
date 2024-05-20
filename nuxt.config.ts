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
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-primevue',
    'nuxt-lodash'
  ],
  css: ['~/assets/css/config.scss'],
  runtimeConfig: {
    baseUrl: 'localhost:4000/'
  },
  axios: {
    baseURL: 'localhost:4000/',
    proxyHeaders: false,
    credentials: false
  },
  primevue: {
    options: {
        unstyled: false
    },
    // includes: ['FileUpload'],
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
  },
  vite: {
    template: {
      transformAssetUrls: {
          includeAbsolute: false,
          base: null
      },
    },
    vue: {
     
    },
  }
})
