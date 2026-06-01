import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /ca-pub-3282448341991495/g, 
            process.env.ADSENSE_PUBLISHER_ID || "ca-pub-3282448341991495"
          );
        }
      }
    ],
    define: {
      'import.meta.env.VITE_ADSENSE_PUBLISHER_ID': JSON.stringify(process.env.ADSENSE_PUBLISHER_ID || "ca-pub-3282448341991495")
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
