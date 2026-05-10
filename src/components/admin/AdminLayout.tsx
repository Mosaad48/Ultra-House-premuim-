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
  const { profile } = useAuth();
  const { currentStore } = useStore();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { isRtl } = useLanguage();
  const location = useLocation();

  React.useEffect(() => {
    // @ts-ignore
    const unsub = useStore.persist.onFinishHydration(() => setIsHydrated(true));
    // @ts-ignore
    if (useStore.persist.hasHydrated()) setIsHydrated(true);
    return () => unsub();
  }, []);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!isHydrated) {
    const loaderColor = currentStore?.primaryColor || '#000000';
    return (
      <div className="h-screen flex items-center justify-center bg-[#f1f1f1]">
        <div 
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: `${loaderColor} transparent ${loaderColor} transparent` }} 
        />
      </div>
    );
  }

  const primaryColor = currentStore?.primaryColor || '#000000';
  const typography = currentStore?.fontFamily || 'Inter';

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
      <div className={cn(
        "fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity",
        isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsMobileSidebarOpen(false)} />

      <div className={cn(
        "fixed inset-y-0 z-50 lg:relative lg:block transition-transform duration-300",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isRtl ? "right-0" : "left-0"
      )}>
        <AdminSidebar />
      </div>
      
      <main className={cn(
        "transition-all duration-300 min-h-screen flex flex-col min-w-0 w-full",
        !isMobileSidebarOpen && (isRtl ? "lg:pr-64" : "lg:pl-64")
      )}>
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <div className="relative w-full max-w-md group hidden sm:block">
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

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center gap-1 lg:mr-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] font-bold uppercase tracking-wider h-6 hidden md:flex">
                Online
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 gap-2 font-bold text-xs hidden sm:flex" onClick={() => window.open('/', '_blank')}>
                View Store
                <ExternalLink size={14} className="text-gray-400" />
              </Button>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-[1px] bg-gray-200 lg:mx-2" />
            
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 group">
              <div className="flex flex-col items-end mr-1 hidden sm:flex">
                <span className="text-[11px] font-bold text-gray-900 leading-none">{profile?.displayName?.split(' ')[0] || profile?.email?.split('@')[0]}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{profile?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--admin-primary)' }}>
                {profile?.displayName?.charAt(0) || profile?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <AISidekick />
      <Toaster position="bottom-right" />
    </div>
  );
};
