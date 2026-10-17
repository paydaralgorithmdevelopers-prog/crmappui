
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Search, 
  TrendingUp, 
  AlertCircle,
  Package,
  ArrowRight,
  Copy
} from 'lucide-react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo, InflationPurchasePriceRecord } from './types';

export const InflationAndPurchasePriceForecastView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo, setHeaderInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '1405',
    version: 'V1',
    orgUnit: 'supply',
    baseCurrency: 'ریال',
    secondaryCurrency: 'دلار',
    exchangeRate: 500000,
    status: 'draft',
    description: 'محاسبه قیمت خرید پیش‌بینی‌شده مواد اولیه و قطعات برای سال ۱۴۰۵',
    startDate: '۱۴۰۵/۰۱/۰۱',
    endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const baseItems = [
    { itemCode: 'MAT-001', itemTitle: 'ورق فولادی ۲ میلی‌متر', supplyGroup: 'فلزات', uom: 'کیلوگرم', lastPurchaseDate: '۱۴۰۴/۱۰/۱۵', lastPurchasePrice: 450000 },
    { itemCode: 'MAT-002', itemTitle: 'رنگ اپوکسی طوسی', supplyGroup: 'شیمیایی', uom: 'لیتر', lastPurchaseDate: '۱۴۰۴/۱۱/۰۲', lastPurchasePrice: 1200000 },
  ];

  const initialRecords: InflationPurchasePriceRecord[] = useMemo(() => {
    const recs: InflationPurchasePriceRecord[] = [];
    for (let m = 1; m <= 12; m++) {
      baseItems.forEach((item, idx) => {
        recs.push({
          id: `${m}-${idx}`,
          ...item,
          month: m,
          forecastInflationRate: 0,
          forecastPurchasePrice: item.lastPurchasePrice,
          inflationSource: '',
          description: ''
        });
      });
    }
    return recs;
  }, []);

  const [records, setRecords] = useState<InflationPurchasePriceRecord[]>(initialRecords);
  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplyGroupFilter, setSupplyGroupFilter] = useState('all');

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.month === activeMonth &&
      (r.itemTitle.includes(searchQuery) || r.itemCode.includes(searchQuery)) &&
      (supplyGroupFilter === 'all' || r.supplyGroup === supplyGroupFilter)
    );
  }, [records, activeMonth, searchQuery, supplyGroupFilter]);

  const groupedRecords = useMemo(() => {
    const groups: Record<string, InflationPurchasePriceRecord[]> = {};
    filteredRecords.forEach(r => {
      if (!groups[r.supplyGroup]) groups[r.supplyGroup] = [];
      groups[r.supplyGroup].push(r);
    });
    return groups;
  }, [filteredRecords]);

  const updateRecord = (id: string, field: keyof InflationPurchasePriceRecord, value: any) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'forecastInflationRate' || field === 'lastPurchasePrice') {
          updated.forecastPurchasePrice = Math.round(updated.lastPurchasePrice * (1 + (updated.forecastInflationRate || 0) / 100));
        }
        return updated;
      }
      return r;
    }));
  };

  const handleGroupInflationChange = (group: string, rate: number) => {
    setRecords(prev => prev.map(r => {
      if (r.month === activeMonth && r.supplyGroup === group) {
        return {
          ...r,
          forecastInflationRate: rate,
          forecastPurchasePrice: Math.round(r.lastPurchasePrice * (1 + rate / 100))
        };
      }
      return r;
    }));
  };

  const handleCopyFromPreviousMonth = () => {
    if (activeMonth <= 1 || activeMonth > 12) return;
    
    setRecords(prev => {
      const prevMonthRecords = prev.filter(r => r.month === activeMonth - 1);
      return prev.map(r => {
        if (r.month === activeMonth) {
          const prevRec = prevMonthRecords.find(pr => pr.itemCode === r.itemCode);
          if (prevRec) {
            return {
              ...r,
              forecastInflationRate: prevRec.forecastInflationRate,
              forecastPurchasePrice: prevRec.forecastPurchasePrice,
              inflationSource: prevRec.inflationSource
            };
          }
        }
        return r;
      });
    });
    alert(`اطلاعات تورم ماه ${months[activeMonth - 2]} به ماه جاری کپی شد.`);
  };

  const [generalIncrease, setGeneralIncrease] = useState<number>(0);

  const handleApplyGeneralIncrease = () => {
    if (generalIncrease === 0) return;
    setRecords(prev => prev.map(r => {
      if (r.month === activeMonth) {
        return {
          ...r,
          forecastInflationRate: generalIncrease,
          forecastPurchasePrice: Math.round(r.lastPurchasePrice * (1 + generalIncrease / 100))
        };
      }
      return r;
    }));
    alert(`نرخ تورم ${generalIncrease}٪ بر تمام اقلام ماه ${months[activeMonth - 1]} اعمال شد.`);
  };

  const supplyGroups = useMemo(() => Array.from(new Set(records.map(r => r.supplyGroup))), [records]);

  return (
    <BudgetPageLayout
      title="پیش‌بینی نرخ تورم و قیمت خرید اقلام"
      headerInfo={headerInfo}
      onHeaderChange={(info) => setHeaderInfo({ ...headerInfo, ...info })}
      onBack={onBack}
    >
      <div className="flex flex-col h-full gap-4">
        {/* Month Selector Tabs */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-sm w-fit max-w-full">
          {months.map((m, idx) => (
            <button
              key={m}
              onClick={() => setActiveMonth(idx + 1)}
              className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                activeMonth === idx + 1
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-100'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 whitespace-nowrap">فیلتر گروه:</label>
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-rose-500 transition-all min-w-[140px]"
                  value={supplyGroupFilter}
                  onChange={(e) => setSupplyGroupFilter(e.target.value)}
                >
                  <option value="all">تمام گروه‌ها</option>
                  {supplyGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              <div className="h-6 w-px bg-slate-200 mx-1" />
              
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-indigo-600 whitespace-nowrap">افزایش عمومی (%):</label>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    className="w-16 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-indigo-700 outline-none focus:border-indigo-500 transition-all"
                    placeholder="0"
                    value={generalIncrease || ''}
                    onChange={(e) => setGeneralIncrease(Number(e.target.value))}
                  />
                  <button 
                    onClick={handleApplyGeneralIncrease}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    اعمال عمومی
                  </button>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {activeMonth > 1 && (
                <button 
                  onClick={handleCopyFromPreviousMonth}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100 hover:bg-indigo-100 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  کپی از ماه قبل ({months[activeMonth - 2]})
                </button>
              )}
           </div>

           <div className="relative w-72">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="جستجوی کالا یا کد فنی..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-xs outline-none focus:border-rose-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th className="px-4 py-3 font-bold text-right">مشخصات کالا / کد فنی</th>
                    <th className="px-4 py-3 font-bold text-center w-24">واحد</th>
                    <th className="px-4 py-3 font-bold text-left">آخرین قیمت ({headerInfo.baseCurrency})</th>
                    <th className="px-4 py-3 font-bold text-center w-32">تورم اختصاصی ماه (%)</th>
                    <th className="px-4 py-3 font-bold text-left bg-indigo-50/50 text-indigo-900 border-l border-indigo-100">قیمت پیش‌بینی‌شده ({months[activeMonth - 1]})</th>
                    <th className="px-4 py-3 font-bold">منبع داده / توضیحات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(Object.entries(groupedRecords) as [string, InflationPurchasePriceRecord[]][]).map(([group, items]) => (
                    <React.Fragment key={group}>
                      <tr className="bg-slate-100/80 border-y border-slate-200">
                        <td colSpan={2} className="px-4 py-3 font-black text-slate-800">
                           <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-rose-600" />
                              <span>{group}</span>
                              <span className="text-[10px] text-slate-400 font-normal italic mr-2">({items.length} قلم کالا)</span>
                           </div>
                        </td>
                        <td colSpan={1} className="px-4 py-3 text-left">
                           <span className="text-[10px] font-bold text-slate-500">تورم گروهی ماه:</span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                className="w-full bg-white border-2 border-indigo-200 rounded-lg px-2 py-1.5 text-center font-mono font-bold text-indigo-700 outline-none focus:border-indigo-500 shadow-sm"
                                placeholder="0"
                                onChange={(e) => handleGroupInflationChange(group, Number(e.target.value))}
                              />
                              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                           </div>
                        </td>
                        <td colSpan={2} className="px-4 py-3 text-indigo-600 text-[10px] font-bold italic">
                           اعمال نرخ تورم روی تمام اقلام گروه {group} برای ماه {months[activeMonth - 1]}
                        </td>
                      </tr>
                      {items.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3 pr-8">
                             <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <div>
                                   <p className="font-bold text-slate-700">{record.itemTitle}</p>
                                   <p className="text-[10px] text-slate-400 font-mono mt-0.5">{record.itemCode}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500">{record.uom}</td>
                          <td className="px-4 py-3">
                             <div className="text-left font-mono text-slate-600">
                                {record.lastPurchasePrice.toLocaleString()}
                                <p className="text-[9px] text-slate-400 mt-0.5">تاریخ: {record.lastPurchaseDate}</p>
                             </div>
                          </td>
                          <td className="px-4 py-3">
                             <input 
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-mono outline-none focus:border-rose-500 transition-all opacity-70 group-hover:opacity-100"
                                value={record.forecastInflationRate}
                                onChange={(e) => updateRecord(record.id, 'forecastInflationRate', Number(e.target.value))}
                             />
                          </td>
                          <td className="px-4 py-3 bg-indigo-50/10 border-l border-indigo-100">
                             <div className="text-left font-mono font-bold text-indigo-700">
                                {record.forecastPurchasePrice.toLocaleString()}
                             </div>
                          </td>
                          <td className="px-4 py-3">
                             <input 
                                type="text"
                                className="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-rose-500 outline-none px-1 py-1 transition-all text-[10px]"
                                value={record.inflationSource}
                                onChange={(e) => updateRecord(record.id, 'inflationSource', e.target.value)}
                                placeholder="..."
                             />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm mt-auto">
           <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
           <div className="text-xs">
              <h4 className="font-bold text-amber-900 mb-1">راهنمای هوشمند پیش‌بینی قیمت (ماهانه)</h4>
              <p className="text-amber-800 leading-relaxed">
                 در این بخش می‌توانید نرخ تورم انتظاری را برای هر ماه به صورت مجزا وارد کنید. 
                 با استفاده از **کپی از ماه قبل** می‌توانید تنظیمات ماه گذشته را به ماه جاری منتقل کرده و سپس تغییرات جزئی را اعمال کنید.
              </p>
           </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};

