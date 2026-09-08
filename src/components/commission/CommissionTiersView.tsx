import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  Percent, 
  Target, 
  Users, 
  BarChart3, 
  Check, 
  X,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommissionTier {
  id: string;
  code: string;
  minAchievement: number;
  maxAchievement: number;
  personalRate: number; // percentage
  teamRate: number; // percentage
}

const initialTiers: CommissionTier[] = [
  { id: '1', code: 'T1', minAchievement: 0, maxAchievement: 100, personalRate: 7, teamRate: 0 },
  { id: '2', code: 'T2', minAchievement: 100, maxAchievement: 150, personalRate: 10, teamRate: 5 },
  { id: '3', code: 'T3', minAchievement: 150, maxAchievement: 200, personalRate: 15, teamRate: 10 },
  { id: '4', code: 'T4', minAchievement: 200, maxAchievement: 250, personalRate: 20, teamRate: 15 },
  { id: '5', code: 'T5', minAchievement: 250, maxAchievement: 300, personalRate: 25, teamRate: 20 },
  { id: '6', code: 'T6', minAchievement: 300, maxAchievement: 999, personalRate: 30, teamRate: 25 },
];

export const CommissionTiersView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tiers, setTiers] = useState<CommissionTier[]>(initialTiers);
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این پله پورسانت اطمینان دارید؟')) {
      setTiers(tiers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Visual Chart Placeholder / Visualization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Award className="w-48 h-48 text-rose-600" />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-600" /> نمودار پلکانی پورسانت فروش
          </h3>
          
          <div className="flex items-end gap-1 h-48 mb-4">
            {tiers.map((t, idx) => (
              <div key={t.id} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="relative w-full flex flex-col gap-1 items-center justify-end h-full">
                  {/* Team Rate Bar */}
                  <div 
                    className="w-full bg-sky-200/50 rounded-t-md transition-all duration-700 group-hover:bg-sky-300/60" 
                    style={{ height: `${t.teamRate * 3}px` }} 
                  />
                  {/* Personal Rate Bar */}
                  <div 
                    className="w-full bg-rose-500/80 rounded-t-md transition-all duration-700 group-hover:bg-rose-600 shadow-xs" 
                    style={{ height: `${t.personalRate * 3}px` }} 
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.personalRate}%
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap">{t.minAchievement}% تا {t.maxAchievement > 300 ? '∞' : t.maxAchievement}%</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded" />
              <span className="text-[10px] font-bold text-slate-600">نرخ پورسانت فردی</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-200 rounded" />
              <span className="text-[10px] font-bold text-slate-600">نرخ پورسانت تیمی (Over-Achievement)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">تعریف پله‌های پورسانت</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">محاسبه بر اساس درصد تحقق تارگت کل</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingTier(null); setShowModal(true); }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> افزودن پله جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-100">کد پله</th>
                <th className="px-6 py-4 border-b border-slate-100">از درصد تحقق</th>
                <th className="px-6 py-4 border-b border-slate-100">تا درصد تحقق</th>
                <th className="px-6 py-4 border-b border-slate-100">نرخ پورسانت فردی</th>
                <th className="px-6 py-4 border-b border-slate-100">نرخ پورسانت تیمی</th>
                <th className="px-6 py-4 border-b border-slate-100 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{tier.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-xs font-mono font-bold text-slate-700">{tier.minAchievement}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">{tier.maxAchievement > 900 ? 'بیشتر از ۳۰۰٪' : `${tier.maxAchievement}%`}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Percent className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-sm font-mono font-bold text-rose-600">{tier.personalRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-sm font-mono font-bold text-sky-600">{tier.teamRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingTier(tier); setShowModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tier.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-amber-50/50 flex items-start gap-3 border-t border-slate-100">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
          <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
            قاعده محاسباتی: پورسانت بر اساس پله‌ای که کل تحقق در آن قرار می‌گیرد محاسبه می‌شود (غیر انباشته). پله‌های پورسانت نباید همپوشانی داشته باشند.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white shadow-2xl rounded-3xl z-50 overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{editingTier ? 'ویرایش پله پورسانت' : 'تعریف پله جدید پورسانت'}</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 mr-1">حداقل درصد تحقق</label>
                    <div className="relative">
                      <Target className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                      <input type="number" defaultValue={editingTier?.minAchievement} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 mr-1">حداکثر درصد تحقق</label>
                    <div className="relative">
                      <Target className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                      <input type="number" defaultValue={editingTier?.maxAchievement} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 mr-1">درصد پورسانت فردی</label>
                    <div className="relative">
                      <Percent className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                      <input type="number" defaultValue={editingTier?.personalRate} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs font-mono text-rose-600 font-bold focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 mr-1">درصد پورسانت تیمی</label>
                    <div className="relative">
                      <Users className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                      <input type="number" defaultValue={editingTier?.teamRate} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs font-mono text-sky-600 font-bold focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all">انصراف</button>
                <button className="flex-[2] py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> ذخیره پله پورسانت
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
