import React from 'react';
import { ArrowUpCircle, Droplets, Factory, Waves } from 'lucide-react';
import { DEPARTMENTS_INFO, EMPLOYEE_ROLES } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { DepartmentKey } from '../../types/game';

export const DepartmentsTab: React.FC = () => {
  const { factories, activeFactoryId, cash, upgradeDepartment, upgradeLaundryMachine } = useGameStore();
  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];

  const deptKeys = Object.keys(DEPARTMENTS_INFO) as DepartmentKey[];
  const laundry = factory.departments.laundry;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">الأقسام الصناعية المترابطة الـ 13</h2>
          <p className="text-sm text-slate-400">
            تنتقل المنتجات تلقائياً عبر الأقسام حسب وصفة التصنيع. تطوير الأقسام يرفع السعة والجودة ويقلل الهالك.
          </p>
        </div>
      </div>

      {/* قسم المغاسل الصناعية المتخصص */}
      <div className="bg-gradient-to-l from-sky-950/60 to-slate-900 border border-sky-500/30 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">إدارة المغاسل الصناعية (الجينز والجواكت)</h3>
              <p className="text-xs text-slate-300">
                عدد الغسالات: <strong className="text-sky-300">{laundry.washMachines || 2}</strong> • استهلاك المياه:{' '}
                <strong className="text-sky-300">{laundry.waterConsumption || 150} لتر/دورة</strong> • السعة:{' '}
                <strong className="text-emerald-400">{laundry.capacity} قطعة</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => upgradeLaundryMachine(factory.id)}
            disabled={cash < 4500}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Droplets className="w-4 h-4" />
            إضافة غسالة صناعية (4,500 ج.م)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { id: 'normal', label: 'غسيل عادي', desc: 'استهلاك قياسي' },
              { id: 'stone', label: 'غسيل حجري (Stone)', desc: 'مظهر جينز عصري' },
              { id: 'enzyme', label: 'غسيل إنزيمي', desc: 'نعومة فائقة للأنسجة' },
              { id: 'acid', label: 'غسيل حمضي (Acid)', desc: 'تأثيرات فاخرة للتصدير' },
            ] as const
          ).map((wt) => {
            const active = (laundry.washType || 'normal') === wt.id;
            return (
              <button
                key={wt.id}
                onClick={() => upgradeLaundryMachine(factory.id, wt.id)}
                disabled={active || cash < 1500}
                className={`p-3 rounded-xl border text-right transition ${
                  active
                    ? 'bg-sky-500/20 border-sky-400 text-white'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-sky-500/50'
                }`}
              >
                <div className="font-bold text-xs">{wt.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{wt.desc}</div>
                <div className="text-[11px] text-sky-400 mt-1 font-bold">
                  {active ? 'مُفعّل حالياً' : 'تبديل (1,500 ج.م)'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* شبكة الأقسام الـ 13 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deptKeys.map((key, idx) => {
          const info = DEPARTMENTS_INFO[key];
          const state = factory.departments[key];
          const upgradeCost = Math.round(info.baseUpgradeCost * Math.pow(1.45, state.level - 1));

          return (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    المرحلة {idx + 1} • مستوى {state.level}
                  </span>
                  <Factory className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-extrabold text-base text-white">{info.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{info.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-950/60 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block">السعة التشغيلية</span>
                    <span className="font-bold text-emerald-400">{state.capacity} وحدة/يوم</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">تكلفة التشغيل</span>
                    <span className="font-bold text-rose-400">{state.operatingCost} ج.م/يوم</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  المسؤول المؤثر: <span className="text-slate-200">{EMPLOYEE_ROLES[info.roleBonus].name}</span>
                </div>
              </div>

              <button
                onClick={() => upgradeDepartment(factory.id, key)}
                disabled={cash < upgradeCost}
                className="mt-4 w-full py-2 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>تطوير القسم ({upgradeCost.toLocaleString()} ج.م)</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
