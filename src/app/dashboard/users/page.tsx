"use client";

import { useState, useEffect, useMemo } from 'react';
import { usersAPI } from '@/services/usersAPI';
import { User, UserRole, UserStatus } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Trash2, Edit2, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UserFormModal } from '@/components/users/UserFormModal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll();
      if (res.success) setUsers(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, data);
        toast({ title: "Success", description: "User updated successfully." });
      } else {
        await usersAPI.create(data);
        toast({ title: "Success", description: "User added successfully." });
      }
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      toast({ title: "Success", description: "User deleted successfully." });
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed.", variant: "destructive" });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system users and roles</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download}>
            Export
          </Button>
          <Button 
            onClick={() => { setEditingUser(null); setIsFormOpen(true); }} 
            icon={Plus}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
          <div className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-9 w-16" /> : users.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Active accounts</p>
        </Card>
      </div>

      {/* 3. FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1">
          <Input 
            placeholder="Search users..." 
            icon={Search}
            className="h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger icon={Filter} className="w-full sm:w-[160px] h-11 rounded-xl">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger icon={Filter} className="w-full sm:w-[160px] h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. DATA TABLE */}
      <Card className="border border-slate-100 dark:border-slate-800/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800/50 hover:bg-transparent">
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 pl-6 text-sm">Name</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Email</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Role</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Status</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">Last Login</TableHead>
                <TableHead className="py-4 font-medium text-slate-500 dark:text-slate-400 text-right pr-6 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-slate-50 dark:border-slate-800/50">
                    <TableCell className="pl-6 py-4"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <TableRow 
                    key={u.id} 
                    className="border-slate-50 dark:border-slate-800/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group"
                  >
                    <TableCell className="py-4 pl-6 font-medium text-slate-900 dark:text-white">
                      {u.name}
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 dark:text-slate-400">
                      {u.email}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium text-xs border-none shadow-none",
                        u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                        u.role === 'Manager' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      )}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium text-xs border-none shadow-none",
                        u.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      )}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '--'}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Edit2}
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                          onClick={() => { setEditingUser(u); setIsFormOpen(true); }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          icon={Trash2}
                          className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                          onClick={() => handleDelete(u.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-base font-medium text-slate-900 dark:text-white mt-4">No users found</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Try adjusting your search or filter.</p>
                      <Button variant="outline" icon={Search} onClick={() => { setSearchTerm(''); setRoleFilter('All'); setStatusFilter('All'); }}>
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
              Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredUsers.length}</span> results
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

      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingUser(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingUser}
      />
    </div>
  );
}
