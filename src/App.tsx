
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load all pages for better performance
const Landing = React.lazy(() => import("./pages/Landing"));
const Index = React.lazy(() => import("./pages/Index"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Features = React.lazy(() => import("./pages/Features"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Payment = React.lazy(() => import("./pages/Payment"));
const DocumentAnalysis = React.lazy(() => import("./pages/DocumentAnalysis"));
const DocumentSummary = React.lazy(() => import("./pages/DocumentSummary"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Documentation = React.lazy(() => import("./pages/Documentation"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const Dashboard = React.lazy(() => import("@/components/dashboard").then(module => ({ default: module.Dashboard })));
const ESignatures = React.lazy(() => import("./pages/ESignatures"));
const SigningPage = React.lazy(() => import("./pages/SigningPage"));

// Optimized query client with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 20 * 60 * 1000, // 20 minutes
    },
  },
});

// PayPal configuration
const paypalOptions = {
  clientId: "ASwEnGxUl0eURMQkZ7lolWGxgRznZ9lx-h55cblFMiJj0qYOzluIe5BFBdeGYhwyabLRHZZvBPAJJBv6",
  currency: "USD",
  intent: "capture" as const,
  components: "buttons" as const,
  "disable-funding": "credit,card" as const,
};

// Fast loading component with skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="space-y-4 w-full max-w-md animate-fade-in">
      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <PayPalScriptProvider 
        options={paypalOptions}
        deferLoading={true}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/esignatures" element={<ESignatures />} />
                  <Route path="/sign/:requestId" element={<SigningPage />} />
                </Routes>
              </Suspense>
              <ChatWidget />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </PayPalScriptProvider>
    </ErrorBoundary>
  );
}

export default App;
