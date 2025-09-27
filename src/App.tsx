import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { setupMockTTSAPI } from "@/utils/mockTTSApi";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropDiseaseDetection from "./pages/CropDiseaseDetection";
import MarketPrices from "./pages/MarketPrices";
import Weather from "./pages/Weather";
import NGOSchemes from "./pages/NGOSchemes";
import Teaching from "./pages/Teaching";
import YieldPrediction from "./pages/YieldPrediction";
import FarmIQ from "./pages/FarmIQ";
import QRGeneration from "./pages/QRGeneration";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
        <AuthProvider>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/farmer/dashboard" 
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmIQ />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vendor/dashboard" 
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/old-homepage" element={<Index />} />
            <Route path="/iot" element={<div className="container mx-auto p-6">IoT page coming soon</div>} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/farmer/crop-disease" element={<CropDiseaseDetection />} />
            <Route path="/farmer/weather" element={<Weather />} />
            <Route path="/farmer/ngo-schemes" element={<NGOSchemes />} />
            <Route path="/farmer/teaching" element={<Teaching />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/yield-prediction" element={<YieldPrediction />} />
            <Route path="/farmer/qr/generate" element={<QRGeneration />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
