import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  base: '/ofdocs/',
  optimizeDeps: {
    include: [
      'highlight.js/lib/core',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/json',
      'highlight.js/lib/languages/xml',
    ],
  },
  plugins: [vue()],
}

export default config
