import React, { useEffect, useState } from 'react';
import { RAW_MATERIALS } from './data/gameCatalog';
import { useGameStore } from './store/useGameStore';
import { RawMaterialKey } from './types/game';
import { Sidebar, TabKey } from './components/layout/Sidebar';
import { TopHud } from './components/layout/TopHud';
import { DashboardTab } from './components/tabs/DashboardTab';
import { DepartmentsTab } from './components/tabs/DepartmentsTab';
import { ExportTab } from './components/tabs/ExportTab';
import { FactoriesSettingsTab } from './components/tabs/FactoriesSettingsTab';
import { FinanceTab } from './components/tabs/FinanceTab';
import { HrTab } from './components/tabs/HrTab';
import { ProductionTab } from './components/tabs/ProductionTab';
import { WarehousesTab } from './components/tabs/WarehousesTab';

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const { speed, tick, factories, activeFactoryId, lines, orders } = useGameStore();

  useEffect(() => {
    if (speed === 0) return;
    const intervalMs = speed === 1 ? 1500 : speed === 2 ? 750 : 375;
    const timer = setInterval(() => {
      tick();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [speed, tick]);

  const activeFactory = factories.find((f) => f.id === activeFactoryId) || factories[0];
  const lowStockCount = (Object.keys(RAW_MATERIALS) as RawMaterialKey[]).filter(
    (k) => activeFactory.rawInventory[k] <= activeFactory.reorderLevels[k]
  ).length;
  const brokenLinesCount = lines.filter((l) => l.factoryId === activeFactory.id && l.isBroken).length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopHud />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openOrdersCount={orders.length}
          lowStockCount={lowStockCount}
          brokenLinesCount={brokenLinesCount}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
          {activeTab === 'departments' && <DepartmentsTab />}
          {activeTab === 'production' && <ProductionTab />}
          {activeTab === 'warehouses' && <WarehousesTab />}
          {activeTab === 'hr' && <HrTab />}
          {activeTab === 'export' && <ExportTab />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'factories_settings' && <FactoriesSettingsTab />}
        </main>
      </div>
    </div>
  );
}

export default App;
