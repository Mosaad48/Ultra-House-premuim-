import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminSettings } from './pages/admin/Settings';
import { StoreCustomizer } from './pages/admin/StoreCustomizer';

// Storefront Pages
import { Home } from './pages/storefront/Home';
import { ProductDetail } from './pages/storefront/ProductDetail';
import { Checkout } from './pages/storefront/Checkout';
import { OrderSuccess } from './pages/storefront/OrderSuccess';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { NotFound } from './pages/NotFound';

// Providers & Hooks
import { CartProvider } from './hooks/useCart';
import { LanguageProvider } from './hooks/useLanguage';
import { useAuth } from './hooks/useAuth';
import { StorefrontLayout } from './components/storefront/StorefrontLayout';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* 
          ADMIN DASHBOARD ROUTES 
          Wrapped in ProtectedRoute and AdminLayout
        */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="marketing" element={<AdminDashboard />} />
          <Route path="discounts" element={<AdminDashboard />} />
          <Route path="content" element={<AdminDashboard />} />
          <Route path="store-customizer" element={<StoreCustomizer />} />
          <Route path="settings" element={<AdminSettings />} />
          
          {/* Missing admin routes from sidebar placeholders */}
          <Route path="pos" element={<AdminDashboard />} />
          <Route path="markets" element={<AdminDashboard />} />
          <Route path="apps" element={<AdminDashboard />} />
          <Route path="translations" element={<AdminDashboard />} />
        </Route>

        {/* 
          STOREFRONT ROUTES 
          Independently wrapped in StorefrontLayout
        */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Home />} /> {/* Listing page */}
          <Route path="collections" element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Checkout />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="account" element={<Navigate to="/login" />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LanguageProvider>
  );
}
