import React from 'react';
import {
  LayoutDashboard,
  Factory,
  Cpu,
  Warehouse,
  Users,
  Globe2,
  Landmark,
  Settings,
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'departments'
  | 'production'
  | 'warehouses'
  | 'hr'
  | 'export'
  | 'finance'
  | 'factories_settings';

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  openOrdersCount: number;
  lowStockCount: number;
  brokenLinesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openOrdersCount,
  lowStockCount,
  brokenLinesCount,
}) => {
  const navItems = [
    { key: 'dashboard' as TabKey, label: 'الرئيسية', icon: <LayoutDashboard /> },
    { key: 'departments' as TabKey, label: 'الأقسام', icon: <Factory /> },
    { key: 'production' as TabKey, label: 'الإنتاج', icon: <Cpu />, badge: brokenLinesCount },
    { key: 'warehouses' as TabKey, label: 'المخازن', icon: <Warehouse />, badge: lowStockCount },
    { key: 'hr' as TabKey, label: 'الموظفين', icon: <Users /> },
    { key: 'export' as TabKey, label: 'الطلبات', icon: <Globe2 />, badge: openOrdersCount },
    { key: 'finance' as TabKey, label: 'المالية', icon: <Landmark /> },
    { key: 'factories_settings' as TabKey, label: 'الإعدادات', icon: <Settings /> },
  ];

  return (
    <aside className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 border-t border-slate-700 pb-[env(safe-area-inset-bottom)]">
      <nav className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 min-w-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 active:bg-slate-800'
              }`}
            >
              <span className="relative">
                {React.cloneElement(item.icon, { size: 21, strokeWidth: 2.2 })}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
