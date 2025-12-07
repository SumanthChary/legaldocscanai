import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ChatWidget } from "@/components/chat/ChatWidget";

// Auth
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Import mobile-first pages
import MobileHome from "./pages/MobileHome";
import MobileScan from "./pages/MobileScan";
import MobileHistory from "./pages/MobileHistory";
import MobileAuth from "./pages/MobileAuth";
import MobileChat from "./pages/MobileChat";
import MobileDocumentSummary from "./pages/MobileDocumentSummary";
import MobileReports from "./pages/MobileReports";
import MobileProfile from "./pages/MobileProfile";
import MobilePlans from "./pages/MobilePlans";

// Desktop fallbacks
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import DocumentSummary from "./pages/DocumentSummary";
import DocumentAnalysis from "./pages/DocumentAnalysis";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// PayPal configuration with proper error handling
const paypalOptions = {
  clientId: "ASwEnGxUl0eURMQkZ7lolWGxgRznZ9lx-h55cblFMiJj0qYOzluIe5BFBdeGYhwyabLRHZZvBPAJJBv6",
  currency: "USD",
  intent: "capture" as const,
  components: "buttons" as const,
  "disable-funding": "credit,card" as const, // Disable credit card options to focus on PayPal
};

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <PayPalScriptProvider 
      options={paypalOptions}
      deferLoading={false}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public auth route */}
                <Route path="/auth" element={<MobileAuth />} />
                
                {/* Protected Mobile-first routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MobileHome />
                  </ProtectedRoute>
                } />
                <Route path="/scan" element={
                  <ProtectedRoute>
                    <MobileScan />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <MobileHistory />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MobileReports />
                  </ProtectedRoute>
                } />
                <Route path="/reports/:id" element={
                  <ProtectedRoute>
                    <MobileDocumentSummary />
                  </ProtectedRoute>
                } />
                <Route path="/document-summary/:id" element={
                  <ProtectedRoute>
                    <MobileDocumentSummary />
                  </ProtectedRoute>
                } />
                <Route path="/document/:id/summary" element={
                  <ProtectedRoute>
                    <MobileDocumentSummary />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <MobileChat />
                  </ProtectedRoute>
                } />
                <Route path="/plans" element={
                  <ProtectedRoute>
                    <MobilePlans />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MobileProfile />
                  </ProtectedRoute>
                } />
                  <Route path="*" element={
                    <ProtectedRoute>
                      <MobileHome />
                    </ProtectedRoute>
                  } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
