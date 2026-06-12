// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

  colorMode: {
    classSuffix: '',
    defaultColorScheme: 'dark',
    storageKey: 'its-color-mode',
  },

  app: {
    head: {
      titleTemplate: '%s | Incident Tracking System',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'description', content: 'Internal IT incident tracking system' }],
      bodyAttrs: { class: 'antialiased font-sans' },
    },
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    public: {
      appName: 'Incident Tracking System',
    },
  },
})
