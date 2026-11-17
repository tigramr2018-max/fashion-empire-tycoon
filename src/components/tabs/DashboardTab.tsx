import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  PackageCheck,
  Scissors,
  Sparkles,
  TrendingUp,
  Factory,
  Boxes,
} from 'lucide-react';
import { PRODUCTS, RAW_MATERIALS } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { ProductKey, RawMaterialKey } from '../../types/game';
import { TabKey } from '../layout/Sidebar';

export const DashboardTab: React.FC<{ onNavigate: (tab: TabKey) => void }> = ({ onNavigate }) => {
  const { factories, activeFactoryId, lines, employees, orders, events, stats } = useGameStore();
  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];

  if (!factory) {
    return <div className="p-5 text-center text-slate-400">لا يوجد مصنع متاح حالياً.</div>;
  }

  const facLines = lines.filter((l) => l.factoryId === factory.id);
  const facEmployees = employees.filter((e) => e.factoryId === factory.id);

  const lowMaterials = (Object.keys(RAW_MATERIALS) as RawMaterialKey[]).filter(
    (k) => factory.rawInventory[k] <= factory.reorderLevels[k]
  );

  const readyProducts = (Object.keys(PRODUCTS) as ProductKey[]).filter(
    (k) => factory.finishedInventory[k].qty > 0
  );

  const activeLines = facLines.filter((l) => l.active && !l.isBroken).length;

  return (
    <div className="w-full min-w-0 space-y-4 pb-3">

      {/* عنوان لوحة التحكم */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-11 h-11 shrink-0 rounded-2xl bg-amber-500/15 flex items-center justify-center">
          <Factory className="w-6 h-6 text-amber-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-black text-white">لوحة التحكم</h2>
          <p className="text-xs text-slate-400 truncate">{factory.name}</p>
        </div>
      </div>

      {/* ملخص المصنع */}
      <section className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-300 px-1">ملخص المصنع</h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-slate-400">إنتاج اليوم</span>
              <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-xl font-black text-white mt-2">{factory.dailyProduced}</div>
            <p className="text-[11px] text-slate-500 mt-1">قطعة منتجة</p>
          </div>

          <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-slate-400">خطوط تعمل</span>
              <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <div className="text-xl font-black text-white mt-2">
              {activeLines}<span className="text-sm text-slate-500"> / {facLines.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">خط إنتاج نشط</p>
          </div>

          <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-slate-400">الطلبات المفتوحة</span>
              <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xl font-black text-white mt-2">{orders.length}</div>
            <button
              onClick={() => onNavigate('export')}
              className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-bold"
            >
              التصدير والشحن <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-slate-400">كفاءة المصنع</span>
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            </div>
            <div className="text-xl font-black text-white mt-2">{factory.efficiency}%</div>
            <p className="text-[11px] text-slate-500 mt-1">{facEmployees.length} موظف</p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">إجمالي إنتاج الشركة</span>
          <span className="text-sm font-black text-emerald-400">{stats.totalProduced} قطعة</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">الهالك التراكمي</span>
          <span className="text-sm font-bold text-rose-400">{stats.wasteCount} قطعة</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">المساحة المتاحة للمصنع</span>
          <span className="text-sm font-bold text-slate-200">{factory.areaSqm} م²</span>
        </div>
      </section>

      {/* خطوط الإنتاج */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp className="w-5 h-5 text-sky-400 shrink-0" />
            <h3 className="font-extrabold text-sm text-white">خطوط الإنتاج</h3>
          </div>
          <button
            onClick={() => onNavigate('production')}
            className="shrink-0 text-xs bg-slate-800 text-amber-400 px-3 py-2 rounded-xl font-bold"
          >
            إدارة الخطوط
          </button>
        </div>

        {facLines.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-5">لا توجد خطوط إنتاج في هذا المصنع بعد.</p>
        ) : (
          <div className="space-y-2.5">
            {facLines.map((line) => {
              const prod = PRODUCTS[line.productKey];
              const hasMaterials = Object.entries(prod.recipe).every(
                ([k, q]) => factory.rawInventory[k as RawMaterialKey] >= (q || 0) * line.machines
              );

              const status = line.isBroken
                ? { text: 'معطل - يحتاج صيانة', style: 'bg-rose-500/15 text-rose-400', bar: 'bg-rose-500' }
                : !hasMaterials
                ? { text: 'نقص في الخامات', style: 'bg-amber-500/15 text-amber-300', bar: 'bg-amber-500' }
                : line.active
                ? { text: `يعمل الآن ${Math.round(line.progress)}%`, style: 'bg-emerald-500/15 text-emerald-400', bar: 'bg-emerald-500' }
                : { text: 'متوقف يدوياً', style: 'bg-slate-700 text-slate-300', bar: 'bg-slate-500' };

              return (
                <div key={line.id} className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white">{prod.name}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {line.machines} ماكينات • جودة {line.qualityScore}%
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] px-2 py-1 rounded-lg font-bold ${status.style}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${status.bar}`}
                      style={{ width: `${Math.min(100, Math.max(0, line.progress))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* المنتجات الجاهزة */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-white">المنتجات الجاهزة للشحن</h3>
        </div>

        {readyProducts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-5">المخزن فارغ حالياً. انتظر إتمام دورات الإنتاج.</p>
        ) : (
          <div className="space-y-2">
            {readyProducts.map((key) => {
              const item = factory.finishedInventory[key];
              return (
                <div key={key} className="flex items-center justify-between gap-3 bg-slate-800/70 border border-slate-700 rounded-xl p-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-white">{PRODUCTS[key].name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">جودة المنتج: {item.quality}%</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="font-black text-emerald-400 text-base">{item.qty}</p>
                    <p className="text-[10px] text-slate-500">قطعة</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* تنبيهات الخامات */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">تنبيهات المخزون</h3>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${lowMaterials.length ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'}`}>
            {lowMaterials.length ? `${lowMaterials.length} تنبيه` : 'المخزون جيد'}
          </span>
        </div>

        {lowMaterials.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
            <CheckCircle2 className="w-4 h-4" />
            لا توجد خامات وصلت لحد إعادة الطلب.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {lowMaterials.map((m) => (
                <div key={m} className="flex items-center justify-between gap-2 bg-amber-950/30 border border-amber-500/20 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-amber-200 font-bold">{RAW_MATERIALS[m].name}</span>
                  <span className="text-xs text-amber-300 font-black">{factory.rawInventory[m]}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('warehouses')}
              className="w-full py-3 bg-amber-500 text-slate-950 font-black text-sm rounded-xl active:scale-[0.98] transition"
            >
              شراء خامات من الموردين
            </button>
          </>
        )}
      </section>

      {/* سجل الأحداث */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-extrabold text-sm text-white">أحدث الأحداث والتقارير</h3>
          <span className="text-[11px] text-slate-500">{events.length} حدث</span>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-5">لا توجد أحداث مسجلة حتى الآن.</p>
        ) : (
          <div className="space-y-2">
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
                <div className="flex items-center justify-between gap-2 font-bold mb-1">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ev.title}</span>
                  </span>
                  <span className="text-[10px] opacity-75 shrink-0">يوم {ev.day}</span>
                </div>
                <p className="opacity-90 leading-relaxed">{ev.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
