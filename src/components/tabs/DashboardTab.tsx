import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  PackageCheck,
  Scissors,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { PRODUCTS, RAW_MATERIALS } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { ProductKey, RawMaterialKey } from '../../types/game';
import { TabKey } from '../layout/Sidebar';

export const DashboardTab: React.FC<{ onNavigate: (tab: TabKey) => void }> = ({ onNavigate }) => {
  const { factories, activeFactoryId, lines, employees, orders, events, stats } = useGameStore();
  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];
  const facLines = lines.filter((l) => l.factoryId === factory.id);
  const facEmployees = employees.filter((e) => e.factoryId === factory.id);

  const lowMaterials = (Object.keys(RAW_MATERIALS) as RawMaterialKey[]).filter(
    (k) => factory.rawInventory[k] <= factory.reorderLevels[k]
  );

  const readyProducts = (Object.keys(PRODUCTS) as ProductKey[]).filter(
    (k) => factory.finishedInventory[k].qty > 0
  );

  return (
    <div className="space-y-6">
      {/* بطاقات ملخص المصنع الحالي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>إنتاج المصنع اليومي</span>
            <Scissors className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{factory.dailyProduced} قطعة</div>
          <div className="text-xs text-slate-400 mt-1">
            الإجمالي التراكمي للشركة: <span className="text-emerald-400 font-bold">{stats.totalProduced}</span> قطعة
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>خطوط الإنتاج النشطة</span>
            <TrendingUp className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {facLines.filter((l) => l.active).length} / {facLines.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            السعة المساحية: {factory.areaSqm} م² (حد أقصى {Math.floor(factory.areaSqm / 200)} خطوط)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>الطلبات المفتوحة</span>
            <PackageCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{orders.length} طلبات</div>
          <button
            onClick={() => onNavigate('export')}
            className="text-xs text-amber-400 hover:underline mt-1 flex items-center gap-1 font-bold"
          >
            الانتقال إلى التصدير والشحن <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>طاقم وكفاءة المصنع</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{factory.efficiency}%</div>
          <div className="text-xs text-slate-400 mt-1">
            {facEmployees.length} موظف • الهالك التراكمي: {stats.wasteCount} قطعة
          </div>
        </div>
      </div>

      {/* تنبيهات المخزون وحالة خطوط الإنتاج */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* خطوط الإنتاج الحالية */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg text-white">سير العمل في خطوط الإنتاج ({factory.name})</h2>
              <button
                onClick={() => onNavigate('production')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg font-bold"
              >
                إدارة الخطوط
              </button>
            </div>

            {facLines.length === 0 ? (
              <p className="text-sm text-slate-400">لا توجد خطوط إنتاج في هذا المصنع بعد.</p>
            ) : (
              <div className="space-y-3">
                {facLines.map((line) => {
                  const prod = PRODUCTS[line.productKey];
                  const hasMaterials = Object.entries(prod.recipe).every(
                    ([k, q]) => factory.rawInventory[k as RawMaterialKey] >= (q || 0) * line.machines
                  );

                  return (
                    <div key={line.id} className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="font-bold text-white">{prod.name}</span>
                          <span className="text-xs text-slate-400 mr-2">
                            ({line.machines} ماكينات • جودة {line.qualityScore}%)
                          </span>
                        </div>
                        <div>
                          {line.isBroken ? (
                            <span className="text-xs bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full font-bold">
                              معطل - يحتاج صيانة
                            </span>
                          ) : !hasMaterials ? (
                            <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                              متوقف لنقص الخامات
                            </span>
                          ) : line.active ? (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                              يعمل الآن ({Math.round(line.progress)}%)
                            </span>
                          ) : (
                            <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full">
                              متوقف يدوياً
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            line.isBroken ? 'bg-rose-500' : !hasMaterials ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, line.progress)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* مخزون المنتجات النهائية الجاهزة */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-extrabold text-lg text-white mb-3">مخزن المنتجات النهائية الجاهزة للشحن</h2>
            {readyProducts.length === 0 ? (
              <p className="text-sm text-slate-400">المخزن فارغ حالياً. انتظر إتمام دورات الإنتاج.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {readyProducts.map((key) => {
                  const item = factory.finishedInventory[key];
                  return (
                    <div key={key} className="bg-slate-800/70 border border-slate-700 rounded-xl p-3">
                      <div className="font-bold text-sm text-white">{PRODUCTS[key].name}</div>
                      <div className="flex items-center justify-between mt-1.5 text-xs">
                        <span className="text-emerald-400 font-extrabold">{item.qty} قطعة</span>
                        <span className="text-amber-300">جودة {item.quality}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* سجل الأحداث والتنبيهات */}
        <div className="space-y-6">
          {lowMaterials.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span>تنبيه نقص الخامات ({lowMaterials.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lowMaterials.map((m) => (
                  <span key={m} className="text-xs bg-amber-500/20 text-amber-200 px-2 py-1 rounded-lg">
                    {RAW_MATERIALS[m].name}: {factory.rawInventory[m]}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onNavigate('warehouses')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                شراء خامات من الموردين
              </button>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-extrabold text-lg text-white mb-3">أحدث الأحداث والتقارير</h2>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pl-1">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-xl border text-xs ${
                    ev.severity === 'danger'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      : ev.severity === 'warning'
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                      : ev.severity === 'success'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {ev.title}
                    </span>
                    <span className="text-[11px] opacity-75">يوم {ev.day}</span>
                  </div>
                  <p className="opacity-90 leading-relaxed">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
