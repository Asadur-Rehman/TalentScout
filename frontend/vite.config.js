import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables
const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");
console.log(env);

console.log("VITE_API_KEY:", env.VITE_API_KEY);
console.log("VITE_LLAMA:", env.VITE_LLAMA);

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
        model: env.VITE_LLAMA, // Using the loaded env variable
        headers: {
          Authorization: `Bearer ${env.VITE_API_KEY}`, // Using the loaded env variable
        },
      },
    },
  },
  plugins: [react()],
});
