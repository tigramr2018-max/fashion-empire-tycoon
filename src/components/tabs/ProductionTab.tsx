import React, { useState } from 'react';
import {
  Cpu,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Wrench,
  Factory,
  Clock3,
  Zap,
  Package,
  Scissors,
} from 'lucide-react';
import { PRODUCTS, RAW_MATERIALS } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { ProductKey, RawMaterialKey } from '../../types/game';

export const ProductionTab: React.FC = () => {
  const {
    factories,
    activeFactoryId,
    lines,
    cash,
    level,
    addProductionLine,
    upgradeLineMachines,
    toggleLineActive,
    repairLine,
  } = useGameStore();

  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>('shirt');

  if (!factory) {
    return <div className="p-5 text-center text-slate-400">لا يوجد مصنع متاح حالياً.</div>;
  }

  const facLines = lines.filter((l) => l.factoryId === factory.id);
  const maxLines = Math.floor(factory.areaSqm / 200);
  const productKeys = Object.keys(PRODUCTS) as ProductKey[];

  return (
    <div className="w-full min-w-0 space-y-4 pb-3">

      {/* عنوان الشاشة */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 flex items-center justify-center">
          <Factory className="w-6 h-6 text-amber-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-black text-white">إدارة الإنتاج</h2>
          <p className="text-xs text-slate-400 truncate">{factory.name}</p>
        </div>
      </div>

      {/* ملخص سريع */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Cpu className="w-4 h-4 text-amber-400" />
            خطوط الإنتاج
          </div>
          <p className="text-xl font-black text-white mt-2">
            {facLines.length}<span className="text-sm text-slate-500"> / {maxLines}</span>
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            خطوط نشطة
          </div>
          <p className="text-xl font-black text-emerald-400 mt-2">
            {facLines.filter((l) => l.active && !l.isBroken).length}
          </p>
        </div>
      </div>

      {/* إنشاء خط إنتاج */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">إنشاء خط إنتاج جديد</h3>
            <p className="text-[11px] text-slate-400">اختر المنتج الذي تريد تصنيعه</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <label className="block text-xs text-slate-400 mb-2">المنتج</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value as ProductKey)}
            className="w-full min-w-0 bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-3 outline-none focus:border-amber-500"
          >
            {productKeys.map((pk) => (
              <option key={pk} value={pk}>
                {PRODUCTS[pk].name} - {PRODUCTS[pk].basePrice.toLocaleString()} ج.م
              </option>
            ))}
          </select>
        </div>

        {/* وصفة التصنيع */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Package className="w-4 h-4" />
            خامات تصنيع {PRODUCTS[selectedProduct].name}
          </div>

          <div className="space-y-2">
            {Object.entries(PRODUCTS[selectedProduct].recipe).map(([mat, qty]) => (
              <div key={mat} className="flex justify-between items-center gap-2 text-xs">
                <span className="text-slate-300">{RAW_MATERIALS[mat as RawMaterialKey].name}</span>
                <span className="font-bold text-white">{qty} وحدة</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />
              زمن الإنتاج
            </span>
            <span className="text-xs font-bold text-sky-400">
              {PRODUCTS[selectedProduct].productionTimeTicks} ساعات عمل
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs gap-2">
          <span className="text-slate-400">مستوى الشركة: {level}</span>
          <span className="text-slate-400">التأسيس: 12,000 ج.م</span>
        </div>

        <button
          onClick={() => addProductionLine(factory.id, selectedProduct)}
          disabled={cash < 12000 || facLines.length >= maxLines}
          className="w-full min-h-12 py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm rounded-xl transition flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          تأسيس خط الإنتاج
        </button>

        {cash < 12000 && (
          <p className="text-[11px] text-rose-400 text-center">رصيدك لا يكفي لتأسيس خط جديد.</p>
        )}
        {facLines.length >= maxLines && (
          <p className="text-[11px] text-amber-300 text-center">وصل المصنع للحد الأقصى من خطوط الإنتاج. وسّع مساحة المصنع أولاً.</p>
        )}
      </section>

      {/* خطوط الإنتاج الحالية */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">خطوط الإنتاج الحالية</h3>
          </div>
          <span className="text-xs text-slate-500">{facLines.length} خط</span>
        </div>

        {facLines.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <Factory className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">لا توجد خطوط إنتاج</p>
            <p className="text-xs text-slate-500 mt-1">أنشئ أول خط إنتاج لبدء التصنيع.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {facLines.map((line) => {
              const prod = PRODUCTS[line.productKey];
              const machineCost = line.machines * 3500;

              const canProduce = Object.entries(prod.recipe).every(
                ([k, q]) => factory.rawInventory[k as RawMaterialKey] >= (q || 0) * line.machines
              );

              const status = line.isBroken
                ? { text: 'عطل ميكانيكي', color: 'text-rose-400', bg: 'bg-rose-500/15', bar: 'bg-rose-500' }
                : !canProduce
                ? { text: 'بانتظار الخامات', color: 'text-amber-300', bg: 'bg-amber-500/15', bar: 'bg-amber-500' }
                : line.active
                ? { text: 'قيد التشغيل', color: 'text-emerald-400', bg: 'bg-emerald-500/15', bar: 'bg-emerald-500' }
                : { text: 'متوقف', color: 'text-slate-400', bg: 'bg-slate-700', bar: 'bg-slate-500' };

              return (
                <article key={line.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                  {/* اسم المنتج والحالة */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-sm text-white truncate">{prod.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">خط إنتاج #{facLines.indexOf(line) + 1}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[10px] px-2 py-1.5 rounded-lg font-bold ${status.bg} ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* التقدم */}
                  <div className="bg-slate-950/70 rounded-xl p-3">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400">تقدم دورة الإنتاج</span>
                      <span className="font-black text-white">{Math.round(line.progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${status.bar}`}
                        style={{ width: `${Math.min(100, Math.max(0, line.progress))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">{line.machines} قطع لكل دورة إنتاج</p>
                  </div>

                  {/* معلومات الخط */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-800/70 rounded-xl p-2 text-center">
                      <Cpu className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-400">الماكينات</p>
                      <p className="text-sm font-black text-white mt-1">{line.machines}/{line.maxMachines}</p>
                    </div>
                    <div className="bg-slate-800/70 rounded-xl p-2 text-center">
                      <Scissors className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-400">الجودة</p>
                      <p className="text-sm font-black text-emerald-400 mt-1">{line.qualityScore}%</p>
                    </div>
                    <div className="bg-slate-800/70 rounded-xl p-2 text-center">
                      <Zap className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-400">الكهرباء</p>
                      <p className="text-xs font-black text-sky-400 mt-1">{line.machines * 45}</p>
                      <p className="text-[9px] text-slate-500">ج.م/يوم</p>
                    </div>
                  </div>

                  {/* استهلاك الخامات */}
                  <div className="bg-slate-950/50 rounded-xl p-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-300">استهلاك الخامات لكل دورة</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(prod.recipe).map(([k, q]) => (
                        <span key={k} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1.5 rounded-lg">
                          {RAW_MATERIALS[k as RawMaterialKey].name}: {(q || 0) * line.machines}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {line.isBroken ? (
                      <button
                        onClick={() => repairLine(line.id)}
                        disabled={cash < 1800}
                        className="col-span-2 min-h-12 py-3 bg-rose-500/15 border border-rose-500/30 disabled:opacity-40 text-rose-400 font-black text-xs rounded-xl flex items-center justify-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        إصلاح العطل (1,800 ج.م)
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleLineActive(line.id)}
                        className="min-h-12 py-3 bg-slate-800 border border-slate-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                      >
                        {line.active ? (
                          <><PauseCircle className="w-4 h-4 text-amber-400" /> إيقاف الخط</>
                        ) : (
                          <><PlayCircle className="w-4 h-4 text-emerald-400" /> تشغيل الخط</>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => upgradeLineMachines(line.id)}
                      disabled={cash < machineCost || line.machines >= line.maxMachines}
                      className="min-h-12 py-2 px-2 bg-amber-500/15 border border-amber-500/20 disabled:opacity-40 text-amber-400 font-bold text-[11px] rounded-xl flex flex-col items-center justify-center gap-1"
                    >
                      <span className="flex items-center gap-1"><PlusCircle className="w-4 h-4" /> إضافة ماكينة</span>
                      <span>{machineCost.toLocaleString()} ج.م</span>
                    </button>
                  </div>

                  {line.machines >= line.maxMachines && (
                    <p className="text-[10px] text-slate-500 text-center">وصل الخط للحد الأقصى من الماكينات.</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
