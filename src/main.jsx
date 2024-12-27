import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@unocss/reset/normalize.css";
import "./style.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import PlayingProvider from "./Context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayingProvider>
      <App />
    </PlayingProvider>
  </StrictMode>
);
