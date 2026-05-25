import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { HomePage } from "@/pages/HomePage";
import { StudioPage } from "@/pages/StudioPage";
import { SharePage } from "@/pages/SharePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio/:projectId?" element={<StudioPage />} />
        <Route path="/share/:projectId" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
