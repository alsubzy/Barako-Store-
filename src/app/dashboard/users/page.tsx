
"use client";

import { useState, useEffect, useMemo } from 'react';
import { usersAPI } from '@/services/usersAPI';
import { User, UserRole, UserStatus } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, UserPlus, Mail, MoreVertical, 
  Loader2, Trash2, Edit, Shield, ChevronLeft, ChevronRight, Filter,
  Clock, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { UserFormModal } from '@/components/users/UserFormModal';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
      toast({ title: "Sync Error", description: "Failed to load user management directory", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, data);
        toast({ title: "Updated", description: "User account saved successfully." });
      } else {
        await usersAPI.create(data);
        toast({ title: "Created", description: "User provisioned successfully." });
      }
      fetchUsers();
    } catch (err) {
      toast({ title: "Operation Failed", description: "Could not authorize changes.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersAPI.delete(id);
      toast({ title: "Deauthorized", description: "User removed from system access." });
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Deauthorization failed.", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await usersAPI.bulkDelete(selectedIds);
      toast({ title: "Bulk Action Complete", description: `${selectedIds.length} users removed from system.` });
      setSelectedIds([]);
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Bulk deauthorization failed.", variant: "destructive" });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case 'Admin': return 'bg-primary text-white';
      case 'Manager': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-400">Syncing Identity Directory...</p>
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
            <ShieldCheck className="h-3 w-3" />
            <span>IAM System</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Identity Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">Manage organizational access, roles, and security policies for your Barako Store platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-destructive/10 animate-in fade-in slide-in-from-right-4">
              <Trash2 className="mr-2 h-4 w-4" /> Deauthorize ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }} className="h-11 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <UserPlus className="mr-2 h-4 w-4" /> Provision Account
          </Button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Card className="flex-1 flex items-center px-4 h-12 border-none shadow-sm rounded-xl bg-white dark:bg-slate-900 w-full group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-3 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name or email identifier..." 
            className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 h-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
        
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200/50 dark:border-slate-800">
          {['All', 'Admin', 'Manager', 'Staff'].map(r => (
            <button 
              key={r}
              onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
              className={cn(
                "h-10 px-6 rounded-lg font-bold text-xs transition-all whitespace-nowrap",
                roleFilter === r 
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-400"
              )}
            >
              {r}
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
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedUsers.length}
                    onCheckedChange={() => setSelectedIds(selectedIds.length === paginatedUsers.length ? [] : paginatedUsers.map(u => u.id))}
                    className="rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 py-6 text-[10px] uppercase tracking-widest">Operator Identity</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest">Access Policy</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest">Activity Audit</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest text-center">Security Status</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((u) => (
                <TableRow key={u.id} className={cn(
                  "border-b border-slate-50 dark:border-slate-800/50 transition-all group",
                  selectedIds.includes(u.id) ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-slate-50/30 dark:hover:hover:bg-slate-800/20'
                )}>
                  <TableCell className="px-8">
                    <Checkbox 
                      checked={selectedIds.includes(u.id)}
                      onCheckedChange={() => toggleSelect(u.id)}
                      className="rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 py-4">
                      <Avatar className="h-10 w-10 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-primary dark:text-white font-black shadow-sm group-hover:scale-105 transition-all">
                        <AvatarFallback>{u.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{u.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 opacity-60">
                           <Mail className="h-3 w-3" />
                           <span className="text-[10px] font-bold lowercase truncate max-w-[120px]">{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest border-none shadow-sm",
                      getRoleBadge(u.role)
                    )}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Last Seen:</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'Never Authenticated'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest border-none shadow-sm transition-all",
                      u.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    )}>
                      {u.status}
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
                        <DropdownMenuItem onClick={() => { setEditingUser(u); setIsFormOpen(true); }} className="rounded-xl gap-3 p-3 font-bold text-primary dark:text-white hover:bg-primary/5 cursor-pointer">
                          <Edit className="h-4 w-4" /> Modify Access
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(u.id)} className="rounded-xl gap-3 p-3 font-bold text-destructive hover:bg-destructive/5 cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Deauthorize
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] mb-6">
                         <Shield className="h-12 w-12 text-slate-300" />
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">No users discovered</p>
                      <p className="text-sm font-medium text-slate-500 max-w-xs mt-2">No matching accounts found for the current identity search.</p>
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
                {Array.from({ length: totalPages }).map((_, i) => (
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
                ))}
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

      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingUser(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingUser}
      />
    </div>
  );
}
