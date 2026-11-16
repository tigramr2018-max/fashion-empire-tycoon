import React, { useState } from 'react';
import { Building2, Cloud, Download, Expand, RotateCcw, Upload } from 'lucide-react';
import { FACTORY_TEMPLATES } from '../../data/gameCatalog';
import { isSupabaseConfigured, loadSaveFromSupabase, syncSaveToSupabase } from '../../lib/supabase';
import { useGameStore } from '../../store/useGameStore';

export const FactoriesSettingsTab: React.FC = () => {
  const state = useGameStore();
  const {
    factories,
    activeFactoryId,
    cash,
    playerKey,
    buyNewFactory,
    upgradeFactoryBuilding,
    setActiveFactory,
    resetGame,
    loadCloudState,
  } = state;

  const [cloudMsg, setCloudMsg] = useState<string>('');

  const handleCloudSync = async () => {
    const { factories: f, lines, employees, cash: c, level, xp, day, stats } = state;
    const res = await syncSaveToSupabase(playerKey, { factories: f, lines, employees, cash: c, level, xp, day, stats });
    setCloudMsg(res.message);
  };

  const handleCloudLoad = async () => {
    const res = await loadSaveFromSupabase(playerKey);
    if (res.data) {
      loadCloudState(res.data);
    }
    setCloudMsg(res.message);
  };

  const handleExportJson = () => {
    const blob = new Blob([localStorage.getItem('fashion-empire-tycoon-save-v1') || '{}'], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fashion-empire-save-day-${state.day}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* مصانع الشركة المملوكة */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-lg font-black text-white mb-4">مصانع الشركة المملوكة ({factories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factories.map((f) => {
            const expandCost = f.level * 25000;
            const isCurrent = f.id === activeFactoryId;
            return (
              <div
                key={f.id}
                className={`border rounded-2xl p-4 ${
                  isCurrent ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white">{f.name}</h3>
                    <div className="text-xs text-slate-400">
                      {f.city}، {f.country} • المساحة: {f.areaSqm} م² • المستوى {f.level}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFactory(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isCurrent ? 'المصنع النشط' : 'إدارة المصنع'}
                  </button>
                </div>

                <button
                  onClick={() => upgradeFactoryBuilding(f.id)}
                  disabled={cash < expandCost}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Expand className="w-4 h-4" />
                  توسعة مبنى المصنع +250 م² ({expandCost.toLocaleString()} ج.م)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* شراء مصانع جديدة عالمياً */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">الاستحواذ على مصانع جديدة والتوسع العالمي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACTORY_TEMPLATES.map((tpl) => {
            const owned = factories.some((f) => f.id === tpl.id);
            return (
              <div key={tpl.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white">{tpl.name}</h3>
                    <span className="text-xs bg-slate-900 px-2.5 py-1 rounded-lg text-sky-400 font-bold">
                      {tpl.city} • {tpl.areaSqm} م²
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 mt-2">{tpl.bonusDesc}</p>
                </div>

                <button
                  onClick={() => buyNewFactory(tpl.id)}
                  disabled={owned || cash < tpl.price}
                  className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-black text-xs rounded-xl transition"
                >
                  {owned ? 'مملوك للشركة بالفعل' : `شراء وافتتاح المصنع (${tpl.price.toLocaleString()} ج.م)`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* نظام الحفظ التلقائي والمزامنة السحابية */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-black text-white">نظام الحفظ التلقائي وقاعدة البيانات</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          يتم حفظ تقدمك تلقائياً في المتصفح كل ثانية. معرف اللاعب: <code className="text-amber-300">{playerKey}</code> •
          حالة Supabase:{' '}
          <span className={isSupabaseConfigured ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isSupabaseConfigured ? 'متصل' : 'وضع الحفظ المحلي'}
          </span>
        </p>

        {cloudMsg && <div className="mb-3 text-xs bg-slate-800 text-sky-300 p-2.5 rounded-xl">{cloudMsg}</div>}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCloudSync}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            مزامنة مع Supabase
          </button>

          <button
            onClick={handleCloudLoad}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            استعادة من السحابة
          </button>

          <button
            onClick={handleExportJson}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            تصدير ملف الحفظ JSON
          </button>

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من بدء شركة جديدة من الصفر؟')) {
                resetGame();
              }
            }}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 mr-auto"
          >
            <RotateCcw className="w-4 h-4" />
            بدء لعبة جديدة
          </button>
        </div>
      </div>
    </div>
  );
};
