"use client";

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Printer, 
  CheckCircle2, 
  Package,
  CreditCard,
  X,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';

export default function POSPage() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, checkout, clearCart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stockQuantity > 0
    );
  }, [products, searchTerm]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Cart Empty", description: "Add items to cart before checkout.", variant: "destructive" });
      return;
    }
    
    const orderDetails = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      customer: customerName || 'Walk-in Customer',
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleString()
    };
    
    setLastOrder(orderDetails);
    checkout(customerName);
    setIsReceiptOpen(true);
    setCustomerName('');
    toast({ title: "Order Complete", description: "Order processed successfully." });
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-6 lg:flex-row lg:overflow-hidden pb-4">
      {/* 1. PRODUCT SECTION */}
      <div className="flex flex-col flex-1 gap-6 overflow-hidden">
        {/* Header/Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Point of Sale</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select products to build an order</p>
          </div>
          <div className="w-full sm:w-[320px]">
             <Input 
                placeholder="Search products or scan SKU..." 
                icon={Search}
                className="h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1 pr-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => addToCart(product)}
              >
                <div className="relative h-44 w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform group-hover:scale-105 duration-500" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200 dark:text-slate-800">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[#0B1221] dark:text-white font-bold text-[10px] border-none shadow-sm">
                      {product.stockQuantity} {product.unit} left
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">{product.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{product.category}</p>
                    </div>
                    <p className="text-xl font-black text-[#0B1221] dark:text-white">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                 <div className="h-16 w-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 shadow-sm">
                    <Search className="h-6 w-6 text-slate-300" />
                 </div>
                 <p className="text-slate-900 dark:text-white font-bold text-lg">No matches found</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Adjust your search or check inventory levels.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 2. CHECKOUT SECTION */}
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col lg:h-full">
        <Card className="flex flex-col h-full border border-slate-100 dark:border-slate-800/50 shadow-xl rounded-[24px] overflow-hidden bg-white dark:bg-card">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-card">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-[#0B1221]/10 flex items-center justify-center">
                 <ShoppingCart className="h-4 w-4 text-[#0B1221]" />
               </div>
               <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Active Cart</CardTitle>
            </div>
            <Badge className="bg-[#0B1221] text-white rounded-full px-2.5 py-0.5 text-[10px] border-none shadow-none font-black uppercase">
              {cart.length} line items
            </Badge>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
            {/* Customer Attachment */}
            <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800">
               <div className="group">
                  <Input 
                    placeholder="Attach Customer (Optional)" 
                    icon={User}
                    className="h-11 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#0B1221]/30"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
            </div>

            {/* Cart Items List */}
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                           <Package className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-sm truncate leading-none">{item.name}</p>
                      <p className="text-xs font-bold text-[#0B1221] dark:text-slate-400 mt-1.5">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-0.5 border border-slate-100 dark:border-slate-800">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        icon={Minus}
                        className="h-7 w-7 text-slate-500"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      />
                      <span className="w-6 text-center text-xs font-black text-slate-900 dark:text-white">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        icon={Plus}
                        className="h-7 w-7 text-slate-500"
                        disabled={item.quantity >= item.stockQuantity}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      icon={Trash2}
                      className="h-8 w-8 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                      onClick={() => removeFromCart(item.id)}
                    />
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                      <ShoppingCart className="h-6 w-6 text-slate-200" />
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Cart is empty</p>
                    <p className="text-[11px] text-slate-500 mt-1">Add items from the menu to start</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-card p-6">
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500 uppercase tracking-widest">
                <span>Subtotal Value</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-500 uppercase tracking-widest pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>Tax Allocation</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Amount Due</span>
                <span className="text-4xl font-black text-[#0B1221] dark:text-white tracking-tighter">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex w-full gap-3">
              <Button 
                variant="secondary" 
                icon={Trash2}
                className="flex-1" 
                onClick={clearCart}
              >
                Clear
              </Button>
              <Button 
                className="flex-[2]"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                icon={CreditCard}
              >
                Checkout
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 3. RECEIPT MODAL (ACCESSIBILITY FIX) */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-3xl rounded-[32px] bg-white dark:bg-card animate-in zoom-in-95 fade-in duration-300">
          <div className="px-8 pt-10 pb-6 text-center flex flex-col items-center">
            {/* Logo in Receipt */}
            <div className="mb-6">
              <Logo size="lg" clickable={false} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                Order Successful
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                Transaction #{lastOrder?.id} has been processed.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-8 pb-10 space-y-8">
            <div className="border-y-2 border-dashed border-slate-50 dark:border-slate-800 py-6 text-center space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Audit</p>
              <p className="text-xs text-slate-900 dark:text-white font-bold">{lastOrder?.date}</p>
            </div>
            
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-4 pr-3">
                {lastOrder?.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex gap-2 items-center">
                       <span className="h-5 w-5 rounded bg-slate-50 dark:bg-slate-900 text-[10px] flex items-center justify-center font-black border border-slate-100 dark:border-slate-800">{item.quantity}x</span>
                       <span className="text-slate-600 dark:text-slate-300 font-bold">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center">
                 <span className="text-slate-500 font-medium text-xs uppercase tracking-widest">Total Amount Paid</span>
                 <span className="text-3xl font-black text-[#0B1221] dark:text-white tracking-tighter">${lastOrder?.total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider italic">Attached Customer: {lastOrder?.customer}</p>
                  <CreditCard className="h-4 w-4 text-slate-300" />
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="secondary"
                className="flex-1" 
                onClick={() => setIsReceiptOpen(false)}
                icon={X}
              >
                Done
              </Button>
              <Button 
                className="flex-1"
                icon={Printer}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}