// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: ['@nuxtjs/tailwindcss'],

  // Global HTML head
  app: {
    head: {
      titleTemplate: '%s | IT Incident Log',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'description', content: 'Internal IT incident tracking system' }],
      bodyAttrs: { class: 'antialiased font-sans' },
    },
  },

  // Global CSS
  css: ['~/assets/css/main.css'],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Run separately to avoid slowing dev server
  },

  // Runtime config — public keys are exposed to the client
  runtimeConfig: {
    // Private (server-only)
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    // Public (exposed to browser)
    public: {
      appName: 'IT Incident Log System',
    },
  },
})

