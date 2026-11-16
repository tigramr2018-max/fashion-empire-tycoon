import React, { useState } from 'react';
import { Cpu, PauseCircle, PlayCircle, PlusCircle, Wrench } from 'lucide-react';
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
  const facLines = lines.filter((l) => l.factoryId === factory.id);
  const maxLines = Math.floor(factory.areaSqm / 200);

  const [selectedProduct, setSelectedProduct] = useState<ProductKey>('shirt');

  const productKeys = Object.keys(PRODUCTS) as ProductKey[];

  return (
    <div className="space-y-6">
      {/* إنشاء خط إنتاج جديد */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">إنشاء خط إنتاج جديد في {factory.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              الخطوط الحالية: {facLines.length} من {maxLines} (قم بتوسعة مبنى المصنع لزيادة المساحة)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value as ProductKey)}
              className="bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2"
            >
              {productKeys.map((pk) => (
                <option key={pk} value={pk}>
                  {PRODUCTS[pk].name} (سعر البيع الأساسي: {PRODUCTS[pk].basePrice} ج.م)
                </option>
              ))}
            </select>

            <button
              onClick={() => addProductionLine(factory.id, selectedProduct)}
              disabled={cash < 12000 || facLines.length >= maxLines}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-extrabold text-sm rounded-xl transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تأسيس الخط (12,000 ج.م)</span>
            </button>
          </div>
        </div>

        {/* معاينة وصفة التصنيع للمنتج المختار */}
        <div className="mt-4 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-amber-400 font-bold">وصفة تصنيع ({PRODUCTS[selectedProduct].name}):</span>
          {Object.entries(PRODUCTS[selectedProduct].recipe).map(([mat, qty]) => (
            <span key={mat} className="bg-slate-800 px-2.5 py-1 rounded-lg text-slate-200">
              {RAW_MATERIALS[mat as RawMaterialKey].name}: <strong>{qty}</strong>
            </span>
          ))}
          <span className="text-slate-400 mr-auto">
            الزمن: {PRODUCTS[selectedProduct].productionTimeTicks} ساعات عمل • مستوى الشركة: {level}
          </span>
        </div>
      </div>

      {/* قائمة خطوط الإنتاج العاملة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facLines.map((line) => {
          const prod = PRODUCTS[line.productKey];
          const machineCost = line.machines * 3500;
          const canProduce = Object.entries(prod.recipe).every(
            ([k, q]) => factory.rawInventory[k as RawMaterialKey] >= (q || 0) * line.machines
          );

          return (
            <div key={line.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-400" />
                    <h3 className="font-extrabold text-lg text-white">{prod.name}</h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      line.isBroken
                        ? 'bg-rose-500/20 text-rose-400'
                        : !canProduce
                        ? 'bg-amber-500/20 text-amber-300'
                        : line.active
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {line.isBroken
                      ? 'عطل ميكانيكي'
                      : !canProduce
                      ? 'بانتظار الخامات'
                      : line.active
                      ? 'قيد التشغيل'
                      : 'متوقف'}
                  </span>
                </div>

                {/* شريط التقدم */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>تقدم الدورة الحالية ({line.machines} قطع/دورة)</span>
                    <span>{Math.round(line.progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all" style={{ width: `${line.progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 p-3 rounded-xl text-xs mb-3">
                  <div>
                    <span className="text-slate-400 block">الماكينات</span>
                    <span className="font-extrabold text-white text-sm">
                      {line.machines} / {line.maxMachines}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">الجودة المتوقعة</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{line.qualityScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">الكهرباء</span>
                    <span className="font-extrabold text-sky-400 text-sm">{line.machines * 45} ج.م/يوم</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="font-bold text-slate-300">استهلاك الدورة الواحدة: </span>
                  {Object.entries(prod.recipe).map(([k, q]) => (
                    <span key={k} className="inline-block ml-2">
                      {RAW_MATERIALS[k as RawMaterialKey].name} ({(q || 0) * line.machines})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
                {line.isBroken ? (
                  <button
                    onClick={() => repairLine(line.id)}
                    disabled={cash < 1800}
                    className="flex-1 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                  >
                    <Wrench className="w-4 h-4" />
                    إصلاح العطل (1,800 ج.م)
                  </button>
                ) : (
                  <button
                    onClick={() => toggleLineActive(line.id)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    {line.active ? <PauseCircle className="w-4 h-4 text-amber-400" /> : <PlayCircle className="w-4 h-4 text-emerald-400" />}
                    {line.active ? 'إيقاف' : 'تشغيل'}
                  </button>
                )}

                <button
                  onClick={() => upgradeLineMachines(line.id)}
                  disabled={cash < machineCost || line.machines >= line.maxMachines}
                  className="flex-1 py-2 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-xl transition"
                >
                  + إضافة ماكينة ({machineCost.toLocaleString()} ج.م)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
