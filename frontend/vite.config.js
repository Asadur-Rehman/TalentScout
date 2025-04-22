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
        model: "gpt-4o",
        headers: {
          Authorization: `Bearer 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`,
        },
      },
    },
  },
  plugins: [react()],
});
