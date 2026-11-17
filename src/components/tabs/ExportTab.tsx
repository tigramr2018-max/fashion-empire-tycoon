import React, { useState } from 'react';
import { Globe2, Plane, RefreshCw, Ship, Truck } from 'lucide-react';
import { COUNTRIES, PRODUCTS } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { ShippingMethod } from '../../types/game';

export const ExportTab: React.FC = () => {
  const { factories, activeFactoryId, orders, cash, shipOrder, refreshOrders } = useGameStore();
  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];

  const [shippingMethods, setShippingMethods] = useState<Record<string, ShippingMethod>>({});
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  const handleShip = (orderId: string) => {
    const method = shippingMethods[orderId] || 'land';
    const res = shipOrder(orderId, factory.id, method);
    setFeedback({ text: res.msg, ok: res.ok });
  };

  return (
    <div className="space-y-4 pb-4">
      <header className="space-y-3">
        <div>
          <h2 className="text-lg font-black text-white">الأسواق المحلية وعقود التصدير</h2>
          <p className="text-xs text-slate-400 mt-2">
            الشحن من مخزن المنتجات النهائية في: <strong className="text-amber-400">{factory.name}</strong>
          </p>
        </div>
        <button
          onClick={refreshOrders}
          disabled={cash < 500}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث عروض العملاء (500 ج.م)
        </button>
      </header>

      {feedback && (
        <div className={`p-3 rounded-xl border text-sm font-bold leading-6 ${
          feedback.ok
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {orders.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-sm text-slate-400">
          لا توجد طلبات متاحة حالياً. يمكنك تحديث عروض العملاء.
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const country = COUNTRIES[order.countryKey];
          const product = PRODUCTS[order.productKey];
          const stock = factory.finishedInventory[order.productKey];
          const method = shippingMethods[order.id] || (order.countryKey === 'egypt' ? 'land' : 'sea');
          const methodMult = method === 'land' ? 1.0 : method === 'sea' ? 1.35 : 2.2;
          const shippingCost = Math.round(country.baseShipping * methodMult);
          const gross = order.quantity * order.unitPrice;
          const tax = Math.round(gross * country.taxRate);
          const net = gross - shippingCost - tax;
          const hasQty = stock.qty >= order.quantity;
          const hasQual = stock.quality >= order.minQuality;

          return (
            <article
              key={order.id}
              className={`bg-slate-900 border rounded-2xl p-3 ${
                order.isUrgent ? 'border-amber-500/50' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Globe2 className="w-5 h-5 text-sky-400 shrink-0" />
                  <span className="font-extrabold text-white text-sm">{country.name}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {order.isUrgent && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-1 rounded-full">طلب مستعجل</span>
                  )}
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full">
                    متبقي {order.deadlineDays} أيام
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-3">العميل: {order.clientName}</div>

              <div className="bg-slate-950/70 rounded-xl p-3 grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="min-w-0">
                  <span className="text-slate-400 block mb-1">المنتج المطلوب</span>
                  <span className="font-bold text-white leading-5">{order.quantity} × {product.name}</span>
                  <span className={`block mt-2 ${hasQty ? 'text-emerald-400' : 'text-rose-400'}`}>
                    المتوفر: {stock.qty} قطعة
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-slate-400 block mb-1">الجودة المطلوبة</span>
                  <span className="font-bold text-amber-300">{order.minQuality}% كحد أدنى</span>
                  <span className={`block mt-2 ${hasQual ? 'text-emerald-400' : 'text-rose-400'}`}>
                    جودة المخزون: {stock.quality}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-2">اختيار وسيلة الشحن</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {([
                  { id: 'land', label: 'بري', icon: <Truck className="w-4 h-4" /> },
                  { id: 'sea', label: 'بحري', icon: <Ship className="w-4 h-4" /> },
                  { id: 'air', label: 'جوي', icon: <Plane className="w-4 h-4" /> },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setShippingMethods({ ...shippingMethods, [order.id]: m.id })}
                    className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                      method === m.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {m.icon}
                    شحن {m.label}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950/50 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2 text-slate-400">
                  <span>إجمالي العقد</span>
                  <span className="text-white font-bold">{gross.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between gap-2 text-slate-400">
                  <span>تكلفة الشحن والضرائب</span>
                  <span className="text-rose-400 font-bold">-{(shippingCost + tax).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-slate-800 pt-2">
                  <span className="text-slate-300">صافي العقد</span>
                  <span className="text-emerald-400 font-black">{net.toLocaleString()} ج.م</span>
                </div>
              </div>

              <button
                onClick={() => handleShip(order.id)}
                disabled={!hasQty || !hasQual}
                className="mt-3 w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm rounded-xl transition"
              >
                {hasQty && hasQual
                  ? `تنفيذ الشحن وتحصيل +${net.toLocaleString()} ج.م`
                  : 'المخزون أو الجودة غير جاهزين للشحن'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
