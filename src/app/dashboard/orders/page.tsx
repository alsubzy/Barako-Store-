"use client";

import { useState, useEffect, useMemo } from 'react';
import { ordersAPI } from '@/services/ordersAPI';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Loader2, Download, ShoppingBag, Eye, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { OrderFormModal } from '@/components/orders/OrderFormModal';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll();
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingOrder) {
        await ordersAPI.update(editingOrder.id, data);
        toast({ title: "Success", description: "Order updated successfully." });
      } else {
        const res = await ordersAPI.create(data);
        if (!res.success) {
           toast({ title: "Stock Error", description: res.message, variant: "destructive" });
           return;
        }
        toast({ title: "Success", description: "Order placed successfully." });
      }
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await ordersAPI.delete(id);
      toast({ title: "Success", description: "Order deleted successfully." });
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed.", variant: "destructive" });
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.totalAmount, 0);
  }, [orders]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage customer orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download}>
            Export
          </Button>
          <Button 
            onClick={() => { setEditingOrder(null); setIsFormOpen(true); }} 
            icon={Plus}
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-16" /> : orders.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Order records</p>
        </Card>
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-24" /> : `$${totalRevenue.toLocaleString()}`}
          </div>
          <p className="text-xs text-slate-400 mt-1">Gross income</p>
        </Card>
      </div>

      {/* 3. FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1">
          <Input 
            placeholder="Search orders..." 
            icon={Search}
            className="h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger icon={Filter} className="w-full md:w-[180px] h-11 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 4. DATA TABLE */}
      <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 pl-6 text-sm">Order ID</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Customer</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Date</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Status</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Total Amount</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-right pr-6 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-slate-50 dark:border-slate-800/50">
                    <TableCell className="pl-6 py-4"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((o) => (
                  <TableRow 
                    key={o.id} 
                    className="border-slate-50 dark:border-slate-800/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group cursor-pointer"
                    onClick={() => { setViewingOrder(o); setIsDetailOpen(true); }}
                  >
                    <TableCell className="py-4 pl-6 font-mono text-xs font-semibold text-primary">
                      #{o.id}
                    </TableCell>
                    <TableCell className="py-4 font-medium text-slate-900 dark:text-white">
                      {o.customerName}
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 dark:text-slate-400">
                      {new Date(o.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium text-xs border-none shadow-none",
                        o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        o.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                        o.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      )}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-slate-900 dark:text-white">
                      ${o.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Eye}
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                          onClick={() => { setViewingOrder(o); setIsDetailOpen(true); }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Edit2}
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                          onClick={() => { setEditingOrder(o); setIsFormOpen(true); }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Trash2}
                          className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                          onClick={() => handleDelete(o.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-slate-300 mb-4" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No orders found</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Try adjusting your search or filter.</p>
                      <Button variant="outline" icon={Search} onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredOrders.length}</span> results
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <OrderFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingOrder(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingOrder}
      />

      <OrderDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => { setIsDetailOpen(false); setViewingOrder(null); }} 
        order={viewingOrder}
      />
    </div>
  );
}
