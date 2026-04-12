// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiUrl: '', // NUXT_PUBLIC_API_URL
      socketUrl: '', // NUXT_PUBLIC_SOCKET_URL
    }
  },
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
