import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Landmark } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const FinanceTab: React.FC = () => {
  const { cash, loans, financialLogs, stats, takeLoan, repayLoan } = useGameStore();

  const netProfit = stats.totalRevenue - stats.totalExpenses;

  const bankOffers = [
    { bank: 'بنك التنمية الصناعية', amount: 50000, rate: 0.1 },
    { bank: 'البنك التجاري الدولي', amount: 150000, rate: 0.14 },
    { bank: 'صندوق التمويل العالمي', amount: 400000, rate: 0.18 },
  ];

  return (
    <div className="space-y-6">
      {/* ملخص الأرباح والخسائر */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">إجمالي الإيرادات</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            +{stats.totalRevenue.toLocaleString()} ج.م
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">إجمالي المصروفات التشغيلية</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            -{stats.totalExpenses.toLocaleString()} ج.م
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">صافي الأرباح / الخسائر</span>
          <div className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {netProfit >= 0 ? '+' : ''}
            {netProfit.toLocaleString()} ج.م
          </div>
        </div>
      </div>

      {/* القروض البنكية */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">التسهيلات الائتمانية والقروض البنكية</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {bankOffers.map((offer) => (
            <div key={offer.bank} className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <div className="font-bold text-white">{offer.bank}</div>
              <div className="text-xl font-black text-emerald-400 my-1">
                {offer.amount.toLocaleString()} ج.م
              </div>
              <div className="text-xs text-slate-400 mb-3">
                الفائدة: {Math.round(offer.rate * 100)}% • السداد على 20 قسط يومي
              </div>
              <button
                onClick={() => takeLoan(offer.bank, offer.amount, offer.rate)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
              >
                الحصول على التمويل
              </button>
            </div>
          ))}
        </div>

        {loans.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-300">القروض القائمة حالياً:</h3>
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs"
              >
                <div>
                  <span className="font-bold text-white">{loan.bankName}</span>
                  <span className="text-slate-400 mr-3">
                    المتبقي: <strong className="text-rose-400">{loan.remaining.toLocaleString()} ج.م</strong> (قسط يومي:{' '}
                    {loan.dailyPayment.toLocaleString()} ج.م)
                  </span>
                </div>
                <button
                  onClick={() => repayLoan(loan.id, loan.remaining)}
                  disabled={cash < loan.remaining}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-emerald-400 font-bold rounded-lg"
                >
                  سداد كامل القرض مبكراً
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* سجل القيود المالية */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="font-extrabold text-lg text-white mb-3">دفتر الأستاذ والتدفقات المالية</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {financialLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between bg-slate-800/50 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2.5">
                {log.type === 'income' ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-200">{log.description}</div>
                  <div className="text-[11px] text-slate-500">اليوم {log.day}</div>
                </div>
              </div>
              <div className={`font-extrabold ${log.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {log.type === 'income' ? '+' : '-'}
                {log.amount.toLocaleString()} ج.م
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
