import React, { useState } from 'react';
import { ArrowLeftRight, Package, ShoppingCart } from 'lucide-react';
import { PRODUCTS, RAW_MATERIALS } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { ProductKey, RawMaterialKey } from '../../types/game';

export const WarehousesTab: React.FC = () => {
  const {
    factories,
    activeFactoryId,
    cash,
    priceMultiplier,
    buyRawMaterial,
    setReorderLevel,
    transferStock,
  } = useGameStore();

  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];
  const rawKeys = Object.keys(RAW_MATERIALS) as RawMaterialKey[];
  const productKeys = Object.keys(PRODUCTS) as ProductKey[];

  const [transferTo, setTransferTo] = useState<string>('');
  const [transferMat, setTransferMat] = useState<RawMaterialKey>('cotton');
  const [transferQty, setTransferQty] = useState<number>(20);

  const otherFactories = factories.filter((f) => f.id !== factory.id);

  return (
    <div className="space-y-6">
      {/* تنبيه التضخم إن وجد */}
      {priceMultiplier > 1 && (
        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-2xl text-xs font-bold">
          تنبيه السوق: أسعار الخامات مرتفعة حالياً بنسبة {Math.round((priceMultiplier - 1) * 100)}% بسبب تقلبات الشحن العالمي.
        </div>
      )}

      {/* مخزن الخامات والمشتريات */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">مخزن الخامات والموردين ({factory.name})</h2>
          </div>
        </div>

        <table className="w-full text-right text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs">
              <th className="py-3 px-2">الخامة</th>
              <th className="py-3 px-2">المورد</th>
              <th className="py-3 px-2">المخزون الحالي</th>
              <th className="py-3 px-2">حد إعادة الطلب</th>
              <th className="py-3 px-2">سعر الوحدة</th>
              <th className="py-3 px-2">شراء فوري</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {rawKeys.map((key) => {
              const info = RAW_MATERIALS[key];
              const stock = factory.rawInventory[key];
              const reorder = factory.reorderLevels[key];
              const unitPrice = Math.round(info.basePrice * priceMultiplier);
              const isLow = stock <= reorder;

              return (
                <tr key={key} className="hover:bg-slate-800/30">
                  <td className="py-3 px-2 font-bold text-white">{info.name}</td>
                  <td className="py-3 px-2 text-xs text-slate-400">{info.supplier}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`font-extrabold px-2.5 py-0.5 rounded-full text-xs ${
                        isLow ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {stock} {info.unit}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min={0}
                      value={reorder}
                      onChange={(e) => setReorderLevel(factory.id, key, Number(e.target.value))}
                      className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </td>
                  <td className="py-3 px-2 font-bold text-amber-300">{unitPrice} ج.م</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5">
                      {[25, 100, 300].map((qty) => {
                        const cost = unitPrice * qty;
                        return (
                          <button
                            key={qty}
                            onClick={() => buyRawMaterial(factory.id, key, qty)}
                            disabled={cash < cost}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-xs font-bold rounded-lg transition"
                          >
                            +{qty} ({cost.toLocaleString()})
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* نقل المخزون بين المصانع */}
      {otherFactories.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeftRight className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-base text-white">نقل الخامات بين مصانع الشركة</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={transferMat}
              onChange={(e) => setTransferMat(e.target.value as RawMaterialKey)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {rawKeys.map((k) => (
                <option key={k} value={k}>
                  {RAW_MATERIALS[k].name} (متوفر: {factory.rawInventory[k]})
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={transferQty}
              onChange={(e) => setTransferQty(Number(e.target.value))}
              className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />

            <select
              value={transferTo || otherFactories[0]?.id}
              onChange={(e) => setTransferTo(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {otherFactories.map((f) => (
                <option key={f.id} value={f.id}>
                  إلى: {f.name}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                transferStock(factory.id, transferTo || otherFactories[0].id, transferMat, transferQty)
              }
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              تنفيذ النقل اللوجستي
            </button>
          </div>
        </div>
      )}

      {/* جرد مخزن المنتجات النهائية */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-lg text-white">جرد مخزن المنتجات النهائية</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {productKeys.map((pk) => {
            const item = factory.finishedInventory[pk];
            return (
              <div key={pk} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5">
                <div className="font-bold text-sm text-white">{PRODUCTS[pk].name}</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{item.qty} قطعة</div>
                <div className="text-xs text-slate-400 mt-1">متوسط الجودة: {item.quality}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
