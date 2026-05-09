import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  ArrowUpRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
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
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string, icon: any, color: string, bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-100' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50 border-red-100' },
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const path = 'orders';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ords);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500">Track and fulfill your customer purchases.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
          <Button variant="outline" className="bg-white">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Orders Tabs/Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <Card key={status} className="bg-white border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{status}</p>
                <p className="text-xl font-bold">{orders.filter(o => o.status === status).length}</p>
              </div>
              <div className={cn("p-2 rounded-lg", STATUS_CONFIG[status].bg)}>
                {React.createElement(STATUS_CONFIG[status].icon, { size: 18, className: STATUS_CONFIG[status].color })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white shadow-sm border-none overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search by order ID or user..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-gray-50/50 border-gray-100" 
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-gray-50/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-8 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer group hover:bg-gray-50/50">
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                        {order.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{order.userId.slice(0, 12)}...</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit border-none",
                      STATUS_CONFIG[order.status].bg,
                      STATUS_CONFIG[order.status].color
                    )}>
                      {React.createElement(STATUS_CONFIG[order.status].icon, { size: 10 })}
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-500">
                    {order.items.length} items
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="hover:bg-white" />}>
                        <MoreVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Order details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Change Status</div>
                        {Object.keys(STATUS_CONFIG).map((status) => (
                          <DropdownMenuItem 
                            key={status}
                            onClick={() => handleUpdateStatus(order.id, status)}
                            className={cn(
                              "text-xs",
                              order.status === status && "bg-gray-100 font-bold"
                            )}
                          >
                            Mark as {STATUS_CONFIG[status].label}
                          </DropdownMenuItem>
                        ))}
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
