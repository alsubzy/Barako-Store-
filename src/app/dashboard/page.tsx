"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
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
      color: "bg-emerald-100 text-emerald-700" 
    },
    { 
      label: "Orders Today", 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      trend: "+4.2%", 
      trendUp: true,
      color: "bg-blue-100 text-blue-700" 
    },
    { 
      label: "Low Stock Alert", 
      value: lowStockItems.length.toString(), 
      icon: Package, 
      trend: "Critical", 
      trendUp: false,
      color: "bg-orange-100 text-orange-700" 
    },
    { 
      label: "Active Customers", 
      value: customers.length.toString(), 
      icon: Users, 
      trend: "+18%", 
      trendUp: true,
      color: "bg-purple-100 text-purple-700" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to MarketFlow Pro. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-orange-600"}`}>
                  {stat.trendUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-secondary pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-[10px] h-4">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingCart className="mb-2 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Inventory</CardTitle>
            <Badge variant="destructive" className="animate-pulse">Stock Alert</Badge>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {lowStockItems.map((item) => (
                 <div key={item.id} className="flex items-center justify-between rounded-lg border bg-secondary/10 p-4 transition-all hover:bg-secondary/20">
                   <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm font-bold text-primary">
                       {item.name[0]}
                     </div>
                     <div>
                       <p className="text-sm font-bold">{item.name}</p>
                       <p className="text-xs text-muted-foreground">{item.category}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-orange-600">{item.stockQuantity} {item.unit} Left</p>
                     <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ width: `${(item.stockQuantity / 10) * 100}%` }}
                        />
                     </div>
                   </div>
                 </div>
               ))}
               {lowStockItems.length === 0 && (
                 <div className="col-span-full py-8 text-center text-muted-foreground">
                   All inventory levels are healthy!
                 </div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}