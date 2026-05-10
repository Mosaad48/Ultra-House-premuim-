import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  MoreHorizontal,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Rocket,
  PlusCircle,
  Eye,
  Settings,
  HelpCircle,
  ChevronRight,
  Globe as GlobeIcon,
  Truck as TruckIcon,
  Search as SearchIcon,
  ShoppingCart,
  ShoppingBag,
  Bot,
  TriangleAlert,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { cn, formatPrice } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';
import { Order, Product } from '../../types';

const chartData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 13 },
  { name: 'Wed', sales: 2000, orders: 98 },
  { name: 'Thu', sales: 2780, orders: 39 },
  { name: 'Fri', sales: 1890, orders: 48 },
  { name: 'Sat', sales: 2390, orders: 38 },
  { name: 'Sun', sales: 3490, orders: 43 },
];

export const AdminDashboard = () => {
  const { currentStore } = useStore();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const fetchDashboardData = async () => {
      try {
        const [prods, orders] = await Promise.all([
          productService.getAllProducts(true),
          storeService.getOrders()
        ]);

        const sales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        
        setStats({
          totalSales: sales,
          totalOrders: orders.length,
          activeProducts: prods.filter(p => p.isPublished).length
        });

        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(prods.filter(p => p.stock <= 5).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-none">
            Welcome back, {currentStore?.storeName || 'Partner'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Overview of your business performance for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 border-gray-200 bg-white font-bold text-xs uppercase tracking-widest hover:bg-gray-50 shadow-sm" onClick={() => navigate('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4 text-gray-400" />
            Manage Settings
          </Button>
          <Button 
            onClick={() => navigate('/admin/products')}
            className="h-11 px-6 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 shadow-xl shadow-black/10 transition-all"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Manage Products
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Progress & Core Actions */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Sales', value: formatPrice(stats.totalSales), trend: '+0.0%', icon: DollarSign, color: 'emerald' },
              { label: 'Total Orders', value: stats.totalOrders.toString(), trend: '+0.0%', icon: ShoppingCart, color: 'blue' },
              { label: 'Active Products', value: stats.activeProducts.toString(), trend: '+0.0%', icon: ShoppingBag, color: 'violet' },
            ].map((stat) => (
              <Card key={stat.label} className="border-none shadow-sm ring-1 ring-black/[0.05] p-6 hover:ring-black/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-xl bg-gray-50 text-black group-hover:bg-black group-hover:text-white transition-colors")}>
                     <stat.icon size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Sales Analytics Chart */}
          <Card className="border-none shadow-sm ring-1 ring-black/[0.05] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight">Sales Analytics</CardTitle>
                <CardDescription className="text-xs font-medium text-gray-500">Real-time revenue monitoring</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full min-h-[320px] relative">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                          <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#999', fontWeight: 600 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#999', fontWeight: 600 }} 
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
                        itemStyle={{ fontSize: '13px', fontWeight: '900' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#000" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-gray-50 animate-pulse rounded-xl" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm ring-1 ring-black/[0.05] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Recent Orders</h3>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 hover:text-black" onClick={() => navigate('/admin/orders')}>
                  View all
                </Button>
              </div>
              <div className="space-y-4">
                 {recentOrders.length > 0 ? recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 group cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 bg-gray-50 rounded flex items-center justify-center font-bold text-[10px] text-gray-400">
                           {order.orderNumber.slice(-2)}
                         </div>
                         <div>
                           <p className="text-xs font-bold text-gray-900">{order.customerName}</p>
                           <p className="text-[10px] text-gray-500 uppercase font-black">{order.orderNumber}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                         <Badge variant="outline" className={cn(
                           "text-[9px] uppercase tracking-widest px-1.5 py-0 border-transparent",
                           order.status === 'delivered' ? "text-emerald-600 bg-emerald-50" : 
                           order.status === 'pending' ? "text-amber-600 bg-amber-50" : "text-blue-600 bg-blue-50"
                         )}>
                           {order.status}
                         </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-xs text-gray-400 py-10">No orders yet</p>
                  )}
              </div>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-black/[0.05] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Inventory Alerts</h3>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 hover:text-black" onClick={() => navigate('/admin/products')}>
                  Manage
                </Button>
              </div>
              <div className="space-y-4">
                 {lowStockProducts.length > 0 ? lowStockProducts.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 group cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300">
                           {item.images?.[0] ? (
                             <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <ShoppingBag size={20} />
                           )}
                         </div>
                         <div>
                           <p className="text-xs font-bold text-gray-900">{item.title}</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase">{item.stock} left</p>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[8px] bg-rose-50 text-rose-600 border-rose-100">
                          {item.stock === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                        </Badge>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                          <div 
                            className={cn("h-full rounded-full bg-rose-500")} 
                            style={{ width: `${(item.stock / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-xs text-gray-400 py-10">Inventory healthy</p>
                  )}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Insights & Actions */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Main Action Card */}
          <Card className="border-none bg-[#0a0a0a] text-white p-8 relative overflow-hidden shadow-2xl shadow-black/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center mb-10 shadow-2xl border border-white/5">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Ready to scale?</h3>
              <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed max-w-[240px]">
                Your storefront is currently in preview mode. Launch globally to accept live payments.
              </p>
              <Button className="w-full h-14 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Launch My Store
              </Button>
            </div>
          </Card>

          {/* Quick Actions List */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Quick Shortcuts</h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Domains', icon: GlobeIcon, href: '/admin/settings?tab=domains' },
                 { label: 'Shipping', icon: TruckIcon, href: '/admin/settings?tab=shipping' },
                 { label: 'Payments', icon: DollarSign, href: '/admin/settings?tab=payments' },
                 { label: 'Live Chat', icon: HelpCircle, href: '/admin/content' },
               ].map(action => (
                 <button 
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl ring-1 ring-black/[0.05] hover:ring-black/20 transition-all group"
                 >
                   <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                     <action.icon size={18} />
                   </div>
                   <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-black tracking-widest transition-colors">{action.label}</span>
                 </button>
               ))}
             </div>
          </div>

          {/* Marketing Insight */}
          <Card className="border-none bg-accent/5 p-6 border border-accent/10 relative overflow-hidden">
             <div className="flex gap-4 relative z-10">
               <div className="p-2 bg-accent rounded-lg h-fit">
                 <Bot size={18} className="text-black" />
               </div>
               <div className="space-y-1">
                 <h4 className="text-sm font-black text-gray-900">AI Insight</h4>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                   "Your 'Suede Combat Boots' are trending in the UK. Consider running a targeted ad campaign for this region."
                 </p>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
