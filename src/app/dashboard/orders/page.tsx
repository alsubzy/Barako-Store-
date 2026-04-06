
"use client";

import { useState, useEffect, useMemo } from 'react';
import { ordersAPI } from '@/services/ordersAPI';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, Search, Edit, Trash2, Filter, Loader2, ShoppingBag, 
  MoreVertical, ChevronLeft, ChevronRight, CheckCircle2, 
  Clock, AlertCircle, XCircle, FileText, Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { OrderFormModal } from '@/components/orders/OrderFormModal';

const ITEMS_PER_PAGE = 8;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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
        toast({ title: "Success", description: "Order updated successfully" });
      } else {
        const res = await ordersAPI.create(data);
        if (!res.success) {
           toast({ title: "Stock Error", description: res.message, variant: "destructive" });
           return;
        }
        toast({ title: "Success", description: "Order placed successfully" });
      }
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await ordersAPI.delete(id);
      toast({ title: "Deleted", description: "Order removed" });
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} orders?`)) return;
    try {
      await ordersAPI.bulkDelete(selectedIds);
      toast({ title: "Success", description: `${selectedIds.length} items removed` });
      setSelectedIds([]);
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Bulk delete failed", variant: "destructive" });
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
      case 'Processing': return { color: 'bg-blue-100 text-blue-700', icon: Clock };
      case 'Pending': return { color: 'bg-amber-100 text-amber-700', icon: AlertCircle };
      case 'Cancelled': return { color: 'bg-rose-100 text-rose-700', icon: XCircle };
      default: return { color: 'bg-slate-100 text-slate-700', icon: FileText };
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loading && orders.length === 0) {
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
          <h1 className="text-4xl font-black tracking-tight text-primary">Orders</h1>
          <p className="text-slate-500 font-medium">Manage Barako Store sales transactions and fulfillment.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-destructive/20">
              <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => { setEditingOrder(null); setIsFormOpen(true); }} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="mr-2 h-5 w-5" /> Create Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1 flex items-center px-4 h-14 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input 
              placeholder="Search by Order ID or Customer..." 
              className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map(s => (
              <Button 
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`h-14 rounded-2xl px-6 font-bold transition-all whitespace-nowrap ${statusFilter === s ? 'bg-primary text-white' : 'border-slate-200 text-slate-500 bg-white'}`}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12 px-6">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedOrders.length}
                    onCheckedChange={() => setSelectedIds(selectedIds.length === paginatedOrders.length ? [] : paginatedOrders.map(o => o.id))}
                    className="border-slate-300 rounded-md"
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-500 py-6">Order ID</TableHead>
                <TableHead className="font-bold text-slate-500">Customer</TableHead>
                <TableHead className="font-bold text-slate-500">Items</TableHead>
                <TableHead className="font-bold text-slate-500">Total</TableHead>
                <TableHead className="font-bold text-slate-500">Status</TableHead>
                <TableHead className="font-bold text-slate-500 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((o) => {
                const status = getStatusConfig(o.status);
                const StatusIcon = status.icon;
                return (
                  <TableRow key={o.id} className={`border-b border-slate-50 transition-colors group ${selectedIds.includes(o.id) ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}>
                    <TableCell className="px-6">
                      <Checkbox 
                        checked={selectedIds.includes(o.id)}
                        onCheckedChange={() => toggleSelect(o.id)}
                        className="border-slate-300 rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-black text-primary font-mono text-xs">{o.id}</TableCell>
                    <TableCell>
                       <p className="font-bold text-slate-900 leading-tight">{o.customerName}</p>
                       <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{new Date(o.orderDate).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-slate-700">{o.items.length} Products</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-primary text-lg">${o.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {o.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm">
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                          <DropdownMenuItem onClick={() => { setEditingOrder(o); setIsFormOpen(true); }} className="rounded-xl gap-2 p-3 font-bold text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">
                            <Edit className="h-4 w-4" /> Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(o.id)} className="rounded-xl gap-2 p-3 font-bold text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                            <Trash2 className="h-4 w-4" /> Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <ShoppingBag className="h-16 w-16 mb-4 text-slate-300" />
                      <p className="text-xl font-black text-slate-900">No orders found</p>
                      <p className="text-sm font-medium text-slate-500">Try adjusting your filters or search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-400">
                Showing <span className="text-primary">{paginatedOrders.length}</span> of <span className="text-primary">{filteredOrders.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button 
                      key={i} 
                      variant={currentPage === i + 1 ? 'default' : 'ghost'}
                      className={`h-10 w-10 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-primary' : 'text-slate-400'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <OrderFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingOrder(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingOrder}
      />
    </div>
  );
}
