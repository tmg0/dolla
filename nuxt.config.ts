export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  // (optional) Enable the Nuxt devtools
  devtools: { enabled: true },
  // Enable SSG
  ssr: false,
  // Change defaults throughout your Nuxt configuration to Nuxt v4 behavior
  future: { compatibilityVersion: 4 },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
  ],
  // Enables the development server to be discoverable by other devices for mobile development
  devServer: { host: '0.0.0.0' },

  imports: {
    dirs: ['constants'],
  },

  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
      hmr: {
        // Use websocket for mobile hot reloading
        protocol: 'ws',
        // Make sure it's available on the network
        host: '0.0.0.0',
        // Use a specific port for hmr
        port: 5183,
      },
    },
  },

  tailwindcss: {
    cssPath: '~/src/assets/css/tailwind.css',
  },
})
