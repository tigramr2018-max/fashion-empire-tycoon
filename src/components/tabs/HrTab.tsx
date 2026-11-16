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
    <div className="space-y-6">
      {/* مكتب التوظيف */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">مكتب التوظيف واستقطاب الكفاءات ({factory.name})</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          كل تخصص يؤثر بشكل مباشر وحسابي على سرعة خطوط الإنتاج، الجودة، تقليل الأعطال، أو خفض المصروفات.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {roleKeys.map((role) => {
            const info = EMPLOYEE_ROLES[role];
            return (
              <div key={role} className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{info.name}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{info.impactDesc}</p>
                  <div className="text-xs text-slate-300 mt-2">
                    الراتب: <span className="text-rose-400 font-bold">{info.baseSalary} ج.م/يوم</span>
                  </div>
                </div>

                <button
                  onClick={() => hireEmployee(factory.id, role)}
                  disabled={cash < info.hireCost}
                  className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  تعيين ({info.hireCost.toLocaleString()} ج.م)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* قائمة موظفي المصنع */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-sky-400" />
          <h3 className="font-extrabold text-lg text-white">طاقم العمل الحالي ({facEmployees.length} موظف)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {facEmployees.map((emp) => (
            <div key={emp.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-white">{emp.name}</div>
                  <div className="text-xs text-amber-400 font-bold">
                    {EMPLOYEE_ROLES[emp.role].name} • مستوى {emp.level}
                  </div>
                </div>
                <span className="text-xs bg-slate-900 px-2.5 py-1 rounded-lg text-rose-400 font-bold">
                  {emp.salary} ج.م/يوم
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center bg-slate-950/60 p-2 rounded-lg text-xs">
                <div>
                  <span className="text-slate-400 block">الكفاءة</span>
                  <span className="font-bold text-emerald-400">{emp.efficiency}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">السرعة</span>
                  <span className="font-bold text-sky-400">{emp.speed}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">الولاء</span>
                  <span className="font-bold text-purple-400">{emp.loyalty}%</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onClick={() => trainEmployee(emp.id)}
                  disabled={cash < 1500}
                  className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40 text-emerald-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  تدريب وترقية (1,500)
                </button>

                {factories.length > 1 && (
                  <select
                    value={emp.factoryId}
                    onChange={(e) => transferEmployee(emp.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200"
                  >
                    {factories.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.city}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => fireEmployee(emp.id)}
                  title="فصل الموظف"
                  className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
