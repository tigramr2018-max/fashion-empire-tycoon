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
  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { key: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'departments', label: 'الأقسام الصناعية والمغاسل', icon: <Factory className="w-5 h-5" /> },
    {
      key: 'production',
      label: 'خطوط الإنتاج',
      icon: <Cpu className="w-5 h-5" />,
      badge: brokenLinesCount > 0 ? brokenLinesCount : undefined,
      badgeColor: 'bg-rose-500',
    },
    {
      key: 'warehouses',
      label: 'المخازن والمشتريات',
      icon: <Warehouse className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    { key: 'hr', label: 'الموارد البشرية', icon: <Users className="w-5 h-5" /> },
    {
      key: 'export',
      label: 'الطلبات والتصدير العالمي',
      icon: <Globe2 className="w-5 h-5" />,
      badge: openOrdersCount,
      badgeColor: 'bg-sky-500 text-slate-950',
    },
    { key: 'finance', label: 'الإدارة المالية والبنوك', icon: <Landmark className="w-5 h-5" /> },
    { key: 'factories_settings', label: 'المصانع الدولية والحفظ', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-3 shrink-0">
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-slate-950 text-amber-400' : item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
