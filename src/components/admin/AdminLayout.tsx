import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AISidekick } from './AISidekick';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { cn } from '../../lib/utils';
import { Toaster } from '../../components/ui/sonner';
import { 
  Search, 
  Bell, 
  HelpCircle,
  Menu,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const AdminLayout = () => {
  const { user, profile, loading } = useAuth();
  const { currentStore } = useStore();
  const { isRtl } = useLanguage();
  const location = useLocation();

  // Protected route: Check if user is logged in
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check for store and redirect to onboarding if missing
  if (!loading && user && !currentStore && location.pathname !== '/admin/onboarding') {
    return <Navigate to="/admin/onboarding" replace />;
  }

  const primaryColor = currentStore?.adminAppearance?.primaryColor || '#000000';
  const typography = currentStore?.adminAppearance?.typography || 'Inter';

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#f1f1f1] antialiased transition-all duration-300",
        isRtl ? "rtl" : "ltr"
      )}
      style={{ 
        fontFamily: `${typography}, sans-serif`,
        // @ts-ignore
        '--admin-primary': primaryColor 
      }}
    >
      <AdminSidebar />
      
      <main className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        isRtl ? "pr-64" : "pl-64"
      )}>
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Search products, orders, customers..." 
                className="w-full bg-gray-50 rounded-xl h-9 pl-10 pr-4 text-xs font-medium outline-none border border-transparent transition-all shadow-inner"
                style={{
                  // @ts-ignore
                  '--focus-border': 'var(--admin-primary)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--admin-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border text-[9px] font-bold text-gray-400">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border text-[9px] font-bold text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 mr-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] font-bold uppercase tracking-wider h-6">
                Online
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 gap-2 font-bold text-xs" onClick={() => window.open('/', '_blank')}>
                View Store
                <ExternalLink size={14} className="text-gray-400" />
              </Button>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 group">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[11px] font-bold text-gray-900 leading-none">{profile?.displayName?.split(' ')[0]}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{profile?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--admin-primary)' }}>
                {profile?.displayName?.charAt(0) || 'A'}
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <AISidekick />
      <Toaster position="bottom-right" />
    </div>
  );
};
