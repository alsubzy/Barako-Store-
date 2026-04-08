"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer, CustomerOrder } from '@/types/customer';
import { customersAPI } from '@/services/customersAPI';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Loader2, TrendingUp, History, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

import { Logo } from '@/components/shared/Logo';

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      setLoading(true);
      customersAPI.getOrderHistory(customer.id)
        .then(res => {
          if (res.success) setOrders(res.data || []);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[760px] p-0 rounded-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-card shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50/50 dark:bg-background/50 p-8 border-b border-slate-100 dark:border-slate-800 relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            <Logo size="lg" clickable={false} showText={false} className="mb-4" />
            <Avatar className="h-14 w-14 rounded-xl border-2 border-white dark:border-slate-800 bg-primary text-white text-xl font-semibold shadow-md">
              <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{customer.name}</DialogTitle>
              <Badge className={cn(
                "w-fit mx-auto sm:mx-0 rounded-full px-3 py-0.5 font-medium text-xs border-none shadow-none",
                customer.status === 'Active' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="h-4 w-4" />
              Member since {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="text-center sm:text-right mt-4 sm:mt-0">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Lifetime Value</p>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">${customer.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Col: Contact Info */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-background border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Email Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-background border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-background border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.address || 'Confidential'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Metrics */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Engagement Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-background/50">
                  <ShoppingBag className="h-5 w-5 text-primary mb-3" />
                  <p className="text-xs font-medium text-slate-500 mb-1">Total Orders</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{customer.totalOrders}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-background/50">
                  <DollarSign className="h-5 w-5 text-accent mb-3" />
                  <p className="text-xs font-medium text-slate-500 mb-1">Avg. Order</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="mt-10 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Recent Transactions</h3>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              </div>
            ) : orders.length > 0 ? (
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-background">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                      <TableHead className="font-medium text-slate-500 h-10 text-xs">Reference</TableHead>
                      <TableHead className="font-medium text-slate-500 h-10 text-xs">Date</TableHead>
                      <TableHead className="font-medium text-slate-500 h-10 text-xs">Status</TableHead>
                      <TableHead className="font-medium text-slate-500 text-right h-10 text-xs">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-slate-50 dark:border-slate-800/50 h-12">
                        <TableCell className="font-medium text-slate-900 dark:text-white text-sm">#{order.id}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                           <Badge variant="secondary" className="rounded-md font-medium text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                             {order.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900 dark:text-white text-sm">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-background/50">
                <p className="text-sm font-medium text-slate-500">No recent transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
