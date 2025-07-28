import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/providers/auth-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/dashboard/index";
import SignIn from "./pages/auth/signin";
import ProjectEditor from "./pages/editor/[projectId]";
import Analytics from "./pages/dashboard/analytics";
import Billing from "./pages/dashboard/billing";
import Domains from "./pages/dashboard/domains";
import Deploy from "./pages/dashboard/deploy";
import Social from "./pages/dashboard/social";
import Referrals from "./pages/dashboard/referrals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/billing" element={<Billing />} />
            <Route path="/dashboard/domains" element={<Domains />} />
            <Route path="/dashboard/deploy" element={<Deploy />} />
            <Route path="/dashboard/social" element={<Social />} />
            <Route path="/dashboard/referrals" element={<Referrals />} />
            <Route path="/editor/:projectId" element={<ProjectEditor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
