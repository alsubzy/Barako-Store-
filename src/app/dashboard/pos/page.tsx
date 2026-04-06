"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, ShoppingCart, Trash2, Plus, Minus, User, Printer, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

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
    
    // Save order details for receipt display
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
    <div className="grid h-[calc(100vh-140px)] gap-6 lg:grid-cols-12">
      {/* Product Selection */}
      <div className="flex flex-col space-y-4 lg:col-span-8">
        <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search items by name or scan barcode..." 
              className="pl-10 bg-secondary/30" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid flex-1 content-start gap-4 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer border-0 shadow-sm transition-all hover:ring-2 hover:ring-primary overflow-hidden" onClick={() => addToCart(product)}>
              <div className="relative h-32 w-full bg-muted">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-110" 
                    data-ai-hint="grocery product"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">No Image</div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-primary shadow-sm border">
                    {product.stockQuantity} left
                  </span>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-bold text-primary truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                   <p className="text-sm text-accent font-bold">${product.price.toFixed(2)} / {product.unit}</p>
                   <p className="text-[10px] text-muted-foreground">{product.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground bg-secondary/10 rounded-xl">
               No products available.
            </div>
          )}
        </div>
      </div>

      {/* Cart/Checkout Sidebar */}
      <div className="lg:col-span-4 h-full">
        <Card className="flex h-full flex-col border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Order
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Customer Name (Optional)" 
                  className="pl-10 bg-secondary/30"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2 rounded-lg border p-3 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold truncate pr-2">{item.name}</span>
                      <span className="text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border bg-white overflow-hidden shadow-sm">
                        <button 
                          className="px-2 py-1 text-primary hover:bg-secondary disabled:opacity-50"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold border-x">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-primary hover:bg-secondary disabled:opacity-50"
                          disabled={item.quantity >= item.stockQuantity}
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <ShoppingCart className="mb-2 h-12 w-12" />
                    <p className="text-sm">Cart is empty</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-secondary/20 p-6">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-primary/10">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-3">
              <Button variant="outline" className="border-primary text-primary" onClick={clearCart}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground shadow-lg" onClick={handleCheckout}>Checkout</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <div className="bg-emerald-600 p-6 text-center text-white">
            <CheckCircle2 className="mx-auto h-12 w-12 mb-2" />
            <h3 className="text-xl font-bold">Payment Successful</h3>
            <p className="text-emerald-100 text-sm">Transaction has been completed</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="border-b border-dashed pb-4 text-center">
              <h4 className="text-lg font-bold text-primary">MarketFlow Pro Receipt</h4>
              <p className="text-xs text-muted-foreground">Order: {lastOrder?.id}</p>
              <p className="text-xs text-muted-foreground">{lastOrder?.date}</p>
            </div>
            
            <div className="space-y-3">
              {lastOrder?.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-dashed pt-4">
               <div className="flex justify-between font-bold text-lg">
                 <span>Grand Total</span>
                 <span>${lastOrder?.total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs text-muted-foreground mt-1">
                 <span>Customer</span>
                 <span>{lastOrder?.customer}</span>
               </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => setIsReceiptOpen(false)}>Close</Button>
              <Button className="flex-1 gap-2">
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}