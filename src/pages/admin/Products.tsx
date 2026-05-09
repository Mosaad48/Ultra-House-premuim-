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
  Package
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
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
    category: 'Furniture',
    stock: 0,
    images: [] as string[]
  });

  useEffect(() => {
    if (!currentStore?.id) return;
    const path = 'products';
    const q = query(
      collection(db, path), 
      where("storeId", "==", currentStore.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [currentStore?.id]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore?.id) return;
    const path = 'products';
    try {
      await addDoc(collection(db, path), {
        ...newProduct,
        storeId: currentStore.id,
        rating: 5,
        reviewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddDialogOpen(false);
      toast.success('Product added successfully');
      setNewProduct({
        title: '',
        description: '',
        price: 0,
        category: 'Furniture',
        stock: 0,
        images: []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const path = `products/${id}`;
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Product deleted');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
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
                      required 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="rounded-xl h-11"
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
        <CardContent className="p-0">
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
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      product.stock > 10 ? "bg-green-50 text-green-700 border-green-100" :
                      product.stock > 0 ? "bg-orange-50 text-orange-700 border-orange-100" :
                      "bg-red-50 text-red-700 border-red-100"
                    )}>
                      {product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <span className={cn("text-sm font-medium", product.stock <= 5 && "text-red-600")}>
                          {product.stock} available
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                          )} 
                          style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Tag size={12} />
                      <span className="text-xs font-medium uppercase tracking-widest">{product.category}</span>
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
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit details
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
