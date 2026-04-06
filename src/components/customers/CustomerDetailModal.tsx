"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer, CustomerOrder } from '@/types/customer';
import { customersAPI } from '@/services/customersAPI';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Loader2, TrendingUp, History, User, ChevronRight, X } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[850px] rounded-[3rem] overflow-hidden p-0 border-none shadow-2xl dark:bg-slate-950 bg-white animate-in slide-in-from-bottom-10 duration-500">
        <div className="bg-[#F8FAFC] dark:bg-slate-900/50 p-12 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User className="h-64 w-64" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <Avatar className="h-28 w-28 rounded-[2rem] border-4 border-white dark:border-slate-800 bg-primary text-white shadow-2xl text-4xl font-black">
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
              <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest">
                <Calendar className="h-4 w-4 text-primary/40" />
                Member since {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 px-8 py-5 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 text-center animate-in fade-in zoom-in duration-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Lifetime Value</p>
              <p className="text-4xl font-black text-primary dark:text-white tracking-tighter">${customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-12 space-y-12 bg-white dark:bg-slate-950 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* High Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group shadow-sm hover:shadow-xl hover:-translate-y-1">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                 <ShoppingBag className="h-6 w-6" />
               </div>
               <div className="mt-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fulfillment Rate</p>
                 <p className="text-4xl font-black text-slate-900 dark:text-white mt-1.5">{customer.totalOrders}</p>
                 <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                   <TrendingUp className="h-3 w-3" /> 100% SUCCESS
                 </p>
               </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group shadow-sm hover:shadow-xl hover:-translate-y-1">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-accent group-hover:scale-110 transition-all">
                 <DollarSign className="h-6 w-6" />
               </div>
               <div className="mt-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg. Order Value</p>
                 <p className="text-4xl font-black text-slate-900 dark:text-white mt-1.5">${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}</p>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">PER TRANSACTION</p>
               </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 group shadow-sm hover:shadow-xl hover:-translate-y-1">
               <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-all">
                 <History className="h-6 w-6" />
               </div>
               <div className="mt-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loyalty Rating</p>
                 <p className="text-4xl font-black text-slate-900 dark:text-white mt-1.5">Platinum</p>
                 <p className="text-[10px] text-indigo-400 font-bold mt-2 uppercase tracking-tighter">HIGH RETENTION</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-10">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-6 bg-primary rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Hub</h3>
              </div>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email Address', value: customer.email },
                  { icon: Phone, label: 'Phone Line', value: customer.phone || 'N/A' },
                  { icon: MapPin, label: 'Postal Address', value: customer.address || 'Confidential' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                      <p className="font-bold text-slate-900 dark:text-white text-base truncate max-w-[200px]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-accent rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Transaction History</h3>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                </div>
              ) : (
                <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/30 shadow-sm transition-all hover:shadow-xl">
                  <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] py-5 pl-10">Reference</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-[0.2em]">Fulfillment</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-[0.2em] pr-10">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="border-b border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                          <TableCell className="font-black text-[10px] pl-10 text-primary dark:text-white font-mono uppercase tracking-tighter">
                            #{order.id}
                            <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-normal font-sans">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                             <Badge variant="outline" className="rounded-lg border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-400 uppercase px-2 py-0.5">
                               {order.status}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-10 font-black text-slate-900 dark:text-white text-sm">
                            ${order.total.toFixed(2)}
                            <ChevronRight className="inline-block h-4 w-4 ml-2 text-slate-200 group-hover:translate-x-1 transition-transform" />
                          </TableCell>
                        </TableRow>
                      ))}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-24 text-[10px] text-slate-400 font-black uppercase tracking-widest italic opacity-40">No records on file.</TableCell>
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
