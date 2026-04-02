import React from "react";
import ReactDOM from "react-dom/client";
import { MainApp } from "./main-app/MainApp";
import { OverlayApp } from "./overlay-app/OverlayApp";

const params = new URLSearchParams(window.location.search);
const windowType = params.get("window");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {windowType === "overlay" ? <OverlayApp /> : <MainApp />}
  </React.StrictMode>,
);
