import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/chess-game-frontend/",
  plugins: [react(), UnoCSS()],
});
