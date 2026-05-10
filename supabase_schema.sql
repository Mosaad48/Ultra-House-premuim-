/* 
  SUPABASE E-COMMERCE SCHEMA
  Run this in your Supabase SQL Editor.
*/

-- 1. SETTINGS & THEME
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'My Store',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  accent_color TEXT DEFAULT '#fbbf24',
  font_family TEXT DEFAULT 'Inter',
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BANNERS/HERO
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/products',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  original_price DECIMAL(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT, -- Denormalized for speed
  images TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  shipping_address JSONB,
  items JSONB, -- Array of products
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROFILES (Fixed to avoid recursion)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user', -- 'admin', 'user'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simplified for dev, but avoiding recursion)

-- 1. store_settings
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage store_settings" ON store_settings FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');

-- 2. banners
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Admin manage banners" ON banners FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');

-- 3. categories
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');

-- 4. products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON products FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');

-- 5. orders
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view orders" ON orders FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');

-- 6. profiles (FIXED RECURSION)
-- Use auth.uid() and direct comparison instead of self-referencing subqueries
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL 
  USING (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'muhammedhmad111@gmail.com');
