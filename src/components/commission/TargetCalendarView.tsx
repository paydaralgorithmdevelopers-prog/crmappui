import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Calculator, 
  Save, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  FileText,
  ChevronDown
} from 'lucide-react';

interface MonthTarget {
  month: string;
  season: string;
  share: number; // percentage
  amount: number;
}

const months = [
  { name: 'فروردین', season: 'بهار' },
  { name: 'اردیبهشت', season: 'بهار' },
  { name: 'خرداد', season: 'بهار' },
  { name: 'تیر', season: 'تابستان' },
  { name: 'مرداد', season: 'تابستان' },
  { name: 'شهریور', season: 'تابستان' },
  { name: 'مهر', season: 'پاییز' },
  { name: 'آبان', season: 'پاییز' },
  { name: 'آذر', season: 'پاییز' },
  { name: 'دی', season: 'زمستان' },
  { name: 'بهمن', season: 'زمستان' },
  { name: 'اسفند', season: 'زمستان' },
];

export const TargetCalendarView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [title, setTitle] = useState('تقویم فروش سال ۱۴۰۶ - دفتر مرکزی');
  const [year, setYear] = useState('۱۴۰۶');
  const [totalAnnualTarget, setTotalAnnualTarget] = useState(120000000000); // 120 Billion Rials
  const [currency, setCurrency] = useState('ریال');
  const [description, setDescription] = useState('تارگت گذاری بر اساس پیش‌بینی رشد ۲۰ درصدی نسبت به سال گذشته');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  
  const [monthTargets, setMonthTargets] = useState<MonthTarget[]>(
    months.map(m => ({
      month: m.name,
      season: m.season,
      share: 100 / 12,
      amount: 120000000000 / 12
    }))
  );

  const totalShare = monthTargets.reduce((sum, m) => sum + m.share, 0);
  const totalAmountCalculated = monthTargets.reduce((sum, m) => sum + m.amount, 0);

  const handleShareChange = (index: number, newShare: number) => {
    const updated = [...monthTargets];
    updated[index].share = newShare;
    updated[index].amount = (totalAnnualTarget * newShare) / 100;
    setMonthTargets(updated);
  };

  const distributeEqually = () => {
    const equalShare = 100 / 12;
    const equalAmount = totalAnnualTarget / 12;
    setMonthTargets(prev => prev.map(m => ({ ...m, share: equalShare, amount: equalAmount })));
  };

  const calculateAmounts = () => {
    setMonthTargets(prev => prev.map(m => ({
      ...m,
      amount: (totalAnnualTarget * m.share) / 100
    })));
  };

  const getSeasonTotal = (season: string) => {
    return monthTargets
      .filter(m => m.season === season)
      .reduce((sum, m) => sum + m.amount, 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">عنوان تقویم</label>
              <div className="relative">
                <FileText className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">سال</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all appearance-none"
                >
                  <option value="۱۴۰۵">۱۴۰۵</option>
                  <option value="۱۴۰۶">۱۴۰۶</option>
                  <option value="۱۴۰۷">۱۴۰۷</option>
                </select>
                <ChevronDown className="absolute left-3 top-3 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">نوع ارز</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all appearance-none"
                >
                  <option value="ریال">ریال (IRR)</option>
                  <option value="دلار">دلار (USD)</option>
                  <option value="یورو">یورو (EUR)</option>
                  <option value="درهم">درهم (AED)</option>
                </select>
                <ChevronDown className="absolute left-3 top-3 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">مبلغ تارگت کل سال</label>
              <div className="relative">
                <TrendingUp className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  value={totalAnnualTarget}
                  onChange={(e) => setTotalAnnualTarget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-[11px] font-mono font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all"
                />
                <span className="absolute left-3 top-2.5 text-[9px] font-bold text-slate-400">{currency}</span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">توضیحات</label>
              <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 mr-1">وضعیت</label>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                <button 
                  onClick={() => setStatus('draft')}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${status === 'draft' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  پیش‌نویس
                </button>
                <button 
                  onClick={() => setStatus('active')}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${status === 'active' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  فعال
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Months Table + Season Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Months Table */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-rose-600" /> توزیع ماهانه تارگت
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={distributeEqually}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> توزیع مساوی
              </button>
              <button 
                onClick={calculateAmounts}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3 h-3" /> محاسبه مجدد
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 border-b border-slate-100">ماه</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 border-b border-slate-100">فصل</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 border-b border-slate-100">سهم (%)</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 border-b border-slate-100">مبلغ تارگت ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthTargets.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{m.month}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        m.season === 'بهار' ? 'bg-emerald-50 text-emerald-600' :
                        m.season === 'تابستان' ? 'bg-amber-50 text-amber-600' :
                        m.season === 'پاییز' ? 'bg-orange-50 text-orange-600' :
                        'bg-sky-50 text-sky-600'
                      }`}>
                        {m.season}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          step="0.01"
                          value={m.share.toFixed(2)}
                          onChange={(e) => handleShareChange(idx, Number(e.target.value))}
                          className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-center focus:border-rose-500 outline-hidden transition-all"
                        />
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
                          <div 
                            className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                            style={{ width: `${m.share}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-slate-600">
                      {formatNumber(m.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={2} className="px-4 py-3 text-xs text-slate-700">مجموع</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${Math.abs(totalShare - 100) < 0.01 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {totalShare.toFixed(2)}٪
                      </span>
                      {Math.abs(totalShare - 100) > 0.01 && (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-900">
                    {formatNumber(totalAmountCalculated)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Seasonal Summary & Validation */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> خلاصه عملکرد فصلی
            </h3>
            
            <div className="space-y-4">
              {['بهار', 'تابستان', 'پاییز', 'زمستان'].map(s => {
                const seasonTotal = getSeasonTotal(s);
                const seasonShare = (seasonTotal / totalAnnualTarget) * 100;
                return (
                  <div key={s} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">{s}</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">{formatNumber(seasonTotal)} {currency}</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 right-0 rounded-full transition-all duration-1000 ${
                          s === 'بهار' ? 'bg-emerald-500' :
                          s === 'تابستان' ? 'bg-amber-500' :
                          s === 'پاییز' ? 'bg-orange-500' :
                          'bg-sky-500'
                        }`}
                        style={{ width: `${seasonShare}%` }}
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-mono">{seasonShare.toFixed(1)}٪ از کل سال</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className={`p-4 rounded-xl flex items-start gap-3 ${
                Math.abs(totalShare - 100) < 0.01 ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'
              }`}>
                {Math.abs(totalShare - 100) < 0.01 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-emerald-800">توزیع معتبر است</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">مجموع سهم ماه‌ها برابر با ۱۰۰٪ می‌باشد.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-rose-800">خطا در توزیع سهم</p>
                      <p className="text-[10px] text-rose-600 mt-0.5">مجموع سهم ماه‌ها باید دقیقاً ۱۰۰٪ باشد. (در حال حاضر: {totalShare.toFixed(2)}٪)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl shadow-lg text-white">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">اطلاعات نهایی ذخیره‌سازی</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-300">مجموع تارگت محاسبه شده:</span>
                <span className="text-sm font-bold font-mono">{formatNumber(totalAmountCalculated)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-300">تعداد دوره‌های فعال:</span>
                <span className="text-sm font-bold font-mono">۱۲ ماه</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={onBack}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-all border border-slate-700"
              >
                انصراف
              </button>
              <button 
                className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[11px] font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> ذخیره تقویم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
