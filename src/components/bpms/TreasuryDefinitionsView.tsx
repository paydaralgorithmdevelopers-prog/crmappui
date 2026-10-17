import React, { useState } from 'react';
import { 
  Building2, 
  Inbox, 
  Monitor, 
  CreditCard, 
  UserCheck, 
  BookOpen, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Save,
  ArrowRight
} from 'lucide-react';
import { 
  BankAccount, 
  CashBox, 
  POSTerminal, 
  PaymentGateway, 
  PettyCash, 
  Checkbook 
} from '../../types';

interface TreasuryDefinitionsViewProps {
  type: string;
  onBack: () => void;
}

export const TreasuryDefinitionsView: React.FC<TreasuryDefinitionsViewProps> = ({
  type,
  onBack
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getTitle = () => {
    switch (type) {
      case 'treasury-bank-accounts': return 'حساب‌های بانکی';
      case 'treasury-cash-boxes': return 'صندوق‌ها';
      case 'treasury-pos-terminals': return 'کارتخوان‌ها';
      case 'treasury-payment-gateways': return 'درگاه‌های پرداخت';
      case 'treasury-petty-cash': return 'تنخواهگردان‌ها';
      case 'treasury-checkbooks': return 'دسته‌چک‌ها';
      default: return 'تعاریف خزانه';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'treasury-bank-accounts': return Building2;
      case 'treasury-cash-boxes': return Inbox;
      case 'treasury-pos-terminals': return Monitor;
      case 'treasury-payment-gateways': return CreditCard;
      case 'treasury-petty-cash': return UserCheck;
      case 'treasury-checkbooks': return BookOpen;
      default: return Settings;
    }
  };

  const Icon = getIcon();

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
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{getTitle()}</h1>
              <p className="text-xs text-slate-500 mt-0.5">مدیریت و پیکربندی اطلاعات پایه خزانه</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          تعریف جدید
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {isFormOpen ? (
          <DefinitionForm type={type} onCancel={() => setIsFormOpen(false)} />
        ) : (
          <DefinitionList type={type} />
        )}
      </div>
    </div>
  );
};

const DefinitionList: React.FC<{ type: string }> = ({ type }) => {
  const isCashBox = type === 'treasury-cash-boxes';
  const isCheckbook = type === 'treasury-checkbooks';

  // Mock data based on type
  const getData = () => {
    if (isCashBox) {
      return [
        { id: '1', title: 'صندوق دفتر مرکزی', cashier: 'علیرضا احمدی', currency: 'IRR', gl: '۱۰۱۰ - موجودی نقد', status: 'فعال' },
        { id: '2', title: 'صندوق ارزی (دلار)', cashier: 'مریم حسینی', currency: 'USD', gl: '۱۰۲۰ - موجودی ارزی', status: 'فعال' },
        { id: '3', title: 'صندوق تنخواه گردان', cashier: 'رضا کریمی', currency: 'IRR', gl: '۱۰۱۰ - موجودی نقد', status: 'فعال' },
      ];
    }
    if (isCheckbook) {
      return [
        { id: '1', title: 'دسته چک ۵۰ برگی - ملی', bank: 'بانک ملی ۱۲۰۳۰', start: '۱۰۰۰۰۱', end: '۱۰۰۰۵۰', count: '۵۰', status: 'فعال' },
        { id: '2', title: 'دسته چک ۲۵ برگی - پاسارگاد', bank: 'بانک پاسارگاد ۴۴۳۳', start: '۵۰۰۰۲۶', end: '۵۰۰۰۵۰', count: '۲۵', status: 'فعال' },
      ];
    }
    return [
      { id: '1', title: 'بانک ملی - شعبه مرکزی', sub: '۰۱۰۲۳۴۵۶۷۸۹', status: 'فعال' },
      { id: '2', title: 'بانک پاسارگاد - هزاره', sub: '۲۳۴-۸۰۰-۱۱۴۴-۱', status: 'فعال' },
    ];
  };

  const data = getData();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="جستجو..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-hidden focus:border-emerald-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-6 py-4">عنوان</th>
              {isCashBox ? (
                <>
                  <th className="px-6 py-4">صندوق‌دار</th>
                  <th className="px-6 py-4 text-center">ارز پایه</th>
                  <th className="px-6 py-4">حساب معین</th>
                </>
              ) : isCheckbook ? (
                <>
                  <th className="px-6 py-4">بانک مرتبط</th>
                  <th className="px-6 py-4">سریال شروع</th>
                  <th className="px-6 py-4">سریال پایان</th>
                  <th className="px-6 py-4 text-center">تعداد</th>
                </>
              ) : (
                <th className="px-6 py-4">شناسه / شماره</th>
              )}
              <th className="px-6 py-4">وضعیت</th>
              <th className="px-6 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">{item.title}</span>
                </td>
                {isCashBox ? (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-600">{item.cashier}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-black text-[10px]">
                        {item.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{item.gl}</td>
                  </>
                ) : isCheckbook ? (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-600">{(item as any).bank}</td>
                    <td className="px-6 py-4 font-mono text-slate-500 font-bold">{(item as any).start}</td>
                    <td className="px-6 py-4 font-mono text-slate-500 font-bold">{(item as any).end}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-black text-[10px]">
                        {(item as any).count}
                      </span>
                    </td>
                  </>
                ) : (
                  <td className="px-6 py-4 font-mono text-slate-500">{item.sub}</td>
                )}
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black border border-emerald-100">فعال</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DefinitionForm: React.FC<{ type: string; onCancel: () => void }> = ({ type, onCancel }) => {
  const [startSerial, setStartSerial] = useState<string>('');
  const [leafCount, setLeafCount] = useState<string>('');

  const calculateEndSerial = () => {
    const start = parseInt(startSerial);
    const count = parseInt(leafCount);
    if (!isNaN(start) && !isNaN(count) && count > 0) {
      return (start + count - 1).toString();
    }
    return '---';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render fields based on type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">عنوان</label>
          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors" />
        </div>
        
        {type === 'treasury-bank-accounts' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">بانک</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>بانک ملی</option>
                <option>بانک پاسارگاد</option>
                <option>بانک ملت</option>
                <option>بانک سامان</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">نوع حساب</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>جاری</option>
                <option>قرض‌الحسنه پس‌انداز</option>
                <option>کوتاه مدت</option>
                <option>بلند مدت</option>
                <option>سپرده ارزی</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شماره حساب</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شماره کارت</label>
              <input type="text" placeholder="#### - #### - #### - ####" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left tracking-[0.2em]" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شماره شبا (IBAN)</label>
              <input type="text" placeholder="IR" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">ارز پایه بانک</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option value="IRR">ریال ایران (IRR)</option>
                <option value="USD">دلار آمریکا (USD)</option>
                <option value="EUR">یورو (EUR)</option>
                <option value="AED">درهم امارات (AED)</option>
                <option value="GBP">پوند انگلیس (GBP)</option>
              </select>
            </div>
          </>
        )}

        {type === 'treasury-checkbooks' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">بانک متناظر</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>بانک ملی - جاری ۱۰۲۰۳۰</option>
                <option>بانک ملت - جاری ۵۵۶۶۷۷</option>
                <option>بانک پاسارگاد - کوتاه مدت ۴۴۳۳</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">سریال شروع</label>
              <input 
                type="text" 
                value={startSerial}
                onChange={(e) => setStartSerial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" 
                dir="ltr" 
                placeholder="100001"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">تعداد اوراق</label>
              <input 
                type="number" 
                value={leafCount}
                onChange={(e) => setLeafCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" 
                dir="ltr" 
                placeholder="25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">سریال پایان (سیستمی)</label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-black text-slate-600 text-left">
                {calculateEndSerial()}
              </div>
            </div>
          </>
        )}

        {type === 'treasury-cash-boxes' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">صندوق دار</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>علیرضا احمدی</option>
                <option>مریم حسینی</option>
                <option>رضا کریمی</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">ارز صندوق</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option value="IRR">ریال ایران (IRR)</option>
                <option value="USD">دلار آمریکا (USD)</option>
                <option value="EUR">یورو (EUR)</option>
                <option value="AED">درهم امارات (AED)</option>
                <option value="GBP">پوند انگلیس (GBP)</option>
              </select>
            </div>
          </>
        )}

        {type === 'treasury-pos-terminals' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">حساب بانکی متناظر</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>بانک ملی - جاری ۱۰۲۰۳۰</option>
                <option>بانک ملت - جاری ۵۵۶۶۷۷</option>
                <option>بانک پاسارگاد - کوتاه مدت ۴۴۳۳</option>
              </select>
              <p className="text-[9px] text-slate-400 font-bold pr-1">تراکنش‌های این کارتخوان مستقیماً به این حساب واریز می‌شوند.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">شماره پایانه (Terminal ID)</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
            </div>
          </>
        )}

        {type === 'treasury-petty-cash' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">تنخواه‌دار مسئول</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>علیرضا احمدی</option>
                <option>مریم حسینی</option>
                <option>رضا کریمی</option>
                <option>سارا جاوید</option>
              </select>
              <p className="text-[9px] text-slate-400 font-bold pr-1">شخص مسئول مدیریت این تنخواه گردان.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">سقف تنخواه (ریال)</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" placeholder="0" />
            </div>
          </>
        )}

        {type === 'treasury-payment-gateways' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">حساب بانکی متناظر</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
                <option>بانک ملی - جاری ۱۰۲۰۳۰</option>
                <option>بانک ملت - جاری ۵۵۶۶۷۷</option>
                <option>بانک پاسارگاد - کوتاه مدت ۴۴۳۳</option>
              </select>
              <p className="text-[9px] text-slate-400 font-bold pr-1">وجوه دریافتی از این درگاه به این حساب واریز می‌گردد.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">کد پذیرنده (Merchant ID)</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-hidden focus:border-emerald-500 text-left" dir="ltr" />
            </div>
          </>
        )}

        {/* Common GL Account Mapping */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">حساب معین مرتبط</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-hidden focus:border-emerald-500 transition-colors">
            <option>۱۰۱۰ - موجودی نقد و بانک</option>
            <option>۱۰۲۰ - اسناد دریافتنی</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">وضعیت</label>
          <div className="flex items-center gap-4 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-xs font-bold text-slate-700">فعال</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-xs font-bold text-slate-700">غیرفعال</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          انصراف
        </button>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Save className="w-5 h-5" />
          ذخیره اطلاعات
        </button>
      </div>
    </div>
  );
};
