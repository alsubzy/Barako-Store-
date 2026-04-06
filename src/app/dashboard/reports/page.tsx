
"use client";

import { useState, useEffect, useMemo } from 'react';
import { reportsAPI } from '@/services/reportsAPI';
import { aiDataInsightGenerator } from '@/ai/flows/ai-data-insight-generator-flow';
import { SalesReportData, InventoryReportItem, CustomerReportItem, OrderReportItem, TimeRange } from '@/types/reports';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Download, Sparkles, Loader2, TrendingUp, ShoppingBag, 
  Users, Package, Filter, Printer, FileText, ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const COLORS = ['#3338A0', '#FCC61D', '#10B981', '#F43F5E', '#8B5CF6'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [salesData, setSalesData] = useState<SalesReportData[]>([]);
  const [ordersData, setOrdersData] = useState<OrderReportItem[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryReportItem[]>([]);
  const [customersData, setCustomersData] = useState<CustomerReportItem[]>([]);
  
  // AI State
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [salesRes, ordersRes, invRes, custRes] = await Promise.all([
        reportsAPI.getSales(timeRange),
        reportsAPI.getOrders(),
        reportsAPI.getInventory(),
        reportsAPI.getCustomers()
      ]);

      if (salesRes.success) setSalesData(salesRes.data || []);
      if (ordersRes.success) setOrdersData(ordersRes.data || []);
      if (invRes.success) setInventoryData(invRes.data || []);
      if (custRes.success) setCustomersData(custRes.data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load report data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setIsGenerating(true);
    try {
      const totalSales = ordersData.reduce((sum, o) => sum + o.totalAmount, 0);
      const lowStockItems = inventoryData.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').map(p => ({
        productName: p.name,
        stockQuantity: p.stock
      }));
      
      const res = await aiDataInsightGenerator({
        totalSales,
        totalOrders: ordersData.length,
        lowStockItems: lowStockItems,
        topSellingProducts: inventoryData.slice(0, 3).map(p => ({ productName: p.name, totalRevenue: 100 })), // Mock revenue for insight
        monthlyRevenueTrends: salesData.map(s => ({ month: s.date, revenue: s.totalRevenue }))
      });
      setInsight(res.insights);
    } catch (error) {
      toast({ title: "AI Analysis Failed", description: "Could not generate insights.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToCSV = (data: any[], fileName: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = useMemo(() => ordersData.reduce((sum, o) => sum + o.totalAmount, 0), [ordersData]);
  const lowStockCount = useMemo(() => inventoryData.filter(i => i.status !== 'In Stock').length, [inventoryData]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    inventoryData.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [inventoryData]);

  if (loading && salesData.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium">Detailed insights into Barako Store's business performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => window.print()} variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={() => exportToCSV(ordersData, 'barako-orders-report')} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-primary" },
          { label: "Total Orders", value: ordersData.length.toString(), icon: ShoppingBag, color: "bg-emerald-500" },
          { label: "Active Customers", value: customersData.length.toString(), icon: Users, color: "bg-amber-500" },
          { label: "Inventory Alerts", value: lowStockCount.toString(), icon: Package, color: "bg-rose-500" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}/20`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white p-1 rounded-2xl border border-slate-100 mb-8 inline-flex">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Overview</TabsTrigger>
          <TabsTrigger value="sales" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Sales</TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Inventory</TabsTrigger>
          <TabsTrigger value="customers" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4 border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Revenue Stream</CardTitle>
                  <CardDescription>Visual trend of sales over time</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['day', 'week', 'month'].map((r) => (
                    <Button 
                      key={r} 
                      size="sm" 
                      variant={timeRange === r ? 'default' : 'ghost'} 
                      onClick={() => setTimeRange(r as TimeRange)}
                      className="rounded-lg font-bold text-xs capitalize"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3338A0" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3338A0" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="totalRevenue" stroke="#3338A0" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-black text-slate-900">Inventory Split</CardTitle>
                <CardDescription>Product distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg rounded-[32px] bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="h-48 w-48" />
            </div>
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md mb-4 border border-white/20">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-xs font-black uppercase tracking-widest text-accent">AI Strategy Engine</span>
              </div>
              <CardTitle className="text-3xl font-black">Strategic Business Insights</CardTitle>
              <CardDescription className="text-white/60 font-medium text-lg">Harness artificial intelligence to optimize Barako Store operations.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              {insight ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-in fade-in zoom-in duration-500">
                  <div className="prose prose-invert max-w-none">
                    {insight.split('\n').map((line, i) => (
                      <p key={i} className="mb-4 text-white/90 font-medium leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <Button variant="secondary" className="mt-6 rounded-xl font-bold" onClick={() => setInsight(null)}>Refresh Strategy</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                   <Button 
                    onClick={generateAIInsights} 
                    className="h-16 px-10 rounded-2xl bg-accent text-primary font-black text-lg shadow-2xl shadow-accent/20 transition-all hover:scale-105"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Orchestrating Data...</>
                    ) : (
                      <><Sparkles className="mr-3 h-6 w-6" /> Generate Competitive Analysis</>
                    )}
                  </Button>
                  <p className="mt-6 text-white/40 text-xs font-bold uppercase tracking-widest">Powered by Gemini 2.5 Flash</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
             <CardHeader className="p-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Sales Breakdown</CardTitle>
                  <CardDescription>Last {salesData.length} reporting periods</CardDescription>
                </div>
                <Button onClick={() => exportToCSV(salesData, 'sales-report')} variant="outline" className="rounded-xl font-bold">
                  <FileText className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-slate-500 py-6 px-8">Period</TableHead>
                  <TableHead className="font-bold text-slate-500">Orders</TableHead>
                  <TableHead className="font-bold text-slate-500">Revenue</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right px-8">Avg. Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((row, i) => (
                  <TableRow key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="px-8 font-black text-slate-900">{row.date}</TableCell>
                    <TableCell className="font-bold text-slate-700">{row.totalOrders}</TableCell>
                    <TableCell className="font-black text-primary text-lg">${row.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right px-8 font-bold text-slate-600">
                      ${row.totalOrders > 0 ? (row.totalRevenue / row.totalOrders).toFixed(2) : '0.00'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8">
               <CardTitle className="text-xl font-black text-slate-900">Inventory Health</CardTitle>
               <CardDescription>Stock status across all product categories</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-slate-500 py-6 px-8">Product</TableHead>
                  <TableHead className="font-bold text-slate-500">Category</TableHead>
                  <TableHead className="font-bold text-slate-500">Current Stock</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right px-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((row, i) => (
                  <TableRow key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="px-8 font-black text-slate-900">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-lg border-slate-200 text-slate-500 font-bold px-3 py-1">
                        {row.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">{row.stock} {row.unit}</TableCell>
                    <TableCell className="text-right px-8">
                      <Badge className={
                        row.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                        row.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8">
               <CardTitle className="text-xl font-black text-slate-900">Customer Performance</CardTitle>
               <CardDescription>Lifetime value and engagement metrics</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-slate-500 py-6 px-8">Customer</TableHead>
                  <TableHead className="font-bold text-slate-500">Orders</TableHead>
                  <TableHead className="font-bold text-slate-500">Total Spent</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right px-8">Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersData.sort((a,b) => b.totalSpent - a.totalSpent).map((row, i) => (
                  <TableRow key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="px-8">
                      <div>
                        <p className="font-black text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{row.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">{row.totalOrders}</TableCell>
                    <TableCell className="font-black text-primary text-lg">${row.totalSpent.toFixed(2)}</TableCell>
                    <TableCell className="text-right px-8 text-slate-500 font-medium text-sm">
                      {row.lastOrderDate ? new Date(row.lastOrderDate).toLocaleDateString() : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
