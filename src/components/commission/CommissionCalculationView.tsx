import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  ChevronLeft, 
  Eye, 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Info,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculationRecord {
  id: string;
  name: string;
  team: string;
  region: string;
  product: string;
  targetAmount: number;
  achievementAmount: number;
  achievementPercent: number;
  deviation: number;
  tierRate: number;
  responsibilityMultiplier: number;
  regionMultiplier: number;
  productMultiplier: number;
  calculatedCommission: number;
  paidAmount: number;
  balance: number;
}

const mockData: CalculationRecord[] = [
  {
    id: '1',
    name: 'علیرضا حسینی',
    team: 'تیم صنعتی',
    region: 'مناطق شمال',
    product: 'High-Tech',
    targetAmount: 1000000000,
    achievementAmount: 1250000000,
    achievementPercent: 125,
    deviation: 250000000,
    tierRate: 10,
    responsibilityMultiplier: 1.2,
    regionMultiplier: 1.2,
    productMultiplier: 1.3,
    calculatedCommission: 234000000,
    paidAmount: 150000000,
    balance: 84000000
  },
  {
    id: '2',
    name: 'سارا احمدی',
    team: 'تیم صنعتی',
    region: 'مناطق مرکزی',
    product: 'Standard',
    targetAmount: 800000000,
    achievementAmount: 760000000,
    achievementPercent: 95,
    deviation: -40000000,
    tierRate: 7,
    responsibilityMultiplier: 1,
    regionMultiplier: 1,
    productMultiplier: 1,
    calculatedCommission: 53200000,
    paidAmount: 50000000,
    balance: 3200000
  }
];

export const CommissionCalculationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [records, setRecords] = useState<CalculationRecord[]>(mockData);
  const [selectedRecord, setSelectedRecord] = useState<CalculationRecord | null>(null);
  const [currency, setCurrency] = useState('ریال');
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10 relative">
      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 mr-1">دوره زمانی</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
            <option>اردیبهشت ۱۴۰۶</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 mr-1">تیم</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
            <option>همه تیم‌ها</option>
          </select>
        </div>
        <div className="lg:col-span-1 space-y-1.5 relative">
          <label className="text-[10px] font-bold text-slate-500 mr-1">جستجوی کارشناس</label>
          <Search className="absolute right-3 top-8 w-3.5 h-3.5 text-slate-400" />
          <input placeholder="نام کارشناس..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs" />
        </div>
        <button className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" /> محاسبه نهایی پورسانت
        </button>
        <button className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">خروجی لیست پرداخت</button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-800">نتایج محاسبه عملکرد و پورسانت</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">بروزرسانی: لحظاتی پیش</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-4 border-b border-slate-100">کارشناس / تیم</th>
                <th className="px-4 py-4 border-b border-slate-100">تارگت</th>
                <th className="px-4 py-4 border-b border-slate-100">تحقق ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">تحقق (%)</th>
                <th className="px-4 py-4 border-b border-slate-100">ضرایب (P|R|M)</th>
                <th className="px-4 py-4 border-b border-slate-100">پورسانت ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-left">مانده طلب ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{r.name}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{r.team} | {r.region}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-500">{formatNumber(r.targetAmount)}</td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-700">{formatNumber(r.achievementAmount)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-[11px] font-mono font-bold ${r.achievementPercent >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {r.achievementPercent}%
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${r.achievementPercent >= 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(r.achievementPercent, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-slate-400">
                      <span className="text-rose-600">{r.tierRate}%</span> | 
                      <span className="text-sky-600">{r.responsibilityMultiplier}x</span> | 
                      <span className="text-indigo-600">{r.regionMultiplier}x</span> | 
                      <span className="text-amber-600">{r.productMultiplier}x</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-900">{formatNumber(r.calculatedCommission)}</td>
                  <td className="px-4 py-4 text-left">
                    <span className="text-sm font-mono font-bold text-rose-600">{formatNumber(r.balance)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedRecord(r)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" /> جزئیات محاسبه
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Detail Panel for Calculation Breakdown */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRecord(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">جزئیات محاسبه پورسانت</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedRecord.name} - اردیبهشت ۱۴۰۶</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Step 1: Achievement */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-rose-100">۱</div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">سنجش تحقق و تعیین نرخ پایه</h4>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">مبلغ تحقق / مبلغ تارگت:</span>
                      <span className="font-mono font-bold text-slate-700">{formatNumber(selectedRecord.achievementAmount)} / {formatNumber(selectedRecord.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">درصد تحقق نهایی:</span>
                      <span className="font-mono font-bold text-rose-600 text-lg">{selectedRecord.achievementPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200">
                      <span className="text-slate-500 font-bold">نرخ پله پورسانت (نرخ پایه):</span>
                      <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-1 rounded shadow-xs">{selectedRecord.tierRate}%</span>
                    </div>
                  </div>
                </section>

                {/* Step 2: Multipliers */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-rose-100">۲</div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">اعمال ضرایب وزنی و منطقه‌ای</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200 p-3 rounded-xl text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-400">ضریب مسئولیت</p>
                      <p className="text-xs font-mono font-bold text-sky-600">{selectedRecord.responsibilityMultiplier}x</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-xl text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-400">ضریب منطقه</p>
                      <p className="text-xs font-mono font-bold text-indigo-600">{selectedRecord.regionMultiplier}x</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-xl text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-400">ضریب محصول</p>
                      <p className="text-xs font-mono font-bold text-amber-600">{selectedRecord.productMultiplier}x</p>
                    </div>
                  </div>
                </section>

                {/* Step 3: Final Calculation */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-rose-100">۳</div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">محاسبه نهایی مبلغ پورسانت</h4>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6">
                    <div className="space-y-4 font-mono text-[10px] text-slate-400">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>مبلغ تحقق:</span>
                        <span>{formatNumber(selectedRecord.achievementAmount)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>× نرخ پایه ({selectedRecord.tierRate}%):</span>
                        <span>{formatNumber(selectedRecord.achievementAmount * selectedRecord.tierRate / 100)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>× ضریب مسئولیت ({selectedRecord.responsibilityMultiplier}):</span>
                        <span>{formatNumber(selectedRecord.achievementAmount * selectedRecord.tierRate / 100 * selectedRecord.responsibilityMultiplier)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>× ضریب منطقه ({selectedRecord.regionMultiplier}):</span>
                        <span>{formatNumber(selectedRecord.achievementAmount * selectedRecord.tierRate / 100 * selectedRecord.responsibilityMultiplier * selectedRecord.regionMultiplier)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>× ضریب محصول ({selectedRecord.productMultiplier}):</span>
                        <span>{formatNumber(selectedRecord.calculatedCommission)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-2">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">مبلغ پورسانت محاسبه شده</p>
                      <p className="text-2xl font-mono font-bold">{formatNumber(selectedRecord.calculatedCommission)} <span className="text-xs text-slate-500 font-normal">{currency}</span></p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                <div className="flex justify-between items-center px-2 py-1 bg-white border border-slate-200 rounded-xl mb-2">
                  <span className="text-[11px] font-bold text-slate-500">مانده قابل پرداخت:</span>
                  <span className="text-sm font-mono font-bold text-rose-600">{formatNumber(selectedRecord.balance)} {currency}</span>
                </div>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all">
                  <CheckCircle2 className="w-4 h-4" /> تایید و ارسال به خزانه داری
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
