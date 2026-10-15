import React from "react";
import { TempleNightScene } from "../../shaders/temple-night/TempleNightScene";
import "../../shaders/threeui.css";

export function Scene() {
  return (
    <div className="shader-frame" style={{ width: "100%", aspectRatio: "16 / 9" }}>
      <TempleNightScene variant="temple-night" />
    </div>
  );
}
