"use client";

import { useState, useEffect, useMemo } from 'react';
import { productsAPI } from '@/services/productsAPI';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Search, Edit2, Trash2, Loader2, Package, 
  Download, Filter, ArrowUpDown, MoreHorizontal
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll();
      if (res.success) setProducts(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        toast({ title: "Success", description: "Product updated successfully." });
      } else {
        await productsAPI.create(data);
        toast({ title: "Success", description: "Product added to inventory." });
      }
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast({ title: "Success", description: "Product removed successfully." });
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed.", variant: "destructive" });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const inventoryValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  }, [products]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage inventory and stock levels</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-4 rounded-xl font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button 
            onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} 
            className="h-10 px-5 rounded-full bg-primary text-white shadow-sm hover:shadow-md transition-all hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-16" /> : products.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Items in inventory</p>
        </Card>
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inventory Value</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-24" /> : `$${inventoryValue.toLocaleString()}`}
          </div>
          <p className="text-xs text-slate-400 mt-1">Asset valuation</p>
        </Card>
      </div>

      {/* 3. FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search products by name or SKU..." 
            className="pl-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-primary/30 shadow-sm bg-white dark:bg-card w-full"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full md:w-[180px] h-10 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Dairy">Dairy</SelectItem>
            <SelectItem value="Bakery">Bakery</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 4. DATA TABLE */}
      <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 pl-6 text-sm">Product</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Category</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Price</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Stock</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Status</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-right pr-6 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-slate-50 dark:border-slate-800/50">
                    <TableCell className="pl-6 py-4">
                       <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-3 w-16" />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <TableRow 
                    key={p.id} 
                    className="border-slate-50 dark:border-slate-800/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-primary dark:text-white group-hover:scale-105 transition-transform">
                            {p.name[0]}
                         </div>
                         <div>
                            <p className="font-medium text-slate-900 dark:text-white leading-none">{p.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">#{p.id.slice(0,8)}</p>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 font-medium text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none shadow-none">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-slate-900 dark:text-white">
                      ${p.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 font-medium text-slate-500 dark:text-slate-400">
                      {p.stock} <span className="text-[10px] uppercase font-bold text-slate-400">{p.unit}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium text-xs border-none shadow-none",
                        p.stock > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        p.stock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      )}>
                        {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                          onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-lg"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-10 w-10 text-slate-300 mb-4" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No products found</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Try adjusting your search or filters.</p>
                      <Button variant="outline" className="rounded-xl" onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}>
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
              Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredProducts.length}</span> results
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-lg border-slate-200 dark:border-slate-800 shadow-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-lg border-slate-200 dark:border-slate-800 shadow-sm disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ProductFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingProduct}
      />
    </div>
  );
}
