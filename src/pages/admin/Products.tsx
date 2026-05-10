import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Filter, 
  Download,
  Image as ImageIcon,
  Tag,
  Box,
  Eye,
  Edit2,
  Trash2,
  ChevronRight,
  Package,
  Star
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';

const MediaUpload = ({ images, setImages }: { images: string[], setImages: (imgs: string[]) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImages([...images, result]);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFile);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFile);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Images</Label>
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <label 
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all",
              isDragging ? "border-black bg-gray-50" : "border-gray-200"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input type="file" className="hidden" multiple onChange={onSelect} accept="image/*" />
            <ImageIcon size={20} className="text-gray-400 mb-2" />
            <span className="text-[10px] font-black uppercase text-gray-400">Add Image</span>
          </label>
        )}
      </div>
      <p className="text-[10px] text-gray-400">Upload up to 5 professional product shots. Drag and drop supported.</p>
    </div>
  );
};

import { productService } from '../../services/productService';

export const AdminProducts = () => {
  const { currentStore } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'Furniture',
    stock: 0,
    isFeatured: false,
    images: [] as string[]
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(true);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = parseFloat(String(newProduct.price)) || 0;
      const originalPriceValue = parseFloat(String(newProduct.originalPrice)) || 0;
      const stock = parseInt(String(newProduct.stock)) || 0;

      await productService.createProduct({
        ...newProduct,
        price,
        originalPrice: originalPriceValue > 0 ? originalPriceValue : undefined,
        stock,
        categoryName: newProduct.category,
        isPublished: true,
        rating: 5,
        reviewsCount: 0,
      } as any);
      
      setIsAddDialogOpen(false);
      toast.success('Product added successfully');
      setNewProduct({
        title: '',
        description: '',
        price: 0,
        originalPrice: 0,
        category: 'Furniture',
        stock: 0,
        isFeatured: false,
        images: []
      });
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error adding product to Supabase:', error);
      toast.error(`Failed to add product: ${error.message || 'Check connection or RLS policies'}`);
    }
  };

  const toggleFeatured = async (product: any) => {
    try {
      await productService.updateProduct(product.id, { isFeatured: !product.isFeatured });
      toast.success(product.isFeatured ? 'Removed from featured' : 'Marked as featured');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const togglePublished = async (product: any) => {
    try {
      await productService.updateProduct(product.id, { isPublished: !product.isPublished });
      toast.success(product.isPublished ? 'Product unpublished' : 'Product published');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted');
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product from Supabase:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">Manage your store inventory and details.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger render={<Button className="bg-black text-white hover:bg-gray-800" />}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details of the new product to list it in your store.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Title</Label>
                    <Input 
                      required 
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                      placeholder="e.g. Nordic Sofa" 
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price ($)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      required 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Original Price ($ - Optional)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value)})}
                      className="rounded-xl h-11"
                      placeholder="Was e.g. 199.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</Label>
                    <Input 
                      required 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Inventory Stock</Label>
                    <Input 
                      type="number" 
                      required 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-widest text-gray-500 cursor-pointer">
                    Display in Featured Collection
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</Label>
                  <Textarea 
                    required 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Tell your customers about this item..." 
                    className="rounded-xl h-32 resize-none"
                  />
                </div>
                <MediaUpload 
                  images={newProduct.images} 
                  setImages={(imgs) => setNewProduct({...newProduct, images: imgs})} 
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-xl px-8">Create Product</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-white shadow-sm border-none overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-gray-50/50 border-gray-100" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white rounded-lg">
              <Filter className="mr-2 h-4 w-4" />
              Category
            </Button>
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-gray-50/50">
                <TableHead className="w-[80px]"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : filteredProducts.map((product) => (
                <TableRow key={product.id} className="cursor-pointer group hover:bg-gray-50/50">
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center text-gray-400">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-sm truncate max-w-[200px]">{product.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {product.id.slice(0, 8)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase tracking-widest cursor-pointer",
                        product.isPublished ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"
                      )} onClick={() => togglePublished(product)}>
                        {product.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border-amber-100">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <span className={cn("text-sm font-medium", product.stock <= 5 && "text-red-600")}>
                          {product.stock} available
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Tag size={12} />
                      <span className="text-xs font-medium uppercase tracking-widest">{product.categoryName || 'General'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="hover:bg-white" />}>
                        <MoreVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                        <DropdownMenuItem onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" /> View Store
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(product)}>
                          <Star className={cn("mr-2 h-4 w-4", product.isFeatured && "fill-amber-400 text-amber-400")} /> 
                          {product.isFeatured ? 'Unfeature' : 'Feature'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
