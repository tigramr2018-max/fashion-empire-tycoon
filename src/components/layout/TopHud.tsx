import React from 'react';
import {
  Building2,
  Coins,
  Factory as FactoryIcon,
  Pause,
  Play,
  FastForward,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const TopHud: React.FC = () => {
  const {
    companyName,
    cash,
    level,
    xp,
    reputation,
    day,
    hour,
    speed,
    setSpeed,
    factories,
    employees,
    activeFactoryId,
    setActiveFactory,
    stats,
  } = useGameStore();

  const nextLevelXp = level * 600;
  const xpPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <header className="shrink-0 z-30 bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="w-full p-2 space-y-2">

        {/* هوية الشركة */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950">
              <FactoryIcon size={21} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm text-white truncate">
                  {companyName}
                </h1>
                <span className="text-[10px] shrink-0 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  مستوى {level}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Building2 size={12} className="text-slate-400 shrink-0" />
                <select
                  value={activeFactoryId}
                  onChange={(e) => setActiveFactory(e.target.value)}
                  className="max-w-[190px] bg-slate-800 text-slate-200 text-[11px] rounded-md px-2 py-1 border border-slate-700"
                >
                  {factories.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* الوقت والتحكم */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl p-1.5 shrink-0">
            <div className="text-center px-1 border-l border-slate-700">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock size={11} className="text-amber-400" />
                يوم {day}
              </div>
              <div className="text-xs font-bold text-white">
                {String(hour).padStart(2, '0')}:00
              </div>
            </div>
            <button onClick={() => setSpeed(0)} className={`p-2 rounded-lg ${speed === 0 ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>
              <Pause size={15} />
            </button>
            <button onClick={() => setSpeed(1)} className={`p-2 rounded-lg ${speed === 1 ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
              <Play size={15} />
            </button>
            <button onClick={() => setSpeed(2)} className={`px-2 py-2 rounded-lg text-xs font-bold ${speed === 2 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>
              2x
            </button>
            <button onClick={() => setSpeed(4)} className={`px-2 py-2 rounded-lg text-xs font-bold ${speed === 4 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>
              4x
            </button>
          </div>
        </div>

        {/* مؤشرات الشركة */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Coins size={13} className="text-emerald-400" />
              رصيد الشركة
            </div>
            <div className={`font-extrabold text-sm mt-1 ${cash < 10000 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {cash.toLocaleString()} ج.م
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <TrendingUp size={13} className="text-sky-400" />
              الإيرادات والمصروفات
            </div>
            <div className="text-xs font-bold mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-sky-400">+{stats.totalRevenue.toLocaleString()}</span>
              <span className="text-rose-400 flex items-center">
                <TrendingDown size={11} />
                {stats.totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Users size={13} className="text-purple-400" />
              المصانع والموظفين
            </div>
            <div className="text-xs font-bold text-slate-200 mt-1">
              {factories.length} مصنع • {employees.length} موظف
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-400" />
                السمعة {reputation}%
              </span>
              <span>{xpPercent}% XP</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
