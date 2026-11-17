import React from 'react';
import { Award, UserMinus, UserPlus, Users } from 'lucide-react';
import { EMPLOYEE_ROLES } from '../../data/gameCatalog';
import { useGameStore } from '../../store/useGameStore';
import { EmployeeRole } from '../../types/game';

export const HrTab: React.FC = () => {
  const {
    factories,
    activeFactoryId,
    employees,
    cash,
    hireEmployee,
    trainEmployee,
    transferEmployee,
    fireEmployee,
  } = useGameStore();

  const factory = factories.find((f) => f.id === activeFactoryId) || factories[0];
  const facEmployees = employees.filter((e) => e.factoryId === factory.id);
  const roleKeys = Object.keys(EMPLOYEE_ROLES) as EmployeeRole[];

  return (
    <div className="space-y-4 pb-4">

      {/* مكتب التوظيف */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base font-black text-white">مكتب التوظيف</h2>
            <p className="text-xs text-slate-400 mt-1">{factory.name}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-6 mb-3">
          اختار التخصص المناسب لتطوير الإنتاج والجودة وتقليل الأعطال والمصروفات.
        </p>

        <div className="grid grid-cols-1 gap-2">
          {roleKeys.map((role) => {
            const info = EMPLOYEE_ROLES[role];

            return (
              <div
                key={role}
                className="bg-slate-800/70 border border-slate-700 rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-white">{info.name}</h3>
                  <span className="text-xs text-rose-400 font-bold shrink-0">
                    {info.baseSalary.toLocaleString()} ج.م/يوم
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-5">
                  {info.impactDesc}
                </p>

                <button
                  onClick={() => hireEmployee(factory.id, role)}
                  disabled={cash < info.hireCost}
                  className="mt-3 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-sm rounded-xl transition"
                >
                  تعيين موظف • {info.hireCost.toLocaleString()} ج.م
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* طاقم العمل */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="font-extrabold text-base text-white">طاقم العمل الحالي</h3>
            <p className="text-xs text-slate-400 mt-1">
              {facEmployees.length} موظف في {factory.name}
            </p>
          </div>
        </div>

        {facEmployees.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            لا يوجد موظفون في هذا المصنع حالياً
          </div>
        ) : (
          <div className="space-y-3">
            {facEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white">{emp.name}</h4>
                    <p className="text-xs text-amber-400 font-bold mt-1">
                      {EMPLOYEE_ROLES[emp.role].name} • مستوى {emp.level}
                    </p>
                  </div>

                  <span className="text-xs bg-slate-900 px-2 py-2 rounded-lg text-rose-400 font-bold shrink-0">
                    {emp.salary.toLocaleString()} ج.م/يوم
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 p-3 rounded-xl">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">الكفاءة</span>
                    <span className="font-black text-emerald-400">{emp.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">السرعة</span>
                    <span className="font-black text-sky-400">{emp.speed}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">الولاء</span>
                    <span className="font-black text-purple-400">{emp.loyalty}%</span>
                  </div>
                </div>

                <button
                  onClick={() => trainEmployee(emp.id)}
                  disabled={cash < 1500}
                  className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-emerald-400 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  تدريب وترقية • 1,500 ج.م
                </button>

                {factories.length > 1 && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      نقل الموظف إلى مصنع آخر
                    </label>
                    <select
                      value={emp.factoryId}
                      onChange={(e) => transferEmployee(emp.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white"
                    >
                      {factories.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => fireEmployee(emp.id)}
                  title="فصل الموظف"
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  فصل الموظف
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
