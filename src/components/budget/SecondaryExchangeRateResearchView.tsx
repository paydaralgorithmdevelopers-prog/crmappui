
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Search, 
  Info, 
  Globe, 
  TrendingUp, 
  Zap,
  BarChart3,
  Settings2,
  ExternalLink,
  Target,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Copy,
  History
} from 'lucide-react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo, ExchangeRateResearch, ExchangeRateSource } from './types';

export const SecondaryExchangeRateResearchView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo, setHeaderInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '1405',
    version: 'V1',
    orgUnit: 'financial',
    baseCurrency: 'ریال',
    secondaryCurrency: 'یورو',
    exchangeRate: 650000,
    status: 'draft',
    description: 'تحقیقات جامع نرخ تبدیل یورو به ریال برای بودجه‌ریزی سال ۱۴۰۵',
    startDate: '۱۴۰۵/۰۱/۰۱',
    endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const [research, setResearch] = useState<ExchangeRateResearch>({
    id: '1',
    title: 'تحقیق جامع ارز - فروردین ۱۴۰۵',
    fiscalYear: '1405',
    startDate: '1405/01/01',
    endDate: '1405/12/29',
    baseCurrency: 'ریال',
    secondaryCurrency: 'یورو',
    rateDirection: 'تعداد ریال برای یک یورو',
    researchDate: '1404/12/15',
    version: 'V1',
    status: 'draft',
    description: '',
    currentRate: 580000,
    currentRateDate: '1404/12/15',
    baseInflation: 40,
    secondaryInflation: 2.5,
    baseInterestRate: 23,
    secondaryInterestRate: 4.5,
    marketForecastEnd: 720000,
    riskAdjustmentPercent: 5
  });

  const [sources, setSources] = useState<ExchangeRateSource[]>([
    {
      id: '1',
      title: 'گزارش صندوق بین‌المللی پول',
      type: 'IMF',
      region: 'Global',
      indexUsed: 'Forecast for Iran Inflation',
      extractedValue: 38,
      publishDate: '2025/01/10',
      observationDate: '1404/11/20',
      description: ''
    }
  ]);

  const [weights, setWeights] = useState({
    inflation: 50,
    interest: 10,
    market: 40
  });

  const [selectedScenario, setSelectedScenario] = useState<'optimistic' | 'base' | 'pessimistic'>('base');
  const [copyFactor, setCopyFactor] = useState<number>(20);

  const handleCopyFromPreviousYear = () => {
    // Simulated previous year data
    const previousYearRate = 520000; 
    const factor = 1 + (copyFactor / 100);
    
    setResearch(prev => ({
      ...prev,
      currentRate: Math.round(previousYearRate * factor),
      marketForecastEnd: Math.round(620000 * factor),
      baseInflation: 38,
      secondaryInflation: 2.2,
      baseInterestRate: 22,
      secondaryInterestRate: 4.2
    }));
    
    alert(`اطلاعات از دوره قبل با ضریب افزایش ${copyFactor}٪ با موفقیت کپی و جایگزین شد.`);
  };

  const calculations = useMemo(() => {
    const { currentRate, baseInflation, secondaryInflation, baseInterestRate, secondaryInterestRate, marketForecastEnd, riskAdjustmentPercent = 0 } = research;
    
    // 1. Inflation Based
    const inflationBasedRate = currentRate * ((1 + baseInflation / 100) / (1 + secondaryInflation / 100));
    
    // 2. Interest Based
    const interestBasedRate = currentRate * ((1 + baseInterestRate / 100) / (1 + secondaryInterestRate / 100));
    
    // 3. Adjusted Market
    const adjustedMarketRate = (marketForecastEnd || currentRate) * (1 + riskAdjustmentPercent / 100);
    
    // 4. Combined Rate (Weighted)
    const combinedRate = (
      (inflationBasedRate * weights.inflation / 100) +
      (interestBasedRate * weights.interest / 100) +
      (adjustedMarketRate * weights.market / 100)
    );
    
    return {
      inflationBasedRate,
      interestBasedRate,
      adjustedMarketRate,
      combinedRate
    };
  }, [research, weights]);

  // Generate Monthly Rates (geometric growth)
  const monthlyRates = useMemo(() => {
    const { currentRate } = research;
    const { combinedRate } = calculations;
    
    let targetRate = combinedRate;
    if (selectedScenario === 'optimistic') targetRate = combinedRate * 0.9;
    if (selectedScenario === 'pessimistic') targetRate = combinedRate * 1.1;

    const steps = 12;
    const rates = [];
    
    for (let i = 0; i <= steps; i++) {
      const rate = currentRate * Math.pow(targetRate / currentRate, i / steps);
      rates.push(Math.round(rate));
    }
    
    return rates;
  }, [research.currentRate, calculations.combinedRate, selectedScenario]);

  return (
    <BudgetPageLayout
      title="تحقیقات نرخ ارز فرعی"
      headerInfo={headerInfo}
      onHeaderChange={(info) => setHeaderInfo({ ...headerInfo, ...info })}
      onBack={onBack}
    >
      <div className="p-4 space-y-6">
        {/* Quick Actions / Copy from Previous Year */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                 <History className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                 <h4 className="text-xs font-bold text-slate-800">عملیات سریع بودجه‌ریزی</h4>
                 <p className="text-[10px] text-slate-500">استفاده از داده‌های تاریخی برای تسریع در فرآیند</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 px-3 border-l border-slate-200">
                 <span className="text-[10px] font-bold text-slate-500">ضریب افزایش (%)</span>
                 <input 
                   type="number" 
                   className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                   value={copyFactor}
                   onChange={(e) => setCopyFactor(Number(e.target.value))}
                 />
              </div>
              <button 
                onClick={handleCopyFromPreviousYear}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                کپی از دوره مالی قبل
              </button>
           </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 mb-1">نرخ جاری</p>
              <p className="text-lg font-mono font-bold text-slate-800">{research.currentRate.toLocaleString()}</p>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-indigo-500">
              <p className="text-[10px] font-bold text-slate-400 mb-1">مبتنی بر تورم</p>
              <p className="text-lg font-mono font-bold text-indigo-600">{calculations.inflationBasedRate.toLocaleString()}</p>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-sky-500">
              <p className="text-[10px] font-bold text-slate-400 mb-1">مبتنی بر بهره</p>
              <p className="text-lg font-mono font-bold text-sky-600">{calculations.interestBasedRate.toLocaleString()}</p>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-amber-500">
              <p className="text-[10px] font-bold text-slate-400 mb-1">تعدیل‌شده بازار</p>
              <p className="text-lg font-mono font-bold text-amber-600">{calculations.adjustedMarketRate.toLocaleString()}</p>
           </div>
           <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 lg:col-span-2 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-rose-400 mb-1">نرخ مبنای نهایی ({selectedScenario === 'base' ? 'سناریوی مبنا' : selectedScenario === 'optimistic' ? 'خوش‌بینانه' : 'بدبینانه'})</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-mono font-bold text-white">
                  {Math.round(
                    selectedScenario === 'base' ? calculations.combinedRate : 
                    selectedScenario === 'optimistic' ? calculations.combinedRate * 0.9 : 
                    calculations.combinedRate * 1.1
                  ).toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400">({headerInfo.baseCurrency})</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Inputs Column */}
           <div className="lg:col-span-8 space-y-6">
              {/* Essential Inputs */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-rose-600" />
                   <h3 className="text-xs font-bold text-slate-700">ورودی‌های ضروری تحقیق</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-slate-400 border-r-2 border-slate-200 pr-2">ارز اصلی ({headerInfo.baseCurrency})</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">تورم پیش‌بینی‌شده (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
                              value={research.baseInflation}
                              onChange={(e) => setResearch({...research, baseInflation: Number(e.target.value)})}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">نرخ بهره سالانه (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
                              value={research.baseInterestRate}
                              onChange={(e) => setResearch({...research, baseInterestRate: Number(e.target.value)})}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-slate-400 border-r-2 border-slate-200 pr-2">ارز فرعی ({headerInfo.secondaryCurrency})</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">تورم پیش‌بینی‌شده (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
                              value={research.secondaryInflation}
                              onChange={(e) => setResearch({...research, secondaryInflation: Number(e.target.value)})}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">نرخ بهره سالانه (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
                              value={research.secondaryInterestRate}
                              onChange={(e) => setResearch({...research, secondaryInterestRate: Number(e.target.value)})}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="md:col-span-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="space-y-1">
                           <label className="text-[10px] text-slate-500">نرخ جاری ({headerInfo.secondaryCurrency} به {headerInfo.baseCurrency})</label>
                           <input 
                              type="number" 
                              className="w-48 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 shadow-inner"
                              value={research.currentRate}
                              onChange={(e) => setResearch({...research, currentRate: Number(e.target.value)})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] text-slate-500">پیش‌بینی بازار در پایان دوره</label>
                           <input 
                              type="number" 
                              className="w-48 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono font-bold text-amber-600 outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
                              value={research.marketForecastEnd || ''}
                              onChange={(e) => setResearch({...research, marketForecastEnd: Number(e.target.value)})}
                           />
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-left">
                         <p className="text-[10px] font-bold text-indigo-400 mb-1">جهت نرخ تبدیل</p>
                         <p className="text-xs font-bold text-indigo-700">{research.rateDirection}</p>
                      </div>
                   </div>
                </div>
              </section>

              {/* Monthly Rate Growth - Horizontal Layout */}
               <section className="bg-slate-900 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-rose-400" />
                   <h3 className="text-xs font-bold">پیش‌بینی روند نرخ ماهانه در طول دوره (رشد تدریجی)</h3>
                </div>
                <div className="p-0 overflow-x-auto">
                   <div className="flex bg-slate-800 min-w-max">
                      {monthlyRates.map((rate, idx) => (
                        <div key={idx} className="bg-slate-900 p-4 flex-1 flex flex-col gap-1 items-center border-l border-slate-800 last:border-l-0 min-w-[110px]">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {idx === 0 ? 'نرخ جاری' : `انتهای برج ${idx}`}
                           </span>
                           <span className="text-sm font-mono font-bold text-white">{rate.toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </section>
           </div>

           {/* Sidebar: Weights & Monthly Breakdown */}
           <div className="lg:col-span-4 space-y-6">
              {/* Advanced Settings (Weights) */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                   <Settings2 className="w-4 h-4 text-slate-600" />
                   <h3 className="text-xs font-bold text-slate-700">وزن‌دهی روش‌های پیش‌بینی</h3>
                </div>
                <div className="p-4 space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                         <span className="text-slate-500 font-bold">روش اختلاف تورم</span>
                         <span className="text-indigo-600 font-bold">{weights.inflation}%</span>
                      </div>
                      <input type="range" className="w-full accent-indigo-600" value={weights.inflation} onChange={e => setWeights({...weights, inflation: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                         <span className="text-slate-500 font-bold">روش اختلاف بهره</span>
                         <span className="text-sky-600 font-bold">{weights.interest}%</span>
                      </div>
                      <input type="range" className="w-full accent-sky-600" value={weights.interest} onChange={e => setWeights({...weights, interest: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                         <span className="text-slate-500 font-bold">پیش‌بینی تعدیل‌شده بازار</span>
                         <span className="text-amber-600 font-bold">{weights.market}%</span>
                      </div>
                      <input type="range" className="w-full accent-amber-600" value={weights.market} onChange={e => setWeights({...weights, market: Number(e.target.value)})} />
                   </div>
                   
                   <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مجموع وزن‌ها:</span>
                      <span className={`text-xs font-black ${weights.inflation + weights.interest + weights.market === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {weights.inflation + weights.interest + weights.market}%
                      </span>
                   </div>
                </div>
              </section>

              {/* Scenarios */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
                 <h3 className="text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-2 mb-3">سناریوهای تحلیلی (انتخاب مبنا)</h3>
                 
                 {/* Optimistic */}
                 <div 
                   className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group ${
                     selectedScenario === 'optimistic' 
                     ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300' 
                     : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200'
                   }`}
                   onClick={() => setSelectedScenario('optimistic')}
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                         selectedScenario === 'optimistic' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'
                       }`}>
                         {selectedScenario === 'optimistic' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                       </div>
                       <div className="flex items-center gap-2">
                          <ArrowDownCircle className={`w-4 h-4 ${selectedScenario === 'optimistic' ? 'text-emerald-500' : 'text-slate-300'}`} />
                          <span className="text-[11px] font-bold">خوش‌بینانه (۹۰٪)</span>
                       </div>
                    </div>
                    <span className={`font-mono text-xs font-bold ${selectedScenario === 'optimistic' ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {(Math.round(calculations.combinedRate * 0.9)).toLocaleString()}
                    </span>
                 </div>

                 {/* Base */}
                 <div 
                   className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group ${
                     selectedScenario === 'base' 
                     ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-300' 
                     : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                   }`}
                   onClick={() => setSelectedScenario('base')}
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                         selectedScenario === 'base' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'
                       }`}>
                         {selectedScenario === 'base' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                       </div>
                       <div className="flex items-center gap-2">
                          <Target className={`w-4 h-4 ${selectedScenario === 'base' ? 'text-indigo-500' : 'text-slate-300'}`} />
                          <span className="text-[11px] font-bold">سناریوی مبنا (۱۰۰٪)</span>
                       </div>
                    </div>
                    <span className={`font-mono text-xs font-bold ${selectedScenario === 'base' ? 'text-indigo-700' : 'text-slate-500'}`}>
                      {(Math.round(calculations.combinedRate)).toLocaleString()}
                    </span>
                 </div>

                 {/* Pessimistic */}
                 <div 
                   className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group ${
                     selectedScenario === 'pessimistic' 
                     ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300' 
                     : 'bg-white text-slate-400 border-slate-100 hover:border-rose-200'
                   }`}
                   onClick={() => setSelectedScenario('pessimistic')}
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                         selectedScenario === 'pessimistic' ? 'bg-rose-500 border-rose-500' : 'border-slate-300 group-hover:border-rose-400'
                       }`}>
                         {selectedScenario === 'pessimistic' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                       </div>
                       <div className="flex items-center gap-2">
                          <ArrowUpCircle className={`w-4 h-4 ${selectedScenario === 'pessimistic' ? 'text-rose-500' : 'text-slate-300'}`} />
                          <span className="text-[11px] font-bold">بدبینانه (۱۱۰٪)</span>
                       </div>
                    </div>
                    <span className={`font-mono text-xs font-bold ${selectedScenario === 'pessimistic' ? 'text-rose-700' : 'text-slate-500'}`}>
                      {(Math.round(calculations.combinedRate * 1.1)).toLocaleString()}
                    </span>
                 </div>
              </section>

           </div>
        </div>

        {/* Calculation Methodology & Formula Description */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mt-8 shadow-inner overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800">راهنمای متدولوژی و فرمول‌های محاسباتی پیش‌بینی نرخ ارز</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <span className="text-[10px] font-bold">۰۱</span>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-tight">نظریه برابری قدرت خرید (PPP)</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                این روش بر اساس تفاوت نرخ تورم بین دو کشور عمل می‌کند. فرض بر این است که ارز کشوری با تورم بالاتر، به میزان تفاوت تورم نسبت به ارز مقابل تضعیف می‌شود.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-100 font-mono text-[10px] text-indigo-700 ltr text-left">
                Rate(Inf) = Current × [(1 + Infl_Base) / (1 + Infl_Sec)]
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-600">
                <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-100">
                  <span className="text-[10px] font-bold">۰۲</span>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-tight">اثر بین‌المللی فیشر (IFE)</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                این تئوری بیان می‌کند که تفاوت در نرخ بهره اسمی بین دو کشور بازتاب‌دهنده تفاوت در تورم انتظاری است و در نتیجه باعث تغییر در نرخ تبدیل ارز می‌شود.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-100 font-mono text-[10px] text-sky-700 ltr text-left">
                Rate(Int) = Current × [(1 + Intr_Base) / (1 + Intr_Sec)]
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                  <span className="text-[10px] font-bold">۰۳</span>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-tight">تعدیل ریسک و انتظارات بازار</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                این روش از پیش‌بینی‌های مستقیم نهادهای مالی (مانند IMF یا بانک مرکزی) استفاده کرده و یک ضریب اطمینان (Risk Premium) برای پوشش نوسانات غیرمنتظره به آن اضافه می‌کند.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-100 font-mono text-[10px] text-amber-700 ltr text-left">
                Rate(Mkt) = Market_Forecast × (1 + Risk_%)
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center border border-rose-100">
                  <span className="text-[10px] font-bold">۰۴</span>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-tight">نرخ ترکیبی وزنی (Weighted)</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                در نهایت، برای رسیدن به یک پیش‌بینی واقع‌بینانه، از میانگین وزنی هر سه روش فوق استفاده می‌شود. مجموع اوزان باید همواره برابر با ۱۰۰٪ باشد.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-rose-400 ltr text-left shadow-lg">
                Combined = (R_Inf * W1) + (R_Int * W2) + (R_Mkt * W3)
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 space-x-reverse">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">تأیید شده توسط دپارتمان اقتصادی و مدیریت ریسک</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-colors cursor-help">
              <Calculator className="w-4 h-4" />
              <span className="text-[10px] font-bold underline underline-offset-4">مشاهده جزئیات فنی محاسبات</span>
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        <div className="flex justify-end pt-4 pb-8 border-t border-slate-100">
          <button 
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            onClick={() => {
              const finalRate = selectedScenario === 'base' ? calculations.combinedRate : 
                               selectedScenario === 'optimistic' ? calculations.combinedRate * 0.9 : 
                               calculations.combinedRate * 1.1;
              alert(`تنظیمات با موفقیت تایید شد. نرخ نهایی مبنا: ${Math.round(finalRate).toLocaleString()} ریال`);
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            تایید تنظیمات و مبنای محاسباتی
          </button>
        </div>
      </div>
    </BudgetPageLayout>
  );
};
