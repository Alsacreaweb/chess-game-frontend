import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@unocss/reset/normalize.css";
import "./style.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import PlayingProvider from "./Context";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  disable: false,
  startEvent: "DOMContentLoaded",
  initClassName: "aos-init",
  animatedClassName: "aos-animate",
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,

  offset: 120,
  delay: 0,
  duration: 400,
  easing: "ease",
  once: false,
  mirror: false,
  anchorPlacement: "top-bottom",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayingProvider>
      <App />
    </PlayingProvider>
  </StrictMode>
);
