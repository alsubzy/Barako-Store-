"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, ShoppingCart, Trash2, Plus, Minus, User, Printer, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function POSPage() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, checkout, clearCart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stockQuantity > 0
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    <div className="grid h-[calc(100vh-160px)] gap-8 lg:grid-cols-12">
      {/* Product Selection */}
      <div className="flex flex-col space-y-6 lg:col-span-8">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search items by name or scan barcode..." 
              className="pl-12 h-12 bg-transparent border-none focus-visible:ring-0 text-lg font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid flex-1 content-start gap-6 overflow-y-auto pr-2 scrollbar-hide sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer border-none shadow-sm card-shadow overflow-hidden transition-all active:scale-95" onClick={() => addToCart(product)}>
              <div className="relative h-40 w-full bg-slate-50">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-110" 
                    data-ai-hint="grocery product"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-200">
                    <ShoppingCart className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 backdrop-blur-md text-primary font-extrabold shadow-sm border-none">
                    {product.stockQuantity} {product.unit}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="font-bold text-slate-900 text-lg">{product.name}</p>
                <div className="flex items-center justify-between mt-2">
                   <p className="text-xl text-primary font-black">${product.price.toFixed(2)}</p>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{product.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <div className="bg-white p-4 rounded-full shadow-sm w-fit mx-auto mb-4">
                 <ShoppingCart className="h-10 w-10 text-slate-200" />
               </div>
               <p className="text-slate-500 font-bold">No products available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart/Checkout Sidebar */}
      <div className="lg:col-span-4 h-full">
        <Card className="flex h-full flex-col border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-white p-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                Current Order
              </div>
              <Badge className="bg-accent text-primary font-black border-none">
                {cart.length} ITEMS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Add Customer Name" 
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl font-medium"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate leading-tight">{item.name}</p>
                    <p className="text-sm font-bold text-primary mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-xl p-1">
                    <button 
                      className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-primary transition-all disabled:opacity-30"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                    <button 
                      className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-primary transition-all disabled:opacity-30"
                      disabled={item.quantity >= item.stockQuantity}
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="bg-slate-50 p-6 rounded-3xl mb-4">
                    <ShoppingCart className="h-16 w-16 text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-500">Your cart is empty</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t bg-slate-50 p-8">
            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-black text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-white transition-all" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button 
                className="h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className="bg-primary p-8 text-center text-white">
            <div className="bg-accent h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black">Success!</h3>
            <p className="text-white/70 font-medium">Order #{lastOrder?.id} completed</p>
          </div>
          <div className="p-8 space-y-8 bg-white">
            <div className="border-b-2 border-dashed border-slate-100 pb-6 text-center">
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Receipt Information</p>
              <p className="text-xs text-slate-400 font-bold">{lastOrder?.date}</p>
            </div>
            
            <div className="space-y-4">
              {lastOrder?.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-bold">{item.quantity}x {item.name}</span>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-slate-500 font-bold">Total Amount</span>
                 <span className="text-2xl font-black text-primary">${lastOrder?.total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-200">
                 <span>Customer</span>
                 <span>{lastOrder?.customer}</span>
               </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold" onClick={() => setIsReceiptOpen(false)}>Close</Button>
              <Button className="flex-1 h-12 rounded-xl bg-accent text-primary font-bold shadow-md shadow-accent/20">
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}