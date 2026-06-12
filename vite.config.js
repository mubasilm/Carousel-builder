import base44 from "@base44/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { llmApiPlugin } from "./vite-plugin-llm-api.js";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    base44({
      legacySDKImports: false,
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true,
    }),
    react(),
    llmApiPlugin(),
  ],
});
