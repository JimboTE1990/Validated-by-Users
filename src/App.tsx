import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
