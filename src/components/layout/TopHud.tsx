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
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* الهوية واختيار المصنع */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow">
            <FactoryIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white">{companyName}</h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                مستوى {level}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={activeFactoryId}
                onChange={(e) => setActiveFactory(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
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

        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 flex-1 max-w-2xl">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>رصيد الشركة</span>
            </div>
            <div className={`font-extrabold text-sm sm:text-base ${cash < 10000 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {cash.toLocaleString()} ج.م
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>الإيرادات / المصروفات</span>
            </div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-2">
              <span className="text-sky-400">+{stats.totalRevenue.toLocaleString()}</span>
              <span className="text-rose-400 flex items-center">
                <TrendingDown className="w-3 h-3 ml-0.5" />
                {stats.totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>المصانع والطاقم</span>
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-200 mt-0.5">
              {factories.length} مصنع • {employees.length} موظف
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> السمعة {reputation}%
              </span>
              <span>{xpPercent}% XP</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* التحكم بالزمن */}
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
          <div className="text-xs pl-2 border-l border-slate-700">
            <div className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>اليوم {day}</span>
            </div>
            <div className="font-bold text-slate-200">{String(hour).padStart(2, '0')}:00</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSpeed(0)}
              title="إيقاف مؤقت"
              className={`p-1.5 rounded-lg transition ${
                speed === 0 ? 'bg-rose-500 text-white' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSpeed(1)}
              title="سرعة عادية 1x"
              className={`p-1.5 rounded-lg transition ${
                speed === 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSpeed(2)}
              title="سرعة مضاعفة 2x"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                speed === 2 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              title="سرعة فائقة 4x"
              className={`p-1.5 rounded-lg transition flex items-center gap-0.5 text-xs font-bold ${
                speed === 4 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              4x
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
