"use client";

import { useState, useEffect, useMemo } from 'react';
import { customersAPI } from '@/services/customersAPI';
import { Customer } from '@/types/customer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Loader2, Trash2, Edit2, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { CustomerDetailModal } from '@/components/customers/CustomerDetailModal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
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
        toast({ title: "Success", description: "Customer updated successfully." });
      } else {
        await customersAPI.create(data);
        toast({ title: "Success", description: "Customer added successfully." });
      }
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customersAPI.delete(id);
      toast({ title: "Success", description: "Customer deleted successfully." });
      fetchCustomers();
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed.", variant: "destructive" });
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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your customers</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download}>
            Export
          </Button>
          <Button 
            onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} 
            icon={Plus}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-16" /> : customers.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total records</p>
        </Card>
      </div>

      {/* 3. FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1">
          <Input 
            placeholder="Search customers..." 
            icon={Search}
            className="h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger icon={Filter} className="w-full md:w-[180px] h-11 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 4. DATA TABLE */}
      <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 pl-6 text-sm">Name</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Email</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Phone</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Status</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Total Orders</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-right pr-6 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-slate-50 dark:border-slate-800/50">
                    <TableCell className="pl-6 py-4"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((c) => (
                  <TableRow 
                    key={c.id} 
                    className="border-slate-50 dark:border-slate-800/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group cursor-pointer"
                    onClick={() => { setViewingCustomer(c); setIsDetailOpen(true); }}
                  >
                    <TableCell className="py-4 pl-6 font-medium text-slate-900 dark:text-white">
                      {c.name}
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 dark:text-slate-400">
                      {c.email}
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 dark:text-slate-400">
                      {c.phone || '--'}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium text-xs border-none shadow-none",
                        c.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      )}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-slate-700 dark:text-slate-300">
                      {c.totalOrders}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Edit2}
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                          onClick={(e) => { e.stopPropagation(); setEditingCustomer(c); setIsFormOpen(true); }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Trash2}
                          className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                          onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-base font-medium text-slate-900 dark:text-white mt-4">No customers found</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                      <Button variant="outline" icon={Search} onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Details */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredCustomers.length}</span> results
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
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
