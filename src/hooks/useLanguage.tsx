import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.living': 'Living Room',
    'nav.bedroom': 'Bedroom',
    'nav.lighting': 'Lighting',
    'nav.decor': 'Decor',
    'hero.title': 'Elevate Your Home With Premium Style',
    'hero.desc': 'Discover our curated collection of minimalist furniture and decor designed to bring comfort and elegance to your space.',
    'hero.shop': 'Shop Collection',
    'hero.story': 'Our Story',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'product.add': 'Add to Cart',
    'product.buy': 'Buy Now',
    'product.stock': 'In Stock',
    'product.low': 'Low Stock',
    'product.out': 'Out of Stock',
  },
  ar: {
    'nav.living': 'غرفة المعيشة',
    'nav.bedroom': 'غرفة النوم',
    'nav.lighting': 'الإضاءة',
    'nav.decor': 'الديكور',
    'hero.title': 'ارتقِ بمنزلك بأسلوب فاخر',
    'hero.desc': 'اكتشف مجموعتنا المختارة من الأثاث والديكور البسيط المصمم لإضفاء الراحة والأناقة على مساحتك.',
    'hero.shop': 'تسوق المجموعة',
    'hero.story': 'قصتنا',
    'cart.title': 'حقيبة التسوق',
    'cart.empty': 'حقيبة التسوق فارغة',
    'cart.checkout': 'إتمام الشراء',
    'product.add': 'أضف إلى السلة',
    'product.buy': 'اشتري الآن',
    'product.stock': 'متوفر',
    'product.low': 'كمية محدودة',
    'product.out': 'نفذت الكمية',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRtl = language === 'ar';

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
