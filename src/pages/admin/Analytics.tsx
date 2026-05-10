import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatPrice, cn } from '../../lib/utils';
import { storeService } from '../../services/storeService';
import { productService } from '../../services/productService';

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    avgOrderValue: 0,
    totalCustomers: 0,
    conversionRate: '0.00%',
    revenueData: [] as any[],
    categoryData: [] as any[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, products] = await Promise.all([
          storeService.getOrders(),
          productService.getAllProducts(true)
        ]);

        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        // Group by month
        const revenueByMonth: {[key: string]: number} = {};
        orders.forEach(o => {
          const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
          revenueByMonth[month] = (revenueByMonth[month] || 0) + o.totalAmount;
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIdx = new Date().getMonth();
        const last6Months = months.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);

        const revData = last6Months.map(m => ({
          name: m,
          revenue: revenueByMonth[m] || 0,
          target: 5000 // Mock target
        }));

        // Category breakdown
        const catMap: {[key: string]: number} = {};
        products.forEach(p => {
          const cat = p.categoryName || 'General';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });

        const totalProducts = products.length;
        const catData = Object.entries(catMap).map(([name, count]) => ({
          name,
          value: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        })).slice(0, 4);

        setAnalytics({
          avgOrderValue: avgValue,
          totalCustomers: new Set(orders.map(o => o.customerEmail)).size,
          conversionRate: '3.24%', // Keep mock as it requires traffic data
          revenueData: revData,
          categoryData: catData.length > 0 ? catData : [{ name: 'General', value: 100, color: '#000000' }]
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 size={40} className="animate-spin" />
        <p className="font-bold uppercase tracking-widest text-xs">Generating Reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-xs sm:text-sm text-gray-500">Deep dive into your store's performance and customer behavior.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white h-10 text-xs font-bold uppercase tracking-widest">
            <Calendar className="mr-2 h-4 w-4" />
            Last 6 Months
          </Button>
          <Button className="flex-1 sm:flex-none bg-black text-white hover:bg-gray-800 h-10 text-xs font-bold uppercase tracking-widest">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Conversion Rate', value: analytics.conversionRate, trend: '+0.5%', up: true, icon: TrendingUp },
          { label: 'Avg Order Value', value: formatPrice(analytics.avgOrderValue), trend: '+2.1%', up: true, icon: ShoppingBag },
          { label: 'Total Customers', value: analytics.totalCustomers.toLocaleString(), trend: '+12%', up: true, icon: Users },
          { label: 'Return Rate', value: '1.2%', trend: '-0.1%', up: true, icon: Clock },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-none shadow-sm overflow-hidden border-l-4 border-black">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                <stat.icon size={16} className="text-gray-400" />
              </div>
              <div className="flex items-end gap-3">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold mb-1",
                  stat.up ? "text-green-600" : "text-red-600"
                )}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 bg-white shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle>Revenue vs Target</CardTitle>
              <CardDescription>Monthly revenue growth compared to set benchmarks.</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Target</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={analytics.revenueData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(v) => `$${v/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#000" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="target" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white shadow-sm border-none">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Performance breakdown across product types.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Distribution</p>
                  <p className="text-xl font-bold">100%</p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {analytics.categoryData.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-white shadow-sm border-none">
          <CardHeader>
            <CardTitle>Peak Shopping Times</CardTitle>
            <CardDescription>Identify when your customers are most active.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={[
                { time: '6am', v: 10 },
                { time: '10am', v: 45 },
                { time: '2pm', v: 75 },
                { time: '6pm', v: 95 },
                { time: '10pm', v: 40 },
              ]}>
                <XAxis dataKey="time" hide />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#000" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-none md:col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from.</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Filter size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { source: 'Direct / Bookmark', visits: '12.4k', perc: 45 },
                { source: 'Google Search', visits: '8.2k', perc: 30 },
                { source: 'Instagram Ads', visits: '4.1k', perc: 15 },
                { source: 'Email Marketing', visits: '2.7k', perc: 10 },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.source}</span>
                    <span className="font-bold">{s.visits}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: `${s.perc}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
