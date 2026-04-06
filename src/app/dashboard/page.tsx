"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  AlertCircle,
  ArrowUpRight
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
      color: "bg-primary text-white" 
    },
    { 
      label: "Orders Today", 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      trend: "+4.2%", 
      trendUp: true,
      color: "bg-white text-primary border-primary/10 border" 
    },
    { 
      label: "Low Stock Alert", 
      value: lowStockItems.length.toString(), 
      icon: AlertCircle, 
      trend: "Action Required", 
      trendUp: false,
      color: "bg-accent text-primary" 
    },
    { 
      label: "Active Customers", 
      value: customers.length.toString(), 
      icon: Users, 
      trend: "+18%", 
      trendUp: true,
      color: "bg-slate-900 text-white" 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm card-shadow overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 shadow-sm ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.trendUp !== undefined && (
                   <div className={`flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-accent/20 text-primary"}`}>
                    {stat.trendUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : null}
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-sm card-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Weekly Revenue</CardTitle>
              <p className="text-sm text-slate-500">Overview of sales performance this week</p>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-none font-bold">Last 7 Days</Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3338A0" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3338A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#3338A0', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3338A0" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm card-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-primary font-bold shadow-sm">
                    {order.customerName[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</p>
                    <Badge className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingCart className="mb-3 h-12 w-12 text-slate-100" />
                  <p className="text-sm text-slate-400 font-medium">No orders recorded yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm card-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Inventory Status</CardTitle>
            <p className="text-sm text-slate-500">Products requiring immediate attention</p>
          </div>
          <Badge className="bg-accent text-primary border-none font-bold">Stock Warning</Badge>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {lowStockItems.map((item) => (
               <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all hover:border-primary/20 hover:bg-slate-50/50">
                 <div className="flex items-center gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm font-extrabold text-primary border border-slate-100">
                     {item.name[0]}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">{item.name}</p>
                     <p className="text-xs text-slate-500">{item.category}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-primary">{item.stockQuantity} {item.unit}</p>
                   <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="h-full bg-accent transition-all duration-500" 
                        style={{ width: `${Math.max(5, (item.stockQuantity / 10) * 100)}%` }}
                      />
                   </div>
                 </div>
               </div>
             ))}
             {lowStockItems.length === 0 && (
               <div className="col-span-full py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <Package className="h-10 w-10 mx-auto mb-2 opacity-20" />
                 <p className="font-medium">All inventory levels are healthy!</p>
               </div>
             )}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}