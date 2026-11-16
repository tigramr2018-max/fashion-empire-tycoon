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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">الأسواق المحلية وعقود التصدير العالمية</h2>
          <p className="text-xs text-slate-400">
            يتم الشحن من مخزن المنتجات النهائية في: <strong className="text-amber-400">{factory.name}</strong>
          </p>
        </div>

        <button
          onClick={refreshOrders}
          disabled={cash < 500}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث عروض العملاء (500 ج.م)
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-sm font-bold ${
            feedback.ok
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <div
              key={order.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between ${
                order.isUrgent ? 'border-amber-500/50' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-sky-400" />
                    <span className="font-extrabold text-white">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {order.isUrgent && (
                      <span className="text-[11px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                        طلب مستعجل
                      </span>
                    )}
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                      متبقي {order.deadlineDays} أيام
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mb-3">العميل: {order.clientName}</div>

                <div className="bg-slate-950/70 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 block">المنتج المطلوب</span>
                    <span className="font-bold text-white text-sm">
                      {order.quantity} × {product.name}
                    </span>
                    <span className={`block mt-0.5 ${hasQty ? 'text-emerald-400' : 'text-rose-400'}`}>
                      المتوفر بالمخزن: {stock.qty} قطعة
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">الجودة المطلوبة</span>
                    <span className="font-bold text-amber-300 text-sm">{order.minQuality}% كحد أدنى</span>
                    <span className={`block mt-0.5 ${hasQual ? 'text-emerald-400' : 'text-rose-400'}`}>
                      جودة مخزونك: {stock.quality}%
                    </span>
                  </div>
                </div>

                {/* اختيار وسيلة الشحن */}
                <div className="flex items-center gap-2 mb-3">
                  {(
                    [
                      { id: 'land', label: 'شحن بري', icon: <Truck className="w-3.5 h-3.5" /> },
                      { id: 'sea', label: 'شحن بحري', icon: <Ship className="w-3.5 h-3.5" /> },
                      { id: 'air', label: 'شحن جوي', icon: <Plane className="w-3.5 h-3.5" /> },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setShippingMethods({ ...shippingMethods, [order.id]: m.id })}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border transition ${
                        method === m.id
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <span>إجمالي العقد: {gross.toLocaleString()} ج.م</span>
                  <span>
                    شحن وضرائب: -{(shippingCost + tax).toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleShip(order.id)}
                disabled={!hasQty || !hasQual}
                className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm rounded-xl transition"
              >
                {hasQty && hasQual
                  ? `تنفيذ الشحن وتحصيل صافي +${net.toLocaleString()} ج.م`
                  : 'المخزون أو الجودة غير جاهزين للشحن'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
