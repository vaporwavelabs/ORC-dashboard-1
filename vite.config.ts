import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.ANYTHING_LLM_API_KEY': JSON.stringify(env.ANYTHING_LLM_API_KEY),
      'process.env.ANYTHING_LLM_BASE_URL': JSON.stringify(env.ANYTHING_LLM_BASE_URL),
      'process.env.ANYTHING_LLM_WORKSPACE_SLUG': JSON.stringify(env.ANYTHING_LLM_WORKSPACE_SLUG),
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
    },
  };
});
