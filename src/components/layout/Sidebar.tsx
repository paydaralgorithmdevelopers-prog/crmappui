import React, { useState } from 'react';
import {
  Search,
  Users,
  Briefcase,
  UserCheck,
  Landmark,
  Calculator,
  Coins,
  Receipt,
  Package,
  Truck,
  Factory,
  TrendingUp,
  PieChart,
  GitBranch,
  ChevronDown,
  ChevronLeft,
  Settings,
  FolderTree,
  User,
  HeartHandshake,
  Headphones,
  FileSpreadsheet,
  Award,
  BookOpen,
  Cog,
  BarChart3,
  Calendar,
  Radio,
  Share2,
  Activity,
  PlusCircle,
  FileCheck2,
  Wrench,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeMenuItem,
  setActiveMenuItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [salesExpanded, setSalesExpanded] = useState(true);

  // Accordion state for sub-modules of "مدیریت فروش و بازاریابی"
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cem: true, // Default open to show "تعریف گروه هدف"
    crm: false,
    afterSales: false,
    salesAccounting: false,
    targetCommission: false,
  });

  // Accordion state for 3rd level (تعاریف / عملیات / گزارشات)
  const [expandedSubgroups, setExpandedSubgroups] = useState<Record<string, boolean>>({
    'cem-definitions': true, // Open "تعاریف" in CEM
    'cem-operations': false,
    'cem-reports': false,
    'crm-definitions': true,
    'crm-operations': false,
    'afterSales-definitions': false,
    'afterSales-operations': false,
    'afterSales-reports': false,
    'salesAccounting-definitions': false,
    'salesAccounting-operations': false,
    'salesAccounting-reports': false,
    'targetCommission-definitions': false,
    'targetCommission-operations': false,
    'targetCommission-reports': false,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleSubgroup = (subgroupKey: string) => {
    setExpandedSubgroups((prev) => ({
      ...prev,
      [subgroupKey]: !prev[subgroupKey],
    }));
  };

  // Top modules matching screenshot order
  const topMenuItems = [
    { id: 'persons', label: 'مدیریت اشخاص', icon: Users },
    { id: 'biz-architecture', label: 'معماری کسب و کار', icon: Briefcase },
    { id: 'hr', label: 'مدیریت سرمایه انسانی', icon: UserCheck },
    { id: 'financial', label: 'مدیریت مالی', icon: Landmark },
    { id: 'accounting', label: 'حسابداری', icon: Calculator },
    { id: 'treasury', label: 'خزانه داری', icon: Coins },
    { id: 'payroll', label: 'حقوق و دستمزد', icon: Receipt },
    { id: 'assets', label: 'جمع داری اموال', icon: Package },
    { id: 'supply', label: 'مدیریت تامین', icon: Truck },
    { id: 'production', label: 'مدیریت تولید', icon: Factory },
  ];

  // Full Sales & Marketing Structure provided by user
  const salesMarketingData = {
    title: 'مدیریت فروش و بازاریابی',
    sections: [
      {
        id: 'cem',
        title: 'مدیریت تجربه مشتری (CEM)',
        icon: HeartHandshake,
        groups: [
          {
            id: 'cem-definitions',
            title: 'تعاریف',
            items: [
              { id: 'target-group-definition', title: 'تعریف گروه هدف', isCurrent: true },
              { id: 'media-definition', title: 'تعریف رسانه' },
              { id: 'signal-definition', title: 'تعریف سیگنال' },
            ],
          },
          {
            id: 'cem-operations',
            title: 'عملیات',
            items: [
              { id: 'create-campaign', title: 'ایجاد کمپین' },
              { id: 'send-signal', title: 'ثبت ارسال سیگنال' },
              { id: 'signal-feedback', title: 'ثبت دریافت سیگنال' },
              { id: 'sent-signal-metrics', title: 'ثبت سابقه اطلاعات و متریک سیگنال ارسالی' },
              { id: 'received-signal-metrics', title: 'ثبت سابقه اطلاعات و متریک سیگنال دریافتی' },
              { id: 'media-metrics', title: 'ثبت سابقه اطلاعات رسانه' },
              { id: 'campaign-metrics', title: 'ثبت سابقه اطلاعات کمپین' },
            ],
          },
          {
            id: 'cem-reports',
            title: 'گزارشات',
            items: [
              { id: 'operational-calendar', title: 'تقویم عملیاتی' },
              { id: 'pulse-ops-report', title: 'گزارش عملیاتی سیگنال' },
              { id: 'media-ops-report', title: 'گزارش عملیاتی رسانه' },
              { id: 'campaign-ops-report', title: 'گزارش عملیاتی کمپین' },
            ],
          },
        ],
      },
      {
        id: 'crm',
        title: 'مدیریت ارتباط با مشتری (CRM)',
        icon: Users,
        groups: [
          {
            id: 'crm-definitions',
            title: 'تعاریف',
            items: [
              { id: 'lead-customer-definition', title: 'تعریف مشتری / سرنخ' },
            ],
          },
          {
            id: 'crm-operations',
            title: 'عملیات',
            items: [
              { id: 'create-opportunity', title: 'ایجاد فرصت' },
            ],
          },
          {
            id: 'crm-reports',
            title: 'گزارشات',
            items: [
              { id: 'crm-general-report', title: 'گزارش تحلیل مشتریان' },
            ],
          },
        ],
      },
      {
        id: 'afterSales',
        title: 'خدمات پس از فروش',
        icon: Headphones,
        groups: [
          {
            id: 'afterSales-definitions',
            title: 'تعاریف',
            items: [
              { id: 'deployment-management', title: 'تعریف انواع نصب و راه اندازی محصول' },
              { id: 'maintenance-management', title: 'تعریف انواع نگهداشت محصول' },
              { id: 'failure-management', title: 'تعریف انواع خرابی محصول' },
              { id: 'toolbox-definition', title: 'تعریف جعبه ابزار خدمات پس از فروش' },
            ],
          },
          {
            id: 'afterSales-operations',
            title: 'عملیات',
            items: [
              { id: 'req-deployment', title: 'ثبت درخواست استقرار(نصب و راه اندازی)' },
              { id: 'rep-deployment', title: 'ثبت گزارش استقرار(نصب و راه اندازی)' },
              { id: 'req-maintenance', title: 'ثبت درخواست نگهداشت دوره ای' },
              { id: 'rep-maintenance', title: 'ثبت گزارش نگهداشت دوره ای' },
              { id: 'req-repairs', title: 'ثبت درخواست تعمیرات' },
              { id: 'rep-repairs', title: 'ثبت گزارش تعمیرات' },
            ],
          },
          {
            id: 'afterSales-reports',
            title: 'گزارش',
            items: [
              { id: 'toolbox-kardex', title: 'گزارش کاردکس جعبه ابزار' },
            ],
          },
        ],
      },
      {
        id: 'salesAccounting',
        title: 'حسابداری فروش',
        icon: FileSpreadsheet,
        groups: [
          {
            id: 'salesAccounting-definitions',
            title: 'تعاریف',
            items: [
              { id: 'product-pricing', title: 'قیمت گذاری محصولات' },
            ],
          },
          {
            id: 'salesAccounting-operations',
            title: 'عملیات',
            items: [
              { id: 'issue-proforma', title: 'صدور پیش فاکتور' },
              { id: 'issue-invoice', title: 'صدور فاکتور' },
              { id: 'receipt-voucher', title: 'ثبت سند دریافت' },
            ],
          },
          {
            id: 'salesAccounting-reports',
            title: 'گزارشات',
            items: [
              { id: 'sales-review', title: 'مرور فروش' },
              { id: 'pricing-history', title: 'سابقه قیمت گذاری محصولات' },
            ],
          },
        ],
      },
      {
        id: 'targetCommission',
        title: 'مدیریت تارگت و پورسانت',
        icon: Award,
        groups: [
          {
            id: 'targetCommission-definitions',
            title: 'تعاریف',
            items: [
              { id: 'target-calendar', title: 'تقویم تارگت' },
              { id: 'target-product-groups', title: 'گروه‌های محصول' },
              { id: 'target-geo-groups', title: 'گروه‌های جغرافیایی' },
              { id: 'target-team-members', title: 'تنظیمات تیم و افراد' },
              { id: 'commission-tiers', title: 'پلکان پورسانت' },
            ],
          },
          {
            id: 'targetCommission-operations',
            title: 'عملیات',
            items: [
              { id: 'target-allocation', title: 'تخصیص تارگت' },
              { id: 'commission-calculation', title: 'محاسبه پورسانت' },
              { id: 'commission-payment-request', title: 'درخواست پرداخت پورسانت' },
            ],
          },
          {
            id: 'targetCommission-reports',
            title: 'گزارشات',
            items: [
              { id: 'comprehensive-target-report', title: 'گزارش جامع تارگت و پورسانت' },
              { id: 'team-achievement-report', title: 'گزارش تحقق تیم و افراد' },
              { id: 'commission-balance-report', title: 'گزارش مانده و پرداخت پورسانت' },
            ],
          },
        ],
      },
    ],
  };

  // Helper for quick search filtering
  const matchesSearch = (text: string) => {
    if (!searchTerm.trim()) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-72 xl:w-80' : 'w-0 -mr-72 lg:w-14 lg:mr-0'
      } bg-white border-l border-slate-200 flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden z-20 shadow-xs`}
    >
      {/* 1. Top Solid Red Header matching screenshot: "پایدار ERP" centered */}
      <div className="bg-[#b91c1c] text-white flex items-center justify-center px-4 shrink-0 h-12 shadow-xs">
        <span className="font-extrabold text-base md:text-lg tracking-wide select-none">
          پایدار ERP
        </span>
      </div>

      {/* 2. Menu Search Box */}
      <div className="px-2.5 py-2 border-b border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            id="sidebar-menu-search"
            placeholder="...جستجو در منو"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-md pl-8 pr-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-rose-600 transition-all text-right"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* 3. Navigation Items List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-0.5 text-xs text-slate-700">
        {/* Top items (if not searching or matching) */}
        {!searchTerm &&
          topMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer"
              >
                <span className="text-slate-800 text-xs font-normal group-hover:text-slate-950 transition-colors truncate">
                  {item.label}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 shrink-0">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5] text-slate-400 group-hover:text-slate-600" />
                </div>
              </button>
            );
          })}

        {/* Highlighted Module: مدیریت فروش و بازاریابی */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setSalesExpanded(!salesExpanded)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-md bg-rose-50/50 hover:bg-rose-50 transition-colors text-right group cursor-pointer border border-rose-100/60"
          >
            <span className="text-rose-950 text-xs font-bold transition-colors truncate">
              {salesMarketingData.title}
            </span>
            <div className="flex items-center gap-1.5 text-rose-700 shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[1.8]" />
              <ChevronDown
                className={`w-3.5 h-3.5 stroke-[1.8] transition-transform ${
                  salesExpanded ? 'rotate-0' : 'rotate-90'
                }`}
              />
            </div>
          </button>

          {/* Expanded Tree for "مدیریت فروش و بازاریابی" */}
          {salesExpanded && (
            <div className="pr-2 pt-1 pb-1 space-y-1">
              {salesMarketingData.sections.map((sec) => {
                const SecIcon = sec.icon;
                const isSecExpanded = !!expandedSections[sec.id] || !!searchTerm;

                // Check if any items inside match search
                const hasMatchingItem = sec.groups.some((grp) =>
                  grp.items.some((itm) => matchesSearch(itm.title))
                );

                if (searchTerm && !hasMatchingItem && !matchesSearch(sec.title)) {
                  return null;
                }

                return (
                  <div
                    key={sec.id}
                    className="border-r-2 border-slate-200/80 pr-1.5 space-y-0.5"
                  >
                    {/* Level 1: Sub-module header (e.g. مدیریت تجربه مشتری (CEM)) */}
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-100/70 text-right group cursor-pointer font-medium"
                    >
                      <span className="text-slate-800 text-xs font-semibold truncate">
                        {sec.title}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 shrink-0">
                        <SecIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                        <ChevronDown
                          className={`w-3 h-3 stroke-[1.5] transition-transform ${
                            isSecExpanded ? 'rotate-0' : 'rotate-90'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Level 2: Groups (تعاریف / عملیات / گزارشات) */}
                    {isSecExpanded && (
                      <div className="pr-2 space-y-1 my-0.5 border-r border-slate-200/60">
                        {sec.groups.map((grp) => {
                          const isGrpExpanded =
                            !!expandedSubgroups[grp.id] || !!searchTerm;

                          const filteredItems = grp.items.filter((item) =>
                            matchesSearch(item.title)
                          );

                          if (searchTerm && filteredItems.length === 0) {
                            return null;
                          }

                          return (
                            <div key={grp.id} className="space-y-0.5">
                              {/* Subgroup Header (تعاریف / عملیات / گزارشات) */}
                              <button
                                type="button"
                                onClick={() => toggleSubgroup(grp.id)}
                                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-right cursor-pointer"
                              >
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
                                  <span>{grp.title}</span>
                                </span>
                                <ChevronDown
                                  className={`w-2.5 h-2.5 transition-transform ${
                                    isGrpExpanded ? 'rotate-0' : 'rotate-90'
                                  }`}
                                />
                              </button>

                              {/* Level 3: Leaf Items */}
                              {isGrpExpanded && (
                                <div className="pr-3 space-y-0.5">
                                  {filteredItems.map((item) => {
                                    const isTargetGroupItem =
                                      item.id === 'target-group-definition';
                                    const isSelected =
                                      activeMenuItem === item.id ||
                                      (activeMenuItem === 'customer-groups' &&
                                        isTargetGroupItem);

                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                          setActiveMenuItem(
                                            isTargetGroupItem
                                              ? 'customer-groups'
                                              : item.id
                                          );
                                        }}
                                        className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all text-right cursor-pointer ${
                                          isSelected
                                            ? 'bg-rose-600 text-white font-bold shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                      >
                                        <span className="truncate">
                                          {item.title}
                                        </span>
                                        {isTargetGroupItem && (
                                          <FolderTree
                                            className={`w-3 h-3 shrink-0 ${
                                              isSelected
                                                ? 'text-white'
                                                : 'text-rose-600'
                                            }`}
                                          />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lower categories from screenshot */}
        {!searchTerm && (
          <>
            <button
              type="button"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer"
            >
              <span className="text-slate-800 text-xs truncate">بودجه ریزی</span>
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 shrink-0">
                <PieChart className="w-4 h-4 stroke-[1.5]" />
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer"
            >
              <span className="text-slate-800 text-xs truncate">پلتفرم روندها (BPMS)</span>
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 shrink-0">
                <GitBranch className="w-4 h-4 stroke-[1.5]" />
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* 4. Footer matching screenshot details: Gear icon, 09139872321, panel@paydar.com, round red avatar */}
      <div className="px-3 py-2 border-t border-slate-200 bg-white text-[11px] text-slate-600 shrink-0 flex items-center justify-between select-none">
        {/* Settings gear on the right */}
        <button
          type="button"
          title="تنظیمات سامانه"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Center: phone & email exactly as in Untitled1.jpg */}
        <div className="text-center font-mono">
          <div className="text-xs font-bold text-slate-700 tracking-tight">
            ۰۹۱۳۹۸۷۲۳۲۱
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            panel@paydar.com
          </div>
        </div>

        {/* Left: Red circular avatar button */}
        <div className="w-6 h-6 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-rose-700 transition-colors font-bold text-[10px]">
          P
        </div>
      </div>
    </aside>
  );
};
