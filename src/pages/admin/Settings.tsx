import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  CreditCard, 
  Truck, 
  Users, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Languages, 
  Mail, 
  Search,
  Store,
  CreditCard as Billing,
  UserCheck,
  Package,
  FileText,
  Lock,
  ChevronRight,
  Database,
  Palette,
  Layout,
  MapPin,
  CreditCard as PaymentIcon,
  ShoppingBag as CheckoutIcon,
  Users as CustomersIcon,
  Truck as ShippingIcon,
  HandCoins,
  Puzzle as AppIcon,
  Globe as DomainIcon,
  History,
  Mail as NotificationsIcon,
  Braces,
  Languages as LangIcon,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

type SettingsTab = 
  | 'general' 
  | 'plan' 
  | 'billing' 
  | 'users' 
  | 'payments' 
  | 'checkout' 
  | 'customer-accounts' 
  | 'shipping' 
  | 'taxes' 
  | 'locations' 
  | 'apps' 
  | 'sales-channels' 
  | 'domains' 
  | 'customer-events' 
  | 'notifications' 
  | 'meta-objects' 
  | 'languages' 
  | 'privacy' 
  | 'policies' 
  | 'appearance';

export const AdminSettings = () => {
  const { currentStore, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  const [generalDraft, setGeneralDraft] = useState({
    storeName: currentStore?.storeName || '',
    currency: currentStore?.currency || 'USD',
  });

  const [appearanceDraft, setAppearanceDraft] = useState({
    primaryColor: currentStore?.primaryColor || '#000000',
    accentColor: currentStore?.accentColor || '#fbbf24',
    fontFamily: currentStore?.fontFamily || 'Inter'
  });

  // Sync drafts when currentStore loads
  React.useEffect(() => {
    if (currentStore) {
      setGeneralDraft({
        storeName: currentStore.storeName,
        currency: currentStore.currency,
      });
      setAppearanceDraft({
        primaryColor: currentStore.primaryColor,
        accentColor: currentStore.accentColor,
        fontFamily: currentStore.fontFamily
      });
    }
  }, [currentStore]);

  const tabs: { id: SettingsTab, label: string, icon: any }[] = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'appearance', label: 'Store Appearance', icon: Palette },
    { id: 'plan', label: 'Plan', icon: Layout },
    { id: 'billing', label: 'Billing', icon: Billing },
    { id: 'users', label: 'Users and Permissions', icon: UserCheck },
    { id: 'payments', label: 'Payments', icon: PaymentIcon },
    { id: 'checkout', label: 'Checkout', icon: CheckoutIcon },
    { id: 'customer-accounts', label: 'Customer accounts', icon: CustomersIcon },
    { id: 'shipping', label: 'Shipping and delivery', icon: ShippingIcon },
    { id: 'taxes', label: 'Taxes and duties', icon: HandCoins },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'apps', label: 'Apps and sales channels', icon: AppIcon },
    { id: 'domains', label: 'Domains', icon: DomainIcon },
    { id: 'customer-events', label: 'Customer events', icon: History },
    { id: 'notifications', label: 'Notifications', icon: NotificationsIcon },
    { id: 'meta-objects', label: 'Custom data', icon: Braces },
    { id: 'languages', label: 'Languages', icon: LangIcon },
    { id: 'privacy', label: 'Customer privacy', icon: EyeOff },
    { id: 'policies', label: 'Policies', icon: FileText }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'general') {
        await updateSettings(generalDraft);
      } else if (activeTab === 'appearance') {
        await updateSettings(appearanceDraft);
      }
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 space-y-1 overflow-y-auto max-h-[80vh] scrollbar-hide">
        <div className="px-4 mb-4 relative">
          <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search settings" className="pl-9 h-9 bg-gray-50 border-transparent text-xs" />
        </div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Store Settings</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === tab.id 
                ? "bg-black text-white shadow-lg" 
                : "text-gray-500 hover:bg-white hover:text-gray-900"
            )}
          >
            <tab.icon size={18} className={activeTab === tab.id ? "text-accent" : "text-gray-400"} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm shadow-black/5 ring-1 ring-black/[0.05]">
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>Update your store's public identity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input 
                          id="store-name" 
                          value={generalDraft.storeName} 
                          onChange={(e) => setGeneralDraft({...generalDraft, storeName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 opacity-50 cursor-not-allowed">
                        <Label htmlFor="store-email">Contact Email (Linked to Account)</Label>
                        <Input id="store-email" value="admin@lumiere.com" readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm shadow-black/5 ring-1 ring-black/[0.05]">
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Manage currency and markets.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <select 
                          className="w-full h-10 px-3 bg-white border rounded-lg text-sm outline-none"
                          value={generalDraft.currency}
                          onChange={(e) => setGeneralDraft({...generalDraft, currency: e.target.value})}
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm shadow-black/5 ring-1 ring-black/[0.05]">
                  <CardHeader>
                    <CardTitle>Storefront Theme</CardTitle>
                    <CardDescription>Customize the visual style of your customer-facing store.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Primary Color</Label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={appearanceDraft.primaryColor} 
                            onChange={(e) => setAppearanceDraft({...appearanceDraft, primaryColor: e.target.value})}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <Input 
                            value={appearanceDraft.primaryColor} 
                            onChange={(e) => setAppearanceDraft({...appearanceDraft, primaryColor: e.target.value})}
                            className="flex-1 h-10 font-mono text-xs uppercase" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Accent Color</Label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={appearanceDraft.accentColor} 
                            onChange={(e) => setAppearanceDraft({...appearanceDraft, accentColor: e.target.value})}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <Input 
                            value={appearanceDraft.accentColor} 
                            onChange={(e) => setAppearanceDraft({...appearanceDraft, accentColor: e.target.value})}
                            className="flex-1 h-10 font-mono text-xs uppercase" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-gray-500">Storefront Typography</Label>
                      <select 
                        className="w-full h-10 px-3 bg-white border rounded-lg text-sm outline-none"
                        value={appearanceDraft.fontFamily}
                        onChange={(e) => setAppearanceDraft({...appearanceDraft, fontFamily: e.target.value})}
                      >
                        <option value="Inter">Inter (Sans-serif)</option>
                        <option value="Space Grotesk">Space Grotesk (Modern)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                        <option value="Outfit">Outfit (Clean)</option>
                      </select>
                    </div>

                    <Button className="w-full bg-black text-white" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Updating...' : 'Save Appearance'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-6">
                 <Card className="border-none shadow-sm bg-black text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <Badge className="bg-accent text-black font-bold uppercase text-[9px] mb-4">Enterprise Monthly</Badge>
                        <h2 className="text-3xl font-black mb-2">$99.00/mo</h2>
                        <p className="text-gray-400 text-sm">Your next billing date is June 9, 2026.</p>
                      </div>
                      <Button className="bg-white text-black hover:bg-accent font-bold uppercase text-xs h-12 px-8">Upgrade Plan</Button>
                    </div>
                 </Card>

                 <div className="grid grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm ring-1 ring-black/[0.05]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Storage Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="text-xl font-bold mb-2">1.2 GB / 10 GB</div>
                         <Progress value={12} className="h-1.5" />
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-black/[0.05]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Staff Accounts</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="text-xl font-bold mb-2">3 / Unlimited</div>
                         <Progress value={100} className="h-1.5" />
                      </CardContent>
                    </Card>
                 </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-black/[0.05]">
                  <CardHeader>
                    <CardTitle>Payment Providers</CardTitle>
                    <CardDescription>Select the methods your customers can use to pay.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50/50 group hover:border-black transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border font-black text-xs text-blue-600 italic">Stripe</div>
                        <div>
                          <div className="text-sm font-bold">Stripe Payments</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">Accept Credit Cards & Apple Pay</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50/50 group hover:border-black transition-colors opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border font-black text-xs text-blue-800">PayPal</div>
                        <div>
                          <div className="text-sm font-bold">PayPal Checkout</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">Enable express checkout</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold">Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Generic Catch-all for extra sections */}
            {!['general', 'appearance', 'plan', 'payments'].includes(activeTab) && (
              <Card className="border-none shadow-sm ring-1 ring-black/[0.05] p-20 text-center">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Database className="text-gray-300" />
                 </div>
                 <h3 className="font-bold mb-2">Module Coming Soon</h3>
                 <p className="text-sm text-gray-500">We are currently building the {activeTab.replace(/-/g, ' ')} settings module.</p>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" className="font-bold uppercase text-[10px] tracking-widest">Discard changes</Button>
          <Button className="bg-black text-white hover:bg-gray-800 font-bold uppercase text-[10px] tracking-widest px-8">Save all settings</Button>
        </div>
      </div>
    </div>
  );
};

import { ShoppingBag } from 'lucide-react';
