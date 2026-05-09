import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  Globe,
  LogOut,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { items } = useCart();
  const { user, profile, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "bg-white/80 backdrop-blur-xl py-3 shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-display font-black tracking-tighter">
            LUMIÈRE
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <Link to="/shop/living" className="hover:text-accent transition-colors">{t('nav.living')}</Link>
            <Link to="/shop/bedroom" className="hover:text-accent transition-colors">{t('nav.bedroom')}</Link>
            <Link to="/shop/lighting" className="hover:text-accent transition-colors">{t('nav.lighting')}</Link>
            <Link to="/shop/decor" className="hover:text-accent transition-colors">{t('nav.decor')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors text-xs font-bold"
          >
            <Globe size={18} />
            <span className="hidden sm:inline uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
            <Search size={20} />
          </button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 pl-3 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xs font-bold hidden md:block">{profile?.displayName || 'User'}</span>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white overflow-hidden">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
              </button>
              
              <div className={cn(
                "absolute top-full bg-white shadow-2xl rounded-2xl p-2 min-w-[200px] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all border border-gray-100",
                isRtl ? "left-0" : "right-0"
              )}>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">
                    <Settings size={18} /> Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <UserIcon size={20} />
            </Link>
          )}

          <button 
            onClick={onOpenCart}
            className="p-2 hover:bg-black hover:text-white rounded-full transition-all relative group"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white group-hover:border-black font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
