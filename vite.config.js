import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Set Vite to run on http://localhost:5174/
  },
  base: "/", // Ensure Vite serves from the root URL
});
