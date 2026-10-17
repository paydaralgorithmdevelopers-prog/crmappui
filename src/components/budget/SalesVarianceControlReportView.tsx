
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  PieChart as PieChartIcon,
  FileSpreadsheet,
  Info,
  Calendar,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Building2,
  Package,
  LayoutDashboard,
  Eye,
  EyeOff
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo } from './types';

interface SalesNode {
  id: string;
  name: string;
  type: 'root' | 'category' | 'segment' | 'item';
  children?: SalesNode[];
  parentId?: string;
  // Financial data
  predQty: number;
  predBaseTotal: number;
  predBaseCost: number;
  predBaseProfit: number;
  realQty: number;
  realBaseTotal: number;
  realBaseCost: number;
  realBaseProfit: number;
  avgFee: number;
  impactCoeff: number;
}

const hierarchicalData: SalesNode[] = [
  {
    id: 'root-1',
    name: 'بازرگانی',
    type: 'root',
    predQty: 1650, predBaseTotal: 23550000000, predBaseCost: 16400000000, predBaseProfit: 7150000000,
    realQty: 1580, realBaseTotal: 24000000000, realBaseCost: 16700000000, realBaseProfit: 7300000000,
    avgFee: 20000000, impactCoeff: 1.0,
    children: [
      {
        id: 'cat-1-1',
        name: 'ابزار آلات',
        type: 'category',
        predQty: 1200, predBaseTotal: 7800000000, predBaseCost: 5200000000, predBaseProfit: 2600000000,
        realQty: 1100, realBaseTotal: 7200000000, realBaseCost: 4900000000, realBaseProfit: 2300000000,
        avgFee: 6500000, impactCoeff: 1.2,
      },
      {
        id: 'cat-1-2',
        name: 'ماشین آلات',
        type: 'category',
        predQty: 450, predBaseTotal: 15750000000, predBaseCost: 11200000000, predBaseProfit: 4550000000,
        realQty: 480, realBaseTotal: 16800000000, realBaseCost: 11800000000, realBaseProfit: 5000000000,
        avgFee: 35000000, impactCoeff: 0.85,
      }
    ]
  },
  {
    id: 'root-2',
    name: 'تولیدی',
    type: 'root',
    predQty: 5800, predBaseTotal: 16500000000, predBaseCost: 11500000000, predBaseProfit: 5000000000,
    realQty: 5950, realBaseTotal: 15930000000, realBaseCost: 11300000000, realBaseProfit: 4630000000,
    avgFee: 8000000, impactCoeff: 1.05,
    children: [
      {
        id: 'cat-2-1',
        name: 'ابزار آلات و قطعات برقی',
        type: 'category',
        predQty: 5000, predBaseTotal: 4500000000, predBaseCost: 3100000000, predBaseProfit: 1400000000,
        realQty: 5200, realBaseTotal: 4680000000, realBaseCost: 3200000000, realBaseProfit: 1480000000,
        avgFee: 900000, impactCoeff: 1.15,
      },
      {
        id: 'cat-2-2',
        name: 'پمپ‌ها و سیستم‌های هیدرولیک',
        type: 'category',
        predQty: 800, predBaseTotal: 12000000000, predBaseCost: 8400000000, predBaseProfit: 3600000000,
        realQty: 750, realBaseTotal: 11250000000, realBaseCost: 8100000000, realBaseProfit: 3150000000,
        avgFee: 15000000, impactCoeff: 0.95,
      }
    ]
  }
];

export const SalesVarianceControlReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo, setHeaderInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '1405', version: 'V1', orgUnit: 'sales', baseCurrency: 'ریال',
    secondaryCurrency: 'یورو', exchangeRate: 650000, status: 'approved',
    startDate: '۱۴۰۵/۰۱/۰۱', endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMonth, setActiveMonth] = useState<number>(13);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 'root-1': true, 'root-2': true });

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'جمع کل سال'
  ];

  // Mock data for charts
  const trendData = useMemo(() => {
    return months.slice(0, 12).map((m, i) => ({
      name: m,
      forecast: 15000 + Math.random() * 5000,
      actual: 14000 + Math.random() * 7000,
    }));
  }, []);

  const pieData = [
    { name: 'بازرگانی', value: 7150, color: '#f43f5e' },
    { name: 'تولیدی', value: 5000, color: '#6366f1' },
  ];

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const processNode = (node: SalesNode): any => {
    const scaleFactor = activeMonth <= 12 ? (0.08 + Math.random() * 0.04) : 1;
    const rate = headerInfo.exchangeRate;
    const realRate = rate * (1 + (Math.random() * 0.06 - 0.03));

    const predQty = Math.round(node.predQty * scaleFactor);
    const predMain = Math.round(node.predBaseTotal * scaleFactor);
    const predSec = predMain / rate;
    
    const realQty = Math.round(node.realQty * scaleFactor);
    const realMain = Math.round(node.realBaseTotal * scaleFactor);
    const realSec = realMain / realRate;

    const varQty = realQty - predQty;
    const varMain = realMain - predMain;
    const varSec = realSec - predSec;
    const realization = (realQty / predQty) * 100;

    return {
      ...node,
      predQty, predMain, predRate: rate, predSec,
      realQty, realMain, realRate, realSec,
      varQty, varMain, varSec, realization,
      children: node.children?.map(processNode)
    };
  };

  const processedTree = useMemo(() => {
    return hierarchicalData.map(processNode);
  }, [activeMonth, headerInfo.exchangeRate]);

  const renderRows = (nodes: any[], depth = 0): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      const isRoot = node.type === 'root';

      return (
        <React.Fragment key={node.id}>
          <tr className={`hover:bg-slate-50 transition-colors group ${isRoot ? 'bg-slate-50/50' : ''}`}>
            <td className="px-4 py-3 font-bold text-slate-700 border-l border-slate-200 sticky right-0 bg-white group-hover:bg-slate-50 z-20">
              <div className="flex items-center gap-2" style={{ marginRight: `${depth * 24}px` }}>
                {hasChildren ? (
                  <button onClick={() => toggleExpand(node.id)} className="p-1 hover:bg-slate-200 rounded transition-colors">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 rotate-180" />}
                  </button>
                ) : <div className="w-5" />}
                {isRoot ? <Building2 className="w-4 h-4 text-rose-600" /> : <Package className="w-3.5 h-3.5 text-slate-400" />}
                <span className="truncate">{node.name}</span>
              </div>
            </td>
            {/* Forecast */}
            <td className="px-2 py-3 text-center font-mono text-slate-500 border-l border-slate-100">{node.predQty.toLocaleString()}</td>
            <td className="px-2 py-3 text-left font-mono text-slate-800 border-l border-slate-100">{node.predMain.toLocaleString()}</td>
            <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100 italic">{node.predRate.toLocaleString()}</td>
            <td className="px-2 py-3 text-left font-mono text-blue-600 font-bold border-l border-slate-200 bg-blue-50/10">
              {node.predSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
            {/* Actual */}
            <td className="px-2 py-3 text-center font-mono text-slate-500 border-l border-slate-100 bg-emerald-50/5">{node.realQty.toLocaleString()}</td>
            <td className="px-2 py-3 text-left font-mono text-slate-800 border-l border-slate-100 bg-emerald-50/5">{node.realMain.toLocaleString()}</td>
            <td className="px-2 py-3 text-center font-mono text-slate-400 border-l border-slate-100 bg-emerald-50/5 italic">{Math.round(node.realRate).toLocaleString()}</td>
            <td className="px-2 py-3 text-left font-mono text-emerald-600 font-bold border-l border-slate-200 bg-emerald-50/10">
              {node.realSec.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
            {/* Variance */}
            <td className={`px-2 py-3 text-center font-mono font-bold border-l border-slate-100 ${node.varQty >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {node.varQty.toLocaleString()}
            </td>
            <td className={`px-2 py-3 text-left font-mono font-bold border-l border-slate-100 ${node.varMain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {node.varMain.toLocaleString()}
            </td>
            <td className={`px-2 py-3 text-left font-mono font-black border-l border-slate-200 ${node.varSec >= 0 ? 'text-emerald-600' : 'text-rose-600'} bg-rose-50/20`}>
              {Math.round(node.varSec).toLocaleString()}
            </td>
            {/* KPI */}
            <td className="px-4 py-3 text-center border-r border-slate-200 bg-slate-50/30">
              <span className={`font-mono font-black px-2 py-0.5 rounded-full text-[9px] ${node.realization >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {node.realization.toFixed(1)}%
              </span>
            </td>
          </tr>
          {isExpanded && hasChildren && renderRows(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <BudgetPageLayout title="کنترل جامع فروش" headerInfo={headerInfo} onBack={onBack} isOperationPage={false}>
      <div className="flex flex-col h-full overflow-hidden gap-4 p-4">
        {/* Month Selector Tabs */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-sm w-fit">
              {months.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => setActiveMonth(idx + 1)}
                  className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeMonth === idx + 1
                      ? idx === 12 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-rose-600 text-white shadow-md shadow-rose-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input 
              type="text" 
              placeholder="جستجو در ساختار..."
              className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[300px]">
          <table className="w-full text-right text-[10px] border-collapse relative min-w-[1400px]">
            <thead className="sticky top-0 z-30">
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-4 font-bold border-l border-slate-700 min-w-[280px] sticky right-0 bg-slate-800 z-40">ساختار سلسله‌مراتبی فروش</th>
                <th className="px-4 py-2 font-bold text-center border-l border-slate-700 bg-blue-900/90" colSpan={4}>پیش‌بینی (بودجه)</th>
                <th className="px-4 py-2 font-bold text-center border-l border-slate-700 bg-emerald-900/90" colSpan={4}>تحقق یافته</th>
                <th className="px-4 py-2 font-bold text-center border-l border-slate-700 bg-rose-900/90" colSpan={3}>تجزیه و تحلیل انحراف</th>
                <th className="px-4 py-3 font-bold text-center bg-slate-700 min-w-[100px]">تحقق تعدادی %</th>
              </tr>
              <tr className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200 text-[9px]">
                <th className="px-4 py-2 border-l border-slate-200 sticky right-0 bg-slate-100 z-40 text-[10px]">عناوین و سطوح</th>
                {/* Forecast */}
                <th className="px-2 py-2 border-l border-slate-200">تعداد</th>
                <th className="px-2 py-2 border-l border-slate-200">ارز اصلی</th>
                <th className="px-2 py-2 border-l border-slate-200 text-center">نرخ</th>
                <th className="px-2 py-2 border-l border-slate-200 bg-blue-50/50">ارز فرعی</th>
                {/* Actual */}
                <th className="px-2 py-2 border-l border-slate-200">تعداد</th>
                <th className="px-2 py-2 border-l border-slate-200">ارز اصلی</th>
                <th className="px-2 py-2 border-l border-slate-200 text-center">نرخ</th>
                <th className="px-2 py-2 border-l border-slate-200 bg-emerald-50/50">ارز فرعی</th>
                {/* Variance */}
                <th className="px-2 py-2 border-l border-slate-200 text-rose-600">تعدادی</th>
                <th className="px-2 py-2 border-l border-slate-200 text-rose-600">ارز اصلی</th>
                <th className="px-2 py-2 text-rose-600 bg-rose-50/50 font-black">ارز فرعی</th>
                <th className="px-4 py-2 border-r border-slate-200 text-center text-indigo-700">وضعیت کل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renderRows(processedTree)}
            </tbody>
            <tfoot className="sticky bottom-0 z-30">
              <tr className="bg-slate-900 text-white font-bold text-[10px]">
                <td className="px-4 py-4 sticky right-0 bg-slate-900 border-l border-slate-700 z-40">
                  {activeMonth <= 12 ? `جمع کل ماه ${months[activeMonth - 1]}` : 'جمع کل سازمان (سالانه)'}
                </td>
                {/* Sum roots for totals */}
                {(() => {
                  const rootTotals = processedTree.reduce((acc, root) => ({
                    predQty: acc.predQty + root.predQty,
                    predMain: acc.predMain + root.predMain,
                    predSec: acc.predSec + root.predSec,
                    realQty: acc.realQty + root.realQty,
                    realMain: acc.realMain + root.realMain,
                    realSec: acc.realSec + root.realSec,
                    varQty: acc.varQty + root.varQty,
                    varMain: acc.varMain + root.varMain,
                    varSec: acc.varSec + root.varSec,
                  }), { predQty: 0, predMain: 0, predSec: 0, realQty: 0, realMain: 0, realSec: 0, varQty: 0, varMain: 0, varSec: 0 });
                  
                  const totalRealization = (rootTotals.realQty / rootTotals.predQty) * 100;

                  return (
                    <>
                      <td className="px-2 py-4 text-center font-mono border-l border-slate-700">{rootTotals.predQty.toLocaleString()}</td>
                      <td className="px-2 py-4 text-left font-mono border-l border-slate-700">{rootTotals.predMain.toLocaleString()}</td>
                      <td className="px-2 py-4 border-l border-slate-700"></td>
                      <td className="px-2 py-4 text-left font-mono border-l border-slate-700">{Math.round(rootTotals.predSec).toLocaleString()}</td>

                      <td className="px-2 py-4 text-center font-mono border-l border-slate-700">{rootTotals.realQty.toLocaleString()}</td>
                      <td className="px-2 py-4 text-left font-mono border-l border-slate-700">{rootTotals.realMain.toLocaleString()}</td>
                      <td className="px-2 py-4 border-l border-slate-700"></td>
                      <td className="px-2 py-4 text-left font-mono border-l border-slate-700">{Math.round(rootTotals.realSec).toLocaleString()}</td>

                      <td className={`px-2 py-4 text-center font-mono border-l border-slate-700 ${rootTotals.varQty >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{rootTotals.varQty.toLocaleString()}</td>
                      <td className={`px-2 py-4 text-left font-mono border-l border-slate-700 ${rootTotals.varMain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{rootTotals.varMain.toLocaleString()}</td>
                      <td className={`px-2 py-4 text-left font-mono border-l border-slate-700 ${rootTotals.varSec >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{Math.round(rootTotals.varSec).toLocaleString()}</td>
                      
                      <td className="px-4 py-4 text-center bg-slate-800">
                        <span className="font-black text-indigo-400">{totalRealization.toFixed(1)}%</span>
                      </td>
                    </>
                  );
                })()}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Trend Analysis */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-700">تحلیل روند فروش (پیش‌بینی vs تحقق)</h3>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div><span>پیش‌بینی</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div><span>تحقق یافته</span></div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', direction: 'rtl'}}
                    itemStyle={{fontSize: '11px', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contribution Pie */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-64">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">سهم سود ناخالص گروه‌ها</h3>
            </div>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '10px'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] text-slate-400 font-bold">کل سود</p>
                <p className="text-sm font-black text-slate-800">۱۲.۱۵B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-between text-[10px] font-bold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>محاسبات بر اساس بودجه V1</span>
            </div>
            <div className="flex items-center gap-2 border-r border-white/20 pr-6">
              <Info className="w-3.5 h-3.5 text-rose-400" />
              <span>مبنای انحراف: ارز اصلی (ریال) و ارز فرعی (یورو)</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
             <span>خروجی اکسل سلسله‌مراتبی آماده دریافت است</span>
          </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};

