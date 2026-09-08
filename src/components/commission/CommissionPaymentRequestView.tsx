import React, { useState } from 'react';
import { 
  Send, 
  History, 
  Search, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Users,
  MapPin,
  Package,
  X,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentRequest {
  id: string;
  date: string;
  personName: string;
  period: string;
  amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'rejected';
}

const mockRequests: PaymentRequest[] = [
  { id: 'REQ-001', date: '۱۴۰۶/۰۲/۱۵', personName: 'علیرضا حسینی', period: 'اردیبهشت ۱۴۰۶', amount: 50000000, status: 'paid' },
  { id: 'REQ-002', date: '۱۴۰۶/۰۲/۱۸', personName: 'علیرضا حسینی', period: 'اردیبهشت ۱۴۰۶', amount: 30000000, status: 'approved' },
  { id: 'REQ-003', date: '۱۴۰۶/۰۲/۲۰', personName: 'سارا احمدی', period: 'اردیبهشت ۱۴۰۶', amount: 45000000, status: 'submitted' },
];

export const CommissionPaymentRequestView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedPerson, setSelectedPerson] = useState('علیرضا حسینی');
  const [balance, setBalance] = useState(84000000);
  const [requestAmount, setRequestAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currency, setCurrency] = useState('ریال');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  const getStatusInfo = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'paid': return { label: 'پرداخت شده', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 };
      case 'approved': return { label: 'تایید شده', color: 'bg-sky-50 text-sky-600', icon: CheckCircle2 };
      case 'submitted': return { label: 'ثبت شده', color: 'bg-amber-50 text-amber-600', icon: Clock };
      case 'rejected': return { label: 'رد شده', color: 'bg-rose-50 text-rose-600', icon: XCircle };
      default: return { label: 'پیش‌نویس', color: 'bg-slate-50 text-slate-400', icon: FileText };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Payment Request Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-600" /> ثبت درخواست پرداخت جدید
              </h3>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 mr-1">تاریخ درخواست</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input readOnly value="۱۴۰۶/۰۲/۲۱" className="w-full bg-slate-100 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-[11px] font-bold text-slate-600 outline-hidden" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 mr-1">دوره مربوطه</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] outline-hidden focus:border-rose-500 transition-all">
                    <option>اردیبهشت ۱۴۰۶</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 mr-1">نوع ارز</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] outline-hidden focus:border-rose-500 transition-all">
                    <option value="ریال">ریال (IRR)</option>
                    <option value="دلار">دلار (USD)</option>
                    <option value="یورو">یورو (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 mr-1">انتخاب کارشناس</label>
                <div className="relative">
                  <Users className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select 
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-[11px] font-bold text-slate-700 outline-hidden focus:border-rose-500 transition-all appearance-none"
                  >
                    <option>علیرضا حسینی</option>
                    <option>سارا احمدی</option>
                  </select>
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-800">مانده پورسانت قابل درخواست:</span>
                  <span className="text-sm font-mono font-bold text-rose-900">{formatNumber(balance)} <span className="text-[9px] font-normal">{currency}</span></span>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-rose-600 mr-1">مبلغ درخواستی ({currency})</label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-3 w-4 h-4 text-rose-400" />
                    <input 
                      type="number"
                      max={balance}
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(Number(e.target.value))}
                      className="w-full bg-white border border-rose-200 rounded-xl pr-10 pl-4 py-2.5 text-xs font-mono font-bold text-rose-700 focus:ring-4 focus:ring-rose-500/10 outline-hidden transition-all"
                    />
                  </div>
                  {requestAmount > balance && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-600 mt-1">
                      <AlertCircle className="w-3 h-3" /> مبلغ درخواستی نمی‌تواند بیشتر از مانده باشد.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 mr-1">توضیحات درخواست</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="دلیل درخواست (مثلاً پیش‌پرداخت هزینه‌های مأموریت و...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">انصراف</button>
                <button 
                  disabled={requestAmount <= 0 || requestAmount > balance}
                  className="py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> ثبت درخواست
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Requests List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" /> سوابق درخواست‌های اخیر
              </h3>
              <div className="relative">
                <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input placeholder="جستجو در سوابق..." className="bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-1.5 text-[10px] w-48 focus:border-rose-500 outline-hidden" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-4 border-b border-slate-100">شماره / تاریخ</th>
                    <th className="px-4 py-4 border-b border-slate-100">کارشناس</th>
                    <th className="px-4 py-4 border-b border-slate-100">دوره</th>
                    <th className="px-4 py-4 border-b border-slate-100">مبلغ درخواست ({currency})</th>
                    <th className="px-4 py-4 border-b border-slate-100">وضعیت</th>
                    <th className="px-4 py-4 border-b border-slate-100 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockRequests.map((req) => {
                    const status = getStatusInfo(req.status);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-slate-400">{req.id}</span>
                            <span className="text-[11px] font-bold text-slate-600 mt-0.5">{req.date}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-700">{req.personName}</td>
                        <td className="px-4 py-4 text-[10px] font-medium text-slate-500">{req.period}</td>
                        <td className="px-4 py-4 text-xs font-mono font-bold text-slate-900">{formatNumber(req.amount)}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1.5 w-fit ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
              <button className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-all">مشاهده کلیه سوابق پرداخت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
