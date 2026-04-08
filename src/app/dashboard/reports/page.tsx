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
  Users, Package, Filter, Printer, FileText, ChevronRight, Calendar, Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#3338A0', '#FCC61D', '#10B981', '#F43F5E', '#8B5CF6'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
        topSellingProducts: inventoryData.slice(0, 3).map(p => ({ productName: p.name, totalRevenue: 100 })),
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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and analyze business performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()} className="h-10 px-4 rounded-xl font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button 
            onClick={() => exportToCSV(ordersData, 'barako-orders-report')}
            className="h-10 px-5 rounded-full bg-primary text-white shadow-sm hover:shadow-md transition-all hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, desc: "Gross income" },
          { label: "Total Orders", value: ordersData.length.toString(), icon: ShoppingBag, desc: "Lifetime count" },
          { label: "Active Customers", value: customersData.length.toString(), icon: Users, desc: "Subscribed users" },
          { label: "Inventory Alerts", value: lowStockCount.toString(), icon: Package, desc: "Stock warnings" }
        ].map((stat, i) => (
          <Card key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-white border border-slate-100 dark:border-slate-800">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
              {loading ? <Skeleton className="h-9 w-24" /> : stat.value}
            </div>
            <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">Overview</TabsTrigger>
            <TabsTrigger value="sales" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">Sales</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">Inventory</TabsTrigger>
            <TabsTrigger value="customers" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">Customers</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
             <div className="relative w-72 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Filter report data..." 
                  className="pl-9 h-10 rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-primary/30 shadow-sm bg-white dark:bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="h-10 w-36 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg">
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4 border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Revenue Analysis</CardTitle>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Total earnings distribution trend</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Active Growth</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3338A0" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3338A0" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="totalRevenue" stroke="#3338A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Inventory Split</CardTitle>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Products by category ratio</p>
                </div>
                <Package className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl bg-[#3338A0] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles className="h-48 w-48" />
            </div>
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                <Sparkles className="h-5 w-5 text-[#FCC61D]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Internal Strategy Insights</h3>
              <p className="text-white/70 max-w-lg mb-8 text-sm">Use our generative intelligence engine to analyze your periodic performance and discover hidden optimization opportunities.</p>
              
              {insight ? (
                <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="prose prose-invert max-w-none prose-sm">
                    {insight.split('\n').map((line, i) => (
                      <p key={i} className="text-white/90 leading-relaxed mb-3">{line}</p>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-6 border-white/20 text-white hover:bg-white/10 rounded-xl px-6 font-bold text-xs" onClick={() => setInsight(null)}>Reset Analysis</Button>
                </div>
              ) : (
                <Button 
                  onClick={generateAIInsights} 
                  disabled={isGenerating}
                  className="h-12 px-8 rounded-full bg-[#FCC61D] text-[#3338A0] font-black text-sm shadow-xl shadow-[#FCC61D]/20 hover:scale-105 transition-all"
                >
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Orchestrating Intelligence...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Strategic Audit</>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="outline-none">
          <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-card">
                  <TableRow className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                    <TableHead className="py-4 pl-6 font-medium text-slate-500 text-xs">Reporting Period</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Total Orders</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Revenue Amount</TableHead>
                    <TableHead className="py-4 text-right pr-6 font-medium text-slate-500 text-xs">Avg. Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((row, i) => (
                    <TableRow key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <TableCell className="py-4 pl-6 font-medium text-slate-900 dark:text-white capitalize">{row.date}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-400 font-bold">{row.totalOrders}</TableCell>
                      <TableCell className="py-4 font-bold text-primary dark:text-white">${row.totalRevenue.toFixed(2)}</TableCell>
                      <TableCell className="py-4 text-right pr-6 font-medium text-slate-500">
                        ${row.totalOrders > 0 ? (row.totalRevenue / row.totalOrders).toFixed(2) : '0.00'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="outline-none">
          <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-card">
                  <TableRow className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                    <TableHead className="py-4 pl-6 font-medium text-slate-500 text-xs">Product Identity</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Category</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Available Stock</TableHead>
                    <TableHead className="py-4 text-right pr-6 font-medium text-slate-500 text-xs">Health Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((row, i) => (
                    <TableRow key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <TableCell className="py-4 pl-6 font-bold text-slate-900 dark:text-white">{row.name}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full h-5 font-medium border-none shadow-none text-[10px] uppercase">
                          {row.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-slate-600 dark:text-slate-400">{row.stock} {row.unit}</TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Badge className={cn(
                          "rounded-full px-2.5 py-0.5 font-bold text-[10px] border-none shadow-none",
                          row.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          row.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                        )}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="outline-none">
          <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-card">
                  <TableRow className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                    <TableHead className="py-4 pl-6 font-medium text-slate-500 text-xs">Customer Detail</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Total Orders</TableHead>
                    <TableHead className="py-4 font-medium text-slate-500 text-xs">Gross Contribution</TableHead>
                    <TableHead className="py-4 text-right pr-6 font-medium text-slate-500 text-xs">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersData.sort((a,b) => b.totalSpent - a.totalSpent).map((row, i) => (
                    <TableRow key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-none">{row.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{row.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-slate-600 dark:text-slate-400">{row.totalOrders}</TableCell>
                      <TableCell className="py-4 font-black text-primary dark:text-white">${row.totalSpent.toFixed(2)}</TableCell>
                      <TableCell className="py-4 text-right pr-6 text-slate-500 text-xs font-bold">
                        {row.lastOrderDate ? new Date(row.lastOrderDate).toLocaleDateString() : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
