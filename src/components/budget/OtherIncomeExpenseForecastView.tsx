
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Search, 
  Filter,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Target
} from 'lucide-react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo, OtherIncomeExpenseRecord } from './types';

export const OtherIncomeExpenseForecastView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo, setHeaderInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '1405',
    version: 'V1',
    orgUnit: 'all',
    baseCurrency: 'ریال',
    secondaryCurrency: 'دلار',
    exchangeRate: 500000,
    status: 'draft',
    description: 'پیش‌بینی هزینه‌های عملیاتی و درآمدهای غیرعملیاتی سال مالی ۱۴۰۵',
    startDate: '۱۴۰۵/۰۱/۰۱',
    endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const [records, setRecords] = useState<OtherIncomeExpenseRecord[]>([
    {
      id: '1',
      accountCode: '6101',
      accountTitle: 'هزینه ملزومات اداری',
      accountGroup: 'هزینه‌های اداری',
      nature: 'expense',
      month: 1,
      amountBaseCurrency: 50000000,
      exchangeRate: 500000,
      amountSecondaryCurrency: 100,
      costCenter: 'اداری',
      description: ''
    },
    {
      id: '2',
      accountCode: '7102',
      accountTitle: 'سود بانکی',
      accountGroup: 'درآمدهای غیرعملیاتی',
      nature: 'income',
      month: 1,
      amountBaseCurrency: 150000000,
      exchangeRate: 500000,
      amountSecondaryCurrency: 300,
      costCenter: 'عمومی',
      description: 'سود سپرده بلند مدت'
    }
  ]);

  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [natureFilter, setNatureFilter] = useState<string>('all');

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.month === activeMonth &&
      (r.accountTitle.includes(searchQuery) || r.accountCode.includes(searchQuery)) &&
      (natureFilter === 'all' || r.nature === natureFilter)
    );
  }, [records, activeMonth, searchQuery, natureFilter]);

  const handleAddRecord = () => {
    const newRecord: OtherIncomeExpenseRecord = {
      id: Date.now().toString(),
      accountCode: '',
      accountTitle: '',
      accountGroup: '',
      nature: 'expense',
      month: activeMonth,
      amountBaseCurrency: 0,
      exchangeRate: headerInfo.exchangeRate,
      amountSecondaryCurrency: 0,
      costCenter: '',
      description: ''
    };
    setRecords([...records, newRecord]);
  };

  const updateRecord = (id: string, field: keyof OtherIncomeExpenseRecord, value: any) => {
    setRecords(records.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'amountBaseCurrency') {
          updated.amountSecondaryCurrency = Number((updated.amountBaseCurrency / updated.exchangeRate).toFixed(2));
        }
        return updated;
      }
      return r;
    }));
  };

  const handleCopyForward = (record: OtherIncomeExpenseRecord) => {
    const newRecords = [...records];
    for (let m = activeMonth + 1; m <= 12; m++) {
      const existingIdx = newRecords.findIndex(r => r.month === m && r.accountCode === record.accountCode);
      const copy = { ...record, id: `copy-${record.id}-${m}`, month: m };
      if (existingIdx > -1) newRecords[existingIdx] = copy;
      else newRecords.push(copy);
    }
    setRecords(newRecords);
    alert('کپی با موفقیت انجام شد.');
  };

  const handleCopyFromPreviousMonth = () => {
    if (activeMonth <= 1 || activeMonth > 12) return;
    
    setRecords(prev => {
      const prevMonthRecords = prev.filter(r => r.month === activeMonth - 1);
      // We want to clone all records from the previous month to the current month
      // First, remove existing records for the current month if any (optional, or just append)
      // Usually, it's better to replace or append. Let's append but avoid duplicates if possible.
      // A better way: For each record in previous month, if it doesn't exist in current month, add it.
      // If it exists, update it? Or just clear and copy? Let's clear current and copy previous.
      const otherMonthsRecords = prev.filter(r => r.month !== activeMonth);
      const clonedRecords = prevMonthRecords.map(r => ({
        ...r,
        id: `copy-${r.id}-${activeMonth}`,
        month: activeMonth
      }));
      return [...otherMonthsRecords, ...clonedRecords];
    });
    alert(`اطلاعات ماه ${months[activeMonth - 2]} به ماه جاری کپی شد.`);
  };

  const totalExpenses = filteredRecords.filter(r => r.nature === 'expense').reduce((sum, r) => sum + r.amountBaseCurrency, 0);
  const totalIncomes = filteredRecords.filter(r => r.nature === 'income').reduce((sum, r) => sum + r.amountBaseCurrency, 0);

  const accounts = [
    { code: '6101', title: 'هزینه ملزومات اداری', group: 'هزینه‌های اداری', nature: 'expense' },
    { code: '6105', title: 'هزینه سوخت و روشنایی', group: 'هزینه‌های اداری', nature: 'expense' },
    { code: '7102', title: 'سود بانکی', group: 'درآمدهای غیرعملیاتی', nature: 'income' },
    { code: '8100', title: 'حساب کنترلی بودجه', group: 'کنترلی', nature: 'control' },
  ];

  const costCenters = ['اداری', 'فروش', 'تولید', 'عمومی', 'پشتیبانی'];

  return (
    <BudgetPageLayout
      title="پیش‌بینی سایر درآمدها و هزینه‌ها"
      headerInfo={headerInfo}
      onHeaderChange={(info) => setHeaderInfo({ ...headerInfo, ...info })}
      onBack={onBack}
    >
      <div className="flex flex-col h-full">
        {/* Month Selector Tabs */}
        <div className="bg-slate-50 px-4 pt-3 flex items-center gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {months.map((m, idx) => (
            <button
              key={m}
              onClick={() => setActiveMonth(idx + 1)}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all min-w-[80px] ${
                activeMonth === idx + 1
                  ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-[1px] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="جستجوی کد یا عنوان حساب..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-500 transition-all"
                  value={natureFilter}
                  onChange={(e) => setNatureFilter(e.target.value)}
                >
                  <option value="all">تمام ماهیت‌ها</option>
                  <option value="income">درآمد</option>
                  <option value="expense">هزینه</option>
                  <option value="control">کنترلی</option>
                </select>
             </div>
             {activeMonth > 1 && (
               <button 
                onClick={handleCopyFromPreviousMonth}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm"
               >
                 <Copy className="w-3.5 h-3.5" />
                 کپی از {months[activeMonth - 2]}
               </button>
             )}
          </div>

          <button 
            onClick={handleAddRecord}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            افزودن حساب به بودجه
          </button>
        </div>

        <div className="p-4 flex-1">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold w-48">کد و عنوان حساب</th>
                  <th className="px-4 py-3 font-bold text-center">ماهیت</th>
                  <th className="px-4 py-3 font-bold">مرکز هزینه</th>
                  <th className="px-4 py-3 font-bold text-left">مبلغ ({headerInfo.baseCurrency})</th>
                  <th className="px-4 py-3 font-bold text-center">نرخ تبدیل</th>
                  <th className="px-4 py-3 font-bold text-left bg-rose-50/30 text-rose-900">مبلغ ({headerInfo.secondaryCurrency})</th>
                  <th className="px-4 py-3 font-bold">توضیحات</th>
                  <th className="px-4 py-3 font-bold text-center w-24">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2">
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-rose-500"
                        value={record.accountCode}
                        onChange={(e) => {
                          const acc = accounts.find(a => a.code === e.target.value);
                          updateRecord(record.id, 'accountCode', e.target.value);
                          if (acc) {
                            updateRecord(record.id, 'accountTitle', acc.title);
                            updateRecord(record.id, 'accountGroup', acc.group);
                            updateRecord(record.id, 'nature', acc.nature);
                          }
                        }}
                      >
                        <option value="">انتخاب حساب...</option>
                        {accounts.map(a => (
                          <option key={a.code} value={a.code}>{a.code} - {a.title}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                       {record.nature === 'income' ? (
                         <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold">درآمد</span>
                       ) : record.nature === 'expense' ? (
                         <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-bold">هزینه</span>
                       ) : (
                         <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-bold">کنترلی</span>
                       )}
                    </td>
                    <td className="px-4 py-2">
                       <select 
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-rose-500"
                        value={record.costCenter}
                        onChange={(e) => updateRecord(record.id, 'costCenter', e.target.value)}
                      >
                        <option value="">مرکز هزینه...</option>
                        {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-left font-mono outline-none focus:border-rose-500"
                        value={record.amountBaseCurrency}
                        onChange={(e) => updateRecord(record.id, 'amountBaseCurrency', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-2 text-center font-mono text-slate-500">
                      {record.exchangeRate.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 bg-rose-50/10 text-left font-mono font-bold text-rose-700">
                      {record.amountSecondaryCurrency.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                       <input 
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-rose-500"
                        value={record.description}
                        onChange={(e) => updateRecord(record.id, 'description', e.target.value)}
                        placeholder="..."
                      />
                    </td>
                    <td className="px-4 py-2">
                       <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopyForward(record)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setRecords(records.filter(r => r.id !== record.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                   <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400">مجموع هزینه‌های ماه</p>
                   <p className="text-lg font-mono font-bold text-rose-600">{totalExpenses.toLocaleString()}</p>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                   <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400">مجموع درآمدهای ماه</p>
                   <p className="text-lg font-mono font-bold text-emerald-600">{totalIncomes.toLocaleString()}</p>
                </div>
             </div>
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                   <Target className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">تراز بودجه‌ای ماه</p>
                   <p className={`text-lg font-mono font-bold ${totalIncomes - totalExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(totalIncomes - totalExpenses).toLocaleString()}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};
