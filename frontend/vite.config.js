import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/llama38b": {
        target: "https://api.openai.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/llama38b/, ""),
        model: "gpt-4o-mini",
        headers: {
          Authorization: `Bearer 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`,
        },
      },
    },
  },
  plugins: [react()],
});
