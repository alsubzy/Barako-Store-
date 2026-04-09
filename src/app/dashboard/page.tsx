"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MOCK_REVENUE_DATA = [
  { name: 'Mon', total: 4500 },
  { name: 'Tue', total: 3200 },
  { name: 'Wed', total: 5100 },
  { name: 'Thu', total: 4800 },
  { name: 'Fri', total: 6200 },
  { name: 'Sat', total: 8500 },
  { name: 'Sun', total: 7200 },
];

export default function DashboardPage() {
  const { orders, products, customers } = useStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = products.filter(p => p.stockQuantity <= 10);

  const stats = [
    { 
      label: "Total Revenue", 
      value: `$${totalSales.toLocaleString()}`, 
      icon: DollarSign, 
      trend: "+12.5%", 
      trendUp: true,
      description: "Vs last month"
    },
    { 
      label: "Total Orders", 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      trend: "+4.2%", 
      trendUp: true,
      description: "Net orders count"
    },
    { 
      label: "Active Customers", 
      value: customers.length.toString(), 
      icon: Users, 
      trend: "+18%", 
      trendUp: true,
      description: "Subscribed users"
    },
    { 
      label: "Inventory Items", 
      value: products.length.toString(), 
      icon: Package, 
      trend: "Healthy", 
      trendUp: true,
      description: "Across categories"
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-800">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live System Status</span>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-white transition-colors group-hover:bg-primary group-hover:text-white border border-slate-100 dark:border-slate-800">
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold border-none shadow-none",
                  stat.trendUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                )}>
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              <p className="text-[11px] text-slate-400 mt-1.5">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <Card className="md:col-span-4 border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Revenue Performance</CardTitle>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Weekly sales distribution analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">+12% growth</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3338A0" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3338A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff' }}
                    itemStyle={{ color: '#3338A0', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3338A0" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Latest business activities</p>
            </div>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-primary dark:text-white font-bold group-hover:scale-110 transition-transform">
                    {order.customerName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</p>
                    <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full h-5 border-none shadow-none font-bold">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white font-bold">No orders found</p>
                  <p className="text-[11px] text-slate-500 mt-1">Transaction audit is currently empty.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. LOW STOCK SECTION */}
      <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/30 dark:bg-card">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Package className="h-4 w-4 text-primary" />
             </div>
             <div>
               <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Critical Low Stock</CardTitle>
               <p className="text-[11px] text-slate-500 dark:text-slate-400">Inventory items requiring immediate replenishment</p>
             </div>
          </div>
          <Badge className="bg-rose-100 text-rose-700 border-none font-bold rounded-full">Replenish List</Badge>
        </CardHeader>
        <CardContent className="p-6">
           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
             {lowStockItems.map((item) => (
               <div key={item.id} className="group relative flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 overflow-hidden">
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm font-bold text-primary dark:text-white border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                     {item.name[0]}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter font-bold">{item.category}</p>
                   </div>
                 </div>
                 <div className="text-right relative z-10">
                   <p className="text-sm font-bold text-rose-600">{item.stockQuantity} Left</p>
                   <div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-700" 
                        style={{ width: `${Math.max(10, (item.stockQuantity / 10) * 100)}%` }}
                      />
                   </div>
                 </div>
               </div>
             ))}
             {lowStockItems.length === 0 && (
               <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                 <p className="font-bold text-slate-900 dark:text-white text-base">Perfect Inventory Levels</p>
                 <p className="text-[11px] mt-1">All products are currently well-stocked.</p>
               </div>
             )}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}