import React from 'react';
import { X, Layers, Users, Radio, Award } from 'lucide-react';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'customer-groups', title: 'تعریف گروه هدف', icon: Users, active: true, closable: false, isPrimary: true },
    { id: 'media-definition', title: 'تعریف رسانه (CEM)', icon: Radio, closable: false, isPrimary: true },
    { id: 'signal-definition', title: 'تعریف سیگنال', icon: Radio, closable: false, isPrimary: true },
    { id: 'create-campaign', title: 'ایجاد کمپین', icon: Layers, closable: false, isPrimary: true },
    { id: 'send-signal', title: 'ثبت ارسال سیگنال', icon: Layers, closable: false, isPrimary: true },
    { id: 'signal-feedback', title: 'ثبت دریافت سیگنال', icon: Layers, closable: false, isPrimary: true },
    { id: 'sent-signal-metrics', title: 'ثبت سابقه اطلاعات و متریک سیگنال ارسالی', icon: Layers, closable: false, isPrimary: true },
    { id: 'received-signal-metrics', title: 'ثبت سابقه اطلاعات و متریک سیگنال دریافتی', icon: Layers, closable: false, isPrimary: true },
    { id: 'media-metrics', title: 'ثبت سابقه اطلاعات رسانه', icon: Layers, closable: false, isPrimary: true },
    { id: 'campaign-metrics', title: 'ثبت سابقه اطلاعات کمپین', icon: Layers, closable: false, isPrimary: true },
    { id: 'deployment-management', title: 'تعریف انواع نصب و راه اندازی محصول', icon: Layers, closable: false, isPrimary: true },
    { id: 'maintenance-management', title: 'تعریف انواع نگهداشت محصول', icon: Layers, closable: false, isPrimary: true },
    { id: 'failure-management', title: 'تعریف انواع خرابی محصول', icon: Layers, closable: false, isPrimary: true },
    { id: 'toolbox-definition', title: 'تعریف جعبه ابزار خدمات پس از فروش', icon: Layers, closable: false, isPrimary: true },
    { id: 'req-deployment', title: 'ثبت درخواست استقرار(نصب و راه اندازی)', icon: Layers, closable: false, isPrimary: true },
    { id: 'rep-deployment', title: 'ثبت گزارش استقرار(نصب و راه اندازی)', icon: Layers, closable: false, isPrimary: true },
    { id: 'req-maintenance', title: 'ثبت درخواست نگهداشت دوره ای', icon: Layers, closable: false, isPrimary: true },
    { id: 'req-repairs', title: 'ثبت درخواست تعمیرات (رفع خرابی)', icon: Layers, closable: false, isPrimary: true },
    { id: 'rep-repairs', title: 'ثبت گزارش تعمیرات (رفع خرابی)', icon: Layers, closable: false, isPrimary: true },
    { id: 'rep-maintenance', title: 'ثبت گزارش نگهداشت دوره ای', icon: Layers, closable: false, isPrimary: true },
    { id: 'target-calendar', title: 'تقویم تارگت', icon: Award, closable: true },
    { id: 'target-product-groups', title: 'گروه‌های محصول', icon: Award, closable: true },
    { id: 'target-geo-groups', title: 'گروه‌های جغرافیایی', icon: Award, closable: true },
    { id: 'target-team-members', title: 'تنظیمات تیم و افراد', icon: Award, closable: true },
    { id: 'commission-tiers', title: 'پلکان پورسانت', icon: Award, closable: true },
    { id: 'target-allocation', title: 'تخصیص تارگت', icon: Award, closable: true },
    { id: 'commission-calculation', title: 'محاسبه پورسانت', icon: Award, closable: true },
    { id: 'commission-payment-request', title: 'درخواست پرداخت پورسانت', icon: Award, closable: true },
    { id: 'comprehensive-target-report', title: 'گزارش جامع تارگت و پورسانت', icon: Award, closable: true },
    { id: 'team-achievement-report', title: 'گزارش تحقق تیم و افراد', icon: Award, closable: true },
    { id: 'commission-balance-report', title: 'گزارش مانده و پرداخت پورسانت', icon: Award, closable: true },
    { id: 'tab-invoice-322020', title: 'فاکتور خرید ۳۲۲۰۲۰', closable: true },
    { id: 'tab-invoice-goods', title: 'فاکتور خرید کالا', closable: true },
    { id: 'tab-electrical-panel', title: 'ELECTRICALPANEL 12', closable: true },
    { id: 'tab-process-rej', title: 'فرآیند ریج ۱۲', closable: true },
    { id: 'tab-define-process', title: 'تعریف فرآیند', closable: true },
    { id: 'tab-asset', title: 'تعریف دارایی', closable: true },
    { id: 'tab-depreciation', title: 'تعریف روش استهلاک', closable: true },
    { id: 'tab-location', title: 'تعریف محل استقرار', closable: true },
    { id: 'tab-new-contract', title: 'قالب قرارداد جدید', closable: true },
    { id: 'tab-contracts', title: 'قالب های قرارداد', closable: true },
    { id: 'tab-payroll', title: 'تعریف عوامل حقوق و دستمزد', closable: true },
    { id: 'tab-dashboard', title: 'داشبورد', closable: false },
  ];

  return (
    <div className="bg-[#f8fafc] border-b border-slate-200 px-2 pt-1 flex items-center overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center gap-1 min-w-max pb-1">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.id;
          const Icon = tab.icon || Layers;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t-lg transition-all border-t border-x cursor-pointer ${
                isCurrent
                  ? 'bg-white text-rose-700 font-bold border-slate-200 border-b-white shadow-xs -mb-[1px] relative z-10'
                  : 'bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 border-transparent hover:border-slate-200'
              } ${tab.isPrimary ? 'ring-1 ring-rose-200/50' : ''}`}
            >
              {tab.isPrimary ? (
                <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
              ) : null}
              <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-rose-600' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{tab.title}</span>
              {tab.closable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="mr-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
