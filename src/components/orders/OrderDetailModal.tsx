"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, ShoppingBag, DollarSign, User, X, FileText, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

import { Logo } from '@/components/shared/Logo';

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-card shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50/50 dark:bg-background/50 p-8 border-b border-slate-100 dark:border-slate-800 relative">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Logo size="lg" clickable={false} showText={false} />
            
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Order #{order.id}</DialogTitle>
                <Badge className={cn(
                  "w-fit mx-auto sm:mx-0 rounded-full px-3 py-0.5 font-medium text-xs border-none shadow-none",
                  order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                )}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar className="h-4 w-4" />
                Placed on {new Date(order.orderDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-bold">Customer Information</h3>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-background/50 space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.customerName}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <DollarSign className="h-4 w-4 text-accent" />
                <h3 className="font-bold">Financial Summary</h3>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-background/50 space-y-1">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Total Payment Amount</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Package className="h-4 w-4 text-slate-400" />
              <h3 className="font-bold">Order Items</h3>
            </div>
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-background/50">
                  <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                    <TableHead className="font-bold text-slate-500 text-xs py-3 pl-4">Product</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Quantity</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right pr-4">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx} className="border-slate-50 dark:border-slate-800/50 h-12">
                      <TableCell className="font-medium text-slate-900 dark:text-white text-sm pl-4">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-center text-slate-500 text-sm font-semibold">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right pr-4 font-semibold text-slate-900 dark:text-white text-sm">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50/30 dark:bg-background/30 border-t border-slate-100 dark:border-slate-800">
                    <TableCell colSpan={2} className="text-right font-bold text-slate-500 text-sm">Total</TableCell>
                    <TableCell className="text-right pr-4 font-bold text-primary dark:text-white text-base">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
