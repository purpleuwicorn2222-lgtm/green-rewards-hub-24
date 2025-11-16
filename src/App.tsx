import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { PointsProvider } from "@/contexts/PointsContext";
import Home from "./pages/Home";
import ShoppingList from "./pages/ShoppingList";
import SearchResults from "./pages/SearchResults";
import UploadReceipt from "./pages/UploadReceipt";
import MyPoints from "./pages/MyPoints";
import CategoryProducts from "./pages/CategoryProducts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PointsProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/upload-receipt" element={<UploadReceipt />} />
              <Route path="/my-points" element={<MyPoints />} />
              <Route path="/category/:category" element={<CategoryProducts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </PointsProvider>
  </QueryClientProvider>
);

export default App;
