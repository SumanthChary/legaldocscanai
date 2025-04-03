
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import DocumentSummary from "./pages/DocumentSummary";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Documentation from "./pages/Documentation";
import UpcomingFeatures from "./pages/UpcomingFeatures";
import { Dashboard } from "@/components/dashboard";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

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
              <Route path="/payment" element={<Payment />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/upcoming-features" element={<UpcomingFeatures />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
