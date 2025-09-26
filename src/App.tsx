import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { BurgerMenu } from "@/components/BurgerMenu";
import { setupMockTTSAPI } from "@/utils/mockTTSApi";
import Index from "./pages/Index";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropDiseaseDetection from "./pages/CropDiseaseDetection";
import MarketPrices from "./pages/MarketPrices";
import Weather from "./pages/Weather";
import NGOSchemes from "./pages/NGOSchemes";
import Teaching from "./pages/Teaching";
import YieldPrediction from "./pages/YieldPrediction";
import FarmIQ from "./pages/FarmIQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Setup mock TTS API for development
setupMockTTSAPI();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FarmIQ />} />
          <Route path="/old-homepage" element={<Index />} />
          <Route path="/iot" element={<div className="container mx-auto p-6">IoT page coming soon</div>} />
          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          <Route path="/farmer/crop-disease" element={<CropDiseaseDetection />} />
          <Route path="/farmer/weather" element={<Weather />} />
          <Route path="/farmer/ngo-schemes" element={<NGOSchemes />} />
          <Route path="/farmer/teaching" element={<Teaching />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BurgerMenu />
        <ChatbotWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
