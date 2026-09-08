import React, { useState } from 'react';
import { 
  Calculator, 
  Save, 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Package, 
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  X,
  Target
} from 'lucide-react';

interface AllocationItem {
  team: string;
  member: string;
  memberShare: number;
  region: string;
  regionShare: number;
  productGroup: string;
  productShare: number;
  periodTarget: number;
  allocatedTarget: number;
}

const mockAllocations: AllocationItem[] = [
  { team: 'تیم صنعتی', member: 'علیرضا حسینی', memberShare: 40, region: 'مناطق شمال', regionShare: 50, productGroup: 'محصولات راهبردی', productShare: 45, periodTarget: 10000000000, allocatedTarget: 900000000 },
  { team: 'تیم صنعتی', member: 'سارا احمدی', memberShare: 35, region: 'مناطق مرکزی', regionShare: 30, productGroup: 'محصولات عادی', productShare: 30, periodTarget: 10000000000, allocatedTarget: 315000000 },
];

export const TargetAllocationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [year, setYear] = useState('۱۴۰۶');
  const [period, setPeriod] = useState('اردیبهشت');
  const [calendar, setCalendar] = useState('تقویم فروش سال ۱۴۰۶ - دفتر مرکزی');
  const [currency, setCurrency] = useState('ریال');
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Top Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">فیلترهای تخصیص تارگت</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">انتخاب دوره و محدوده تخصیص برای محاسبه هوشمند</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">سال</label>
            <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option value="۱۴۰۶">۱۴۰۶</option>
              <option value="۱۴۰۵">۱۴۰۵</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">ماه / فصل</label>
            <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option value="اردیبهشت">اردیبهشت</option>
              <option value="بهار">بهار</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">نوع ارز</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option value="ریال">ریال (IRR)</option>
              <option value="دلار">دلار (USD)</option>
              <option value="یورو">یورو (EUR)</option>
            </select>
          </div>
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">تقویم تارگت</label>
            <select value={calendar} onChange={e => setCalendar(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option value="تقویم فروش سال ۱۴۰۶ - دفتر مرکزی">تقویم فروش سال ۱۴۰۶ - دفتر مرکزی</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">تیم</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>همه تیم‌ها</option>
              <option>تیم صنعتی</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold transition-all">پاک کردن</button>
            <button className="flex-[2] py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" /> محاسبه تخصیص
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'تارگت کل دوره', value: '۱۰,۰۰۰,۰۰۰,۰۰۰', icon: Target, color: 'text-slate-600', bg: 'bg-white' },
          { label: 'تخصیص یافته', value: '۸,۴۵۰,۰۰۰,۰۰۰', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'تخصیص نیافته', value: '۱,۵۵۰,۰۰۰,۰۰۰', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-white' },
          { label: 'تعداد افراد', value: '۱۲ نفر', icon: Users, color: 'text-sky-600', bg: 'bg-white' },
          { label: 'تعداد مناطق', value: '۵ منطقه', icon: MapPin, color: 'text-indigo-600', bg: 'bg-white' },
          { label: 'گروه محصولات', value: '۴ گروه', icon: Package, color: 'text-amber-600', bg: 'bg-white' },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2`}>
            <div className="flex items-center justify-between">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${card.color}`}>{card.label}</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-800 text-left">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Allocation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-600" /> جزئیات تخصیص تارگت دوره
          </h3>
          <button className="flex items-center gap-2 text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-all bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
            <Save className="w-3.5 h-3.5" /> ذخیره نهایی تخصیص‌ها
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-4 border-b border-slate-100">فرد (تیم)</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">سهم فرد</th>
                <th className="px-4 py-4 border-b border-slate-100">منطقه</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">سهم منطقه</th>
                <th className="px-4 py-4 border-b border-slate-100">گروه محصول</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">سهم محصول</th>
                <th className="px-4 py-4 border-b border-slate-100">تارگت دوره ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-left">تخصیص یافته ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAllocations.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{item.member}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{item.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">{item.memberShare}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-slate-600">{item.region}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-mono font-bold text-indigo-600">{item.regionShare}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-slate-600">{item.productGroup}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-mono font-bold text-amber-600">{item.productShare}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{formatNumber(item.periodTarget)}</span>
                  </td>
                  <td className="px-4 py-4 text-left">
                    <span className="text-sm font-mono font-bold text-emerald-600">{formatNumber(item.allocatedTarget)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 italic">
            <AlertCircle className="w-3.5 h-3.5 text-sky-500" />
            فرمول تخصیص: (تارگت کل دوره) × (سهم فرد) × (سهم منطقه) × (سهم گروه محصول)
          </div>
        </div>
      </div>
    </div>
  );
};
