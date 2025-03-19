import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const key = process.env.VITE_API_KEY; // Use process.env instead


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
          Authorization: `Bearer ${key}`,
        },
      },
    },
  },
  plugins: [react()],
});
