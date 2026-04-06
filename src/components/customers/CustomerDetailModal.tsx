
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer, CustomerOrder } from '@/types/customer';
import { customersAPI } from '@/services/customersAPI';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[700px] rounded-[32px] overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-primary p-10 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShoppingBag className="h-40 w-40" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black">
              {customer.name[0]}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black">{customer.name}</h2>
                <Badge className={customer.status === 'Active' ? 'bg-emerald-400 text-emerald-950 border-none' : 'bg-slate-400 text-slate-950 border-none'}>
                  {customer.status}
                </Badge>
              </div>
              <p className="text-white/70 font-medium">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10 bg-white max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-primary">
                 <ShoppingBag className="h-5 w-5" />
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
               <p className="text-2xl font-black text-primary mt-1">{customer.totalOrders}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-emerald-500">
                 <DollarSign className="h-5 w-5" />
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
               <p className="text-2xl font-black text-primary mt-1">${customer.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-amber-500">
                 <Calendar className="h-5 w-5" />
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AOV</p>
               <p className="text-2xl font-black text-primary mt-1">${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email</p>
                    <p className="font-bold text-slate-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Phone</p>
                    <p className="font-bold text-slate-900">{customer.phone || 'No phone recorded'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                    <p className="font-bold text-slate-900">{customer.address || 'No address recorded'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Order History</h3>
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase">Order</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Date</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-xs">{order.id}</TableCell>
                          <TableCell className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-black text-primary text-xs">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-xs text-slate-400 font-bold italic">No orders found.</TableCell>
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
