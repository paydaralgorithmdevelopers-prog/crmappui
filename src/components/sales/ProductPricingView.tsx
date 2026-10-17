import React, { useState } from 'react';
import { 
  DollarSign, 
  History, 
  TrendingUp, 
  Search, 
  Plus, 
  ChevronRight, 
  Save, 
  X, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Calculator,
  MoreVertical,
  ArrowDownRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PriceHistory {
  id: string;
  price: number;
  date: string;
  description: string;
  changedBy: string;
}

interface ProductPricing {
  id: string;
  code: string;
  name: string;
  unit: string;
  history: PriceHistory[];
}

export const ProductPricingView: React.FC = () => {
  const [products, setProducts] = useState<ProductPricing[]>([
    { 
      id: '1', 
      code: 'PRD-1001', 
      name: 'لوله پلی اتیلن فشار قوی', 
      unit: 'متر',
      history: [
        { id: 'h1', price: 1100000, date: '۱۴۰۴/۱۰/۰۱', description: 'قیمت پایه اولیه', changedBy: 'مدیر سیستم' },
        { id: 'h2', price: 1250000, date: '۱۴۰۵/۰۱/۱۵', description: 'افزایش سالانه تورم', changedBy: 'بخش بازرگانی' },
      ]
    },
    { 
      id: '2', 
      code: 'PRD-1002', 
      name: 'شیر فلکه صنعتی ۱۰ اینچ', 
      unit: 'عدد',
      history: [
        { id: 'h3', price: 14500000, date: '۱۴۰۴/۱۱/۲۰', description: 'قیمت خرید جدید', changedBy: 'تامین کالا' },
        { id: 'h4', price: 15800000, date: '۱۴۰۵/۰۲/۰۱', description: 'تعدیل نرخ ارز', changedBy: 'مدیریت مالی' },
      ]
    },
    { 
      id: '3', 
      code: 'PRD-1003', 
      name: 'زانو ۴۵ درجه فولادی', 
      unit: 'عدد',
      history: [
        { id: 'h5', price: 450000, date: '۱۴۰۵/۰۱/۱۰', description: 'قیمت گذاری سال جدید', changedBy: 'واحد فروش' },
      ]
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showHistoryId, setShowHistoryId] = useState<string | null>(null);
  const [bulkMultiplier, setBulkMultiplier] = useState<string>('1.1');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('۱۴۰۴/۰۱/۰۱');
  const [endDate, setEndDate] = useState('۱۴۰۵/۱۲/۲۹');

  const getPriceAtDate = (product: ProductPricing, targetDate: string) => {
    // Find the price that was active on the target date (latest history entry <= targetDate)
    const sortedHistory = [...product.history].sort((a, b) => a.date.localeCompare(b.date));
    const activeEntry = sortedHistory.filter(h => h.date <= targetDate).pop();
    return activeEntry ? activeEntry.price : (sortedHistory[0]?.price || 0);
  };

  const getLatestPrice = (product: ProductPricing) => {
    if (product.history.length === 0) return 0;
    return product.history[product.history.length - 1].price;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = () => {
    const multiplier = parseFloat(bulkMultiplier);
    if (isNaN(multiplier)) return;

    setProducts(prev => prev.map(p => {
      if (selectedIds.includes(p.id)) {
        const currentPrice = getLatestPrice(p);
        const newPrice = Math.round(currentPrice * multiplier);
        return {
          ...p,
          history: [
            ...p.history,
            {
              id: Math.random().toString(36).substr(2, 9),
              price: newPrice,
              date: '۱۴۰۵/۰۶/۱۸',
              description: `افزایش گروهی با ضریب ${multiplier}`,
              changedBy: 'مدیر فروش'
            }
          ]
        };
      }
      return p;
    }));
    setSelectedIds([]);
  };

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  const handleUpdatePrice = (productId: string, entryId: string) => {
    const newPrice = parseInt(editingPrice);
    if (isNaN(newPrice)) return;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          history: p.history.map(h => h.id === entryId ? { ...h, price: newPrice } : h)
        };
      }
      return p;
    }));
    setEditingEntryId(null);
  };

  const handleDeleteEntry = (productId: string, entryId: string) => {
    if (!confirm('آیا از حذف این سابقه قیمت اطمینان دارید؟')) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          history: p.history.filter(h => h.id !== entryId)
        };
      }
      return p;
    }));
  };

  const selectedProductForHistory = products.find(p => p.id === showHistoryId);

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">قیمت‌گذاری و سوابق محصولات</h1>
            <p className="text-[10px] text-slate-500">مدیریت لحظه‌ای قیمت‌ها و اعمال تغییرات گروهی هوشمند</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Filter */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 px-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500">بازه تحلیل:</span>
            </div>
            <input 
              type="text" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
              placeholder="شروع (۱۴۰۴/۰۱/۰۱)"
            />
            <span className="text-slate-300 text-xs">تا</span>
            <input 
              type="text" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
              placeholder="پایان (۱۴۰۵/۱۲/۲۹)"
            />
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bulk Update Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-600 p-3 rounded-2xl shadow-lg flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white mr-2">{selectedIds.length} محصول انتخاب شده است</span>
              <div className="h-6 w-px bg-indigo-500" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-indigo-100 font-bold">ضریب افزایش گروهی:</span>
                <input 
                  type="text"
                  value={bulkMultiplier}
                  onChange={(e) => setBulkMultiplier(e.target.value)}
                  className="w-16 bg-indigo-700 border border-indigo-400 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white text-center font-bold"
                />
                <span className="text-[10px] text-indigo-200">(مثلاً ۱.۱)</span>
              </div>
            </div>
            <button 
              onClick={handleBulkUpdate}
              className="bg-white text-indigo-700 px-6 py-1.5 rounded-xl text-[11px] font-black hover:bg-indigo-50 transition-all shadow-sm flex items-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5" /> اعمال ضریب به گروه
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(products.map(p => p.id));
                      else setSelectedIds([]);
                    }}
                    checked={selectedIds.length === products.length}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3 font-bold">کد و نام محصول</th>
                <th className="px-4 py-3 font-bold text-center">واحد</th>
                <th className="px-4 py-3 font-bold">قیمت ابتدا (ریال)</th>
                <th className="px-4 py-3 font-bold">قیمت انتها (ریال)</th>
                <th className="px-4 py-3 font-bold text-center">ضریب تغییر</th>
                <th className="px-4 py-3 font-bold text-center">آخرین تغییر</th>
                <th className="px-4 py-3 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prd) => {
                const priceStart = getPriceAtDate(prd, startDate);
                const priceEnd = getPriceAtDate(prd, endDate);
                const multiplier = priceStart > 0 ? (priceEnd / priceStart) : 1;
                const percentage = (multiplier - 1) * 100;

                return (
                  <tr key={prd.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.includes(prd.id) ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(prd.id)}
                        onChange={() => toggleSelect(prd.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{prd.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{prd.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{prd.unit}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {priceStart.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-black text-slate-800">
                      {priceEnd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${multiplier > 1 ? 'bg-rose-50 text-rose-600' : multiplier < 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                        {multiplier.toFixed(2)}x
                        <span className="text-[8px] font-normal opacity-70">({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400 text-[10px]">
                      {prd.history[prd.history.length-1].date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setShowHistoryId(prd.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="مشاهده سوابق"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="تغییر قیمت">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price History Modal */}
      <AnimatePresence>
        {showHistoryId && selectedProductForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">سابقه قیمت‌گذاری</h2>
                    <p className="text-[10px] text-slate-500">{selectedProductForHistory.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistoryId(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="relative space-y-6 before:absolute before:right-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  {selectedProductForHistory.history.slice().reverse().map((entry, idx) => (
                    <div key={entry.id} className="relative pr-8">
                      <div className={`absolute right-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {idx === 0 ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 rounded-full bg-slate-400" />}
                      </div>
                      
                      <div className={`p-3 rounded-2xl border transition-all ${idx === 0 ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-1">
                          {editingEntryId === entry.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                className="bg-white border border-indigo-200 rounded-lg px-2 py-0.5 text-xs font-black text-indigo-700 w-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                autoFocus
                              />
                              <button 
                                onClick={() => handleUpdatePrice(selectedProductForHistory.id, entry.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setEditingEntryId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className={`font-black text-sm ${idx === 0 ? 'text-indigo-700' : 'text-slate-700'}`}>
                              {entry.price.toLocaleString()} ریال
                            </span>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {idx === 0 && editingEntryId !== entry.id && (
                              <div className="flex items-center gap-1 ml-2">
                                <button 
                                  onClick={() => {
                                    setEditingEntryId(entry.id);
                                    setEditingPrice(entry.price.toString());
                                  }}
                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-all"
                                  title="ویرایش قیمت"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteEntry(selectedProductForHistory.id, entry.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-all"
                                  title="حذف سابقه"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            <span className="text-[9px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                              {entry.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{entry.description}</p>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400">
                          <Calculator className="w-3 h-3" /> ثبت شده توسط: {entry.changedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-slate-800 text-white py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-100 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> ثبت قیمت جدید برای این کالا
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
