import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Globe, Heart } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { cn, formatPrice } from '../../lib/utils';
import { Button } from '../ui/button';

export const StorefrontLayout = () => {
  const { currentStore, fetchStoreBySlug, loading, error } = useStore();
  const { cartCount, items } = useCart();
  const { isRtl, t } = useLanguage();
  const location = useLocation();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // @ts-ignore
    const unsub = useStore.persist.onFinishHydration(() => setIsHydrated(true));
    // @ts-ignore
    if (useStore.persist.hasHydrated()) setIsHydrated(true);
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (isHydrated && !currentStore && !loading && !error) {
      // Fetch default store if none exists in state
      fetchStoreBySlug('default');
    }
  }, [currentStore, loading, fetchStoreBySlug, isHydrated, error]);

  if ((loading || !isHydrated) && !currentStore) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback for no store found - Premium Merchant Funnel
  if (!currentStore && !loading && isHydrated) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">LUMIÈRE</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Log In</Link>
            <Link to="/login" className="px-5 py-2.5 bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:translate-y-[-1px] transition-all">Start Free Trial</Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ready for Launch</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            The platform for <span className="text-gray-300">visionary</span> merchants.
          </h1>
          
          <p className="text-xl text-gray-500 font-medium max-w-2xl mb-12 leading-relaxed">
            Beautiful storefronts, global infrastructure, and advanced merchant tools. Join the thousands of brands building their future on Lumière.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-md">
            <Link to="/login" className="flex-1 h-14 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center hover:shadow-2xl hover:shadow-black/10 transition-all">
              Launch My Store
            </Link>
            <Link to="/login" className="flex-1 h-14 bg-white text-black border border-gray-200 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-gray-50 transition-all">
              Merchant Login
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full pt-20 border-t border-gray-50">
            {[
              { label: "Active Stores", value: "24k+" },
              { label: "Daily Orders", value: "150k+" },
              { label: "Uptime", value: "99.99%" },
              { label: "Support", value: "24/7" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-50">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2026 LUMIÈRE. BUILT FOR SCALE.</p>
           <div className="flex gap-8">
             {['Pricing', 'Docs', 'Status', 'Twitter'].map(link => (
               <button key={link} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">{link}</button>
             ))}
           </div>
        </footer>
      </div>
    );
  }

  const brandColor = currentStore?.theme?.primaryColor || '#000000';
  const brandName = currentStore?.name || 'LUMIÈRE';

  // Total cart value
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className={cn(
      "min-h-screen bg-white font-sans antialiased",
      isRtl ? "rtl" : "ltr"
    )} style={{ 
      fontFamily: currentStore?.theme?.typography || 'Inter, sans-serif'
    }}>
      {/* Announcement Bar */}
      <div 
        className="h-10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-white"
        style={{ backgroundColor: brandColor }}
      >
        Free shipping on all orders over $150
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Mobile Menu */}
          <button className="md:hidden p-2">
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-1 md:flex-none">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: brandColor }}>
              {brandName.toUpperCase()}
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {['Shop', 'Collections', 'Our Story', 'Journal'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <Link to="/account" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
              <Heart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Link>
            
            <Link to="/cart" className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition-all group">
              <ShoppingCart size={18} />
              <span className="text-xs font-bold">{cartCount}</span>
              <div className="h-4 w-[1px] bg-white/20 mx-1 hidden md:block" />
              <span className="text-xs font-bold hidden md:block">{formatPrice(subtotal)}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Modern Storefront Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <h2 className="text-xl font-black mb-6" style={{ color: brandColor }}>{brandName.toUpperCase()}</h2>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
                Crafting minimalist essentials for the modern home. Designing for longevity, aesthetics, and the planet.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'Pinterest'].map(social => (
                  <button key={social} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Shop</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/all">All Products</Link></li>
                <li><Link to="/new">New Arrivals</Link></li>
                <li><Link to="/best">Best Sellers</Link></li>
                <li><Link to="/sale">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/shipping">Shipping Policy</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/sustainability">Sustainability</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/legal">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © 2026 {brandName}. Built on Antigravity.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 <Globe size={14} /> English (US) / USD
               </div>
               <div className="flex gap-2">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-5 bg-gray-200 rounded border border-gray-300" />)}
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
