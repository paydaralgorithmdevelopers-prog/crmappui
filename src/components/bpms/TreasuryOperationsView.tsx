import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  User, 
  CheckCircle2, 
  MoreVertical,
  Activity,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Save,
  Trash2,
  FileText,
  Eye,
  ChevronDown,
  Info,
  DollarSign,
  ArrowLeft,
  BookOpen,
  Monitor
} from 'lucide-react';
import { TreasuryOperation, TreasuryOperationType, TreasuryTransactionType } from '../../types';

interface TreasuryOperationsViewProps {
  onBack: () => void;
}

export const TreasuryOperationsView: React.FC<TreasuryOperationsViewProps> = ({
  onBack
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [operationType, setOperationType] = useState<TreasuryOperationType>('receive');
  const [transactionType, setTransactionType] = useState<TreasuryTransactionType>('cash');
  const [sourceType, setSourceType] = useState<string>('partner');
  const [destinationType, setDestinationType] = useState<string>('bank');
  const [amount, setAmount] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [currency, setCurrency] = useState('IRR');

  // Accounting Preview States
  const [drAccount, setDrAccount] = useState('۱۰۲۰ - حساب‌های دریافتنی تجاری');
  const [crAccount, setCrAccount] = useState('۱۰۱۰ - موجودی نقد و بانک / بانک‌ها');

  const operations: TreasuryOperation[] = [
    {
      id: '1',
      date: '۱۴۰۵/۰۶/۲۰',
      voucherNumber: 'TR-1001',
      accountingVoucherNumber: 'ACC-5002',
      description: 'بابت تسویه فاکتور فروش شماره ۱۲۴',
      baseCurrency: 'IRR',
      exchangeRateMain: 1,
      exchangeRateSub: 1,
      fiscalYear: '۱۴۰۵',
      transactionType: 'cash',
      operationType: 'receive',
      amount: 150000000,
      fee: 0,
      sourceType: 'partner',
      sourceId: 'مشتری: ناصر خسروی',
      destinationType: 'bank',
      destinationId: 'بانک ملی - جاری'
    },
    {
      id: '2',
      date: '۱۴۰۵/۰۶/۲۲',
      voucherNumber: 'TR-1002',
      description: 'پرداخت تنخواه واحد اداری',
      baseCurrency: 'IRR',
      exchangeRateMain: 1,
      exchangeRateSub: 1,
      fiscalYear: '۱۴۰۵',
      transactionType: 'cash',
      operationType: 'pay',
      amount: 50000000,
      fee: 0,
      sourceType: 'bank',
      sourceId: 'بانک ملت - مرکزی',
      destinationType: 'pettycash',
      destinationId: 'تنخواه واحد اداری'
    }
  ];

  const filteredOperations = operations.filter(op => 
    op.description.includes(searchTerm) || 
    op.voucherNumber.includes(searchTerm)
  );

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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">عملیات خزانه</h1>
              <p className="text-xs text-slate-500 mt-0.5">مدیریت دریافت، پرداخت و جابه‌جایی وجوه نقد و اسناد</p>
            </div>
          </div>
        </div>

        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            ثبت عملیات جدید
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="flex-1 overflow-auto space-y-6 pb-20">
          {/* Master Form */}
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Section 1: Document Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                   <FileText className="w-4 h-4 text-emerald-600" />
                   اطلاعات پایه سند
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">تاریخ سند</label>
                    <input type="text" defaultValue="۱۴۰۵/۰۶/۲۵" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شماره سند</label>
                    <input type="text" placeholder="سیستمی" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">ارز عملیات</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500"
                    >
                      <option value="IRR">ریال ایران</option>
                      <option value="USD">دلار آمریکا</option>
                      <option value="EUR">یورو</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شرح / توضیحات سند</label>
                  <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 resize-none" />
                </div>
              </div>

              {/* Section 2: Transaction Type & Operation */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                   <Activity className="w-4 h-4 text-emerald-600" />
                   نوع تراکنش و عملیات
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">نوع تراکنش</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                      {[
                        { id: 'cash', label: 'نقد', icon: DollarSign },
                        { id: 'check', label: 'اسناد / چک', icon: FileText },
                        { id: 'document', label: 'اسناد/چک(ضمانت)', icon: FileText },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTransactionType(t.id as TreasuryTransactionType)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
                            transactionType === t.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">نوع عملیات</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                      {[
                        { id: 'receive', label: 'دریافت', icon: ArrowDownCircle },
                        { id: 'pay', label: 'پرداخت', icon: ArrowUpCircle },
                        { id: 'transfer', label: 'مدیریت وجوه', icon: Repeat },
                      ].map(o => (
                        <button
                          key={o.id}
                          onClick={() => setOperationType(o.id as TreasuryOperationType)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
                            operationType === o.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <o.icon className="w-3.5 h-3.5" />
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">مبلغ تراکنش</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="۰"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-black outline-hidden focus:border-emerald-500 text-left" 
                        dir="ltr"
                        onChange={(e) => setAmount(Number(e.target.value.replace(/,/g, '')))}
                      />
                      <span className="absolute left-4 top-3 text-[10px] font-bold text-slate-400">IRR</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">فاکتور مرتبط (اختیاری)</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden appearance-none focus:border-emerald-500">
                        <option>انتخاب فاکتور...</option>
                        <option>SI-102 - فاکتور فروش #۵۵۶</option>
                        <option>PI-004 - صورتحساب خرید #۹۹</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Dynamic Source & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                     <ArrowRight className="w-4 h-4 text-rose-500" />
                     مبدأ تراکنش (از کجا؟)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">نوع مبدأ</label>
                    <select 
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500"
                    >
                      <option value="partner">طرف حساب</option>
                      <option value="bank">حساب بانکی</option>
                      <option value="cashbox">صندوق</option>
                      <option value="pos">کارتخوان</option>
                      <option value="gateway">درگاه پرداخت</option>
                      <option value="pettycash">تنخواهگردان</option>
                      <option value="check">چک / سند</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">انتخاب مبدأ مرتبط</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden appearance-none focus:border-emerald-500">
                        <option>جستجو و انتخاب...</option>
                        <option>بانک پاسارگاد - ۱۲۲</option>
                        <option>صندوق مرکزی</option>
                        <option>احمد علوی (طرف حساب)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                     <ArrowLeft className="w-4 h-4 text-emerald-500" />
                     مقصد تراکنش (به کجا؟)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">نوع مقصد</label>
                    <select 
                      value={destinationType}
                      onChange={(e) => setDestinationType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500"
                    >
                      <option value="partner">طرف حساب</option>
                      <option value="bank">حساب بانکی</option>
                      <option value="cashbox">صندوق</option>
                      <option value="pos">کارتخوان</option>
                      <option value="gateway">درگاه پرداخت</option>
                      <option value="pettycash">تنخواهگردان</option>
                      <option value="check">چک / سند</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">انتخاب مقصد مرتبط</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden appearance-none focus:border-emerald-500">
                        <option>جستجو و انتخاب...</option>
                        <option>بانک ملی - جاری مرکزی</option>
                        <option>شرکت پایدار (طرف حساب)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Check Info (Conditional) */}
              {transactionType === 'check' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                     <BookOpen className="w-4 h-4 text-emerald-600" />
                     اطلاعات چک / سند
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">شماره چک</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">تاریخ سررسید</label>
                      <input type="text" placeholder="۱۴۰۵/--/--" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">شماره صیاد (۱۶ رقم)</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">بانک صادرکننده</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">توضیحات ردیف</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accounting Preview (Relocated to bottom) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4 mb-6">
                 <Monitor className="w-4 h-4 text-emerald-600" />
                 پیش‌نمایش سند حسابداری (سند موقت)
              </div>
              
              <div className="space-y-4">
                {amount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* DR Row */}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-700">بدهکار (DR)</span>
                        <span className="text-sm font-black text-emerald-600">{amount.toLocaleString()} ریال</span>
                      </div>
                      <select 
                        value={drAccount}
                        onChange={(e) => setDrAccount(e.target.value)}
                        className="w-full bg-emerald-100/50 border border-emerald-200 rounded-lg px-2 py-1 text-xs font-black text-emerald-900 outline-hidden focus:border-emerald-500 transition-colors"
                      >
                        <option value="۱۰۲۰ - حساب‌های دریافتنی تجاری">۱۰۲۰ - حساب‌های دریافتنی تجاری</option>
                        <option value="۱۰۱۱ - موجودی نقد و بانک / صندوق">۱۰۱۱ - موجودی نقد و بانک / صندوق</option>
                        <option value="۱۰۱۲ - اسناد دریافتنی">۱۰۱۲ - اسناد دریافتنی</option>
                        <option value="۸۰۱۰ - هزینه‌های عملیاتی">۸۰۱۰ - هزینه‌های عملیاتی</option>
                      </select>
                      <div className="text-[10px] font-bold text-emerald-600/70">تفصیلی: ناصر خسروی</div>
                    </div>
                    
                    {/* CR Row */}
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-rose-700">بستانکار (CR)</span>
                        <span className="text-sm font-black text-rose-600">{amount.toLocaleString()} ریال</span>
                      </div>
                      <select 
                        value={crAccount}
                        onChange={(e) => setCrAccount(e.target.value)}
                        className="w-full bg-rose-100/50 border border-rose-200 rounded-lg px-2 py-1 text-xs font-black text-rose-900 outline-hidden focus:border-rose-500 transition-colors"
                      >
                        <option value="۱۰۱۰ - موجودی نقد و بانک / بانک‌ها">۱۰۱۰ - موجودی نقد و بانک / بانک‌ها</option>
                        <option value="۴۰۱۰ - حساب‌های پرداختنی تجاری">۴۰۱۰ - حساب‌های پرداختنی تجاری</option>
                        <option value="۴۰۱۱ - اسناد پرداختنی">۴۰۱۱ - اسناد پرداختنی</option>
                        <option value="۹۰۱۰ - سایر درآمدها">۹۰۱۰ - سایر درآمدها</option>
                      </select>
                      <div className="text-[10px] font-bold text-rose-600/70">تفصیلی: بانک ملی مرکزی</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-center space-y-2 opacity-30 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Info className="w-8 h-8" />
                    <p className="text-[10px] font-bold">پس از وارد کردن مبلغ، پیش‌نمایش سند حسابداری در این بخش تولید می‌شود.</p>
                  </div>
                )}
              </div>

              {amount > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400">جمع بدهکار:</span>
                      <span className="text-xs font-black text-slate-700">{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400">جمع بستانکار:</span>
                      <span className="text-xs font-black text-slate-700">{amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    سند تراز است
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 lg:right-72 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-20 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                انصراف
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors">
                ذخیره و جدید
              </button>
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
                <Save className="w-5 h-5" />
                ذخیره و ثبت سند
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="جستجو در شرح یا شماره سند..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-hidden focus:border-emerald-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">سند / تاریخ</th>
                  <th className="px-6 py-4">نوع عملیات</th>
                  <th className="px-6 py-4">شرح</th>
                  <th className="px-6 py-4">مبلغ</th>
                  <th className="px-6 py-4">مبدأ / مقصد</th>
                  <th className="px-6 py-4">وضعیت حسابداری</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOperations.map(op => (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{op.voucherNumber}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{op.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                        op.operationType === 'receive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        op.operationType === 'pay' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {op.operationType === 'receive' ? 'دریافت' : op.operationType === 'pay' ? 'پرداخت' : 'مدیریت وجوه'}
                        {op.transactionType === 'check' && ' (چک)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 max-w-xs truncate">{op.description}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-black text-slate-900">{op.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-rose-500 font-bold">از: {op.sourceId}</span>
                        <span className="text-[9px] text-emerald-500 font-bold">به: {op.destinationId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {op.accountingVoucherNumber ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-bold text-[10px]">{op.accountingVoucherNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">بدون سند</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-colors border border-transparent hover:border-slate-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-transparent hover:border-slate-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
