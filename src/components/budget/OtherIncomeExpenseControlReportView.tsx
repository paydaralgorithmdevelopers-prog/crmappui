
import React, { useState, useMemo } from 'react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo } from './types';
import { TrendingDown, TrendingUp, Wallet, ArrowDownRight, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const OtherIncomeExpenseControlReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '1405', version: 'V1', orgUnit: 'all', baseCurrency: 'ریال',
    secondaryCurrency: 'دلار', exchangeRate: 500000, status: 'approved',
    startDate: '۱۴۰۵/۰۱/۰۱', endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const [activeMonth, setActiveMonth] = useState<number>(13); // 13 is "Total Year"

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'جمع کل سال'
  ];

  // Chart data
  const natureData = useMemo(() => {
    return [
      { name: 'هزینه', value: 500000000, color: '#f43f5e' },
      { name: 'درآمد', value: 800000000, color: '#10b981' },
    ];
  }, []);

  const processedDataRaw = [
    { code: '6101', title: 'هزینه ملزومات اداری', nature: 'expense', forecast: 50000000, actual: 55000000 },
    { code: '7102', title: 'سود بانکی', nature: 'income', forecast: 150000000, actual: 160000000 },
  ];

  const processedData = processedDataRaw.map(d => {
    const scaleFactor = activeMonth <= 12 ? (0.08 + Math.random() * 0.04) : 1;
    const forecastMain = Math.round(d.forecast * scaleFactor);
    const actualMain = Math.round(d.actual * scaleFactor);
    const rate = headerInfo.exchangeRate;

    return {
      ...d,
      forecastMain,
      forecastRate: rate,
      forecastSec: forecastMain / rate,
      actualMain,
      actualRate: rate * (1 + (Math.random() * 0.04 - 0.02)),
      actualSec: actualMain / (rate * (1 + (Math.random() * 0.04 - 0.02))),
    };
  });

  const totals = processedData.reduce((acc, curr) => ({
    forecastMain: acc.forecastMain + curr.forecastMain,
    actualMain: acc.actualMain + curr.actualMain,
    forecastSec: acc.forecastSec + curr.forecastSec,
    actualSec: acc.actualSec + curr.actualSec,
  }), { forecastMain: 0, actualMain: 0, forecastSec: 0, actualSec: 0 });

  return (
    <BudgetPageLayout title="کنترل سایر درآمدها و هزینه‌ها" headerInfo={headerInfo} onBack={onBack} isOperationPage={false}>
      <div className="p-4 space-y-4">
        {/* Month Selector Tabs */}
        <div className="flex items-center justify-between gap-4">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-sm w-fit max-w-full">
            {months.map((m, idx) => (
              <button
                key={m}
                onClick={() => setActiveMonth(idx + 1)}
                className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeMonth === idx + 1
                    ? idx === 12 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-rose-600 text-white shadow-md shadow-rose-100'
                    : idx === 12 ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white overflow-x-auto min-h-[300px]">
          <table className="w-full text-right text-[10px] border-collapse relative">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4 font-bold border-l border-slate-200 min-w-[200px] sticky right-0 bg-slate-50 z-20">
                  {activeMonth <= 12 ? `حساب (${months[activeMonth-1]})` : 'حساب (گزارش سالانه)'}
                </th>
                <th className="px-2 py-3 font-bold text-center border-l border-slate-200" rowSpan={2}>ماهیت</th>
                <th className="px-2 py-2 text-center bg-blue-50/50 border-l border-blue-100" colSpan={3}>پیش‌بینی</th>
                <th className="px-2 py-2 text-center bg-emerald-50/50 border-l border-emerald-100" colSpan={3}>تحقق یافته</th>
                <th className="px-2 py-2 text-center bg-rose-50/50" colSpan={2}>انحراف</th>
              </tr>
              <tr className="bg-slate-50 text-[9px] border-b border-slate-200">
                <th className="px-4 py-2 sticky right-0 bg-slate-50 z-20 border-l border-slate-200">عناوین</th>
                {/* Forecast */}
                <th className="px-2 py-2 border-l border-slate-200">ارز اصلی</th>
                <th className="px-2 py-2 text-center border-l border-slate-200">نرخ</th>
                <th className="px-2 py-2 border-l border-blue-100">ارز فرعی</th>
                {/* Actual */}
                <th className="px-2 py-2 border-l border-slate-200">ارز اصلی</th>
                <th className="px-2 py-2 text-center border-l border-slate-200">نرخ</th>
                <th className="px-2 py-2 border-l border-emerald-100">ارز فرعی</th>
                {/* Variance */}
                <th className="px-2 py-2 border-l border-slate-200 text-rose-600">ارز اصلی</th>
                <th className="px-2 py-2 text-rose-600">ارز فرعی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.map((d, i) => {
                const varMain = d.actualMain - d.forecastMain;
                const varSec = d.actualSec - d.forecastSec;
                const isExpense = d.nature === 'expense';
                const isBad = isExpense ? varMain > 0 : varMain < 0;

                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-bold text-slate-700 border-l border-slate-200 sticky right-0 bg-white group-hover:bg-slate-50 z-10 flex items-center gap-2">
                      <div className={`w-1 h-4 rounded-full ${isExpense ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                      {d.code} - {d.title}
                    </td>
                    <td className="px-2 py-3 text-center border-l border-slate-100">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isExpense ? 'هزینه' : 'درآمد'}
                      </span>
                    </td>
                    {/* Forecast */}
                    <td className="px-2 py-3 font-mono text-slate-500 border-l border-slate-100">{d.forecastMain.toLocaleString()}</td>
                    <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100">{d.forecastRate.toLocaleString()}</td>
                    <td className="px-2 py-3 font-mono text-blue-600 border-l border-blue-50 font-bold">{d.forecastSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    {/* Actual */}
                    <td className="px-2 py-3 font-mono text-slate-600 border-l border-slate-100 bg-emerald-50/5">{d.actualMain.toLocaleString()}</td>
                    <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100 bg-emerald-50/5">{Math.round(d.actualRate).toLocaleString()}</td>
                    <td className="px-2 py-3 font-mono text-emerald-600 border-l border-emerald-50 bg-emerald-50/5 font-bold">{d.actualSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    {/* Variance */}
                    <td className={`px-2 py-3 font-mono border-l border-slate-100 font-bold ${isBad ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {varMain.toLocaleString()}
                    </td>
                    <td className={`px-2 py-3 font-mono font-bold ${isBad ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {Math.round(varSec).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-bold sticky bottom-0">
               <tr>
                 <td className="px-4 py-4 sticky right-0 bg-slate-900 border-l border-slate-700 z-10" colSpan={2}>
                   {activeMonth <= 12 ? `جمع کل ماه ${months[activeMonth-1]}` : 'جمع کل سازمان (سالانه)'}
                 </td>
                 <td className="px-2 py-4 font-mono border-l border-slate-800">{totals.forecastMain.toLocaleString()}</td>
                 <td className="px-2 py-4"></td>
                 <td className="px-2 py-4 font-mono border-l border-slate-800">{totals.forecastSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                 <td className="px-2 py-4 font-mono border-l border-slate-800">{totals.actualMain.toLocaleString()}</td>
                 <td className="px-2 py-4"></td>
                 <td className="px-2 py-4 font-mono border-l border-slate-800">{totals.actualSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                 <td className="px-2 py-4 font-mono border-l border-slate-800" colSpan={2}>
                    {(totals.actualMain - totals.forecastMain).toLocaleString()}
                 </td>
               </tr>
            </tfoot>
          </table>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Nature Distribution */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">توزیع ماهیت حساب‌ها</h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={natureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {natureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', direction: 'rtl'}} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Bar Chart */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-700">عملکرد حساب‌های برتر</h3>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', direction: 'rtl'}} />
                  <Bar dataKey="forecastMain" name="پیش‌بینی (ریال)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actualMain" name="واقعی (ریال)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};
