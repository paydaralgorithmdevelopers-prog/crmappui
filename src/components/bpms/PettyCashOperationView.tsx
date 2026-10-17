import React, { useState } from 'react';
import { 
  ArrowRight, 
  Plus, 
  Trash2, 
  Save, 
  Calculator, 
  Wallet,
  User,
  Hash,
  FileText,
  Building2,
  ChevronDown
} from 'lucide-react';

interface PettyCashOperationProps {
  onBack: () => void;
}

interface PettyCashExpense {
  id: string;
  glAccount: string;
  detailedAccount: string;
  amountBase: number;
  amountMain: number;
  amountSecondary: number;
  description: string;
}

export const PettyCashOperationView: React.FC<PettyCashOperationProps> = ({ onBack }) => {
  const [pettyCashHolder, setPettyCashHolder] = useState('علیرضا احمدی');
  const [pettyCashNumber, setPettyCashNumber] = useState('PC-1405-0042');
  const [currency, setCurrency] = useState('IRR');
  const [baseToMainRate, setBaseToMainRate] = useState(1);
  const [baseToSecondaryRate, setBaseToSecondaryRate] = useState(1);
  const [expenses, setExpenses] = useState<PettyCashExpense[]>([
    { 
      id: '1', 
      glAccount: '۸۰۱۰ - هزینه‌های عملیاتی', 
      detailedAccount: 'هزینه پذیرایی', 
      amountBase: 4500000, 
      amountMain: 4500000, 
      amountSecondary: 0, 
      description: 'خرید چای و قند برای دفتر' 
    }
  ]);

  const pettyCashBalance = 150000000; // Mock balance
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amountBase, 0);
  const remainingBalance = pettyCashBalance - totalExpenses;

  const addExpense = () => {
    const newExpense: PettyCashExpense = {
      id: Date.now().toString(),
      glAccount: '',
      detailedAccount: '',
      amountBase: 0,
      amountMain: 0,
      amountSecondary: 0,
      description: ''
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateExpense = (id: string, field: keyof PettyCashExpense, value: any) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 lg:p-6 space-y-6 overflow-hidden rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">عملیات تنخواه</h1>
              <p className="text-xs text-slate-500 mt-0.5">ثبت اسناد هزینه و تسویه تنخواه گردان</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">مانده تنخواه</div>
            <div className="text-sm font-black text-emerald-600">{remainingBalance.toLocaleString()} <span className="text-[10px] mr-0.5">ریال</span></div>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
            <Save className="w-5 h-5" />
            تأیید و ثبت نهایی
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-auto space-y-6">
        {/* Petty Cash Header Info */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase flex items-center gap-1.5">
                <User className="w-3 h-3" />
                تنخواه گردان
              </label>
              <select 
                value={pettyCashHolder}
                onChange={(e) => setPettyCashHolder(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-amber-500 transition-colors"
              >
                <option value="علیرضا احمدی">علیرضا احمدی</option>
                <option value="مریم حسینی">مریم حسینی</option>
                <option value="رضا کریمی">رضا کریمی</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                شماره تنخواه
              </label>
              <input 
                type="text" 
                value={pettyCashNumber}
                onChange={(e) => setPettyCashNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black font-mono outline-hidden focus:border-amber-500 transition-colors" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase flex items-center gap-1.5">
                <Calculator className="w-3 h-3" />
                مجموع هزینه‌ها
              </label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-rose-600">
                {totalExpenses.toLocaleString()} <span className="text-[10px] mr-0.5">{currency}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                تعداد اسناد
              </label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700">
                {expenses.length} مورد
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase">انتخاب ارز</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-amber-500 outline-hidden"
              >
                <option value="IRR">ریال ایران (IRR)</option>
                <option value="USD">دلار آمریکا (USD)</option>
                <option value="EUR">یورو (EUR)</option>
                <option value="AED">درهم امارات (AED)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase">نرخ ارز پایه به اصلی</label>
              <input 
                type="number" 
                value={baseToMainRate}
                onChange={(e) => setBaseToMainRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black font-mono focus:border-amber-500 outline-hidden" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-1 uppercase">نرخ ارز پایه به فرعی</label>
              <input 
                type="number" 
                value={baseToSecondaryRate}
                onChange={(e) => setBaseToSecondaryRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black font-mono focus:border-amber-500 outline-hidden" 
              />
            </div>

            <div className="flex items-end pb-1">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 w-full">
                <div className="text-[9px] font-black text-amber-600 uppercase mb-1">اطلاعات تکمیلی ارز</div>
                <div className="text-[10px] font-bold text-amber-800 leading-relaxed">
                  تمامی محاسبات مالی بر اساس نرخ‌های فوق در اسناد حسابداری اعمال خواهد شد.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-800">ریـز اسناد هزینـه</h3>
            <button 
              onClick={addExpense}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-black text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              افزودن ردیف هزینه
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 w-12 text-center">ردیف</th>
                  <th className="px-4 py-4">حساب معین</th>
                  <th className="px-4 py-4">تفصیلی</th>
                  <th className="px-4 py-4 text-center">مبلغ پایه</th>
                  <th className="px-4 py-4 text-center">مبلغ اصلی</th>
                  <th className="px-4 py-4 text-center">مبلغ فرعی</th>
                  <th className="px-4 py-4">شرح سند</th>
                  <th className="px-4 py-4 w-12 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map((exp, index) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-center font-mono text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <select 
                        value={exp.glAccount}
                        onChange={(e) => updateExpense(exp.id, 'glAccount', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:border-amber-500"
                      >
                        <option value="">انتخاب معین...</option>
                        <option value="۸۰۱۰ - هزینه‌های عملیاتی">۸۰۱۰ - هزینه‌های عملیاتی</option>
                        <option value="۸۰۲۰ - هزینه‌های اداری">۸۰۲۰ - هزینه‌های اداری</option>
                        <option value="۸۰۳۰ - هزینه‌های توزیع">۸۰۳۰ - هزینه‌های توزیع</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 min-w-[150px]">
                      <input 
                        type="text" 
                        value={exp.detailedAccount}
                        onChange={(e) => updateExpense(exp.id, 'detailedAccount', e.target.value)}
                        placeholder="تفصیلی..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:border-amber-500" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={exp.amountBase || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateExpense(exp.id, 'amountBase', val);
                          // Auto calculate main and secondary if rate is 1 or something
                          updateExpense(exp.id, 'amountMain', val * baseToMainRate);
                          updateExpense(exp.id, 'amountSecondary', val * baseToSecondaryRate);
                        }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black font-mono text-center focus:border-amber-500" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={exp.amountMain || ''}
                        onChange={(e) => updateExpense(exp.id, 'amountMain', Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black font-mono text-center focus:border-amber-500" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={exp.amountSecondary || ''}
                        onChange={(e) => updateExpense(exp.id, 'amountSecondary', Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black font-mono text-center focus:border-amber-500" 
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <input 
                        type="text" 
                        value={exp.description}
                        onChange={(e) => updateExpense(exp.id, 'description', e.target.value)}
                        placeholder="توضیحات هزینه..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:border-amber-500" 
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => removeExpense(exp.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400">جمع کل ردیف‌ها:</span>
                <span className="text-sm font-black text-slate-900">{totalExpenses.toLocaleString()} <span className="text-[10px] text-slate-400">ریال</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400">طرفیت بستانکار:</span>
                <span className="text-xs font-black text-rose-600">۴۰۳۰ - تنخواه گردان ({pettyCashHolder})</span>
              </div>
            </div>
            <button 
              onClick={addExpense}
              className="bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-500 px-4 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              اضافه کردن ردیف جدید
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
