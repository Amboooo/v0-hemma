import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for mobile development
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
})
