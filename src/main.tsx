import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const params = new URLSearchParams(window.location.search);
const windowType = params.get("window");

if (windowType === "overlay") {
  import("./overlay-app/OverlayApp").then(({ OverlayApp }) => {
    root.render(
      <React.StrictMode>
        <OverlayApp />
      </React.StrictMode>,
    );
  });
} else {
  import("./main-app/MainApp").then(({ MainApp }) => {
    root.render(
      <React.StrictMode>
        <MainApp />
      </React.StrictMode>,
    );
  });
}
