export default {
  base: '/ofdocs/',
  optimizeDeps: {
    include: [
      'highlight.js/lib/core',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/json',
      'highlight.js/lib/languages/xml',
    ],
    link: ['oceanfront'],
  },
}
