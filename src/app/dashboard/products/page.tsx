
"use client";

import { useState, useEffect, useMemo } from 'react';
import { productsAPI } from '@/services/productsAPI';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, Search, Edit, Trash2, Filter, Loader2, Package, 
  MoreVertical, ChevronLeft, ChevronRight, AlertCircle, 
  CheckCircle2, TrendingDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import Image from 'next/image';

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const handleCreateOrUpdate = async (data: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await productsAPI.create(data);
        toast({ title: "Success", description: "Product created successfully" });
      }
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast({ title: "Deleted", description: "Product removed from inventory" });
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} products?`)) return;
    try {
      await productsAPI.bulkDelete(selectedIds);
      toast({ title: "Success", description: `${selectedIds.length} items removed` });
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Bulk delete failed", variant: "destructive" });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-destructive text-white', icon: AlertCircle };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-accent text-primary', icon: TrendingDown };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map(p => p.id));
    }
  };

  if (loading && products.length === 0) {
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
          <h1 className="text-4xl font-black tracking-tight text-primary">Products</h1>
          <p className="text-slate-500 font-medium">Manage Barako Store inventory and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-destructive/20 transition-all hover:scale-105">
              <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 flex flex-col md:flex-row gap-4">
          <Card className="flex-1 flex items-center px-4 h-14 border-none shadow-sm rounded-2xl overflow-hidden">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input 
              placeholder="Search products..." 
              className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>
          <div className="flex gap-2">
            {['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat'].map(cat => (
              <Button 
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                className={`h-14 rounded-2xl px-6 font-bold transition-all ${categoryFilter === cat ? 'bg-primary text-white' : 'border-slate-200 text-slate-500'}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Card className="md:col-span-12 border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12 px-6">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedProducts.length}
                    onCheckedChange={toggleSelectAll}
                    className="border-slate-300 rounded-md"
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-500 py-6">Product</TableHead>
                <TableHead className="font-bold text-slate-500">Category</TableHead>
                <TableHead className="font-bold text-slate-500">Price</TableHead>
                <TableHead className="font-bold text-slate-500">Stock</TableHead>
                <TableHead className="font-bold text-slate-500">Status</TableHead>
                <TableHead className="font-bold text-slate-500 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((p) => {
                const status = getStockStatus(p.stock);
                const StatusIcon = status.icon;
                return (
                  <TableRow key={p.id} className={`border-b border-slate-50 transition-colors group ${selectedIds.includes(p.id) ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}>
                    <TableCell className="px-6">
                      <Checkbox 
                        checked={selectedIds.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                        className="border-slate-300 rounded-md"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 py-2">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                          <Image 
                            src={p.image || `https://picsum.photos/seed/${p.id}/100/100`} 
                            alt={p.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform" 
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{p.name}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">#{p.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold rounded-lg px-3 py-1">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-primary text-lg">${p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-black text-slate-700">{p.stock} <span className="text-[10px] text-slate-400 uppercase">{p.unit}</span></p>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${p.stock < 10 ? 'bg-accent' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
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
                          <DropdownMenuItem onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} className="rounded-xl gap-2 p-3 font-bold text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">
                            <Edit className="h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(p.id)} className="rounded-xl gap-2 p-3 font-bold text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                            <Trash2 className="h-4 w-4" /> Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Package className="h-16 w-16 mb-4 text-slate-300" />
                      <p className="text-xl font-black text-slate-900">No items found</p>
                      <p className="text-sm font-medium text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-400">
                Showing <span className="text-primary">{paginatedProducts.length}</span> of <span className="text-primary">{filteredProducts.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-slate-200 h-10 w-10" 
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
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-slate-200 h-10 w-10"
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

      <ProductFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingProduct}
      />
    </div>
  );
}
