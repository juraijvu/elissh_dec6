import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import DynamicIndex from "./pages/DynamicIndex";
import DynamicCategoryPage from "./pages/DynamicCategoryPage";
import BrandsPage from "./pages/BrandsPage";
import DynamicSalePage from "./pages/DynamicSalePage";
import CartPage from "./pages/CartPage";
import DynamicProductDetailPage from "./pages/DynamicProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EnhancedAdminDashboard from "./pages/admin/EnhancedAdminDashboard";
import ComprehensiveDashboard from "./pages/admin/ComprehensiveDashboard";
import SimpleDashboard from "./pages/admin/SimpleDashboard";
import ProductManager from "./pages/admin/ProductManager";
import EnhancedProductManager from "./pages/admin/EnhancedProductManager";
import ComprehensiveOrderManager from "./pages/admin/ComprehensiveOrderManager";
import CategoryManager from "./pages/admin/CategoryManager";
import ContentManager from "./pages/admin/ContentManager";
import BannerManager from "./pages/admin/BannerManager";
import PaymentSettings from "./pages/admin/PaymentSettings";
import SEOManager from "./pages/admin/SEOManager";
import BlogManager from "./pages/admin/BlogManager";
import UserManager from "./pages/admin/UserManager";
import ReviewsManager from "./pages/admin/ReviewsManager";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import MockPayment from "./pages/MockPayment";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<DynamicIndex />} />
            <Route path="/category/:category" element={<DynamicCategoryPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/sale" element={<DynamicSalePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<DynamicProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/mock-payment" element={<MockPayment />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<EnhancedAdminDashboard />} />
              <Route path="products" element={<EnhancedProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="orders" element={<ComprehensiveOrderManager />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="banners" element={<BannerManager />} />
              <Route path="payments" element={<PaymentSettings />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="users" element={<UserManager />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
