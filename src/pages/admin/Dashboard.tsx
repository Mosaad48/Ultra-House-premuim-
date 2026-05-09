import React from 'react';
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
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const data = [
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

  const checklistItems = [
    { id: 'store-name', label: 'Set your store name', done: !!currentStore?.name, icon: GlobeIcon },
    { id: 'domain', label: 'Connect a custom domain', done: currentStore?.launchChecklist?.domainConnected, icon: GlobeIcon },
    { id: 'payment', label: 'Set up payment providers', done: currentStore?.launchChecklist?.paymentSetup, icon: DollarSign },
    { id: 'shipping', label: 'Configure shipping zones', done: currentStore?.launchChecklist?.shippingSetup, icon: TruckIcon },
    { id: 'seo', label: 'Optimize store for SEO', done: currentStore?.launchChecklist?.seoReady, icon: SearchIcon },
  ];

  const completedCount = checklistItems.filter(item => item.done).length;
  const progress = (completedCount / checklistItems.length) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentStore?.name || 'Partner'}!</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white border-gray-200" onClick={() => navigate('/admin/store-customizer')}>
            <Settings className="mr-2 h-4 w-4" />
            Customize Theme
          </Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => navigate('/admin/products')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Setup Guide */}
          <Card className="border-none shadow-sm overflow-hidden bg-white ring-1 ring-black/[0.05]">
            <CardHeader className="bg-[#fcfcfc] border-b border-gray-100 flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-bold">Setup Guide</CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                  {completedCount} of {checklistItems.length} tasks completed
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-gray-400">{Math.round(progress)}%</div>
                <Progress value={progress} className="w-24 h-1.5" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {checklistItems.map((item, i) => (
                  <div 
                    key={item.id} 
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                        item.done ? "bg-green-500 border-green-500 text-white" : "border-gray-200 text-gray-300 group-hover:border-gray-400"
                      )}>
                        {item.done ? <CheckCircle2 size={12} /> : i + 1}
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        item.done ? "text-gray-400 line-through" : "text-gray-700"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 bg-accent/5 border-t border-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="text-accent" size={16} />
                <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Ready to launch?</span>
              </div>
              <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10 h-7 text-[10px] font-bold uppercase py-0">
                Publish Store
              </Button>
            </div>
          </Card>

          {/* Quick Stats Chart */}
          <Card className="border-none shadow-sm bg-white overflow-hidden ring-1 ring-black/[0.05]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Sales</CardTitle>
                <div className="text-2xl font-black">$12,482.00</div>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                <TrendingUp size={12} />
                +12.5%
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#bbb', fontWeight: 600 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#bbb', fontWeight: 600 }} 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions Area */}
        <div className="space-y-8">
          {/* Store Health */}
          <Card className="border-none shadow-xl shadow-accent/10 bg-[#121212] text-white p-6 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                  <Rocket size={18} className="text-accent" />
                </div>
                <Badge variant="secondary" className="bg-white/5 text-white border-white/10 text-[9px] uppercase tracking-widest px-2 py-0.5">Draft</Badge>
              </div>
              <h3 className="text-lg font-bold mb-2">Build your empire</h3>
              <p className="text-gray-400 text-[11px] mb-8 leading-relaxed opacity-70">Your store is currently visible only to you. Complete your setup to start selling globally.</p>
              <Button className="w-full bg-accent text-black hover:bg-white border-transparent h-10 font-black uppercase text-[10px] tracking-[0.15em] transition-all">
                Launch Now
              </Button>
            </div>
          </Card>

          {/* Activity Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Activity</h3>
               <button className="text-[10px] font-bold text-accent uppercase">View all</button>
            </div>
            <div className="space-y-1">
              {[
                { title: 'New Order #1042', time: '2 mins ago', type: 'order', color: 'text-green-500' },
                { title: 'Inventory Alert: Watch', time: '1 hour ago', type: 'alert', color: 'text-red-500' },
                { title: 'New Customer: Sarah', time: '3 hours ago', type: 'user', color: 'text-blue-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group cursor-pointer border border-transparent hover:border-black/[0.05]">
                  <div className={cn(
                    "w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors shadow-sm",
                    activity.color.replace('text', 'bg').replace('500', '50')
                  )}>
                    {activity.type === 'order' ? <ShoppingCart size={14} className="text-green-600" /> : 
                     activity.type === 'alert' ? <TriangleAlert size={14} className="text-red-600" /> : 
                     <Users size={14} className="text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 leading-none mb-1">{activity.title}</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Clock size={8} />
                      {activity.time}
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
