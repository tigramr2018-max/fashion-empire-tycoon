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
    <div className="space-y-4 pb-4">

      {priceMultiplier > 1 && (
        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-200 p-3 rounded-xl text-xs font-bold leading-6">
          تنبيه السوق: أسعار الخامات مرتفعة حالياً بنسبة {Math.round((priceMultiplier - 1) * 100)}% بسبب تقلبات الشحن العالمي.
        </div>
      )}

      {/* مخزن الخامات */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base font-black text-white">مخزن الخامات والموردين</h2>
            <p className="text-xs text-slate-400 mt-1">{factory.name}</p>
          </div>
        </div>

        <div className="space-y-3">
          {rawKeys.map((key) => {
            const info = RAW_MATERIALS[key];
            const stock = factory.rawInventory[key];
            const reorder = factory.reorderLevels[key];
            const unitPrice = Math.round(info.basePrice * priceMultiplier);
            const isLow = stock <= reorder;

            return (
              <div key={key} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white">{info.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">المورد: {info.supplier}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    isLow
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {stock} {info.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/70 rounded-lg p-2">
                    <p className="text-[11px] text-slate-400 mb-1">حد إعادة الطلب</p>
                    <input
                      type="number"
                      min={0}
                      value={reorder}
                      onChange={(e) => setReorderLevel(factory.id, key, Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="bg-slate-900/70 rounded-lg p-2">
                    <p className="text-[11px] text-slate-400 mb-1">سعر الوحدة</p>
                    <p className="font-black text-amber-300 text-sm">{unitPrice.toLocaleString()} ج.م</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-2">شراء فوري</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[25, 100, 300].map((qty) => {
                      const cost = unitPrice * qty;
                      return (
                        <button
                          key={qty}
                          onClick={() => buyRawMaterial(factory.id, key, qty)}
                          disabled={cash < cost}
                          className="bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-white text-xs font-bold rounded-lg py-2 transition"
                        >
                          +{qty}
                          <span className="block text-[10px] mt-1 opacity-80">
                            {cost.toLocaleString()} ج.م
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* نقل المخزون */}
      {otherFactories.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-base text-white">نقل الخامات بين المصانع</h3>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">الخامة المراد نقلها</label>
            <select
              value={transferMat}
              onChange={(e) => setTransferMat(e.target.value as RawMaterialKey)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white"
            >
              {rawKeys.map((k) => (
                <option key={k} value={k}>
                  {RAW_MATERIALS[k].name} (متوفر: {factory.rawInventory[k]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">الكمية</label>
            <input
              type="number"
              min={1}
              value={transferQty}
              onChange={(e) => setTransferQty(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">المصنع المستلم</label>
            <select
              value={transferTo || otherFactories[0]?.id}
              onChange={(e) => setTransferTo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white"
            >
              {otherFactories.map((f) => (
                <option key={f.id} value={f.id}>إلى: {f.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              transferStock(factory.id, transferTo || otherFactories[0].id, transferMat, transferQty)
            }
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl py-3"
          >
            تنفيذ النقل اللوجستي
          </button>
        </section>
      )}

      {/* المنتجات النهائية */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-base text-white">جرد المنتجات النهائية</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {productKeys.map((pk) => {
            const item = factory.finishedInventory[pk];

            return (
              <div key={pk} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                <div className="font-bold text-sm text-white leading-5">
                  {PRODUCTS[pk].name}
                </div>
                <div className="text-lg font-black text-emerald-400 mt-2">
                  {item.qty.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">قطعة</div>
                <div className="text-xs text-slate-400 mt-2">
                  متوسط الجودة: <span className="text-white font-bold">{item.quality}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
