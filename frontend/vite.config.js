import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
          headers: {
            Authorization: `Bearer ${env.VITE_API_KEY}`,
          },
        },
      },
    },
    plugins: [react()],
  };
});
