import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';
import { formatPrice, cn } from '../../lib/utils';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';
import { Product, Banner } from '../../types';

export const Home = () => {
  const { t, isRtl } = useLanguage();
  const { addItem } = useCart();
  const { currentStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prods, bans] = await Promise.all([
          productService.getFeaturedProducts(),
          storeService.getBanners()
        ]);
        setProducts(prods);
        setBanners(bans);
      } catch (error) {
        console.error('Failed to fetch storefront data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to realtime updates
    const subscription = productService.subscribeToProducts(() => {
      fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const brandColor = currentStore?.primaryColor || '#000000';
  const activeHero = banners[0];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] sm:h-screen min-h-[500px] sm:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={activeHero?.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000"} 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white px-2 sm:px-0"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] mb-6 sm:mb-8" style={{ fontFamily: currentStore?.fontFamily || 'inherit' }}>
              {activeHero?.title || currentStore?.storeName || t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-lg leading-relaxed font-medium">
              {activeHero?.subtitle || t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                to={activeHero?.buttonLink || '/products'}
                className="bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-2xl"
                style={{ color: brandColor }}
              >
                {activeHero?.buttonText || t('hero.shop')} 
                <ArrowRight size={20} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180")} />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold hover:bg-white/20 transition-all">
                {t('hero.story')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white py-8 sm:py-12 md:py-20 border-t border-gray-100 hidden sm:block">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              <FeatureItem icon={<Truck />} title="Fast Delivery" desc="Across GCC within 3-5 days" />
              <FeatureItem icon={<ShieldCheck />} title="Secure Payment" desc="100% secure checkout" />
              <FeatureItem icon={<RotateCcw />} title="Easy Returns" desc="30-day return policy" />
              <FeatureItem icon={<Star />} title="Premium Quality" desc="Handpicked materials" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section for Mobile */}
      <section className="py-12 bg-gray-50 sm:hidden">
        <div className="px-6 flex flex-col gap-8">
          <FeatureItem icon={<Truck />} title="Fast Delivery" desc="Across GCC within 3-5 days" />
          <FeatureItem icon={<ShieldCheck />} title="Secure Payment" desc="100% secure checkout" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-display font-black mb-4 sm:mb-6">Featured Pieces</h2>
            <p className="text-gray-500 max-w-lg text-base sm:text-lg">
              Explore our most popular pieces, chosen for their exceptional design and timeless quality.
            </p>
          </div>
          <button className="w-full sm:w-auto px-8 py-4 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-all text-xs tracking-widest uppercase font-display">
            VIEW ALL PRODUCTS
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-12 sm:gap-y-16 min-h-[400px] relative">
          {loading ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
              <Loader2 size={40} className="animate-spin" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs">Loading collection</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product: Product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 mb-6">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                      }}
                      className="absolute bottom-6 left-6 right-6 bg-white py-4 rounded-xl font-bold text-sm shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-black hover:text-white"
                    >
                      {t('product.add')}
                    </button>
                  </div>
                </Link>
                <div className="flex justify-between items-start">
                  <Link to={`/product/${product.id}`} className="block flex-1 min-w-0">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{product.categoryName || 'General'}</p>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-1 text-orange-400 text-xs">
                        <Star size={14} fill="currentColor" />
                        <span className="text-gray-500 font-bold">{product.rating} ({product.reviewsCount})</span>
                      </div>
                    </div>
                  </Link>
                  <p className="text-2xl font-display font-black">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="font-bold uppercase tracking-[0.2em] text-xs">No products found</p>
              <p className="text-sm">Start adding products in the admin dashboard</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="w-16 h-16 rounded-2xl border border-gray-100 flex items-center justify-center bg-gray-50/50 group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/10">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <h3 className="font-black text-xs uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-xs text-gray-400 font-medium">{desc}</p>
    </div>
  </div>
);
