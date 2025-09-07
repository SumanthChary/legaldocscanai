import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ChatWidget } from "@/components/chat/ChatWidget";

// Import mobile-first pages
import MobileHome from "./pages/MobileHome";
import MobileScan from "./pages/MobileScan";
import MobileHistory from "./pages/MobileHistory";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MobileProfile from "./pages/MobileProfile";
import DocumentSummary from "./pages/DocumentSummary";
import MobileDocumentSummary from "./pages/MobileDocumentSummary";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MobileHome />} />
              <Route path="/scan" element={<MobileScan />} />
              <Route path="/history" element={<MobileHistory />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<MobileProfile />} />
              <Route path="/document-summary/:id" element={<MobileDocumentSummary />} />
              <Route path="/document/:id/summary" element={<MobileDocumentSummary />} />
              <Route path="/settings" element={<MobileProfile />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
