import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Megaphone, 
  Tag, 
  Layout, 
  Settings, 
  Package, 
  MousePointer2, 
  Sparkles, 
  Store,
  Layers,
  ChevronDown,
  ExternalLink,
  PlusCircle,
  Search,
  Globe,
  Smartphone,
  Puzzle,
  Languages,
  Bot
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../hooks/useStore';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, badge, external }: SidebarItemProps) => {
  const location = useLocation();
  const { currentStore } = useStore();
  const isActive = location.pathname === href;
  const isLight = currentStore?.adminAppearance?.sidebarMode === 'light';

  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all group",
        isActive 
          ? (isLight ? "bg-gray-100 text-black shadow-sm" : "bg-[#303030] text-white shadow-sm")
          : (isLight ? "text-gray-500 hover:text-black hover:bg-gray-50" : "text-gray-400 hover:text-white hover:bg-[#252525]")
      )}
    >
      <Icon size={18} className={cn(
        "transition-colors",
        isActive ? "" : (isLight ? "text-gray-400 group-hover:text-black" : "text-gray-400 group-hover:text-white")
      )} style={isActive ? { color: 'var(--admin-primary)' } : {}} />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[10px] font-bold",
          isLight ? "bg-gray-100 text-gray-500" : "bg-[#303030] text-gray-300"
        )}>
          {badge}
        </span>
      )}
      {external && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
    </NavLink>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <div className="px-3 mt-6 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
    {label}
  </div>
);

export const AdminSidebar = () => {
  const { currentStore } = useStore();
  const isLight = currentStore?.adminAppearance?.sidebarMode === 'light';

  return (
    <aside className={cn(
      "w-64 h-screen flex flex-col fixed left-0 top-0 z-50 border-r transition-all duration-300",
      isLight ? "bg-white border-gray-100" : "bg-[#1a1a1a] border-[#303030]"
    )}>
      {/* Store Switcher */}
      <div className={cn("p-4 border-b transition-colors", isLight ? "border-gray-100" : "border-[#303030]")}>
        <div className={cn(
          "flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors cursor-pointer group",
          isLight ? "hover:bg-gray-50 text-gray-900" : "hover:bg-[#252525] text-white"
        )}>
          <div 
            className="w-8 h-8 rounded flex items-center justify-center font-bold"
            style={{ backgroundColor: 'var(--admin-primary)', color: '#fff' }}
          >
            {currentStore?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-semibold truncate">{currentStore?.name || 'Untitled Store'}</div>
            <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              Store status: <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                currentStore?.launchStatus === 'live' ? "bg-green-500" : "bg-yellow-500"
              )} />
              {currentStore?.launchStatus || 'Draft'}
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-500 group-hover:text-white" />
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-hide">
        <nav className="space-y-0.5">
          <SidebarItem icon={Home} label="Home" href="/admin" />
          <SidebarItem icon={ShoppingCart} label="Orders" href="/admin/orders" badge="12" />
          <SidebarItem icon={ShoppingBag} label="Products" href="/admin/products" />
          <SidebarItem icon={Package} label="Inventory" href="/admin/inventory" />
          <SidebarItem icon={Users} label="Customers" href="/admin/customers" />
          <SidebarItem icon={BarChart3} label="Analytics" href="/admin/analytics" />
          <SidebarItem icon={Megaphone} label="Marketing" href="/admin/marketing" />
          <SidebarItem icon={Tag} label="Discounts" href="/admin/discounts" />
          <SidebarItem icon={Layers} label="Content" href="/admin/content" />

          <SectionHeader label="Sales Channels" />
          <div className="space-y-0.5">
            <div className="flex items-center justify-between group">
              <SidebarItem icon={Store} label="Online Store" href="/admin/store-customizer" />
              <a 
                href="/" 
                target="_blank" 
                rel="noreferrer"
                className={cn(
                  "mr-2 p-1 rounded hover:bg-gray-200 transition-colors",
                  isLight ? "text-gray-400 hover:text-black" : "text-gray-500 hover:text-white hover:bg-[#303030]"
                )}
                title="View your store"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <SidebarItem icon={Smartphone} label="Point of Sale" href="/admin/pos" />
            <SidebarItem icon={Globe} label="Markets" href="/admin/markets" />
          </div>

          <SectionHeader label="Apps" />
          <div className="space-y-0.5">
            <SidebarItem icon={Puzzle} label="Apps" href="/admin/apps" />
            <SidebarItem icon={Languages} label="Translate & Adapt" href="/admin/translations" />
          </div>
        </nav>
      </div>

      {/* Footer Nav */}
      <div className={cn(
        "p-2 border-t backdrop-blur-xl transition-all", 
        isLight ? "border-gray-100 bg-white/50" : "border-[#303030] bg-[#1a1a1a]/50"
      )}>
        <SidebarItem icon={Settings} label="Settings" href="/admin/settings" />
      </div>
    </aside>
  );
};
