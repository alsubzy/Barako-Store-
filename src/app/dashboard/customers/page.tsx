
"use client";

import { useState, useEffect, useMemo } from 'react';
import { customersAPI } from '@/services/customersAPI';
import { Customer, CustomerStatus } from '@/types/customer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, UserPlus, Phone, Mail, MoreVertical, 
  Loader2, Trash2, Edit, User, Eye, Download,
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { CustomerDetailModal } from '@/components/customers/CustomerDetailModal';

const ITEMS_PER_PAGE = 8;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customersAPI.getAll();
      if (res.success) setCustomers(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, data);
        toast({ title: "Success", description: "Customer profile updated" });
      } else {
        await customersAPI.create(data);
        toast({ title: "Success", description: "New customer registered" });
      }
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this customer?')) return;
    try {
      await customersAPI.delete(id);
      toast({ title: "Deleted", description: "Customer removed" });
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} customers?`)) return;
    try {
      await customersAPI.bulkDelete(selectedIds);
      toast({ title: "Success", description: `${selectedIds.length} profiles removed` });
      setSelectedIds([]);
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Bulk delete failed", variant: "destructive" });
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loading && customers.length === 0) {
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
          <h1 className="text-4xl font-black tracking-tight text-primary">Customers</h1>
          <p className="text-slate-500 font-medium">Manage Barako Store client base and spending history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-destructive/20">
              <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <UserPlus className="mr-2 h-5 w-5" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1 flex items-center px-4 h-14 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input 
              placeholder="Search by name or email..." 
              className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive'].map(s => (
              <Button 
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`h-14 rounded-2xl px-6 font-bold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'border-slate-200 text-slate-500 bg-white'}`}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12 px-6">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedCustomers.length}
                    onCheckedChange={() => setSelectedIds(selectedIds.length === paginatedCustomers.length ? [] : paginatedCustomers.map(c => c.id))}
                    className="border-slate-300 rounded-md"
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-500 py-6">Customer</TableHead>
                <TableHead className="font-bold text-slate-500">Contact</TableHead>
                <TableHead className="font-bold text-slate-500">Activity</TableHead>
                <TableHead className="font-bold text-slate-500">Spending</TableHead>
                <TableHead className="font-bold text-slate-500">Status</TableHead>
                <TableHead className="font-bold text-slate-500 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((c) => (
                <TableRow key={c.id} className={`border-b border-slate-50 transition-colors group ${selectedIds.includes(c.id) ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}>
                  <TableCell className="px-6">
                    <Checkbox 
                      checked={selectedIds.includes(c.id)}
                      onCheckedChange={() => toggleSelect(c.id)}
                      className="border-slate-300 rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 py-2">
                      <Avatar className="h-12 w-12 rounded-2xl bg-primary/5 text-primary font-black border border-primary/10">
                        <AvatarFallback>{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-slate-900 leading-tight">{c.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Added {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.email}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5"><Phone className="h-3 w-3" /> {c.phone || '--'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-black text-slate-700">{c.totalOrders} Orders</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lifetime Fulfillment</p>
                  </TableCell>
                  <TableCell className="font-black text-primary text-lg">${c.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={c.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-none rounded-lg' : 'bg-slate-100 text-slate-500 border-none rounded-lg'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm">
                          <MoreVertical className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                        <DropdownMenuItem onClick={() => { setViewingCustomer(c); setIsDetailOpen(true); }} className="rounded-xl gap-2 p-3 font-bold text-slate-700 focus:bg-slate-50 cursor-pointer">
                          <Eye className="h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingCustomer(c); setIsFormOpen(true); }} className="rounded-xl gap-2 p-3 font-bold text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">
                          <Edit className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="rounded-xl gap-2 p-3 font-bold text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <User className="h-16 w-16 mb-4 text-slate-300" />
                      <p className="text-xl font-black text-slate-900">No customers found</p>
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
                Showing <span className="text-primary">{paginatedCustomers.length}</span> of <span className="text-primary">{filteredCustomers.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10" 
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
                  variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10"
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

      <CustomerFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingCustomer(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingCustomer}
      />

      <CustomerDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => { setIsDetailOpen(false); setViewingCustomer(null); }} 
        customer={viewingCustomer}
      />
    </div>
  );
}
