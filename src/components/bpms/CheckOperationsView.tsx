import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  User, 
  CheckCircle2, 
  MoreVertical,
  Activity,
  Calendar,
  Save,
  Trash2,
  FileText,
  Eye,
  ChevronDown,
  Info,
  DollarSign,
  Building2,
  Inbox,
  History,
  AlertTriangle,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { CheckInstance, CheckStatus, CheckOperation } from '../../types';

interface CheckOperationsViewProps {
  type: string;
  onBack: () => void;
}

export const CheckOperationsView: React.FC<CheckOperationsViewProps> = ({
  type,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'operation' | 'history'>('operation');
  const [opType, setOpType] = useState<string>('');
  const [selectedCheck, setSelectedCheck] = useState<CheckInstance | null>(null);

  const isIncoming = type === 'treasury-ops-check-incoming';

  const incomingOps = [
    { id: 'RC-02', label: 'واگذاری چک به بانک جهت وصول', dr: 'چکهای در جریان وصول', cr: 'چکهای دریافتی نزد خزانه', status: 'در جریان وصول' },
    { id: 'RC-03', label: 'استرداد چک از بانک', dr: 'چکهای دریافتی نزد خزانه', cr: 'چکهای در جریان وصول', status: 'نزد خزانه' },
    { id: 'RC-04', label: 'وصول چک', dr: 'بانک', cr: 'چکهای در جریان وصول', status: 'وصول‌شده' },
    { id: 'RC-05', label: 'برگشت چک', dr: 'چکهای برگشتی / مطالبات از مشتری', cr: 'چکهای در جریان وصول', status: 'برگشتی' },
    { id: 'RC-06', label: 'خرج / واگذاری چک به بستانکار', dr: 'حساب پرداختنی شخص مقصد', cr: 'چکهای دریافتی نزد خزانه', status: 'خرج‌شده' },
    { id: 'RC-07', label: 'استرداد چک خرج‌شده', dr: 'چکهای دریافتی نزد خزانه', cr: 'حساب پرداختنی شخص مقصد', status: 'نزد خزانه' },
    { id: 'RC-08', label: 'عودت چک به صادرکننده', dr: 'حساب دریافتنی مشتری', cr: 'چکهای دریافتی نزد خزانه', status: 'عودت‌شده' },
    { id: 'RC-09', label: 'انتقال چک برگشتی به مطالبات حقوقی', dr: 'مطالبات حقوقی', cr: 'چکهای برگشتی', status: 'در پیگیری حقوقی' },
    { id: 'RC-10', label: 'وصول چک برگشتی/حقوقی', dr: 'بانک / صندوق', cr: 'چکهای برگشتی یا مطالبات حقوقی', status: 'وصول‌شده' },
    { id: 'RC-11', label: 'ابطال / برگشت ثبت چک', dr: 'حساب دریافتنی مشتری', cr: 'اسناد دریافتنی', status: 'باطل‌شده' },
  ];

  const outgoingOps = [
    { id: 'PC-02', label: 'تسویه / پاس شدن چک', dr: 'اسناد پرداختنی / چکهای پرداختی', cr: 'بانک', status: 'تسویه-شده' },
    { id: 'PC-03', label: 'استرداد چک پرداختی', dr: 'اسناد پرداختنی / چکهای پرداختی', cr: 'حساب پرداختنی بستانکار', status: 'مستردشده' },
    { id: 'PC-04', label: 'ابطال چک پرداختی', dr: 'اسناد پرداختنی / چکهای پرداختی', cr: 'حساب پرداختنی بستانکار', status: 'باطل‌شده' },
    { id: 'PC-05', label: 'برگشت چک پرداختی', dr: 'برگشت اثر تسویه', cr: 'بانک / حساب واسط', status: 'برگشتی' },
    { id: 'PC-06', label: 'تسویه چک پرداختی برگشتی', dr: 'بدهی ناشی از چک برگشتی', cr: 'بانک / صندوق', status: 'تسویه-شده' },
  ];

  const currentOps = isIncoming ? incomingOps : outgoingOps;

  // Mock Checks
  const checks: CheckInstance[] = [
    {
      id: '1',
      amount: 250000000,
      partnerId: 'تولیدی مهرآوا',
      bankName: 'بانک سپه',
      currentVaultId: 'صندوق مرکزی',
      checkNumber: '۴۴۵۵۶۶',
      dueDate: '۱۴۰۵/۰۷/۱۰',
      sayadNumber: '۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶',
      type: isIncoming ? 'incoming' : 'outgoing',
      status: 'in_vault',
      currentLocation: 'صندوق نزد شرکت'
    },
    {
      id: '2',
      amount: 120000000,
      partnerId: 'بازرگانی علوی',
      bankName: 'بانک ملی',
      checkNumber: '۸۸۹۹۰۰',
      dueDate: '۱۴۰۵/۰۶/۳۰',
      sayadNumber: '۹۸۷۶۵۴۳۲۱۰۹۸۷۶۵۴',
      type: isIncoming ? 'incoming' : 'outgoing',
      status: 'received',
      currentLocation: 'در انتظار تحویل'
    }
  ];

  const checkHistory = [
    { date: '۱۴۰۵/۰۶/۱۵', op: 'دریافت چک از مشتری', status: 'دریافت شده', location: 'واحد حسابداری' },
    { date: '۱۴۰۵/۰۶/۱۸', op: 'واگذاری به صندوق', status: 'نزد صندوق', location: 'صندوق مرکزی' },
  ];

  const currentOpInfo = currentOps.find(o => o.id === opType);

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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${isIncoming ? 'bg-blue-600 shadow-blue-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}>
              {isIncoming ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{isIncoming ? 'عملیات چک دریافتی' : 'عملیات چک پرداختی'}</h1>
              <p className="text-xs text-slate-500 mt-0.5">مدیریت رویدادهای حسابداری و وضعیت چک‌های {isIncoming ? 'دریافتی' : 'پرداختی'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Step 1: Operation Type */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
                   <Activity className="w-4 h-4 text-emerald-600" />
                   انتخاب رویداد عملیاتی
                </div>
                <span className="text-[10px] font-bold text-slate-400">شناسه رویداد: {opType || '---'}</span>
              </div>
              <div className="relative">
                <select 
                  value={opType} 
                  onChange={(e) => setOpType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-black outline-hidden focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>--- انتخاب رویداد عملیاتی ---</option>
                  {currentOps.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.label} ({op.id})
                    </option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {currentOpInfo && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">بدهکار</div>
                      <div className="text-[11px] font-bold text-emerald-700">{currentOpInfo.dr}</div>
                    </div>
                    <div className="space-y-1 border-x border-slate-200 px-4">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">بستانکار</div>
                      <div className="text-[11px] font-bold text-rose-700">{currentOpInfo.cr}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">وضعیت جدید</div>
                      <div className="text-[11px] font-bold text-blue-700">{currentOpInfo.status}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Check Selection */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                 <Search className="w-4 h-4 text-emerald-600" />
                 جستجو و انتخاب چک
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="جستجو بر اساس شماره چک، صیاد یا طرف حساب..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {checks.map(check => (
                  <button
                    key={check.id}
                    onClick={() => setSelectedCheck(check)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right ${
                      selectedCheck?.id === check.id 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800">چک شماره {check.checkNumber}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{check.bankName} - {check.partnerId}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-emerald-600">{check.amount.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5">سررسید: {check.dueDate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2.5: Horizontal Check Info (If selected) */}
            {selectedCheck && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs border-b border-slate-100 pb-4">
                   <Info className="w-4 h-4 text-blue-600" />
                   اطلاعات چک انتخاب شده
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'شماره چک', value: selectedCheck.checkNumber },
                    { label: 'مبلغ', value: `${selectedCheck.amount.toLocaleString()} ریال` },
                    { label: 'بانک', value: selectedCheck.bankName },
                    { label: 'طرف حساب', value: selectedCheck.partnerId },
                    { label: 'سررسید', value: selectedCheck.dueDate },
                    { label: 'وضعیت فعلی', value: selectedCheck.status === 'in_vault' ? 'نزد صندوق' : 'دریافت شده' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{item.label}</span>
                      <span className="text-[11px] font-black text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Operation Details */}
            {selectedCheck && opType && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    تکمیل اطلاعات {currentOpInfo?.label}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">تاریخ عملیات</label>
                    <div className="relative">
                      <input type="text" defaultValue="۱۴۰۵/۰۶/۲۵" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                  
                  {(opType === 'RC-02' || opType === 'RC-04' || opType === 'PC-02') && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 pr-1">بانک مقصد</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500">
                        <option>بانک ملت - جاری ۱۰۲۰</option>
                        <option>بانک سپه - ۵۵۶۶</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 pr-1">مبلغ کارمزد (در صورت وجود)</label>
                    <input type="text" defaultValue="۰" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 pr-1">توضیحات و شرح رویداد</label>
                  <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500" placeholder="توضیحات تکمیلی جهت ثبت در دفتر روزنامه..." />
                </div>
              </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-72 xl:right-80 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-20 flex items-center justify-end gap-3 shadow-2xl transition-all duration-300">
          <button 
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            انصراف
          </button>
          <button 
            disabled={!selectedCheck || !opType}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
              !selectedCheck || !opType 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <Save className="w-5 h-5" />
            تایید و ثبت رویداد چک
          </button>
        </div>
      </div>
    </div>
  );
};
