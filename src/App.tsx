import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminSettings } from './pages/admin/Settings';
import { StoreCustomizer } from './pages/admin/StoreCustomizer';
import { Home } from './pages/storefront/Home';
import { ProductDetail } from './pages/storefront/ProductDetail';
import { Checkout } from './pages/storefront/Checkout';
import { OrderSuccess } from './pages/storefront/OrderSuccess';
import { Login } from './pages/Login';
import { CartProvider } from './hooks/useCart';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { useAuth } from './hooks/useAuth';

import { StorefrontLayout } from './components/storefront/StorefrontLayout';

const AppContent = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Merchant Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/admin" /> : <Login />} />
        <Route path="/forgot-password" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="store-customizer" element={<StoreCustomizer />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="marketing" element={<AdminDashboard />} />
          <Route path="discounts" element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminProducts />} />
          <Route path="ai" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Storefront Routes (Customer Facing) */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="collections" element={<Home />} />
          <Route path="cart" element={<Checkout />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="account" element={<Navigate to="/login" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
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
