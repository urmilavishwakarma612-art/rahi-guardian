import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Emergency from "./pages/Emergency";
import Auth from "./pages/Auth";
import Volunteer from "./pages/Volunteer";
import FirstAid from "./pages/FirstAid";
import About from "./pages/About";
import NearbyServices from "./pages/NearbyServices";
import QuickDial from "./pages/QuickDial";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
<BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/about" element={<About />} />
          <Route path="/nearby-services" element={<NearbyServices />} />
          <Route path="/quick-dial" element={<QuickDial />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/install" element={<Install />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
