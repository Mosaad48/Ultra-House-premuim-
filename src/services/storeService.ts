import { supabase } from '../lib/supabase';
import { StoreSettings, Banner, Category, Order } from '../types';

export const storeService = {
  // SETTINGS
  async getSettings(): Promise<StoreSettings | null> {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      storeName: data.store_name,
      logoUrl: data.logo_url,
      primaryColor: data.primary_color,
      accentColor: data.accent_color,
      fontFamily: data.font_family,
      currency: data.currency,
      updatedAt: data.updated_at
    };
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.storeName) dbUpdates.store_name = updates.storeName;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    if (updates.primaryColor) dbUpdates.primary_color = updates.primaryColor;
    if (updates.accentColor) dbUpdates.accent_color = updates.accentColor;
    if (updates.fontFamily) dbUpdates.font_family = updates.fontFamily;
    if (updates.currency) dbUpdates.currency = updates.currency;

    const { data: existing } = await supabase.from('store_settings').select('id').maybeSingle();
    
    if (existing) {
      await supabase.from('store_settings').update(dbUpdates).eq('id', existing.id);
    } else {
      await supabase.from('store_settings').insert([dbUpdates]);
    }
  },

  // BANNERS
  async getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      return [];
    }

    return (data || []).map(b => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.image_url,
      buttonText: b.button_text,
      buttonLink: b.button_link,
      isActive: b.is_active,
      displayOrder: b.display_order
    }));
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data || []).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image_url
    }));
  },

  // ORDERS
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        total_amount: order.totalAmount,
        status: order.status,
        shipping_address: order.shippingAddress,
        items: order.items
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return {
      id: data.id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      totalAmount: data.total_amount,
      status: data.status,
      shippingAddress: data.shipping_address,
      items: data.items,
      createdAt: data.created_at
    };
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return (data || []).map(o => ({
      id: o.id,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      totalAmount: o.total_amount,
      totalPrice: o.total_amount, // supporting both field names if needed
      orderNumber: o.id.slice(0, 8).toUpperCase(),
      status: o.status,
      shippingAddress: o.shipping_address,
      items: o.items,
      createdAt: o.created_at
    }));
  }
};
