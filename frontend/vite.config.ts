import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,   // frontend dev
    open: true
  },
  build: {
    outDir: "dist",
  }
});