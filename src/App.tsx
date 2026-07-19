import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import Quiz1 from "./pages/Quiz1";
import Quiz2 from "./pages/Quiz2";
import ProductLandingPage from "./pages/ProductLandingPage";
import OABTracker from "./pages/OABTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Quiz1 />} />
          <Route path="/paginadevendas" element={<Index />} />
          <Route path="/obrigado" element={<ThankYou />} />
          <Route path="/quiz" element={<Quiz1 />} />
          <Route path="/quiz2" element={<Quiz2 />} />
          <Route path="/produto/:slug" element={<ProductLandingPage />} />
          <Route path="/oabtracker" element={<OABTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
