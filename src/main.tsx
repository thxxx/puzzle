import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Scene from "./screens/Scene";
// import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene" element={<Scene />} />
        {/* <Route path="*" element={<NotFound />} /> 일치하는 경로가 없으면 */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
