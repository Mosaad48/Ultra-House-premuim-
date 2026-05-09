import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Save, 
  Plus, 
  Layout as LayoutIcon, 
  Palette, 
  Type, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Undo2,
  Redo2,
  Eye,
  Rocket
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const ControlGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="border-b border-gray-100 last:border-0 p-4">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{label}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export const StoreCustomizer = () => {
  const { currentStore, updateStore } = useStore();
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');

  const [themeDraft, setThemeDraft] = useState(currentStore?.theme || {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    typography: 'Inter',
    darkMode: false
  });

  const handleSave = async () => {
    if (!currentStore?.id) return;
    setIsSaving(true);
    try {
      await updateStore(currentStore.id, { theme: themeDraft });
      toast.success('Visual changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f1f1f1] z-50 flex flex-col pt-14 pl-64">
      {/* Editor Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ChevronLeft size={16} className="mr-2" />
            Exit Editor
          </Button>
          <div className="h-6 w-[1px] bg-gray-200" />
          <h1 className="font-bold text-sm">Theme: Standard</h1>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <Button 
            variant={device === 'mobile' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone size={16} />
          </Button>
          <Button 
            variant={device === 'tablet' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setDevice('tablet')}
          >
            <Tablet size={16} />
          </Button>
          <Button 
            variant={device === 'desktop' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setDevice('desktop')}
          >
            <Monitor size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Undo2 size={16} /></Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Redo2 size={16} /></Button>
          </div>
          <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save & Publish'}
            <Save size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('sections')}
              className={cn(
                "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                activeTab === 'sections' ? "border-b-2 border-black text-black" : "text-gray-400"
              )}
            >
              Sections
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={cn(
                "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                activeTab === 'theme' ? "border-b-2 border-black text-black" : "text-gray-400"
              )}
            >
              Theme settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'sections' ? (
              <div className="space-y-1 p-2">
                <ControlGroup label="Header">
                  <div className="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <p className="text-xs font-medium">Main Navigation</p>
                  </div>
                </ControlGroup>
                
                <ControlGroup label="Body Sections">
                  <div className="space-y-2">
                    <div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center group">
                      <span className="text-xs font-medium">Hero Banner</span>
                      <Settings2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center group">
                      <span className="text-xs font-medium">Featured Collection</span>
                      <Settings2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center group">
                      <span className="text-xs font-medium">Newsletter</span>
                      <Settings2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-8 text-[10px] uppercase font-bold" size="sm">
                    <Plus size={14} className="mr-2" /> Add Section
                  </Button>
                </ControlGroup>

                <ControlGroup label="Footer">
                  <div className="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100">
                    <p className="text-xs font-medium">Footer Content</p>
                  </div>
                </ControlGroup>
              </div>
            ) : (
              <div className="p-2 space-y-4">
                <ControlGroup label="Colors">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-gray-500">Primary Color</Label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={themeDraft.primaryColor} 
                          onChange={(e) => setThemeDraft({...themeDraft, primaryColor: e.target.value})}
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <Input 
                          value={themeDraft.primaryColor} 
                          onChange={(e) => setThemeDraft({...themeDraft, primaryColor: e.target.value})}
                          className="flex-1 h-10 font-mono text-xs uppercase" 
                        />
                      </div>
                    </div>
                  </div>
                </ControlGroup>

                <ControlGroup label="Typography">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-gray-500">Main Font</Label>
                    <select 
                      className="w-full h-10 px-3 bg-white border rounded-lg text-sm outline-none"
                      value={themeDraft.typography}
                      onChange={(e) => setThemeDraft({...themeDraft, typography: e.target.value})}
                    >
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Space Grotesk">Space Grotesk (Tech)</option>
                      <option value="Playfair Display">Playfair Display (Serif)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                    </select>
                  </div>
                </ControlGroup>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-[#f9f9f9]">
            <Button variant="outline" className="w-full gap-2 text-xs font-bold" onClick={() => window.open('/', '_blank')}>
              <Eye size={14} /> View Storefront
            </Button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 bg-[#f1f1f1] flex items-center justify-center p-8 overflow-hidden">
          <motion.div
            layout
            className={cn(
              "bg-white shadow-2xl overflow-hidden relative transition-all duration-500 border border-gray-200",
              device === 'mobile' ? "w-[375px] h-[667px]" : 
              device === 'tablet' ? "w-[768px] h-[1024px]" : 
              "w-full h-full max-w-7xl max-h-[90%] rounded-xl"
            )}
          >
            {/* Mock Storefront Preview */}
            <div className="w-full h-full flex flex-col bg-white overflow-y-auto">
              {/* Preview Header */}
              <div className="h-16 border-b flex items-center justify-between px-8 bg-white sticky top-0 z-30">
                <div className="font-bold text-lg" style={{ color: themeDraft.primaryColor }}>
                  {currentStore?.name || 'STORE NAME'}
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-600">
                  <span>Home</span>
                  <span>Shop</span>
                  <span>About</span>
                </div>
              </div>

              {/* Preview Hero */}
              <div className="p-12 text-center" style={{ backgroundColor: `${themeDraft.primaryColor}10` }}>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tight" style={{ fontFamily: themeDraft.typography }}>
                  New Summer Collection
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">Discover the latest trends in minimalist design. Carefully crafted for you.</p>
                <Button className="rounded-full px-8" style={{ backgroundColor: themeDraft.primaryColor }}>Shop Now</Button>
              </div>

              {/* Preview Products */}
              <div className="p-12 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3 group cursor-pointer">
                      <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative">
                         <div className="absolute inset-x-2 bottom-2">
                           <Button size="sm" className="w-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all" style={{ backgroundColor: themeDraft.primaryColor }}>
                             Add to Cart
                           </Button>
                         </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Minimalist Watch 0{i}</h4>
                        <p className="text-gray-500 text-sm">$120.00</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Preview Footer */}
              <div className="mt-auto border-t p-12 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="font-bold uppercase tracking-widest text-xs">Categories</div>
                    <div className="text-sm text-gray-500 space-y-2">
                      <p>Electronics</p>
                      <p>Furniture</p>
                      <p>Lighting</p>
                    </div>
                  </div>
                  <div className="max-w-xs text-right">
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">Newsletter</p>
                    <div className="flex gap-2">
                      <Input placeholder="Email" className="bg-white" />
                      <Button size="sm" style={{ backgroundColor: themeDraft.primaryColor }}>Join</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay for "Live Preview" status */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live Preview Mode
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
