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
    <div className="space-y-4 pb-4">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-xs text-slate-400">إجمالي الإيرادات</span>
          <div className="text-xl font-black text-emerald-400 mt-1">+{stats.totalRevenue.toLocaleString()} ج.م</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-xs text-slate-400">إجمالي المصروفات التشغيلية</span>
          <div className="text-xl font-black text-rose-400 mt-1">-{stats.totalExpenses.toLocaleString()} ج.م</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-xs text-slate-400">صافي الأرباح / الخسائر</span>
          <div className={`text-xl font-black mt-1 ${netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ج.م
          </div>
        </div>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-black text-white">التسهيلات الائتمانية والقروض</h2>
        </div>

        <div className="space-y-3 mb-4">
          {bankOffers.map((offer) => (
            <div key={offer.bank} className="bg-slate-800/70 border border-slate-700 rounded-xl p-3">
              <div className="font-bold text-white text-sm">{offer.bank}</div>
              <div className="text-xl font-black text-emerald-400 my-2">{offer.amount.toLocaleString()} ج.م</div>
              <div className="text-xs text-slate-400 mb-3">
                الفائدة: {Math.round(offer.rate * 100)}% • السداد على 20 قسط يومي
              </div>
              <button
                onClick={() => takeLoan(offer.bank, offer.amount, offer.rate)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl"
              >
                الحصول على التمويل
              </button>
            </div>
          ))}
        </div>

        {loans.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-300">القروض القائمة حالياً</h3>
            {loans.map((loan) => (
              <div key={loan.id} className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-3">
                <div className="font-bold text-white text-sm">{loan.bankName}</div>
                <div className="text-xs text-slate-400 leading-6">
                  المتبقي: <strong className="text-rose-400">{loan.remaining.toLocaleString()} ج.م</strong>
                  <br />
                  القسط اليومي: {loan.dailyPayment.toLocaleString()} ج.م
                </div>
                <button
                  onClick={() => repayLoan(loan.id, loan.remaining)}
                  disabled={cash < loan.remaining}
                  className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-emerald-400 font-bold text-xs rounded-xl"
                >
                  سداد كامل القرض مبكراً
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <h3 className="font-extrabold text-base text-white mb-3">دفتر الأستاذ والتدفقات المالية</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {financialLogs.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-5">لا توجد قيود مالية حتى الآن</p>
          )}
          {financialLogs.map((log) => (
            <div key={log.id} className="flex items-start justify-between gap-2 bg-slate-800/50 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-start gap-2 min-w-0">
                {log.type === 'income' ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                )}
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-200 break-words">{log.description}</div>
                  <div className="text-[11px] text-slate-500 mt-1">اليوم {log.day}</div>
                </div>
              </div>
              <div className={`text-xs font-extrabold text-left shrink-0 ${log.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {log.type === 'income' ? '+' : '-'}{log.amount.toLocaleString()} ج.م
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
