import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminSettings } from './pages/admin/Settings';
import { Onboarding } from './pages/admin/Onboarding';
import { StoreCustomizer } from './pages/admin/StoreCustomizer';
import { Home } from './pages/storefront/Home';
import { ProductDetail } from './pages/storefront/ProductDetail';
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
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
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
          <Route path="collections" element={<Home />} /> {/* Temporary placeholders */}
          <Route path="cart" element={<Home />} />
          <Route path="checkout" element={<Home />} />
          <Route path="account" element={<Login />} />
          <Route path="login" element={user ? <Navigate to="/" /> : <Login />} />
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
