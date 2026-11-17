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
    <div className="space-y-4 pb-4">
      <header>
        <h2 className="text-lg font-black text-white">الأقسام الصناعية المترابطة الـ 13</h2>
        <p className="text-xs text-slate-400 mt-2 leading-6">
          تنتقل المنتجات تلقائياً عبر الأقسام حسب وصفة التصنيع. تطوير الأقسام يرفع السعة والجودة ويقلل الهالك.
        </p>
      </header>

      <section className="bg-gradient-to-l from-sky-950/60 to-slate-900 border border-sky-500/30 rounded-2xl p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-base text-white">إدارة المغاسل الصناعية</h3>
            <p className="text-xs text-slate-300 mt-1">الجينز والجواكت</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-950/50 rounded-lg p-2 text-xs">
            <span className="text-slate-400 block">عدد الغسالات</span>
            <strong className="text-sky-300">{laundry.washMachines || 2}</strong>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2 text-xs">
            <span className="text-slate-400 block">استهلاك المياه</span>
            <strong className="text-sky-300">{laundry.waterConsumption || 150} لتر/دورة</strong>
          </div>
          <div className="col-span-2 bg-slate-950/50 rounded-lg p-2 text-xs">
            <span className="text-slate-400">السعة: </span>
            <strong className="text-emerald-400">{laundry.capacity} قطعة</strong>
          </div>
        </div>

        <button
          onClick={() => upgradeLaundryMachine(factory.id)}
          disabled={cash < 4500}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
        >
          <Droplets className="w-4 h-4" />
          إضافة غسالة صناعية (4,500 ج.م)
        </button>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {([
            { id: 'normal', label: 'غسيل عادي', desc: 'استهلاك قياسي' },
            { id: 'stone', label: 'غسيل حجري (Stone)', desc: 'مظهر جينز عصري' },
            { id: 'enzyme', label: 'غسيل إنزيمي', desc: 'نعومة فائقة للأنسجة' },
            { id: 'acid', label: 'غسيل حمضي (Acid)', desc: 'تأثيرات فاخرة للتصدير' },
          ] as const).map((wt) => {
            const active = (laundry.washType || 'normal') === wt.id;
            return (
              <button
                key={wt.id}
                onClick={() => upgradeLaundryMachine(factory.id, wt.id)}
                disabled={active || cash < 1500}
                className={`p-3 rounded-xl border text-right transition ${
                  active ? 'bg-sky-500/20 border-sky-400 text-white' : 'bg-slate-900/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{wt.label}</div>
                <div className="text-[11px] text-slate-400 mt-1">{wt.desc}</div>
                <div className="text-[11px] text-sky-400 mt-2 font-bold">
                  {active ? 'مُفعّل حالياً' : 'تبديل (1,500 ج.م)'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="space-y-3">
        {deptKeys.map((key, idx) => {
          const info = DEPARTMENTS_INFO[key];
          const state = factory.departments[key];
          const upgradeCost = Math.round(info.baseUpgradeCost * Math.pow(1.45, state.level - 1));

          return (
            <article key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  المرحلة {idx + 1} • مستوى {state.level}
                </span>
                <Factory className="w-4 h-4 text-slate-500" />
              </div>
              <h3 className="font-extrabold text-base text-white">{info.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-5">{info.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-950/60 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">السعة التشغيلية</span>
                  <span className="font-bold text-emerald-400">{state.capacity} وحدة/يوم</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">تكلفة التشغيل</span>
                  <span className="font-bold text-rose-400">{state.operatingCost.toLocaleString()} ج.م/يوم</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                المسؤول المؤثر: <span className="text-slate-200">{EMPLOYEE_ROLES[info.roleBonus].name}</span>
              </p>
              <button
                onClick={() => upgradeDepartment(factory.id, key)}
                disabled={cash < upgradeCost}
                className="mt-3 w-full py-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40 text-amber-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowUpCircle className="w-4 h-4" />
                تطوير القسم ({upgradeCost.toLocaleString()} ج.م)
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
