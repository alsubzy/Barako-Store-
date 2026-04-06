"use client";

import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { aiDataInsightGenerator } from '@/ai/flows/ai-data-insight-generator-flow';

const CATEGORY_DATA = [
  { name: 'Fruits', value: 400 },
  { name: 'Dairy', value: 300 },
  { name: 'Bakery', value: 200 },
  { name: 'Vegetables', value: 500 },
  { name: 'Meat', value: 150 },
];

const COLORS = ['#4A7770', '#629969', '#A3C6C0', '#D4E8E4', '#2C4C47'];

const SALES_TREND = [
  { name: 'Jan', revenue: 12000, orders: 450 },
  { name: 'Feb', revenue: 15000, orders: 520 },
  { name: 'Mar', revenue: 18000, orders: 610 },
  { name: 'Apr', revenue: 16500, orders: 580 },
  { name: 'May', revenue: 21000, orders: 720 },
  { name: 'Jun', revenue: 25000, orders: 850 },
];

export default function ReportsPage() {
  const { orders, products } = useStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIInsights = async () => {
    setIsGenerating(true);
    try {
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const lowStockItems = products.filter(p => p.stockQuantity <= 10).map(p => ({
        productName: p.name,
        stockQuantity: p.stockQuantity
      }));
      
      const res = await aiDataInsightGenerator({
        totalSales: totalSales || 154200, 
        totalOrders: orders.length || 1240,
        lowStockItems: lowStockItems,
        topSellingProducts: products.slice(0, 3).map(p => ({ productName: p.name, totalRevenue: p.price * 100 })),
        monthlyRevenueTrends: SALES_TREND.map(s => ({ month: s.name, revenue: s.revenue }))
      });
      setInsight(res.insights);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Reports & Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your store's performance data.</p>
        </div>
        <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue vs Orders</CardTitle>
            <CardDescription>Monthly growth comparison for current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_TREND}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="#4A7770" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" name="Total Orders" fill="#629969" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="h-32 w-32" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Barako Store AI Insights
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Let AI analyze your store data to provide strategic recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insight ? (
             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-sm leading-relaxed border border-white/20">
               {insight.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 last:mb-0">{line}</p>
               ))}
               <Button variant="secondary" size="sm" className="mt-4" onClick={() => setInsight(null)}>Refresh Analysis</Button>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Button 
                onClick={generateAIInsights} 
                className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-8 rounded-full shadow-xl transition-transform hover:scale-105"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing your data...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" /> Generate Strategic Analysis
                  </>
                )}
              </Button>
              <p className="mt-4 text-xs text-primary-foreground/60 italic">AI will evaluate stock levels, revenue trends, and customer engagement.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
