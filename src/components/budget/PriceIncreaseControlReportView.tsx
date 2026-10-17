
import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle,
  Calendar,
  Layers,
  ShoppingBag,
  Tag,
  ArrowRight,
  ChevronLeft,
  X,
  FileText,
  BarChart3,
  LineChart as LineChartIcon,
  Maximize2,
  Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

import { 
  PriceStatus,
  PurchaseDetail,
  MonthlyPurchaseSummary,
  ItemPriceChange,
  GroupPriceChange,
  SaleDetail
} from '../../types/priceIncrease';

import {
  mockPurchaseDetails,
  mockMonthlyPurchaseSummaries,
  mockItemPriceChanges,
  mockGroupPriceChanges,
  mockSaleDetails,
  mockGroupPriceChangesSales
} from '../../data/priceIncreaseMockData';

interface PriceIncreaseControlReportViewProps {
  onBack: () => void;
}

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const PriceIncreaseControlReportView: React.FC<PriceIncreaseControlReportViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('۱۴۰۵/۰۱/۰۱');
  const [toDate, setToDate] = useState('۱۴۰۵/۰۵/۳۱');
  const [analysisType, setAnalysisType] = useState<'purchase' | 'sales'>('purchase');
  const [showFilters, setShowFilters] = useState(false);
  
  // Drill-down state
  const [selectedItem, setSelectedItem] = useState<ItemPriceChange | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<PurchaseDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const tabs = [
    { id: 1, label: 'جزئیات خرید' },
    { id: 3, label: 'تغییرات قیمت خرید اقلام' },
    { id: 4, label: 'تغییرات قیمت گروه‌های خرید' },
    { id: 5, label: 'جزئیات قیمت فروش' },
    { id: 10, label: 'تغییرات قیمت فروش اقلام' },
    { id: 6, label: 'تغییرات قیمت گروه‌های فروش' },
  ];

  const getStatusConfig = (status: PriceStatus) => {
    switch (status) {
      case 'critical_increase': return { label: 'افزایش شدید', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'increase': return { label: 'افزایش', color: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'no_change': return { label: 'بدون تغییر معنادار', color: 'bg-slate-50 text-slate-700 border-slate-200' };
      case 'decrease': return { label: 'کاهش', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'no_basis': return { label: 'فاقد مبنای مقایسه', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'no_transaction': return { label: 'بدون خرید یا فروش در ماه', color: 'bg-slate-50 text-slate-400 border-slate-100' };
      default: return { label: 'نامشخص', color: 'bg-slate-50 text-slate-500' };
    }
  };

  const summaryCards = [
    { title: 'میانگین افزایش فی خرید', value: '۱۸.۴٪', icon: TrendingUp, color: 'text-rose-600' },
    { title: 'میانگین افزایش فی فروش', value: '۱۵.۲٪', icon: TrendingUp, color: 'text-emerald-600' },
  ];

  const handleItemClick = (item: ItemPriceChange) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Vazirmatn'] text-right" dir="rtl">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowRight className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">کنترل افزایش قیمت</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">تحلیل ماهانه تغییر فی خرید و فروش در سطح قلم و گروه قلم</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>خروجی اکسل</span>
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
           <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 pr-1">از تاریخ</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="۱۴۰۵/۰۱/۰۱"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] font-mono outline-hidden focus:border-rose-500 transition-colors"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 pr-1">تا تاریخ</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="۱۴۰۵/۰۵/۳۱"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] font-mono outline-hidden focus:border-rose-500 transition-colors"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
           </div>
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 flex items-center gap-1.5 text-rose-600 text-[10px] font-bold hover:text-rose-700"
        >
          <Filter className="w-3 h-3" />
          <span>{showFilters ? 'عدم نمایش فیلترهای بیشتر' : 'نمایش فیلترهای بیشتر'}</span>
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 pr-1">انبار</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] outline-hidden">
                   <option>همه انبارها</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 pr-1">تامین‌کننده</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] outline-hidden">
                   <option>همه تامین‌کنندگان</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 pr-1">وضعیت تغییر</label>
                <div className="flex gap-2 items-center h-8">
                   <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" className="w-3 h-3 accent-rose-500" />
                      <span className="text-[10px] text-slate-600">فقط افزایش</span>
                   </label>
                   <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" className="w-3 h-3 accent-emerald-500" />
                      <span className="text-[10px] text-slate-600">فقط کاهش</span>
                   </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Cards Row */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
             <div className={`p-2 rounded-lg bg-slate-50 ${card.color}`}>
                <card.icon className="w-4 h-4" />
             </div>
             <div>
                <p className="text-[9px] text-slate-500 font-bold">{card.title}</p>
                <p className={`text-sm font-bold mt-0.5 ${card.color}`}>{card.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="px-4 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Tab Buttons (Horizontal scrollable) */}
        <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${
                 activeTab === tab.id 
                 ? 'bg-white text-rose-600 shadow-xs ring-1 ring-slate-200' 
                 : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 mt-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
           {activeTab === 1 && <TabDetailsPurchase />}
           {activeTab === 3 && <TabItemPriceChanges onItemClick={handleItemClick} />}
           {activeTab === 4 && <TabGroupPriceChanges />}
           {activeTab === 5 && <TabDetailsSales />}
           {activeTab === 10 && <TabItemPriceChangesSales onItemClick={(item) => handleItemClick(item as unknown as ItemPriceChange)} />}
           {activeTab === 6 && <TabGroupPriceChangesSales />}
        </div>
      </div>

      {/* Drawer for Drill-down */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                       <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                       <h2 className="text-sm font-bold text-slate-900">{selectedItem?.itemTitle || 'جزئیات'}</h2>
                       <p className="text-[10px] text-slate-500">کد قلم: {selectedItem?.itemCode}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 {/* Trend Chart */}
                 <section>
                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <LineChartIcon className="w-4 h-4 text-rose-500" />
                       روند تغییر قیمت ماهانه
                    </h3>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedItem?.monthlyData || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis 
                                dataKey="month" 
                                tickFormatter={(val) => MONTHS[val - 1]} 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                             />
                             <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                tickFormatter={(val) => val.toLocaleString()}
                             />
                             <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                                labelFormatter={(val) => `ماه: ${MONTHS[Number(val) - 1]}`}
                             />
                             <Line type="monotone" dataKey="weightedAvgPrice" stroke="#e11d48" strokeWidth={3} dot={{ r: 4, fill: '#e11d48' }} activeDot={{ r: 6 }} name="فی خرید" />
                          </LineChart>
                       </ResponsiveContainer>
                    </div>
                 </section>

                 {/* Comparison Stats */}
                 <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-500">فی مبنا (ابتدای سال)</p>
                       <p className="text-sm font-bold text-slate-900 mt-1">{selectedItem?.basePrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-500">آخرین فی ثبت شده</p>
                       <p className="text-sm font-bold text-slate-900 mt-1">{selectedItem?.monthlyData[selectedItem.monthlyData.length - 1].weightedAvgPrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                       <p className="text-[10px] font-bold text-rose-500">تغییر تجمعی</p>
                       <p className="text-sm font-bold text-rose-700 mt-1">{selectedItem?.cumulativeChange}%</p>
                    </div>
                 </div>

                 {/* Tab-like data in drawer */}
                 <section>
                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <TableIcon className="w-4 h-4 text-rose-500" />
                       جدول داده‌های خام ماهانه
                    </h3>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                       <table className="w-full text-[11px] text-right">
                          <thead className="bg-slate-50 text-slate-500 font-bold">
                             <tr>
                                <th className="px-4 py-3">ماه</th>
                                <th className="px-4 py-3">فی میانگین</th>
                                <th className="px-4 py-3">تغییر</th>
                                <th className="px-4 py-3">وضعیت</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {selectedItem?.monthlyData.map((m, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 font-bold text-slate-700">{MONTHS[m.month - 1]}</td>
                                  <td className="px-4 py-3 font-mono text-slate-900">{m.hasTransaction ? m.weightedAvgPrice.toLocaleString() : '-'}</td>
                                  <td className="px-4 py-3 font-mono text-rose-600">{m.hasTransaction ? `${m.changePercent}%` : '-'}</td>
                                  <td className="px-4 py-3">
                                     {!m.hasTransaction ? (
                                       <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[9px]">بدون خرید</span>
                                     ) : (
                                       <span className={`px-2 py-0.5 rounded-full text-[9px] ${getStatusConfig(m.changePercent > 2 ? 'increase' : 'no_change').color}`}>
                                          {m.changePercent > 2 ? 'افزایش' : 'عادی'}
                                       </span>
                                     )}
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </section>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
                 <button className="w-full py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <Maximize2 className="w-4 h-4" />
                    مشاهده اسناد منبع
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Tab Components ---

const TabDetailsPurchase = () => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right whitespace-nowrap">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3">تاریخ</th>
          <th className="px-4 py-3">شماره سند</th>
          <th className="px-4 py-3">کد کالا</th>
          <th className="px-4 py-3">عنوان کالا</th>
          <th className="px-4 py-3">واحد</th>
          <th className="px-4 py-3 text-left">مقدار</th>
          <th className="px-4 py-3 text-left">فی خرید</th>
          <th className="px-4 py-3 text-left">فی تمام شده</th>
          <th className="px-4 py-3">تامین‌کننده</th>
          <th className="px-4 py-3">انبار</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockPurchaseDetails.map(doc => (
          <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
            <td className="px-4 py-3 text-slate-500 font-mono">{doc.date}</td>
            <td className="px-4 py-3 font-bold text-rose-600 group-hover:underline underline-offset-4">{doc.docNumber}</td>
            <td className="px-4 py-3 font-mono text-slate-600">{doc.itemCode}</td>
            <td className="px-4 py-3 font-bold text-slate-800">{doc.itemTitle}</td>
            <td className="px-4 py-3 text-slate-500">{doc.unit}</td>
            <td className="px-4 py-3 text-left font-mono">{doc.quantity.toLocaleString()}</td>
            <td className="px-4 py-3 text-left font-mono font-bold">{doc.purchasePrice.toLocaleString()}</td>
            <td className="px-4 py-3 text-left font-mono text-emerald-600">{doc.purchasePrice.toLocaleString()}</td>
            <td className="px-4 py-3 text-slate-700">{doc.supplier}</td>
            <td className="px-4 py-3 text-slate-500">{doc.warehouse}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TabItemPriceChanges = ({ onItemClick }: { onItemClick: (item: ItemPriceChange) => void }) => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3 sticky right-0 bg-slate-50 z-20">قلم کالا</th>
          <th className="px-4 py-3 text-left">فی مبنا</th>
          <th className="px-4 py-3 text-center">تغییر تجمعی</th>
          <th className="px-4 py-3">وضعیت</th>
          {/* Dynamic Months Columns */}
          {[1, 2, 3, 4, 5].map(m => (
            <th key={m} className="px-4 py-3 text-center border-r border-slate-100/50">{MONTHS[m-1]}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockItemPriceChanges.map((item, i) => {
          const status = item.status === 'critical_increase' ? { label: 'افزایش شدید', color: 'bg-rose-50 text-rose-700 border-rose-200' } : { label: 'افزایش', color: 'bg-orange-50 text-orange-700 border-orange-200' };
          return (
            <tr key={i} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-sm">
                 <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer" onClick={() => onItemClick(item)}>{item.itemTitle}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{item.itemCode} | {item.purchaseGroup}</span>
                 </div>
              </td>
              <td className="px-4 py-4 text-left font-mono font-bold text-slate-500">{item.basePrice.toLocaleString()}</td>
              <td className="px-4 py-4 text-center">
                 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-bold ${item.cumulativeChange > 20 ? 'text-rose-700 bg-rose-50' : 'text-orange-700 bg-orange-50'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {item.cumulativeChange.toFixed(1)}٪
                 </span>
              </td>
              <td className="px-4 py-4">
                 <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${status.color}`}>
                    {status.label}
                 </span>
              </td>
              {item.monthlyData.map((m, idx) => (
                <td key={idx} className="px-4 py-4 border-r border-slate-50/50">
                   <div className="flex flex-col items-center">
                      <span className={`font-mono font-bold text-[11px] ${m.hasTransaction ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                        {m.hasTransaction ? m.weightedAvgPrice.toLocaleString() : 'فاقد مبنا'}
                      </span>
                      {m.hasTransaction && (
                        <span className={`text-[9px] font-mono font-bold mt-1 ${m.changePercent > 5 ? 'text-rose-600' : 'text-slate-400'}`}>
                           {m.changePercent > 0 ? `+${m.changePercent.toFixed(1)}٪` : '-'}
                        </span>
                      )}
                   </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const TabGroupPriceChanges = () => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3">کد گروه</th>
          <th className="px-4 py-3">عنوان گروه خرید</th>
          <th className="px-4 py-3 text-center">تعداد اقلام</th>
          <th className="px-4 py-3 text-left">مبلغ خرید ماه</th>
          <th className="px-4 py-3 text-center">افزایش میانگین موزون</th>
          <th className="px-4 py-3 text-center">تغییر تجمعی</th>
          <th className="px-4 py-3">وضعیت</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockGroupPriceChanges.map(grp => (
          <tr key={grp.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-mono text-slate-500">{grp.code}</td>
            <td className="px-4 py-3 font-bold text-slate-900">{grp.title}</td>
            <td className="px-4 py-3 text-center text-slate-600">{grp.activeItemCount} / {grp.itemCount}</td>
            <td className="px-4 py-3 text-left font-mono text-slate-700">{grp.currentMonthAmount.toLocaleString()}</td>
            <td className="px-4 py-3 text-center font-mono font-bold text-rose-600">{grp.weightedAvgIncrease.toFixed(1)}٪</td>
            <td className="px-4 py-3 text-center font-mono font-bold text-rose-700 bg-rose-50/30">{grp.cumulativeChange.toFixed(1)}٪</td>
            <td className="px-4 py-3">
               <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${grp.status === 'critical_increase' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                  {grp.status === 'critical_increase' ? 'بحرانی' : 'افزایشی'}
               </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TabDetailsSales = () => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right whitespace-nowrap">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3">کد کالا</th>
          <th className="px-4 py-3">عنوان کالا</th>
          <th className="px-4 py-3">گروه فروش</th>
          <th className="px-4 py-3">واحد</th>
          <th className="px-4 py-3 text-left">فی مبنا</th>
          <th className="px-4 py-3 text-center">تغییر تجمعی</th>
          <th className="px-4 py-3">وضعیت</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockSaleDetails.map(doc => (
          <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-mono text-slate-600">{doc.itemCode}</td>
            <td className="px-4 py-3 font-bold text-slate-800">{doc.itemTitle}</td>
            <td className="px-4 py-3 text-slate-500">{doc.salesGroup}</td>
            <td className="px-4 py-3 text-slate-500">{doc.unit}</td>
            <td className="px-4 py-3 text-left font-mono">{doc.basePrice.toLocaleString()}</td>
            <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">{doc.cumulativeChange.toFixed(1)}٪</td>
            <td className="px-4 py-3">
               <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${getStatusConfigSales(doc.status).color}`}>
                  {getStatusConfigSales(doc.status).label}
               </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const getStatusConfigSales = (status: PriceStatus) => {
  switch (status) {
    case 'critical_increase': return { label: 'افزایش شدید', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'increase': return { label: 'افزایش', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'no_change': return { label: 'بدون تغییر معنادار', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    case 'decrease': return { label: 'کاهش', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    default: return { label: 'نامشخص', color: 'bg-slate-50 text-slate-500' };
  }
};

const TabItemPriceChangesSales = ({ onItemClick }: { onItemClick: (item: SaleDetail) => void }) => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3 sticky right-0 bg-slate-50 z-20">قلم کالا</th>
          <th className="px-4 py-3 text-left">فی مبنا</th>
          <th className="px-4 py-3 text-center">تغییر تجمعی</th>
          <th className="px-4 py-3">وضعیت</th>
          {/* Dynamic Months Columns */}
          {[1, 2, 3, 4, 5].map(m => (
            <th key={m} className="px-4 py-3 text-center border-r border-slate-100/50">{MONTHS[m-1]}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockSaleDetails.map((item, i) => {
          const status = item.status === 'critical_increase' ? { label: 'افزایش شدید', color: 'bg-rose-50 text-rose-700 border-rose-200' } : { label: 'افزایش', color: 'bg-orange-50 text-orange-700 border-orange-200' };
          return (
            <tr key={i} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-sm">
                 <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer" onClick={() => onItemClick(item)}>{item.itemTitle}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{item.itemCode} | {item.salesGroup}</span>
                 </div>
              </td>
              <td className="px-4 py-4 text-left font-mono font-bold text-slate-500">{item.basePrice.toLocaleString()}</td>
              <td className="px-4 py-4 text-center">
                 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-bold ${item.cumulativeChange > 20 ? 'text-rose-700 bg-rose-50' : 'text-orange-700 bg-orange-50'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {item.cumulativeChange.toFixed(1)}٪
                 </span>
              </td>
              <td className="px-4 py-4">
                 <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${status.color}`}>
                    {status.label}
                 </span>
              </td>
              {item.monthlyData.map((m, idx) => (
                <td key={idx} className="px-4 py-4 border-r border-slate-50/50">
                   <div className="flex flex-col items-center">
                      <span className={`font-mono font-bold text-[11px] ${m.hasTransaction ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                        {m.hasTransaction ? m.weightedAvgPrice.toLocaleString() : 'فاقد مبنا'}
                      </span>
                      {m.hasTransaction && (
                        <span className={`text-[9px] font-mono font-bold mt-1 ${m.changePercent > 5 ? 'text-rose-600' : 'text-slate-400'}`}>
                           {m.changePercent > 0 ? `+${m.changePercent.toFixed(1)}٪` : '-'}
                        </span>
                      )}
                   </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const TabGroupPriceChangesSales = () => (
  <div className="flex-1 overflow-auto">
    <table className="w-full text-[11px] text-right">
      <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
        <tr>
          <th className="px-4 py-3">کد گروه</th>
          <th className="px-4 py-3">عنوان گروه فروش</th>
          <th className="px-4 py-3 text-center">تعداد اقلام</th>
          <th className="px-4 py-3 text-left">مبلغ فروش ماه</th>
          <th className="px-4 py-3 text-center">افزایش میانگین موزون</th>
          <th className="px-4 py-3 text-center">تغییر تجمعی</th>
          <th className="px-4 py-3">وضعیت</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {mockGroupPriceChangesSales.map(grp => (
          <tr key={grp.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-mono text-slate-500">{grp.code}</td>
            <td className="px-4 py-3 font-bold text-slate-900">{grp.title}</td>
            <td className="px-4 py-3 text-center text-slate-600">{grp.activeItemCount} / {grp.itemCount}</td>
            <td className="px-4 py-3 text-left font-mono text-slate-700">{grp.currentMonthAmount.toLocaleString()}</td>
            <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">{grp.weightedAvgIncrease.toFixed(1)}٪</td>
            <td className="px-4 py-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">{grp.cumulativeChange.toFixed(1)}٪</td>
            <td className="px-4 py-3">
               <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${grp.status === 'critical_increase' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {grp.status === 'critical_increase' ? 'بحرانی' : 'عادی'}
               </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
