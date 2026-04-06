"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Sparkles, Loader2, Package, MoreVertical } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/ai-product-description-assistant';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    price: 0,
    stockQuantity: 0,
    unit: 'piece',
    description: '',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
        description: product.description || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'General',
        price: 0,
        stockQuantity: 0,
        unit: 'piece',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast({ title: "Product Updated", description: `${formData.name} has been updated successfully.` });
    } else {
      addProduct({ ...formData, image: `https://picsum.photos/seed/${formData.name}/600/400` });
      toast({ title: "Product Added", description: `${formData.name} has been added to inventory.` });
    }
    setIsModalOpen(false);
  };

  const handleAIDescription = async () => {
    if (!formData.name) {
      toast({ title: "Missing Name", description: "Please enter a product name first.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        productName: formData.name,
        category: formData.category,
        keyFeatures: "fresh, organic, premium quality"
      });
      setFormData({ ...formData, description: result.description });
      toast({ title: "Description Generated", description: "AI has crafted a new description for you!" });
    } catch (error) {
      toast({ title: "AI Error", description: "Failed to generate description. Try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Product Management</h1>
          <p className="text-slate-500 font-medium">Manage your catalog, prices and stock levels.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <Plus className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search products by name or category..." 
            className="pl-12 h-11 bg-transparent border-none focus-visible:ring-0 font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm card-shadow overflow-hidden rounded-3xl">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[100px] font-bold text-slate-500">Image</TableHead>
              <TableHead className="font-bold text-slate-500">Product Name</TableHead>
              <TableHead className="font-bold text-slate-500">Category</TableHead>
              <TableHead className="font-bold text-slate-500">Price</TableHead>
              <TableHead className="font-bold text-slate-500">Stock</TableHead>
              <TableHead className="font-bold text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors group">
                <TableCell>
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-110" 
                        data-ai-hint="grocery product"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-slate-200 m-auto" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-900">{product.name}</TableCell>
                <TableCell>
                   <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-black text-primary text-lg">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-sm font-bold ${product.stockQuantity <= 10 ? "text-primary" : "text-slate-700"}`}>
                      {product.stockQuantity} {product.unit}
                    </span>
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all ${product.stockQuantity <= 10 ? "bg-accent" : "bg-primary"}`} 
                         style={{ width: `${Math.min(100, (product.stockQuantity / 50) * 100)}%` }}
                       />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2">
                      <DropdownMenuItem onClick={() => handleOpenModal(product)} className="rounded-lg gap-2 cursor-pointer p-3 font-bold text-primary focus:bg-primary/5 focus:text-primary">
                        <Edit className="h-4 w-4" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteProduct(product.id)} className="rounded-lg gap-2 cursor-pointer p-3 font-bold text-destructive focus:bg-destructive/5 focus:text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <Package className="h-12 w-12 mb-2" />
                    <p className="font-bold">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className="bg-primary p-8 text-white">
            <h3 className="text-2xl font-black">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="text-white/70 font-medium">Fill in the information to manage your catalog.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 bg-white space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Product Name</Label>
                  <Input 
                    id="name" 
                    className="h-12 bg-slate-50 border-none rounded-xl font-bold" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-slate-400">Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Meat">Meat</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-slate-400">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    className="h-12 bg-slate-50 border-none rounded-xl font-bold" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-xs font-black uppercase tracking-widest text-slate-400">Initial Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    className="h-12 bg-slate-50 border-none rounded-xl font-bold" 
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-xs font-black uppercase tracking-widest text-slate-400">Unit</Label>
                  <Select value={formData.unit} onValueChange={(val) => setFormData({...formData, unit: val})}>
                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="liter">Liter (l)</SelectItem>
                      <SelectItem value="piece">Piece (pc)</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-black gap-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5"
                    onClick={handleAIDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Generate with AI
                  </Button>
                </div>
                <textarea 
                  id="description" 
                  className="w-full min-h-[120px] rounded-2xl border-none bg-slate-50 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell customers more about this product..."
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold text-slate-500" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}