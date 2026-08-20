import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },

  build: {
    rollupOptions: {
      output: {
        /*
         * Split the heavy third-party code out of the app chunk.
         * Firebase and Recharts together were roughly a megabyte sitting
         * in the same file as the landing page, so nothing rendered until
         * all of it had downloaded and parsed. Now they are cached
         * separately and Recharts only loads with the pages that chart.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'react';
          }
          return 'vendor';
        },
      },
    },
    // The firebase chunk is large but loads lazily, never on first paint.
    chunkSizeWarningLimit: 800,
  },

  server: {
    // HMR is disabled in AI Studio via the DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
