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
    <div className="space-y-4 pb-4">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <h2 className="text-base font-black text-white mb-3">
          مصانع الشركة المملوكة ({factories.length})
        </h2>
        <div className="space-y-3">
          {factories.map((f) => {
            const expandCost = f.level * 25000;
            const isCurrent = f.id === activeFactoryId;

            return (
              <article
                key={f.id}
                className={`border rounded-xl p-3 ${
                  isCurrent ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-white">{f.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-5">
                      {f.city}، {f.country}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      المساحة: {f.areaSqm} م² • المستوى {f.level}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveFactory(f.id)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs font-bold ${
                      isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isCurrent ? 'نشط' : 'إدارة'}
                  </button>
                </div>

                <button
                  onClick={() => upgradeFactoryBuilding(f.id)}
                  disabled={cash < expandCost}
                  className="mt-3 w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Expand className="w-4 h-4" />
                  توسعة +250 م² ({expandCost.toLocaleString()} ج.م)
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-black text-white">الاستحواذ على مصانع جديدة</h2>
        </div>
        <div className="space-y-3">
          {FACTORY_TEMPLATES.map((tpl) => {
            const owned = factories.some((f) => f.id === tpl.id);

            return (
              <article key={tpl.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-white text-sm">{tpl.name}</h3>
                  <span className="text-xs bg-slate-900 px-2 py-1 rounded-lg text-sky-400 font-bold shrink-0">
                    {tpl.city}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{tpl.areaSqm} م²</p>
                <p className="text-xs text-emerald-400 mt-2 leading-5">{tpl.bonusDesc}</p>
                <button
                  onClick={() => buyNewFactory(tpl.id)}
                  disabled={owned || cash < tpl.price}
                  className="mt-3 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-black text-xs rounded-xl"
                >
                  {owned ? 'مملوك للشركة بالفعل' : `شراء المصنع (${tpl.price.toLocaleString()} ج.م)`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-black text-white">الحفظ والمزامنة السحابية</h2>
        </div>

        <p className="text-xs text-slate-400 mb-3 leading-6">
          يتم حفظ تقدمك تلقائياً في المتصفح كل ثانية.
          <br />
          معرف اللاعب: <code className="text-amber-300 break-all">{playerKey}</code>
          <br />
          حالة Supabase:{' '}
          <span className={isSupabaseConfigured ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isSupabaseConfigured ? 'متصل' : 'وضع الحفظ المحلي'}
          </span>
        </p>

        {cloudMsg && (
          <div className="mb-3 text-xs bg-slate-800 text-sky-300 p-3 rounded-xl leading-5">
            {cloudMsg}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleCloudSync}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            مزامنة مع Supabase
          </button>

          <button
            onClick={handleCloudLoad}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            استعادة من السحابة
          </button>

          <button
            onClick={handleExportJson}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
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
            className="w-full py-3 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            بدء لعبة جديدة
          </button>
        </div>
      </section>
    </div>
  );
};
