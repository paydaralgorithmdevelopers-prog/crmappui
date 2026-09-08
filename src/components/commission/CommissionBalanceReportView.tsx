import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Filter,
  FileText,
  Printer,
  Download,
  CreditCard,
  Wallet
} from 'lucide-react';

interface BalanceRecord {
  id: string;
  name: string;
  totalEarned: number;
  totalPaid: number;
  balance: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  status: 'settled' | 'pending' | 'overdue';
}

const mockBalances: BalanceRecord[] = [
  { id: '1', name: 'علیرضا حسینی', totalEarned: 850000000, totalPaid: 766000000, balance: 84000000, lastPaymentDate: '۱۴۰۶/۰۲/۱۵', lastPaymentAmount: 50000000, status: 'pending' },
  { id: '2', name: 'سارا احمدی', totalEarned: 540000000, totalPaid: 536800000, balance: 3200000, lastPaymentDate: '۱۴۰۶/۰۲/۱۸', lastPaymentAmount: 15000000, status: 'settled' },
  { id: '3', name: 'محمد رضایی', totalEarned: 420000000, totalPaid: 200000000, balance: 220000000, lastPaymentDate: '۱۴۰۶/۰۱/۳۰', lastPaymentAmount: 50000000, status: 'overdue' },
];

export const CommissionBalanceReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 border-r-4 border-r-sky-500">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">کل پورسانت تعهدی</p>
            <p className="text-lg font-mono font-bold text-slate-800">{formatNumber(1810000000)} ریال</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 border-r-4 border-r-emerald-500">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">مجموع پرداختی‌ها</p>
            <p className="text-lg font-mono font-bold text-slate-800">{formatNumber(1502800000)} ریال</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 border-r-4 border-r-rose-500">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">مانده کل بدهی پورسانت</p>
            <p className="text-lg font-mono font-bold text-rose-600">{formatNumber(307200000)} ریال</p>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-4">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">ترازی نهایی و مانده حساب پورسانت</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">مشاهده بدهی و طلب به تفکیک کارشناسان فروش</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input placeholder="جستجوی کارشناس..." className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs w-64 outline-hidden focus:border-rose-500 transition-all" />
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all border border-slate-200">
              <Filter className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-slate-800 transition-all">
              <Download className="w-4 h-4" /> دریافت گزارش
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-100">نام کارشناس</th>
                <th className="px-6 py-4 border-b border-slate-100">کل پورسانت مکتسبه</th>
                <th className="px-6 py-4 border-b border-slate-100">کل مبالغ پرداختی</th>
                <th className="px-6 py-4 border-b border-slate-100">مانده فعلی (طلب)</th>
                <th className="px-6 py-4 border-b border-slate-100">آخرین پرداخت</th>
                <th className="px-6 py-4 border-b border-slate-100 text-center">وضعیت حساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {mockBalances.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{formatNumber(item.totalEarned)}</td>
                  <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{formatNumber(item.totalPaid)}</td>
                  <td className="px-6 py-4 font-mono text-rose-600 font-extrabold">{formatNumber(item.balance)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-slate-600">{formatNumber(item.lastPaymentAmount)}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.lastPaymentDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold inline-block ${
                      item.status === 'settled' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600 animate-pulse'
                    }`}>
                      {item.status === 'settled' ? 'تسویه شده' : 
                       item.status === 'pending' ? 'در انتظار پرداخت' : 'بدهی معوقه'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400">نمایش ۱ تا ۳ از ۳ مورد</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all">قبلی</button>
            <button className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold shadow-xs">۱</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all">بعدی</button>
          </div>
        </div>
      </div>
    </div>
  );
};
