"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer, CustomerOrder } from '@/types/customer';
import { customersAPI } from '@/services/customersAPI';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Loader2, TrendingUp, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

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
      <DialogContent className="sm:max-w-[850px] rounded-[3rem] overflow-hidden p-0 border-none shadow-2xl dark:bg-slate-950">
        <div className="bg-[#F8FAFC] dark:bg-slate-900 p-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <Avatar className="h-28 w-28 rounded-[2rem] border-4 border-white dark:border-slate-800 bg-primary text-white shadow-xl text-4xl font-black">
              <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{customer.name}</h2>
                <Badge className={cn(
                  "w-fit mx-auto md:mx-0 rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shadow-sm",
                  customer.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                )}>
                  {customer.status}
                </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Member since {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Value</p>
              <p className="text-3xl font-black text-primary dark:text-white">${customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-12 bg-white dark:bg-slate-950 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Business KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <ShoppingBag className="h-6 w-6" />
               </div>
               <div className="mt-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</p>
                 <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{customer.totalOrders}</p>
               </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                 <DollarSign className="h-6 w-6" />
               </div>
               <div className="mt-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Spend</p>
                 <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}</p>
               </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                 <TrendingUp className="h-6 w-6" />
               </div>
               <div className="mt-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention</p>
                 <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">High</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Personal Information</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Primary Email</p>
                    <p className="font-bold text-slate-900 dark:text-white">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Contact Number</p>
                    <p className="font-bold text-slate-900 dark:text-white">{customer.phone || 'No phone provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Delivery Address</p>
                    <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{customer.address || 'No address'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Log</h3>
                </div>
                <Badge variant="outline" className="rounded-lg text-[10px] font-bold text-slate-400 border-slate-100 dark:border-slate-800 uppercase px-3 py-1">Recent 10</Badge>
              </div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="text-[10px] font-black uppercase tracking-wider py-5 pl-8">Order ID</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-wider">Date</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase tracking-wider pr-8">Fulfillment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="border-b border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <TableCell className="font-black text-xs pl-8 text-primary dark:text-white font-mono">{order.id}</TableCell>
                          <TableCell className="text-xs text-slate-500 font-bold">{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right pr-8 font-black text-slate-900 dark:text-white text-xs">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-24 text-xs text-slate-400 font-bold italic">This customer has no purchase history.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}