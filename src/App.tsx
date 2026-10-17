import React, { useState } from 'react';
import { initialTargetGroups, initialLeads } from './data/initialData';
import { TargetGroup, Lead, MediaChannel } from './types';
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { Sidebar } from './components/layout/Sidebar';
import { GroupTreeView } from './components/groups/GroupTreeView';
import { GroupForm } from './components/groups/GroupForm';
import { LeadSelector } from './components/leads/LeadSelector';
import { MediaDefinitionView } from './components/media/MediaDefinitionView';
import { SignalDefinitionView } from './components/media/SignalDefinitionView';
import { ComprehensiveLeadReportView } from './components/leads/ComprehensiveLeadReportView';
import { LeadTimelineReportView } from './components/leads/LeadTimelineReportView';
import { ProductDefinitionView } from './components/sales/ProductDefinitionView';
import { ProductPricingView } from './components/sales/ProductPricingView';
import { CampaignDefinitionView } from './components/campaign/CampaignDefinitionView';
import { SendSignalView } from './components/media/SendSignalView';
import { ReceiveSignalView } from './components/media/ReceiveSignalView';
import { MediaMetricsHistoryView } from './components/media/MediaMetricsHistoryView';
import { SentSignalMetricsHistoryView } from './components/media/SentSignalMetricsHistoryView';
import { ReceivedSignalMetricsHistoryView } from './components/media/ReceivedSignalMetricsHistoryView';
import { CampaignMetricsHistoryView } from './components/campaign/CampaignMetricsHistoryView';
import { OperationGanttView } from './components/campaign/OperationGanttView';
import { PulseOperationalDashboard } from './components/media/PulseOperationalDashboard';
import { MediaOperationalDashboard } from './components/media/MediaOperationalDashboard';
import { CampaignOperationalDashboard } from './components/campaign/CampaignOperationalDashboard';
import { CreateOpportunityView } from './components/opportunity/CreateOpportunityView';
import { CreateProformaInvoiceView } from './components/sales/CreateProformaInvoiceView';
import { CreateInvoiceView } from './components/sales/CreateInvoiceView';
import { DeploymentManagementView } from './components/deployment/DeploymentManagementView';
import { MaintenanceManagementView } from './components/maintenance/MaintenanceManagementView';
import { FailureManagementView } from './components/failure/FailureManagementView';
import { ToolboxDefinitionView } from './components/aftersales/ToolboxDefinitionView';
import { DeploymentRequestView } from './components/aftersales/DeploymentRequestView';
import { DeploymentReportView } from './components/aftersales/DeploymentReportView';
import { MaintenanceRequestView } from './components/aftersales/MaintenanceRequestView';
import { MaintenanceReportView } from './components/aftersales/MaintenanceReportView';
import { RepairRequestView } from './components/aftersales/RepairRequestView';
import { RepairReportView } from './components/aftersales/RepairReportView';
import { TargetCalendarView } from './components/commission/TargetCalendarView';
import { ProductGroupsTargetView } from './components/commission/ProductGroupsTargetView';
import { GeographicGroupsTargetView } from './components/commission/GeographicGroupsTargetView';
import { ComprehensiveTargetCommissionReportView } from './components/commission/ComprehensiveTargetCommissionReportView';
import { TeamMemberSettingsView } from './components/commission/TeamMemberSettingsView';
import { CommissionTiersView } from './components/commission/CommissionTiersView';
import { TargetAllocationView } from './components/commission/TargetAllocationView';
import { CommissionCalculationView } from './components/commission/CommissionCalculationView';
import { CommissionPaymentRequestView } from './components/commission/CommissionPaymentRequestView';
import { IndirectPayrollForecastView } from './components/budget/IndirectPayrollForecastView';
import { OtherIncomeExpenseForecastView } from './components/budget/OtherIncomeExpenseForecastView';
import { InflationAndPurchasePriceForecastView } from './components/budget/InflationAndPurchasePriceForecastView';
import { SecondaryExchangeRateResearchView } from './components/budget/SecondaryExchangeRateResearchView';
import { SalesVarianceControlReportView } from './components/budget/SalesVarianceControlReportView';
import { IndirectPayrollControlReportView } from './components/budget/IndirectPayrollControlReportView';
import { OtherIncomeExpenseControlReportView } from './components/budget/OtherIncomeExpenseControlReportView';
import { BudgetaryPLStatementView } from './components/budget/BudgetaryPLStatementView';
import { PriceIncreaseControlReportView } from './components/budget/PriceIncreaseControlReportView';
import { ProcessDefinitionView } from './components/bpms/ProcessDefinitionView';
import { ProcessInstancesView } from './components/bpms/ProcessInstancesView';
import { ProcessDashboardView } from './components/bpms/ProcessDashboardView';
import { TreasuryDefinitionsView } from './components/bpms/TreasuryDefinitionsView';
import { TreasuryOperationsView } from './components/bpms/TreasuryOperationsView';
import { CheckOperationsView } from './components/bpms/CheckOperationsView';
import { TreasuryReportsView } from './components/bpms/TreasuryReportsView';
import { PettyCashOperationView } from './components/bpms/PettyCashOperationView';
import { BPMSAccessLevelsView } from './components/bpms/BPMSAccessLevelsView';
import { SmartAttendancePage } from './components/hcm/SmartAttendancePage';
import { AttendanceQrDisplayPage } from './components/hcm/AttendanceQrDisplayPage';
import { LocationDefinitionPage } from './components/hcm/LocationDefinitionPage';
import { AttendanceReportsPage } from './components/hcm/AttendanceReportsPage';
import { WorkflowAnalysisPage } from './components/bpms/WorkflowAnalysisPage';
import { Dashboard } from './components/Dashboard';
import { initialPredefinedMedia } from './data/mediaData';
import { ProcessDefinition, ProcessInstance } from './types';
import {
  FolderTree,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Radio,
  Users,
  Layers,
  Award,
  LayoutGrid
} from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  icon?: any;
  isPrimary?: boolean;
  closable?: boolean;
}

interface PinnedItem {
  id: string;
  title: string;
  type: 'definition' | 'operation' | 'report';
  icon?: any;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('customer-groups');
  const [activeMenuItem, setActiveMenuItem] = useState('customer-groups');
  const [selectedProcessId, setSelectedProcessId] = useState<string | number | null>(null);

  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'customer-groups', title: 'تعریف گروه هدف', icon: Users, isPrimary: true, closable: false },
    { id: 'my-dashboard', title: 'میز کار من', icon: Layers, closable: false },
  ]);

  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([
    { id: 'customer-groups', title: 'تعریف گروه هدف', type: 'definition', icon: Users },
    { id: 'create-process', title: 'ایجاد روند', type: 'definition' },
    { id: 'bpms-ops-dashboard', title: 'داشبورد عملیاتی روندها', type: 'operation' },
    { id: 'bpms-workflow-analysis', title: 'روندنما', type: 'report' },
  ]);

  const handleTogglePin = (id: string, title: string, type: 'definition' | 'operation' | 'report', icon?: any) => {
    setPinnedItems(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.filter(item => item.id !== id);
      }
      return [...prev, { id, title, type, icon }];
    });
  };

  const handleCloseTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
        setActiveMenuItem(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  };

  const openTab = (id: string, title: string, icon?: any) => {
    setTabs(prev => {
      const exists = prev.find(t => t.id === id);
      if (exists) return prev;
      return [...prev, { id, title, icon, closable: true }];
    });
    setActiveTab(id);
    setActiveMenuItem(id);
  };

  const [processDefinitions, setProcessDefinitions] = useState<ProcessDefinition[]>([
    { 
      id: 1, 
      title: 'روند درخواست خرید کالا', 
      code: 'PR-001', 
      version: '2.1', 
      status: 'active', 
      creator: 'سهراب ابراهیمی', 
      createDate: '۱۴۰۵/۰۱/۱۵',
      usageCount: 124
    },
    { 
      id: 2, 
      title: 'روند تایید فاکتور فروش', 
      code: 'SI-005', 
      version: '1.0', 
      status: 'draft', 
      creator: 'مریم حسینی', 
      createDate: '۱۴۰۵/۰۵/۰۲',
      usageCount: 0
    },
    { 
      id: 3, 
      title: 'روند مرخصی کارکنان', 
      code: 'HR-L01', 
      version: '3.4', 
      status: 'active', 
      creator: 'علیرضا کریمی', 
      createDate: '۱۴۰۴/۱۲/۲۰',
      usageCount: 567
    }
  ]);

  const [processInstances, setProcessInstances] = useState<ProcessInstance[]>([
    { id: '1', processDefinitionId: 1, title: 'خرید تجهیزات شبکه دفتر مرکزی', createdAt: '۱۴۰۵/۰۶/۱۰', lastUpdate: '۱۴۰۵/۰۶/۱۵', currentStage: 'تایید نهایی مدیر مالی', progress: 85, responsible: 'سارا رضایی' },
    { id: '2', processDefinitionId: 1, title: 'خرید لوازم مصرفی انبار', createdAt: '۱۴۰۵/۰۶/۱۲', lastUpdate: '۱۴۰۵/۰۶/۱۳', currentStage: 'بررسی واحد تدارکات', progress: 40, responsible: 'رضا احمدی' },
    { id: '3', processDefinitionId: 3, title: 'درخواست مرخصی استحقاقی - سپهر ناصری', createdAt: '۱۴۰۵/۰۶/۱۴', lastUpdate: '۱۴۰۵/۰۶/۱۴', currentStage: 'تایید مدیر مستقیم', progress: 20, responsible: 'علیرضا کریمی' },
  ]);

  const handleSelectMenuItem = (item: string) => {
    if (item === 'my-dashboard') {
      setActiveTab('my-dashboard');
      setActiveMenuItem('my-dashboard');
      return;
    }

    if (item === 'bpms-ops-dashboard') {
      openTab('bpms-ops-dashboard', 'داشبورد عملیاتی روندها', LayoutGrid);
      setSelectedProcessId(null);
      return;
    }

    // Mapping of menu IDs to titles for dynamic tab creation
    const menuTitles: Record<string, string> = {
      'customer-groups': 'تعریف گروه هدف',
      'media-definition': 'تعریف رسانه',
      'signal-definition': 'تعریف سیگنال',
      'create-campaign': 'ایجاد کمپین',
      'send-signal': 'ثبت ارسال سیگنال',
      'signal-feedback': 'ثبت دریافت سیگنال',
      'sent-signal-metrics': 'ثبت سابقه اطلاعات و متریک سیگنال ارسالی',
      'received-signal-metrics': 'ثبت سابقه اطلاعات و متریک سیگنال دریافتی',
      'media-metrics': 'ثبت سابقه اطلاعات رسانه',
      'campaign-metrics': 'ثبت سابقه اطلاعات کمپین',
      'operational-calendar': 'تقویم عملیاتی',
      'pulse-ops-report': 'گزارش عملیاتی سیگنال',
      'media-ops-report': 'گزارش عملیاتی رسانه',
      'campaign-ops-report': 'گزارش عملیاتی کمپین',
      'create-opportunity': 'ایجاد فرصت',
      'deployment-management': 'تعریف انواع نصب و راه اندازی محصول',
      'maintenance-management': 'تعریف انواع نگهداشت محصول',
      'failure-management': 'تعریف انواع خرابی محصول',
      'toolbox-definition': 'تعریف جعبه ابزار خدمات پس از فروش',
      'req-deployment': 'ثبت درخواست استقرار',
      'req-maintenance': 'ثبت درخواست نگهداشت',
      'req-repairs': 'ثبت درخواست تعمیرات',
      'rep-repairs': 'ثبت گزارش تعمیرات',
      'rep-maintenance': 'ثبت گزارش نگهداشت',
      'rep-deployment': 'ثبت گزارش استقرار',
      'target-calendar': 'تقویم تارگت',
      'target-product-groups': 'گروه‌های محصول',
      'target-geo-groups': 'گروه‌های جغرافیایی',
      'target-team-members': 'تنظیمات تیم و افراد',
      'commission-tiers': 'پلکان پورسانت',
      'target-allocation': 'تخصیص تارگت',
      'commission-calculation': 'محاسبه پورسانت',
      'commission-payment-request': 'درخواست پرداخت پورسانت',
      'comprehensive-target-commission-report': 'گزارش جامع تارگت و پورسانت',
      'indirect-payroll-forecast': 'پیشبینی حقوق و دستمزد',
      'other-income-expense-forecast': 'پیشبینی سایر درآمدها',
      'inflation-purchase-price-forecast': 'پیشبینی نرخ تورم',
      'secondary-exchange-research': 'پیشبینی نرخ ارز',
      'sales-variance-control-report': 'کنترل جامع فروش',
      'indirect-payroll-control-report': 'کنترل حقوق و دستمزد',
      'other-income-expense-control-report': 'کنترل سایر درآمدها',
      'budgetary-pl-statement': 'صورت سود و زیان بودجه‌ای',
      'price-increase-control': 'کنترل افزایش قیمت',
      'create-process': 'ایجاد روند',
      'bpms-access-levels': 'تنظیمات سطح دسترسی',
      'crm-comprehensive-lead-report': 'گزارش جامع سرنخ',
      'crm-timeline-report': 'گزارش تایم‌لاین',
      'bpms-workflow-analysis': 'روندنما',
      'hr-smart-attendance': 'ثبت تردد هوشمند',
      'hr-qr-display': 'نمایش QR تردد',
      'hr-location-definition': 'تعریف لوکیشن',
      'hr-attendance-log': 'گزارش ترددها',
      'issue-proforma': 'صدور پیش فاکتور',
      'issue-invoice': 'صدور فاکتور',
    };

    if (item.startsWith('treasury-')) {
      openTab(item, item.split('-').pop() || 'خزانه‌داری');
      return;
    }

    if (menuTitles[item]) {
      openTab(item, menuTitles[item]);
    } else {
      setActiveMenuItem(item);
      setActiveTab(item);
    }
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setActiveMenuItem(tabId);
  };

  const [groups, setGroups] = useState<TargetGroup[]>(initialTargetGroups);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [mediaList, setMediaList] = useState<MediaChannel[]>(initialPredefinedMedia);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialTargetGroups[0].id);

  const handleUpdateMediaList = (newList: MediaChannel[]) => {
    setMediaList(newList);
  };

  // Find currently selected group
  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Handlers for Groups
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleSaveGroup = (updatedGroup: TargetGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === updatedGroup.id);
      if (exists) {
        return prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
      } else {
        return [...prev, updatedGroup];
      }
    });
    setSelectedGroupId(updatedGroup.id);
  };

  const handleAddSubGroup = (parentId: string | null) => {
    const newId = `grp-${Date.now()}`;
    const newGroup: TargetGroup = {
      id: newId,
      code: `TGT-${Math.floor(100 + Math.random() * 900)}`,
      title: parentId ? 'زیرگروه جدید هدف' : 'گروه هدف اصلی جدید',
      parentId: parentId,
      description: '',
      isActive: true,
      priority: 'medium',
      assignee: 'مهندس حسینی (مدیر بازاریابی صنعتی)',
      targetIndustry: 'صنایع سنگین و مادر',
      expectedAnnualValue: 15000000000,
      assignedLeadIds: [],
      createdAt: '۱۴۰۵/۱۱/۱۸',
      updatedAt: '۱۴۰۵/۱۱/۱۸',
    };

    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newId);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId && g.parentId !== groupId));
    if (selectedGroupId === groupId) {
      const remaining = groups.filter((g) => g.id !== groupId);
      if (remaining.length > 0) {
        setSelectedGroupId(remaining[0].id);
      }
    }
  };

  // Handlers for Leads
  const handleToggleLeadAssignment = (leadId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === currentGroup.id) {
          const isAssigned = g.assignedLeadIds.includes(leadId);
          const newAssigned = isAssigned
            ? g.assignedLeadIds.filter((id) => id !== leadId)
            : [...g.assignedLeadIds, leadId];
          return { ...g, assignedLeadIds: newAssigned };
        }
        return g;
      })
    );
  };

  const handleBulkAssignLeads = (leadIds: string[]) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === currentGroup.id) {
          const merged = Array.from(new Set([...g.assignedLeadIds, ...leadIds]));
          return { ...g, assignedLeadIds: merged };
        }
        return g;
      })
    );
  };

  const handleAddNewCustomLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    // Automatically assign to current group
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === currentGroup.id) {
          return {
            ...g,
            assignedLeadIds: [...g.assignedLeadIds, newLead.id],
          };
        }
        return g;
      })
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f3f4f6] text-slate-800 font-['Vazirmatn',sans-serif] text-xs" dir="rtl">
      {/* Right Sidebar (Paydar ERP standard in RTL) */}
      <Sidebar
        isOpen={sidebarOpen}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={handleSelectMenuItem}
        processDefinitions={processDefinitions}
        onTogglePin={handleTogglePin}
        pinnedIds={pinnedItems.map(p => p.id)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header (Company, fiscal year, online indicators) */}
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Tab Bar (Browser/ERP-like tab bar) */}
        <TabBar
          activeTab={activeTab}
          tabs={tabs}
          setActiveTab={handleSelectTab}
          onCloseTab={handleCloseTab}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3">
          {activeTab === 'my-dashboard' ? (
            <Dashboard 
              pinnedItems={pinnedItems}
              onRemovePin={(id) => handleTogglePin(id, '', 'definition')}
              onOpenItem={(id) => handleSelectMenuItem(id)}
            />
          ) : activeTab === 'issue-invoice' || activeMenuItem === 'issue-invoice' ? (
             <CreateInvoiceView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'issue-proforma' || activeMenuItem === 'issue-proforma' ? (
             <CreateProformaInvoiceView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'create-opportunity' || activeMenuItem === 'create-opportunity' ? (
            <CreateOpportunityView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'sent-signal-metrics' || activeMenuItem === 'sent-signal-metrics' ? (
            <SentSignalMetricsHistoryView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'received-signal-metrics' || activeMenuItem === 'received-signal-metrics' ? (
            <ReceivedSignalMetricsHistoryView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'campaign-metrics' || activeMenuItem === 'campaign-metrics' ? (
            <CampaignMetricsHistoryView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'operational-calendar' || activeMenuItem === 'operational-calendar' ? (
            <OperationGanttView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'pulse-ops-report' || activeMenuItem === 'pulse-ops-report' ? (
            <PulseOperationalDashboard onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'media-ops-report' || activeMenuItem === 'media-ops-report' ? (
            <MediaOperationalDashboard onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'campaign-ops-report' || activeMenuItem === 'campaign-ops-report' ? (
            <CampaignOperationalDashboard onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'media-metrics' || activeMenuItem === 'media-metrics' ? (
            <MediaMetricsHistoryView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'signal-feedback' || activeMenuItem === 'signal-feedback' ? (
            <ReceiveSignalView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'send-signal' || activeMenuItem === 'send-signal' ? (
            <SendSignalView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'create-campaign' || activeMenuItem === 'create-campaign' ? (
            <CampaignDefinitionView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'crm-comprehensive-lead-report' || activeMenuItem === 'crm-comprehensive-lead-report' ? (
            <ComprehensiveLeadReportView leads={leads} mediaList={mediaList} />
          ) : activeTab === 'crm-timeline-report' || activeMenuItem === 'crm-timeline-report' ? (
            <LeadTimelineReportView leads={leads} />
          ) : activeTab === 'product-definition' || activeMenuItem === 'product-definition' ? (
            <ProductDefinitionView />
          ) : activeTab === 'product-pricing' || activeMenuItem === 'product-pricing' ? (
            <ProductPricingView />
          ) : activeTab === 'signal-definition' || activeMenuItem === 'signal-definition' ? (
            <SignalDefinitionView 
              mediaList={mediaList}
              onBackToCustomerGroups={() => handleSelectMenuItem('customer-groups')} 
            />
          ) : activeTab === 'media-definition' || activeMenuItem === 'media-definition' ? (
            <MediaDefinitionView 
              mediaList={mediaList}
              onUpdateMediaList={handleUpdateMediaList}
              onBackToCustomerGroups={() => handleSelectMenuItem('customer-groups')} 
            />
          ) : activeTab === 'deployment-management' || activeMenuItem === 'deployment-management' ? (
            <DeploymentManagementView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'maintenance-management' || activeMenuItem === 'maintenance-management' ? (
            <MaintenanceManagementView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'failure-management' || activeMenuItem === 'failure-management' ? (
            <FailureManagementView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'toolbox-definition' || activeMenuItem === 'toolbox-definition' ? (
            <ToolboxDefinitionView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'req-deployment' || activeMenuItem === 'req-deployment' ? (
            <DeploymentRequestView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'req-maintenance' || activeMenuItem === 'req-maintenance' ? (
            <MaintenanceRequestView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'req-repairs' || activeMenuItem === 'req-repairs' ? (
            <RepairRequestView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'rep-deployment' || activeMenuItem === 'rep-deployment' ? (
            <DeploymentReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'rep-maintenance' || activeMenuItem === 'rep-maintenance' ? (
            <MaintenanceReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'rep-repairs' || activeMenuItem === 'rep-repairs' ? (
            <RepairReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'target-calendar' ? (
            <TargetCalendarView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'target-product-groups' ? (
            <ProductGroupsTargetView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'target-geo-groups' ? (
            <GeographicGroupsTargetView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'target-team-members' ? (
            <TeamMemberSettingsView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'commission-tiers' ? (
            <CommissionTiersView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'target-allocation' ? (
            <TargetAllocationView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'commission-calculation' ? (
            <CommissionCalculationView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'commission-payment-request' ? (
            <CommissionPaymentRequestView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'comprehensive-target-commission-report' ? (
            <ComprehensiveTargetCommissionReportView />
          ) : activeTab === 'indirect-payroll-forecast' ? (
            <IndirectPayrollForecastView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'other-income-expense-forecast' ? (
            <OtherIncomeExpenseForecastView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'inflation-purchase-price-forecast' ? (
            <InflationAndPurchasePriceForecastView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'secondary-exchange-research' ? (
            <SecondaryExchangeRateResearchView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'sales-variance-control-report' ? (
            <SalesVarianceControlReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'indirect-payroll-control-report' ? (
            <IndirectPayrollControlReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'other-income-expense-control-report' ? (
            <OtherIncomeExpenseControlReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'budgetary-pl-statement' ? (
            <BudgetaryPLStatementView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'price-increase-control' ? (
            <PriceIncreaseControlReportView onBack={() => handleSelectMenuItem('customer-groups')} />
          ) : activeTab === 'create-process' ? (
            <ProcessDefinitionView 
              processes={processDefinitions} 
              onUpdateProcesses={setProcessDefinitions} 
            />
          ) : activeTab === 'bpms-access-levels' ? (
            <BPMSAccessLevelsView 
              processes={processDefinitions}
              onBack={() => handleSelectMenuItem('customer-groups')}
            />
          ) : activeTab === 'bpms-ops-dashboard' ? (
            <ProcessDashboardView 
              definitions={processDefinitions}
              onSelectProcess={(id) => {
                setSelectedProcessId(id);
                setActiveTab('process-instances');
              }}
            />
          ) : activeTab === 'process-instances' && selectedProcessId ? (
            <ProcessInstancesView 
              definition={processDefinitions.find(d => String(d.id) === String(selectedProcessId))!}
              instances={processInstances.filter(i => String(i.processDefinitionId) === String(selectedProcessId))}
              onBack={() => handleSelectMenuItem('bpms-ops-dashboard')}
              onCreateNew={() => {
                const newInst: ProcessInstance = {
                  id: String(Date.now()),
                  processDefinitionId: selectedProcessId,
                  title: `اجرای جدید - ${new Date().toLocaleDateString('fa-IR')}`,
                  createdAt: '۱۴۰۵/۰۶/۲۵',
                  lastUpdate: '۱۴۰۵/۰۶/۲۵',
                  currentStage: 'مرحله اول',
                  progress: 0,
                  responsible: 'کاربر فعلی'
                };
                setProcessInstances([...processInstances, newInst]);
              }}
            />
          ) : activeTab.startsWith('treasury-') ? (
            activeTab === 'treasury-ops-petty-cash' ? (
              <PettyCashOperationView onBack={() => handleSelectMenuItem('customer-groups')} />
            ) : activeTab === 'treasury-ops-main' ? (
              <TreasuryOperationsView onBack={() => handleSelectMenuItem('customer-groups')} />
            ) : activeTab === 'treasury-ops-check-incoming' || activeTab === 'treasury-ops-check-outgoing' ? (
              <CheckOperationsView type={activeTab} onBack={() => handleSelectMenuItem('customer-groups')} />
            ) : activeTab.includes('report') ? (
              <TreasuryReportsView type={activeTab} onBack={() => handleSelectMenuItem('customer-groups')} />
            ) : (
              <TreasuryDefinitionsView type={activeTab} onBack={() => handleSelectMenuItem('customer-groups')} />
            )
          ) : activeMenuItem === 'hr-smart-attendance' ? (
            <SmartAttendancePage onBack={() => setActiveMenuItem('customer-groups')} />
          ) : activeMenuItem === 'hr-qr-display' ? (
            <AttendanceQrDisplayPage />
          ) : activeMenuItem === 'hr-location-definition' ? (
            <LocationDefinitionPage />
          ) : activeMenuItem === 'hr-attendance-log' ? (
            <AttendanceReportsPage />
          ) : activeTab === 'bpms-workflow-analysis' || activeMenuItem === 'bpms-workflow-analysis' ? (
            <WorkflowAnalysisPage />
          ) : (
            <>
              {/* Top Breadcrumb & Action bar with DEV badge matching screenshot */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  {/* Green DEV badge from screenshot */}
                  <span className="bg-[#2e7d32] text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                    • DEV
                  </span>

                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <span>پایدار ERP</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
                    <span>مدیریت فروش و بازاریابی</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
                    <span>مدیریت تجربه مشتری (CEM)</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
                    <span>تعاریف</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
                    <span className="font-bold text-slate-900">تعریف گروه هدف</span>
                  </nav>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="چاپ کاردکس گروه"
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">چاپ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`خروجی اکسل سرنخ‌های گروه «${currentGroup.title}» با موفقیت آماده شد.`);
                    }}
                    className="flex items-center gap-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>خروجی اکسل</span>
                  </button>
                </div>
              </div>

              {/* Core Master-Detail Split Layout: ساختار درختی (فضای بزرگتر - ۸ ستون) + عنوان و فرم گروه هدف (تک‌ستونی فشرده - ۴ ستون) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                {/* ساختار درختی (Tree Structure) - فضای بزرگ و گسترده: 8 ستون */}
                <div className="lg:col-span-8 h-[440px]">
                  <GroupTreeView
                    groups={groups}
                    selectedGroupId={selectedGroupId}
                    onSelectGroup={handleSelectGroup}
                    onAddSubGroup={handleAddSubGroup}
                    onDeleteGroup={handleDeleteGroup}
                  />
                </div>

                {/* عنوان گروه هدف (Group Info & Form) - فقط نام‌گذاری و کدینگ، بقیه نمایشی */}
                <div className="lg:col-span-4">
                  <GroupForm
                    selectedGroup={currentGroup}
                    allGroups={groups}
                    onSaveGroup={handleSaveGroup}
                  />
                </div>
              </div>

              {/* انتخاب سرنخ‌ها: از فهرست سرنخ‌ها | بصورت دلخواه */}
              <LeadSelector
                currentGroup={currentGroup}
                allLeads={leads}
                onToggleLeadAssignment={handleToggleLeadAssignment}
                onBulkAssignLeads={handleBulkAssignLeads}
                onAddNewCustomLead={handleAddNewCustomLead}
              />
            </>
          )}
        </main>

      </div>
    </div>
  );
}
