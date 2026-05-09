import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';
import { formatPrice, cn } from '../../lib/utils';

// Sample data for Home
const FEATURED_PRODUCTS = [
  {
    id: '1',
    title: 'Nordic Minimalist Sofa',
    price: 999,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    category: 'Sofa',
    stock: 5,
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: '2',
    title: 'Modern Pendant Light',
    price: 249,
    images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800'],
    category: 'Lighting',
    stock: 12,
    rating: 4.5,
    reviewsCount: 86
  }
];

export const Home = () => {
  const { t, isRtl } = useLanguage();
  const { addItem } = useCart();
  const { currentStore } = useStore();

  const brandColor = currentStore?.theme?.primaryColor || '#000000';
  const brandName = currentStore?.name?.toUpperCase() || 'LUMIÈRE';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] mb-8" style={{ fontFamily: currentStore?.theme?.typography || 'inherit' }}>
              {currentStore?.settings.tagline || t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-lg leading-relaxed font-medium">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                className="bg-white text-black px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-2xl"
                style={{ color: brandColor }}
              >
                {t('hero.shop')} 
                <ArrowRight size={20} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180")} />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all">
                {t('hero.story')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white py-12 md:py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <FeatureItem icon={<Truck />} title="Fast Delivery" desc="Across GCC within 3-5 days" />
              <FeatureItem icon={<ShieldCheck />} title="Secure Payment" desc="100% secure checkout" />
              <FeatureItem icon={<RotateCcw />} title="Easy Returns" desc="30-day return policy" />
              <FeatureItem icon={<Star />} title="Premium Quality" desc="Handpicked materials" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-display font-black mb-6">Featured Pieces</h2>
            <p className="text-gray-500 max-w-lg text-lg">
              Explore our most popular pieces, chosen for their exceptional design and timeless quality.
            </p>
          </div>
          <button className="px-8 py-4 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-all">
            VIEW ALL PRODUCTS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {FEATURED_PRODUCTS.map((product: any) => (
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
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{product.category}</p>
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
          ))}
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
