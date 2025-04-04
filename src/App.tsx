
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Lazy load pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Index = lazy(() => import("./pages/Index"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Payment = lazy(() => import("./pages/Payment"));
const DocumentAnalysis = lazy(() => import("./pages/DocumentAnalysis"));
const DocumentSummary = lazy(() => import("./pages/DocumentSummary"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Documentation = lazy(() => import("./pages/Documentation"));
const UpcomingFeatures = lazy(() => import("./pages/UpcomingFeatures"));
const Dashboard = lazy(() => import("@/components/dashboard").then(module => ({ default: module.Dashboard })));

// Create loading component
const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-12 w-12 bg-primary/20 rounded-full"></div>
      <div className="text-lg text-muted-foreground">Loading...</div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: "ASwEnGxUl0eURMQkZ7lolWGxgRznZ9lx-h55cblFMiJj0qYOzluIe5BFBdeGYhwyabLRHZZvBPAJJBv6",
        currency: "USD",
        intent: "capture",
        components: "buttons"
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/index" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/document-analysis" element={<DocumentAnalysis />} />
                <Route path="/document-summary/:id" element={<DocumentSummary />} />
                <Route path="/document/:id/summary" element={<DocumentSummary />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/upcoming-features" element={<UpcomingFeatures />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
