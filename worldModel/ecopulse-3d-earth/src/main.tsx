import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobeCanvas from "./GlobeCanvas";
import "./globe.css";

function EarthOnly() {
  return (
    <main className="earth-page">
      <div className="earth-stage-wrap">
        <div className="globe-stage">
          <GlobeCanvas />
          <span className="globe-orbit orbit-one" aria-hidden="true" />
          <span className="globe-orbit orbit-two" aria-hidden="true" />
          <div className="globe-tag"><span className="tag-pin" aria-hidden="true" /> QARABAĞ</div>
        </div>
        <p className="rotation-hint"><span aria-hidden="true">⤺</span> Fırlatmaq üçün sürüşdürün</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EarthOnly />
  </StrictMode>,
);
