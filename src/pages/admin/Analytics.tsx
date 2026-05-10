import React from 'react';
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
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatPrice, cn } from '../../lib/utils';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, target: 40000 },
  { name: 'Feb', revenue: 52000, target: 40000 },
  { name: 'Mar', revenue: 48000, target: 45000 },
  { name: 'Apr', revenue: 61000, target: 50000 },
  { name: 'May', revenue: 55000, target: 50000 },
  { name: 'Jun', revenue: 67000, target: 55000 },
];

const CATEGORY_DATA = [
  { name: 'Furniture', value: 45, color: '#000000' },
  { name: 'Lighting', value: 25, color: '#333333' },
  { name: 'Decor', value: 20, color: '#666666' },
  { name: 'Kitchen', value: 10, color: '#999999' },
];

export const AdminAnalytics = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-gray-500">Deep dive into your store's performance and customer behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Calendar className="mr-2 h-4 w-4" />
            Last 6 Months
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: '3.24%', trend: '+0.5%', up: true, icon: TrendingUp },
          { label: 'Avg Order Value', value: '$156.00', trend: '-2.1%', up: false, icon: ShoppingBag },
          { label: 'New Customers', value: '1,234', trend: '+12%', up: true, icon: Users },
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
              <BarChart data={REVENUE_DATA} barGap={8}>
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
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Shares</p>
                  <p className="text-xl font-bold">100%</p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {CATEGORY_DATA.map((item, i) => (
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
