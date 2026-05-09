export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  ownedStoreIds?: string[];
  currentStoreId?: string;
  createdAt: any;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  onboardingStatus: 'onboarding' | 'active';
  launchStatus: 'draft' | 'live' | 'maintenance';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    banner?: string;
    typography?: string;
    darkMode: boolean;
  };
  settings: {
    currency: string;
    timezone: string;
    email: string;
    tagline?: string;
    domain?: string;
  };
  navigation: {
    header: any[];
    footer: any[];
  };
  launchChecklist: {
    domainConnected: boolean;
    seoReady: boolean;
    paymentSetup: boolean;
    shippingSetup: boolean;
  };
  adminAppearance?: {
    primaryColor: string;
    sidebarMode: 'dark' | 'light';
    typography: string;
  };
  createdAt: any;
}

export interface Product {
  id: string;
  storeId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  storeId: string;
  userId: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  customerEmail: string;
  createdAt: any;
}
