import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupMockTTSAPI } from "@/utils/mockTTSApi";

// Initialize mock TTS API
setupMockTTSAPI();

createRoot(document.getElementById("root")!).render(<App />);
