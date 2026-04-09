"use client";

import { useState, useEffect } from 'react';
import { settingsAPI } from '@/services/settingsAPI';
import { SystemSettings } from '@/data/settingsData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  User, 
  ShieldCheck, 
  Palette, 
  Bell, 
  Save, 
  Loader2,
  Globe,
  DollarSign,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  Building2,
  Lock,
  Camera,
  Layers,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type SettingSection = 'general' | 'account' | 'security' | 'preferences' | 'notifications';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('general');
  const [data, setData] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.get();
      if (res.success) setData(res.data!);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (section: keyof SystemSettings | 'notifications', sectionData: any) => {
    setSaving(true);
    try {
      // For general logic, we treat notifications as part of preferences in the mock but could split
      const targetSection = section === 'notifications' ? 'preferences' : section;
      const res = await settingsAPI.update(targetSection, sectionData);
      if (res.success) {
        setData(res.data!);
        toast({ title: "Updated", description: "Settings saved successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not sync changes.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const menuItems = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Manage your system environment and user profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={X}>
            Discard
          </Button>
          <Button 
            onClick={() => handleUpdate(activeSection as any, data[activeSection === 'notifications' ? 'preferences' : activeSection])}
            disabled={saving}
            icon={saving ? Loader2 : Save}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 2. SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 space-y-1 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 p-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingSection)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 shrink-0 lg:shrink",
                    isActive 
                      ? "bg-[#0B1221] text-white shadow-lg shadow-[#0B1221]/20" 
                      : "text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                  <span className={cn("text-xs font-bold uppercase tracking-wider", isActive ? "text-white" : "text-slate-500")}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 3. CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeSection === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Settings</h2>
                 <p className="text-sm text-slate-500">Public information about your Barako Store business</p>
              </div>
              
              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
                 <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Business Name</Label>
                        <Input 
                          value={data.general.businessName}
                          onChange={(e) => setData({ ...data, general: { ...data.general, businessName: e.target.value } })}
                          icon={Building2}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Official Email</Label>
                        <Input 
                          value={data.general.email}
                          onChange={(e) => setData({ ...data, general: { ...data.general, email: e.target.value } })}
                          icon={Mail}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Support Phone</Label>
                        <Input 
                          value={data.general.phone}
                          onChange={(e) => setData({ ...data, general: { ...data.general, phone: e.target.value } })}
                          icon={Phone}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                         <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Store Location</Label>
                         <Input 
                           value={data.general.address}
                           onChange={(e) => setData({ ...data, general: { ...data.general, address: e.target.value } })}
                           icon={MapPin}
                           className="h-11"
                         />
                      </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Information</h2>
                 <p className="text-sm text-slate-500">Manage your profile details and personal credentials</p>
              </div>

              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
                 <CardContent className="p-8 space-y-8">
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-[32px] bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                           <img src={data.account.avatar} alt="avatar" className="h-full w-full object-cover" />
                        </div>
                        <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-900 shadow-md flex items-center justify-center text-primary dark:text-white hover:scale-110 transition-transform">
                           <Camera className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">Profile Avatar</h4>
                        <p className="text-xs text-slate-400 font-medium">PNG, JPG or GIF. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-slate-50 dark:border-slate-800 pt-8">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Display Name</Label>
                        <Input 
                          value={data.account.name}
                          onChange={(e) => setData({ ...data, account: { ...data.account, name: e.target.value } })}
                          icon={User}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Identifier</Label>
                        <Input 
                          value={data.account.email}
                          onChange={(e) => setData({ ...data, account: { ...data.account, email: e.target.value } })}
                          icon={Mail}
                          className="h-11"
                        />
                      </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Privacy</h2>
                 <p className="text-sm text-slate-500">Protect your account with advanced authentication</p>
              </div>

              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card mb-6">
                 <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex gap-4 items-center">
                         <div className="h-10 w-10 rounded-xl bg-white dark:bg-card border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[#0B1221]">
                            <Smartphone className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Auth</p>
                            <p className="text-[11px] text-slate-400 font-medium">Use internal app for secure sign-in</p>
                         </div>
                      </div>
                      <Switch 
                        checked={data.security.twoFactorEnabled}
                        onCheckedChange={(v) => handleUpdate('security', { ...data.security, twoFactorEnabled: v })}
                        className="data-[state=checked]:bg-[#0B1221]"
                      />
                    </div>
                 </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
                 <CardHeader className="px-8 pt-8 pb-0">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B1221] dark:text-white">Credentials Reset</h4>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    <div className="space-y-1.5">
                     <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Current Password</Label>
                        <Input type="password" placeholder="••••••••" icon={Lock} className="h-11" />
                     </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">New Secure Password</Label>
                          <Input type="password" placeholder="••••••••" icon={Lock} className="h-11" />
                        </div>
                       </div>
                       <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm New Password</Label>
                          <Input type="password" placeholder="••••••••" icon={Lock} className="h-11" />
                        </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Preferences</h2>
                 <p className="text-sm text-slate-500">Regional formatting and interface localization</p>
              </div>

              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
                 <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1.5 border-b border-slate-50 dark:border-slate-800 pb-1">
                             <Globe className="h-3 w-3 text-[#0B1221]" />
                             <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Language</Label>
                          </div>
                          <Select value={data.preferences.language} onValueChange={(v) => handleUpdate('preferences', { ...data.preferences, language: v })}>
                             <SelectTrigger icon={Globe} className="h-11 rounded-xl">
                                <SelectValue placeholder="Language" />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
                                <SelectItem value="English">English (United States)</SelectItem>
                                <SelectItem value="Arabic">Arabic (العربية)</SelectItem>
                                <SelectItem value="Somali">Somali (Af-Soomaali)</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1.5 border-b border-slate-50 dark:border-slate-800 pb-1">
                             <DollarSign className="h-3 w-3 text-emerald-600" />
                             <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Global Currency</Label>
                          </div>
                          <Select value={data.preferences.currency} onValueChange={(v) => handleUpdate('preferences', { ...data.preferences, currency: v })}>
                             <SelectTrigger icon={DollarSign} className="h-11 rounded-xl">
                                <SelectValue placeholder="Currency" />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
                                <SelectItem value="USD">USD ($) United States</SelectItem>
                                <SelectItem value="SLSH">SLSH (Sh.So) Somaliland</SelectItem>
                                <SelectItem value="EUR">EUR (€) Eurozone</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="mb-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                 <p className="text-sm text-slate-500">Configure how and when you want to receive alerts</p>
              </div>

              <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
                 <CardContent className="p-8 space-y-4">
                    {[
                       { id: 'orders', label: 'Order Updates', icon: Building2, desc: 'New orders and delivery alerts' },
                       { id: 'inventory', label: 'Inventory Summary', icon: Layers, desc: 'Stock alerts and replenish reports' },
                       { id: 'security', label: 'Security Alerts', icon: ShieldCheck, desc: 'New login and system security logs' }
                    ].map((item, idx) => (
                      <div key={item.id} className={cn(
                        "flex items-center justify-between p-5 rounded-2xl transition-all border border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30",
                        idx === 0 && "bg-slate-50/50 dark:bg-slate-900/30"
                      )}>
                         <div className="flex gap-4 items-center">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                               <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                               <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                            </div>
                         </div>
                         <Switch 
                            defaultChecked={idx < 2}
                            onCheckedChange={() => {}}
                            className="data-[state=checked]:bg-[#0B1221]"
                         />
                      </div>
                    ))}
                 </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
