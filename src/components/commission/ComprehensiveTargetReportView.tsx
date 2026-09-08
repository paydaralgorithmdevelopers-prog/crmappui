import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  Eye, 
  TrendingUp, 
  Target, 
  Award, 
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Printer,
  Calendar,
  Layers
} from 'lucide-react';

interface ReportRow {
  id: string;
  team: string;
  member: string;
  region: string;
  product: string;
  target: number;
  achievement: number;
  achievementPercent: number;
  deviation: number;
  commission: number;
  paid: number;
  balance: number;
}

const mockReportData: ReportRow[] = [
  { id: '1', team: 'تیم صنعتی', member: 'علیرضا حسینی', region: 'مناطق شمال', product: 'High-Tech', target: 1000000000, achievement: 1250000000, achievementPercent: 125, deviation: 250000000, commission: 234000000, paid: 150000000, balance: 84000000 },
  { id: '2', team: 'تیم صنعتی', member: 'سارا احمدی', region: 'مناطق مرکزی', product: 'Standard', target: 800000000, achievement: 760000000, achievementPercent: 95, deviation: -40000000, commission: 53200000, paid: 50000000, balance: 3200000 },
  { id: '3', team: 'تیم خرده‌فروشی', member: 'محمد رضایی', region: 'مناطق جنوب', product: 'Legacy', target: 500000000, achievement: 550000000, achievementPercent: 110, deviation: 50000000, commission: 38500000, paid: 38500000, balance: 0 },
];

export const ComprehensiveTargetReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currency, setCurrency] = useState('ریال');
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">گزارش جامع تارگت و پورسانت</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">تحلیل عملکرد فروش و محاسبات پورسانت در دوره‌های مختلف</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-bold hover:bg-emerald-100 transition-all">
              <FileSpreadsheet className="w-3.5 h-3.5" /> خروجی اکسل
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-all">
              <Printer className="w-3.5 h-3.5" /> چاپ گزارش
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">سال</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>۱۴۰۶</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">دوره (ماه/فصل)</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>اردیبهشت</option>
              <option>کل سال</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">تیم</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>همه تیم‌ها</option>
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
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">منطقه</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>همه مناطق</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-1">وضعیت پرداخت</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <option>همه وضعیت‌ها</option>
              <option>دارای مانده</option>
              <option>تسویه شده</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> فیلتر گزارش
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'مجموع تارگت', value: '۲,۳۰۰,۰۰۰,۰۰۰', icon: Target, color: 'text-slate-600' },
          { label: 'مجموع تحقق', value: '۲,۵۶۰,۰۰۰,۰۰۰', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'درصد تحقق کل', value: '۱۱۱٪', icon: BarChart3, color: 'text-sky-600' },
          { label: 'مجموع پورسانت', value: '۳۲۵,۷۰۰,۰۰۰', icon: Award, color: 'text-rose-600' },
          { label: 'مبلغ پرداخت شده', value: '۲۳۸,۵۰۰,۰۰۰', icon: CheckCircleIcon, color: 'text-emerald-600' },
          { label: 'مانده پورسانت', value: '۸۷,۲۰۰,۰۰۰', icon: DollarSign, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${stat.color}`}>{stat.label}</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-800 text-left">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Comprehensive Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-4 border-b border-slate-100">نام کارشناس (تیم)</th>
                <th className="px-4 py-4 border-b border-slate-100">منطقه / محصول</th>
                <th className="px-4 py-4 border-b border-slate-100">تارگت ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100">تحقق ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-center">تحقق (%)</th>
                <th className="px-4 py-4 border-b border-slate-100">انحراف ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100">پورسانت کل ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100">پرداخت ({currency})</th>
                <th className="px-4 py-4 border-b border-slate-100 text-left">مانده ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockReportData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{row.member}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-slate-600">{row.region}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{row.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-400">{formatNumber(row.target)}</td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-700">{formatNumber(row.achievement)}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-mono font-bold ${row.achievementPercent >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.achievementPercent}%</span>
                      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.achievementPercent >= 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(row.achievementPercent, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[10px] font-mono font-bold">
                    <span className={row.deviation >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {row.deviation >= 0 ? '+' : ''}{formatNumber(row.deviation)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-slate-800">{formatNumber(row.commission)}</td>
                  <td className="px-4 py-4 text-xs font-mono font-bold text-emerald-600">{formatNumber(row.paid)}</td>
                  <td className="px-4 py-4 text-left">
                    <span className={`text-xs font-mono font-bold ${row.balance > 0 ? 'text-rose-600 underline decoration-rose-200 underline-offset-4' : 'text-slate-400'}`}>
                      {formatNumber(row.balance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
