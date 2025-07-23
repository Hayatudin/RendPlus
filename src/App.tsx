
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import QuotePage from "./pages/QuotePage";
import FAQPage from "./pages/FAQPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import PortfolioPage from "./pages/PortfolioPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={
                <RouteGuard requireAuth={false}>
                  <LoginPage />
                </RouteGuard>
              } />
              <Route path="/signup" element={
                <RouteGuard requireAuth={false}>
                  <SignupPage />
                </RouteGuard>
              } />
              <Route path="/profile" element={
                <RouteGuard requireAuth={true}>
                  <ProfilePage />
                </RouteGuard>
              } />
              
              {/* Admin route */}
              <Route path="/admin" element={
                <AdminRouteGuard>
                  <AdminPage />
                </AdminRouteGuard>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
