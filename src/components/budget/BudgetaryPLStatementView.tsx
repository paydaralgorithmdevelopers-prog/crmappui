
import React, { useState, useMemo } from 'react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo } from './types';
import { FileText, TrendingUp, TrendingDown, Target, Eye, EyeOff, LayoutDashboard, BarChart3 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';

export const BudgetaryPLStatementView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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

  // Profitability trend data
  const profitTrend = useMemo(() => {
    return months.slice(0, 12).map((m, i) => ({
      name: m,
      profit: 500000000 + Math.random() * 300000000,
      revenue: 2000000000 + Math.random() * 500000000,
      cogs: 1200000000 + Math.random() * 200000000,
    }));
  }, []);

  const pnlStructure = [
    { id: 'sales_total', label: 'فروش خالص', type: 'income', level: 0 },
    { id: 'cogs_total', label: 'کسر می‌شود: بهای تمام‌شده کالای فروش‌رفته', type: 'expense', level: 0 },
    { id: 'gp_total', label: 'سود و زیان ناخالص', type: 'total', level: 1 },
    { id: 'indirect_payroll', label: 'حقوق و دستمزد غیرمستقیم', type: 'expense', level: 0 },
    { id: 'ga_expenses', label: 'کسر می‌شود: هزینه‌های اداری، عمومی و فروش', type: 'expense', level: 0 },
    { id: 'net_profit', label: 'سود خالص ریالی (فاقد کیفیت تقسیم سود)', type: 'total', level: 3 },
  ];

  const generateMockValues = (id: string, activeMonth: number) => {
    const scaleFactor = activeMonth <= 12 ? (0.08 + Math.random() * 0.02) : 1;
    const baseForecast = Math.floor(Math.random() * 500000000) * 100 * scaleFactor;
    const rate = 500000 + Math.floor(Math.random() * 50000);
    const baseActual = baseForecast * (0.9 + Math.random() * 0.2);
    
    return {
      forecastBase: baseForecast,
      forecastRate: rate,
      forecastSec: baseForecast / rate,
      actualBase: baseActual,
      actualRate: rate * (1 + (Math.random() * 0.05 - 0.025)),
      actualSec: baseActual / (rate * (1 + (Math.random() * 0.05 - 0.025))),
    };
  };

  const processedLines = useMemo(() => {
    return pnlStructure.map(line => ({
      ...line,
      values: generateMockValues(line.id, activeMonth)
    }));
  }, [activeMonth]);

  return (
    <BudgetPageLayout title="صورت سود و زیان بودجه‌ای" headerInfo={headerInfo} onBack={onBack} isOperationPage={false}>
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

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
             <div className="text-right">
                <h2 className="text-xs font-bold opacity-70 mb-0.5">صورت سود و زیان مقایسه‌ای</h2>
                <h3 className="text-sm font-black">
                  {activeMonth <= 12 ? `دوره منتهی به پایان ${months[activeMonth-1]}` : `سال مالی منتهی به ۲۹ اسفند ${headerInfo.fiscalYear}`}
                </h3>
             </div>
             <div className="flex items-center gap-4 text-[10px] opacity-60">
                <span>ارز اصلی: {headerInfo.baseCurrency}</span>
                <div className="w-px h-3 bg-white/20"></div>
                <span>ارز فرعی: {headerInfo.secondaryCurrency}</span>
             </div>
          </div>
          
          <div className="overflow-auto flex-1">
            <table className="w-full text-right text-[10px] border-collapse relative">
              <thead className="sticky top-0 z-20 shadow-sm">
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <th className="px-4 py-4 min-w-[280px] sticky right-0 bg-slate-100 z-30 border-l border-slate-200">صورت سود و زیان</th>
                  
                  {/* Forecast Group */}
                  <th className="px-2 py-2 text-center bg-blue-50/50 border-l border-blue-100" colSpan={3}>پیش‌بینی</th>
                  
                  {/* Actual Group */}
                  <th className="px-2 py-2 text-center bg-emerald-50/50 border-l border-emerald-100" colSpan={3}>محقق شده</th>
                  
                  {/* Variance Group */}
                  <th className="px-2 py-2 text-center bg-rose-50/50" colSpan={2}>انحراف</th>
                </tr>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-2 sticky right-0 bg-slate-50 z-30 border-l border-slate-200">عناوین عملیاتی</th>
                  
                  {/* Forecast Headers */}
                  <th className="px-2 py-2 text-left border-l border-slate-200">به ارز اصلی</th>
                  <th className="px-2 py-2 text-center border-l border-slate-200">نرخ تبدیل</th>
                  <th className="px-2 py-2 text-left border-l border-blue-100">به ارز فرعی</th>
                  
                  {/* Actual Headers */}
                  <th className="px-2 py-2 text-left border-l border-slate-200">به ارز اصلی</th>
                  <th className="px-2 py-2 text-center border-l border-slate-200">نرخ تبدیل</th>
                  <th className="px-2 py-2 text-left border-l border-emerald-100">به ارز فرعی</th>
                  
                  {/* Variance Headers */}
                  <th className="px-2 py-2 text-left border-l border-slate-200 text-rose-600">به ارز اصلی</th>
                  <th className="px-2 py-2 text-left text-rose-600">به ارز فرعی</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {processedLines.map((line, idx) => {
                  const varBase = line.values.actualBase - line.values.forecastBase;
                  const varSec = line.values.actualSec - line.values.forecastSec;
                  const isExpense = line.type === 'expense';
                  const isBad = isExpense ? varBase > 0 : varBase < 0;

                  return (
                    <tr key={idx} className={`hover:bg-slate-50 transition-colors group ${line.level > 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className={`px-4 py-3 sticky right-0 z-10 border-l border-slate-200 group-hover:bg-slate-50 transition-colors ${
                        line.level === 0 ? 'text-slate-600' : 
                        line.level === 1 ? 'font-bold text-slate-800' :
                        line.level === 2 ? 'font-black text-indigo-700 bg-indigo-50/30' : 
                        'font-black text-rose-700 bg-rose-50/30'
                      }`}>
                        <div className="flex items-center gap-2">
                           {line.level > 0 && <div className={`w-1 h-4 rounded-full ${line.level === 1 ? 'bg-slate-400' : line.level === 2 ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>}
                           <span>{line.label}</span>
                        </div>
                      </td>
                      
                      {/* Forecast Values */}
                      <td className="px-2 py-3 text-left font-mono text-slate-500 border-l border-slate-100">
                        {Math.round(line.values.forecastBase).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100">
                        {Math.round(line.values.forecastRate).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-left font-mono text-blue-600 border-l border-blue-50 font-bold">
                        {line.values.forecastSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      
                      {/* Actual Values */}
                      <td className="px-2 py-3 text-left font-mono text-slate-600 border-l border-slate-100 bg-emerald-50/5">
                        {Math.round(line.values.actualBase).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100 bg-emerald-50/5">
                        {Math.round(line.values.actualRate).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-left font-mono text-emerald-600 border-l border-emerald-50 bg-emerald-50/5 font-bold">
                        {line.values.actualSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      
                      {/* Variance Values */}
                      <td className={`px-2 py-3 text-left font-mono border-l border-slate-100 font-bold ${isBad ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {(isExpense && varBase !== 0 ? '-' : '')}{Math.abs(Math.round(varBase)).toLocaleString()}
                      </td>
                      <td className={`px-2 py-3 text-left font-mono font-bold ${isBad ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {(isExpense && varSec !== 0 ? '-' : '')}{Math.abs(Math.round(varSec)).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Profitability Trend */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">روند سود خالص ماهیانه</h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitTrend}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', direction: 'rtl'}} />
                  <Area type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="سود خالص" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue vs COGS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">تحلیل درآمد در مقابل بهای تمام شده</h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', direction: 'rtl'}} />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                  <Bar dataKey="revenue" name="درآمد" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cogs" name="بهای تمام شده" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};

