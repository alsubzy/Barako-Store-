"use client";

import { useState, useEffect, useMemo } from 'react';
import { customersAPI } from '@/services/customersAPI';
import { Customer } from '@/types/customer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, UserPlus, Phone, Mail, MoreVertical, 
  Loader2, Trash2, Edit, User, Eye, Download,
  ChevronLeft, ChevronRight, MapPin, Filter
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
import { cn } from '@/lib/utils';

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
      toast({ title: "Sync Error", description: "Failed to load customer directory", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, data);
        toast({ title: "Updated", description: "Profile saved successfully." });
      } else {
        await customersAPI.create(data);
        toast({ title: "Created", description: "Customer registered successfully." });
      }
      fetchCustomers();
    } catch (err) {
      toast({ title: "Operation Failed", description: "Could not save changes.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customersAPI.delete(id);
      toast({ title: "Deleted", description: "Customer removed from directory." });
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed.", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await customersAPI.bulkDelete(selectedIds);
      toast({ title: "Bulk Deleted", description: `${selectedIds.length} profiles removed.` });
      setSelectedIds([]);
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Bulk delete failed.", variant: "destructive" });
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
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-400">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary/70 font-bold uppercase tracking-widest text-[10px]">
            <User className="h-3 w-3" />
            <span>Relationship Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">Manage your customer base, monitor lifetime value, and track spending patterns across all locations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-destructive/10 animate-in fade-in slide-in-from-right-4">
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="h-11 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <UserPlus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Card className="flex-1 flex items-center px-4 h-12 border-none shadow-sm rounded-xl bg-white dark:bg-slate-900 w-full group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-3 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, email or phone..." 
            className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 h-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
        
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200/50 dark:border-slate-800">
          {['All', 'Active', 'Inactive'].map(s => (
            <button 
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={cn(
                "h-10 px-6 rounded-lg font-bold text-xs transition-all whitespace-nowrap",
                statusFilter === s 
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* SaaS Table Card */}
      <Card className="border-none shadow-sm card-shadow rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12 px-8">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedCustomers.length}
                    onCheckedChange={() => setSelectedIds(selectedIds.length === paginatedCustomers.length ? [] : paginatedCustomers.map(c => c.id))}
                    className="rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 py-6 text-[10px] uppercase tracking-widest">Customer Profile</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest">Contact Information</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest">Sales Metrics</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((c) => (
                <TableRow key={c.id} className={cn(
                  "border-b border-slate-50 dark:border-slate-800/50 transition-all group",
                  selectedIds.includes(c.id) ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-slate-50/30 dark:hover:bg-slate-800/20'
                )}>
                  <TableCell className="px-8">
                    <Checkbox 
                      checked={selectedIds.includes(c.id)}
                      onCheckedChange={() => toggleSelect(c.id)}
                      className="rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 py-4">
                      <Avatar className="h-10 w-10 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-primary dark:text-white font-black shadow-sm group-hover:scale-105 transition-all">
                        <AvatarFallback>{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{c.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 opacity-60">
                           <MapPin className="h-3 w-3" />
                           <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{c.address || 'Location Hidden'}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-300" /> {c.email}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2 font-bold tracking-tight"><Phone className="h-3.5 w-3.5 text-slate-300" /> {c.phone || '--'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-primary dark:text-white">${c.totalSpent.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">{c.totalOrders} Orders Placed</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest border-none shadow-sm transition-all",
                      c.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    )}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px] dark:bg-slate-800 bg-white">
                        <DropdownMenuItem onClick={() => { setViewingCustomer(c); setIsDetailOpen(true); }} className="rounded-xl gap-3 p-3 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                          <Eye className="h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingCustomer(c); setIsFormOpen(true); }} className="rounded-xl gap-3 p-3 font-bold text-primary dark:text-white hover:bg-primary/5 cursor-pointer">
                          <Edit className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="rounded-xl gap-3 p-3 font-bold text-destructive hover:bg-destructive/5 cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Delete Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] mb-6">
                         <User className="h-12 w-12 text-slate-300" />
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">No customers found</p>
                      <p className="text-sm font-medium text-slate-500 max-w-xs mt-2">We couldn't find any profiles matching your current filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Minimalist Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-10 py-8 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Page <span className="text-primary dark:text-white">{currentPage}</span> of <span className="text-primary dark:text-white">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 h-10 w-10 bg-white dark:bg-slate-900 shadow-sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  if (totalPages > 5 && Math.abs(currentPage - (i + 1)) > 2) return null;
                  return (
                    <Button 
                      key={i} 
                      variant={currentPage === i + 1 ? 'default' : 'ghost'}
                      className={cn(
                        "h-10 w-10 rounded-xl font-black text-[10px]",
                        currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
              <Button 
                variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 h-10 w-10 bg-white dark:bg-slate-900 shadow-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

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
