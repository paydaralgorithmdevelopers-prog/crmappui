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
  DollarSign,
  Play,
  LayoutGrid,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  FileText,
  CreditCard,
  Building2,
  Inbox,
  Monitor,
  CheckCircle2,
  Clock,
  QrCode,
  Camera,
  MapPin,
  ClipboardList,
  Pin,
  Layers,
  Boxes
} from 'lucide-react';
import { ProcessDefinition } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
  processDefinitions?: ProcessDefinition[];
  onTogglePin?: (id: string, title: string, type: 'definition' | 'operation' | 'report', icon?: any) => void;
  pinnedIds?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeMenuItem,
  setActiveMenuItem,
  processDefinitions = [],
  onTogglePin,
  pinnedIds = []
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
    budgetManagement: true,
    bpms: true,
    treasury: true,
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
    'budget-operations': true,
    'budget-reports': false,
    'bpms-definitions': true,
    'bpms-operations': false,
    'bpms-reports': false,
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
  const topMenuItemsPart1 = [
    { id: 'persons', label: 'مدیریت اشخاص', icon: Users },
    { id: 'biz-architecture', label: 'معماری کسب و کار', icon: Briefcase },
    { id: 'financial', label: 'مدیریت مالی', icon: Landmark },
    { id: 'accounting', label: 'حسابداری', icon: Calculator },
  ];

  const topMenuItemsPart2 = [
    { id: 'payroll', label: 'حقوق و دستمزد', icon: Receipt },
    { id: 'assets', label: 'جمع داری اموال', icon: Package },
    { id: 'supply', label: 'مدیریت تامین', icon: Truck },
    { id: 'production', label: 'مدیریت تولید', icon: Factory },
  ];

  const treasuryData = {
    id: 'treasury',
    title: 'خزانه‌داری',
    icon: Wallet,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    groups: [
      {
        id: 'treasury-definitions',
        title: 'تعاریف',
        items: [
          { id: 'treasury-bank-accounts', title: 'حساب‌های بانکی', icon: Building2 },
          { id: 'treasury-cash-boxes', title: 'صندوق‌ها', icon: Inbox },
          { id: 'treasury-pos-terminals', title: 'کارتخوان‌ها', icon: Monitor },
          { id: 'treasury-payment-gateways', title: 'درگاه‌های پرداخت', icon: CreditCard },
          { id: 'treasury-petty-cash', title: 'تنخواهگردان‌ها', icon: UserCheck },
          { id: 'treasury-checkbooks', title: 'دسته‌چک‌ها', icon: BookOpen },
        ],
      },
      {
        id: 'treasury-operations',
        title: 'عملیات',
        items: [
          { id: 'treasury-ops-main', title: 'عملیات خزانه', icon: RefreshCw },
          { id: 'treasury-ops-petty-cash', title: 'عملیات تنخواه', icon: Wallet },
          { id: 'treasury-ops-check-incoming', title: 'عملیات چک دریافتی', icon: ArrowDownCircle },
          { id: 'treasury-ops-check-outgoing', title: 'عملیات چک پرداختی', icon: ArrowUpCircle },
        ],
      },
      {
        id: 'treasury-reports',
        title: 'گزارشات',
        items: [
          { id: 'treasury-report-bank', title: 'گردش حساب‌های بانکی', icon: Building2 },
          { id: 'treasury-report-cash', title: 'گردش صندوق‌ها', icon: Inbox },
          { id: 'treasury-report-pos', title: 'گردش کارتخوان‌ها', icon: Monitor },
          { id: 'treasury-report-gateways', title: 'گردش درگاه‌های پرداخت', icon: CreditCard },
          { id: 'treasury-report-petty-cash-ops', title: 'گردش تنخواه گردانها', icon: BarChart3 },
          { id: 'treasury-report-check-incoming', title: 'گردش عملیات چک دریافتی', icon: ArrowDownCircle },
          { id: 'treasury-report-check-outgoing', title: 'گردش عملیات چک پرداختی', icon: ArrowUpCircle },
        ],
      },
    ],
  };

  const hrData = {
    id: 'hr',
    title: 'مدیریت سرمایه انسانی',
    icon: UserCheck,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    groups: [
      {
        id: 'hr-definitions',
        title: 'تعاریف / کنترل تردد',
        items: [
          { id: 'hr-location-definition', title: 'تعریف لوکیشن', icon: MapPin },
          { id: 'hr-qr-display', title: 'نمایش QR تردد', icon: QrCode },
        ],
      },
      {
        id: 'hr-operations',
        title: 'عملیات',
        items: [
          { id: 'hr-smart-attendance', title: 'ثبت تردد هوشمند', icon: Camera },
        ],
      },
      {
        id: 'hr-reports',
        title: 'گزارشات',
        items: [
          { id: 'hr-attendance-log', title: 'گزارش ترددها', icon: ClipboardList },
        ],
      },
    ],
  };

  const budgetData = {
    id: 'budgetManagement',
    title: 'مدیریت بودجه',
    icon: DollarSign,
    groups: [
      {
        id: 'budget-operations',
        title: 'عملیات',
        items: [
          { id: 'secondary-exchange-research', title: 'پیشبینی نرخ ارز فرعی' },
          { id: 'indirect-payroll-forecast', title: 'پیشبینی حقوق و دستمزد غیرمستقیم' },
          { id: 'other-income-expense-forecast', title: 'پیشبینی سایر درآمدها و هزینهها' },
          { id: 'inflation-purchase-price-forecast', title: 'پیشبینی نرخ تورم و قیمت خرید اقلام' },
        ],
      },
      {
        id: 'budget-reports',
        title: 'گزارشات',
        items: [
          { id: 'price-increase-control', title: 'کنترل افزایش قیمت' },
          { id: 'sales-variance-control-report', title: 'کنترل جامع فروش' },
          { id: 'indirect-payroll-control-report', title: 'کنترل حقوق و دستمزد غیرمستقیم' },
          { id: 'other-income-expense-control-report', title: 'کنترل سایر درآمدها و هزینهها' },
          { id: 'budgetary-pl-statement', title: 'صورت سود و زیان بودجهای' },
        ],
      },
    ],
  };

  const bpmsData = {
    id: 'bpms',
    title: 'پلتفرم روند (BPMS)',
    icon: GitBranch,
    groups: [
      {
        id: 'bpms-definitions',
        title: 'تعاریف',
        items: [
          { id: 'create-process', title: 'ایجاد روند' },
          { id: 'bpms-access-levels', title: 'تنظیمات سطح دسترسی' },
        ],
      },
      {
        id: 'bpms-operations',
        title: 'عملیات',
        items: [
          { id: 'bpms-ops-dashboard', title: 'داشبورد عملیاتی روندها', icon: LayoutGrid }
        ],
      },
      {
        id: 'bpms-reports',
        title: 'گزارشات',
        items: [
          { id: 'bpms-workflow-analysis', title: 'روندنما', icon: Activity },
        ],
      },
    ],
  };

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
              { id: 'crm-comprehensive-lead-report', title: 'گزارش جامع سرنخ' },
              { id: 'crm-timeline-report', title: 'گزارش تایم‌لاین عملیاتی' },
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
              { id: 'product-definition', title: 'تعریف محصول' },
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
              { id: 'commission-payment-request', title: 'درخواست پرداخت پورسانت' },
            ],
          },
          {
            id: 'targetCommission-reports',
            title: 'گزارشات',
            items: [
              { id: 'comprehensive-target-commission-report', title: 'گزارش جامع تارگت و پورسانت' },
              { id: 'commission-calculation', title: 'گزارش محاسبه پورسانت' },
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
      {/* 1. Top Enterprise Header: "ERP پایدار" matching screenshot */}
      <div
        id="sidebar-brand-header"
        className="bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#881313] text-white flex items-center justify-between px-3.5 shrink-0 h-14 border-b border-red-900/50 shadow-sm relative overflow-hidden select-none"
        title="ERP پایدار الگوریتم - سامانه جامع مدیریت سازمانی"
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px]" />
        
        {/* Brand logo & titles */}
        <div className="flex items-center gap-2.5 z-10 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center shadow-inner shrink-0 group hover:bg-white/25 transition-all">
            <Boxes className="w-4 h-4 text-white drop-shadow-xs" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="bg-white/20 text-white font-mono font-black text-[11px] px-1.5 py-0.5 rounded tracking-wider border border-white/25 shadow-2xs">
                ERP
              </span>
              <span className="font-black text-base text-white tracking-tight drop-shadow-xs">
                پایدار الگوریتم
              </span>
            </div>
            <span className="text-[10px] text-red-100/80 font-medium tracking-tight truncate">
              سامانه جامع سازمانی
            </span>
          </div>
        </div>

        {/* Status / Edition badge */}
        <div className="hidden sm:flex items-center gap-1 bg-black/20 text-rose-100 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/15 shrink-0 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>نسخه سازمانی</span>
        </div>
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

      {/* 3. Dashboard Button */}
      <div className="px-2 py-1 border-b border-slate-100">
        <button
          onClick={() => setActiveMenuItem('my-dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
            activeMenuItem === 'my-dashboard'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${activeMenuItem === 'my-dashboard' ? 'text-white' : 'text-rose-600'}`} />
          <span className="font-bold text-sm">میز کار (داشبورد)</span>
        </button>
      </div>

      {/* 4. Navigation Items List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-0.5 text-xs text-slate-700">
        {/* Top items (if not searching or matching) */}
        {!searchTerm && (
          <>
            {topMenuItemsPart1.map((item) => {
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

            {/* HCM Section */}
            <div className="py-0.5 border-r-2 border-slate-200/80 pr-1.5 mr-0.5 space-y-0.5">
              <button
                type="button"
                onClick={() => toggleSection('hr')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer ${expandedSections['hr'] ? 'bg-slate-50/50' : ''}`}
              >
                <span className={`text-xs font-bold transition-colors truncate ${expandedSections['hr'] ? 'text-sky-900' : 'text-slate-800'}`}>
                  مدیریت سرمایه انسانی
                </span>
                <div className={`flex items-center gap-1.5 shrink-0 ${expandedSections['hr'] ? 'text-sky-600' : 'text-slate-400'}`}>
                  <UserCheck className="w-4 h-4 stroke-[1.8]" />
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[1.8] transition-transform ${
                      expandedSections['hr'] ? 'rotate-0' : 'rotate-90'
                    }`}
                  />
                </div>
              </button>

              {expandedSections['hr'] && (
                <div className="pr-2 space-y-1 my-0.5 border-r border-slate-200/60">
                  {hrData.groups.map((grp) => {
                    const isGrpExpanded = !!expandedSubgroups[grp.id] || !!searchTerm;
                    const filteredItems = grp.items.filter((item) => matchesSearch(item.title));
                    if (searchTerm && filteredItems.length === 0) return null;

                    return (
                      <div key={grp.id} className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => toggleSubgroup(grp.id)}
                          className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-right cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
                            <span>{grp.title}</span>
                          </span>
                          <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isGrpExpanded ? 'rotate-0' : 'rotate-90'}`} />
                        </button>
                        {isGrpExpanded && (
                          <div className="pr-3 space-y-0.5">
                            {filteredItems.map((item) => {
                              const isSelected = activeMenuItem === item.id;
                              const ItemIcon = item.icon;
                              const isPinned = pinnedIds.includes(item.id);
                              return (
                                <div key={item.id} className="relative group/pin">
                                  <button
                                    type="button"
                                    onClick={() => setActiveMenuItem(item.id)}
                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all text-right cursor-pointer ${
                                      isSelected
                                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {ItemIcon && <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />}
                                      <span className="truncate">{item.title}</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTogglePin?.(item.id, item.title, grp.id.includes('definition') ? 'definition' : grp.id.includes('ops') || grp.id.includes('operation') ? 'operation' : 'report', ItemIcon);
                                    }}
                                    className={`absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all opacity-0 group-hover/pin:opacity-100 ${
                                      isPinned ? 'text-rose-500 opacity-100' : 'text-slate-400 hover:text-rose-500'
                                    }`}
                                  >
                                    <Pin className={`w-2.5 h-2.5 ${isPinned ? 'fill-rose-500' : ''}`} />
                                  </button>
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

            {/* Treasury Section placed after Accounting */}
            <div className="py-0.5 border-r-2 border-slate-200/80 pr-1.5 mr-0.5 space-y-0.5">
              <button
                type="button"
                onClick={() => toggleSection('treasury')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer ${expandedSections['treasury'] ? 'bg-slate-50/50' : ''}`}
              >
                <span className={`text-xs font-bold transition-colors truncate ${expandedSections['treasury'] ? 'text-emerald-900' : 'text-slate-800'}`}>
                  خزانه‌داری
                </span>
                <div className={`flex items-center gap-1.5 shrink-0 ${expandedSections['treasury'] ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <Wallet className="w-4 h-4 stroke-[1.8]" />
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[1.8] transition-transform ${
                      expandedSections['treasury'] ? 'rotate-0' : 'rotate-90'
                    }`}
                  />
                </div>
              </button>

              {expandedSections['treasury'] && (
                <div className="pr-2 space-y-1 my-0.5 border-r border-slate-200/60">
                  {treasuryData.groups.map((grp) => {
                    const isGrpExpanded = !!expandedSubgroups[grp.id] || !!searchTerm;
                    const filteredItems = grp.items.filter((item) => matchesSearch(item.title));
                    if (searchTerm && filteredItems.length === 0) return null;

                    return (
                      <div key={grp.id} className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => toggleSubgroup(grp.id)}
                          className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-right cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                            <span>{grp.title}</span>
                          </span>
                          <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isGrpExpanded ? 'rotate-0' : 'rotate-90'}`} />
                        </button>
                        {isGrpExpanded && (
                          <div className="pr-3 space-y-0.5">
                            {filteredItems.map((item) => {
                              const isSelected = activeMenuItem === item.id;
                              const ItemIcon = (item as any).icon;
                              const isPinned = pinnedIds.includes(item.id);
                              return (
                                <div key={item.id} className="relative group/pin">
                                  <button
                                    type="button"
                                    onClick={() => setActiveMenuItem(item.id)}
                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all text-right cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {ItemIcon && <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />}
                                      <span className="truncate">{item.title}</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTogglePin?.(item.id, item.title, grp.id.includes('definition') ? 'definition' : grp.id.includes('ops') || grp.id.includes('operation') ? 'operation' : 'report', ItemIcon);
                                    }}
                                    className={`absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all opacity-0 group-hover/pin:opacity-100 ${
                                      isPinned ? 'text-rose-500 opacity-100' : 'text-slate-400 hover:text-rose-500'
                                    }`}
                                  >
                                    <Pin className={`w-2.5 h-2.5 ${isPinned ? 'fill-rose-500' : ''}`} />
                                  </button>
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

            {topMenuItemsPart2.map((item) => {
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
          </>
        )}

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
                                      const ItemIcon = (item as any).icon;
                                      const isPinned = pinnedIds.includes(item.id) || (isTargetGroupItem && pinnedIds.includes('customer-groups'));

                                      return (
                                        <div key={item.id} className="relative group/pin">
                                          <button
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
                                            <div className="flex items-center gap-2 truncate">
                                              {ItemIcon && (
                                                <ItemIcon
                                                  className={`w-3 h-3 shrink-0 ${
                                                    isSelected
                                                      ? 'text-white'
                                                      : 'text-slate-400'
                                                  }`}
                                                />
                                              )}
                                              <span className="truncate">
                                                {item.title}
                                              </span>
                                            </div>
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
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const actualId = isTargetGroupItem ? 'customer-groups' : item.id;
                                              onTogglePin?.(actualId, item.title, grp.id.includes('definition') ? 'definition' : grp.id.includes('ops') || grp.id.includes('operation') ? 'operation' : 'report', ItemIcon);
                                            }}
                                            className={`absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all opacity-0 group-hover/pin:opacity-100 ${
                                              isPinned ? 'text-white opacity-100' : 'text-slate-400 hover:text-rose-500'
                                            }`}
                                          >
                                            <Pin className={`w-2.5 h-2.5 ${isPinned ? 'fill-current' : ''}`} />
                                          </button>
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
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Management Section */}
        {!searchTerm && (
          <div className="py-0.5 border-r-2 border-slate-200/80 pr-1.5 mr-0.5 space-y-0.5">
            <button
              type="button"
              onClick={() => toggleSection('budgetManagement')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer ${expandedSections['budgetManagement'] ? 'bg-slate-50/50' : ''}`}
            >
              <span className={`text-xs font-bold transition-colors truncate ${expandedSections['budgetManagement'] ? 'text-blue-900' : 'text-slate-800'}`}>
                مدیت بودجه
              </span>
              <div className={`flex items-center gap-1.5 shrink-0 ${expandedSections['budgetManagement'] ? 'text-blue-600' : 'text-slate-400'}`}>
                <DollarSign className="w-4 h-4 stroke-[1.8]" />
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.8] transition-transform ${
                    expandedSections['budgetManagement'] ? 'rotate-0' : 'rotate-90'
                  }`}
                />
              </div>
            </button>

            {expandedSections['budgetManagement'] && (
              <div className="pr-2 space-y-1 my-0.5 border-r border-slate-200/60">
                {budgetData.groups.map((grp) => {
                  const isGrpExpanded = !!expandedSubgroups[grp.id] || !!searchTerm;
                  const filteredItems = grp.items.filter((item) => matchesSearch(item.title));
                  if (searchTerm && filteredItems.length === 0) return null;

                  return (
                    <div key={grp.id} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleSubgroup(grp.id)}
                        className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-right cursor-pointer"
                      >
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                          <span>{grp.title}</span>
                        </span>
                        <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isGrpExpanded ? 'rotate-0' : 'rotate-90'}`} />
                      </button>
                      {isGrpExpanded && (
                        <div className="pr-3 space-y-0.5">
                          {filteredItems.map((item) => {
                            const isSelected = activeMenuItem === item.id;
                            const isPinned = pinnedIds.includes(item.id);
                            return (
                              <div key={item.id} className="relative group/pin">
                                <button
                                  type="button"
                                  onClick={() => setActiveMenuItem(item.id)}
                                  className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all text-right cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  }`}
                                >
                                  <span className="truncate">{item.title}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTogglePin?.(item.id, item.title, grp.id.includes('definition') ? 'definition' : grp.id.includes('ops') || grp.id.includes('operation') ? 'operation' : 'report');
                                  }}
                                  className={`absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all opacity-0 group-hover/pin:opacity-100 ${
                                    isPinned ? 'text-rose-500 opacity-100' : 'text-slate-400 hover:text-rose-500'
                                  }`}
                                >
                                  <Pin className={`w-2.5 h-2.5 ${isPinned ? 'fill-rose-500' : ''}`} />
                                </button>
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
        )}

        {/* BPMS Section */}
        {!searchTerm && (
          <div className="py-0.5 border-r-2 border-slate-200/80 pr-1.5 mr-0.5 space-y-0.5">
            <button
              type="button"
              onClick={() => toggleSection('bpms')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-right group cursor-pointer ${expandedSections['bpms'] ? 'bg-slate-50/50' : ''}`}
            >
              <span className={`text-xs font-bold transition-colors truncate ${expandedSections['bpms'] ? 'text-indigo-900' : 'text-slate-800'}`}>
                پلتفرم روند (BPMS)
              </span>
              <div className={`flex items-center gap-1.5 shrink-0 ${expandedSections['bpms'] ? 'text-indigo-600' : 'text-slate-400'}`}>
                <GitBranch className="w-4 h-4 stroke-[1.8]" />
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.8] transition-transform ${
                    expandedSections['bpms'] ? 'rotate-0' : 'rotate-90'
                  }`}
                />
              </div>
            </button>

            {expandedSections['bpms'] && (
              <div className="pr-2 space-y-1 my-0.5 border-r border-slate-200/60">
                {bpmsData.groups.map((grp) => {
                  const isGrpExpanded = !!expandedSubgroups[grp.id] || !!searchTerm;
                  const filteredItems = grp.items.filter((item) => matchesSearch(item.title));
                  if (searchTerm && filteredItems.length === 0) return null;

                  return (
                    <div key={grp.id} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleSubgroup(grp.id)}
                        className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-right cursor-pointer"
                      >
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                          <span>{grp.title}</span>
                        </span>
                        <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isGrpExpanded ? 'rotate-0' : 'rotate-90'}`} />
                      </button>
                      {isGrpExpanded && (
                        <div className="pr-3 space-y-0.5">
                          {filteredItems.map((item) => {
                            const isSelected = activeMenuItem === item.id;
                            const ItemIcon = (item as any).icon;
                            const isPinned = pinnedIds.includes(item.id);
                            return (
                              <div key={item.id} className="relative group/pin">
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setActiveMenuItem(item.id)}
                                  className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all text-right cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {ItemIcon && <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />}
                                    <span className="truncate">{item.title}</span>
                                  </div>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTogglePin?.(item.id, item.title, grp.id.includes('definition') ? 'definition' : grp.id.includes('ops') || grp.id.includes('operation') ? 'operation' : 'report', ItemIcon);
                                  }}
                                  className={`absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all opacity-0 group-hover/pin:opacity-100 ${
                                    isPinned ? 'text-rose-500 opacity-100' : 'text-slate-400 hover:text-rose-500'
                                  }`}
                                >
                                  <Pin className={`w-2.5 h-2.5 ${isPinned ? 'fill-rose-500' : ''}`} />
                                </button>
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
        )}

        {/* Lower categories from screenshot */}
        {!searchTerm && (
          <>
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
