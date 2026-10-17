
import React from 'react';
import { 
  Save, 
  CheckCircle, 
  Lock, 
  Clock, 
  Info, 
  ChevronLeft,
  Calendar,
  Layers,
  Building2,
  DollarSign
} from 'lucide-react';
import { BudgetHeaderInfo, BudgetStatus } from './types';

interface BudgetPageLayoutProps {
  title: string;
  headerInfo: BudgetHeaderInfo;
  onHeaderChange?: (info: Partial<BudgetHeaderInfo>) => void;
  onSaveDraft?: () => void;
  onApprove?: () => void;
  onClosePeriod?: () => void;
  onBack: () => void;
  children: React.ReactNode;
  isOperationPage?: boolean;
}

export const BudgetPageLayout: React.FC<BudgetPageLayoutProps> = ({
  title,
  headerInfo,
  onHeaderChange,
  onSaveDraft,
  onApprove,
  onClosePeriod,
  onBack,
  children,
  isOperationPage = true
}) => {
  const getStatusBadge = (status: BudgetStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            پیش‌نویس
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
            <CheckCircle className="w-3 h-3" />
            تأییدشده
          </span>
        );
      case 'closed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
            <Lock className="w-3 h-3" />
            بسته‌شده
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">{title}</h1>
            <div className="flex items-center gap-3 mt-1">
              {getStatusBadge(headerInfo.status)}
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Info className="w-3 h-3" />
                <span>آخرین بروزرسانی: امروز، ۱۰:۳۰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOperationPage && (
            <>
              <button 
                onClick={onSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                ذخیره پیش‌نویس
              </button>
              <button 
                onClick={onApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-shadow shadow-sm shadow-emerald-200"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                تأیید نهایی
              </button>
              <button 
                onClick={onClosePeriod}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                بستن دوره
              </button>
            </>
          )}
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors mr-2"
          >
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            بازگشت
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Quick Filters / Header Info */}
        <div className="bg-slate-50/50 p-4 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1">
                <Calendar className="w-3 h-3" />
                سال مالی
              </label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 h-[34px] flex items-center">
                {headerInfo.fiscalYear}
              </div>
            </div>
            
            {/* System Info Read-only Fields */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 mb-1">ارز اصلی / فرعی</label>
              <div className="bg-slate-100/50 border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono flex justify-between items-center h-[34px]">
                <span>{headerInfo.baseCurrency}</span>
                <span className="text-slate-300">|</span>
                <span>{headerInfo.secondaryCurrency}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 mb-1">نرخ تبدیل بودجه</label>
              <div className="bg-slate-100/50 border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono h-[34px] flex items-center">
                {headerInfo.exchangeRate.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 mb-1">دوره بودجه</label>
              <div className="bg-slate-100/50 border border-slate-200/50 rounded-lg px-3 py-1.5 text-[10px] text-slate-600 h-[34px] flex items-center gap-1 truncate">
                <span>{headerInfo.startDate}</span>
                <span className="text-slate-300">تا</span>
                <span>{headerInfo.endDate}</span>
              </div>
            </div>
          </div>
          
          {headerInfo.description !== undefined && (
            <div className="mt-4">
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">توضیحات پیش‌بینی</label>
              <input 
                type="text" 
                value={headerInfo.description}
                onChange={(e) => onHeaderChange?.({ description: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                placeholder="توضیحات و ملاحظات بودجه‌ریزی را اینجا بنویسید..."
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
