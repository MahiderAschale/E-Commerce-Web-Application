/* import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "ui": path.resolve(__dirname, "src/components/ui"),
      "utils": path.resolve(__dirname, "src/lib/utils"),
      "lib": path.resolve(__dirname, "src/lib"),
      "hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
}); */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',  // Ensure that @ maps to the /src directory
    },
  },
  css: {
    postcss: './postcss.config.ts',  // Tell Vite to use your TypeScript-based PostCSS config
  },
});

