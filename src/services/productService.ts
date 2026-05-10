import { supabase } from '../lib/supabase';
import { Product } from '../types';

/**
 * Service to handle product operations with Supabase.
 */
export const productService = {
  /**
   * Internal helper to map DB snake_case to JS camelCase
   */
  _mapFromDb(data: any): Product {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.original_price ? Number(data.original_price) : undefined,
      categoryId: data.category_id,
      categoryName: data.category_name,
      images: data.images || [],
      stock: data.stock,
      isPublished: data.is_published,
      isFeatured: data.is_featured,
      rating: Number(data.rating),
      reviewsCount: data.reviews_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  /**
   * Fetch all products
   */
  async getAllProducts(includeUnpublished = false): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return (data || []).map(p => this._mapFromDb(p));
  },

  /**
   * Fetch featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_published', true)
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }

    return (data || []).map(p => this._mapFromDb(p));
  },

  /**
   * Fetch a single product by ID or Slug
   */
  async getProduct(identifier: string): Promise<Product | null> {
    const isId = identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(isId ? `id.eq.${identifier}` : `slug.eq.${identifier}`)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product ${identifier}:`, error);
      return null;
    }

    return data ? this._mapFromDb(data) : null;
  },

  /**
   * Create a new product
   */
  async createProduct(product: Partial<Product>): Promise<Product | null> {
    const dbProduct = {
      title: product.title,
      slug: product.slug || product.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category_id: product.categoryId,
      category_name: product.categoryName,
      images: product.images,
      stock: product.stock || 0,
      is_published: product.isPublished ?? true,
      is_featured: product.isFeatured ?? false,
      rating: 5.0,
      reviews_count: 0
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating product:', error);
      throw error;
    }

    return this._mapFromDb(data);
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.slug) dbUpdates.slug = updates.slug;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.categoryId) dbUpdates.category_id = updates.categoryId;
    if (updates.categoryName) dbUpdates.category_name = updates.categoryName;
    if (updates.images) dbUpdates.images = updates.images;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }

    return this._mapFromDb(data);
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetch products by category
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }

    return (data || []).map(p => this._mapFromDb(p));
  },

  /**
   * Subscribe to product changes
   */
  subscribeToProducts(callback: () => void) {
    return supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => callback()
      )
      .subscribe();
  }
};
