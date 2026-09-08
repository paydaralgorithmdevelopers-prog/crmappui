import React, { useState } from 'react';
import { initialTargetGroups, initialLeads } from './data/initialData';
import { TargetGroup, Lead } from './types';
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { Sidebar } from './components/layout/Sidebar';
import { GroupTreeView } from './components/groups/GroupTreeView';
import { GroupForm } from './components/groups/GroupForm';
import { LeadSelector } from './components/leads/LeadSelector';
import { MediaDefinitionView } from './components/media/MediaDefinitionView';
import { SignalDefinitionView } from './components/media/SignalDefinitionView';
import { CampaignDefinitionView } from './components/campaign/CampaignDefinitionView';
import { SendSignalView } from './components/media/SendSignalView';
import { ReceiveSignalView } from './components/media/ReceiveSignalView';
import { MediaMetricsHistoryView } from './components/media/MediaMetricsHistoryView';
import { SentSignalMetricsHistoryView } from './components/media/SentSignalMetricsHistoryView';
import { ReceivedSignalMetricsHistoryView } from './components/media/ReceivedSignalMetricsHistoryView';
import { CampaignMetricsHistoryView } from './components/campaign/CampaignMetricsHistoryView';
import { OperationGanttView } from './components/campaign/OperationGanttView';
import { PulseOperationalDashboard } from './components/media/PulseOperationalDashboard';
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
import { TeamMemberSettingsView } from './components/commission/TeamMemberSettingsView';
import { CommissionTiersView } from './components/commission/CommissionTiersView';
import { TargetAllocationView } from './components/commission/TargetAllocationView';
import { CommissionCalculationView } from './components/commission/CommissionCalculationView';
import { CommissionPaymentRequestView } from './components/commission/CommissionPaymentRequestView';
import { ComprehensiveTargetReportView } from './components/commission/ComprehensiveTargetReportView';
import { TeamAchievementReportView } from './components/commission/TeamAchievementReportView';
import { CommissionBalanceReportView } from './components/commission/CommissionBalanceReportView';
import {
  FolderTree,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Radio
} from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('customer-groups');
  const [activeMenuItem, setActiveMenuItem] = useState('customer-groups');

  const handleSelectMenuItem = (item: string) => {
    setActiveMenuItem(item);
    if (item === 'media-definition') {
      setActiveTab('media-definition');
    } else if (item === 'signal-definition') {
      setActiveTab('signal-definition');
    } else if (item === 'create-campaign') {
      setActiveTab('create-campaign');
    } else if (item === 'send-signal') {
      setActiveTab('send-signal');
    } else if (item === 'signal-feedback') {
      setActiveTab('signal-feedback');
    } else if (item === 'sent-signal-metrics') {
      setActiveTab('sent-signal-metrics');
    } else if (item === 'received-signal-metrics') {
      setActiveTab('received-signal-metrics');
    } else if (item === 'media-metrics') {
      setActiveTab('media-metrics');
    } else if (item === 'campaign-metrics') {
      setActiveTab('campaign-metrics');
    } else if (item === 'operational-calendar') {
      setActiveTab('operational-calendar');
    } else if (item === 'pulse-ops-report') {
      setActiveTab('pulse-ops-report');
    } else if (item === 'create-opportunity') {
      setActiveTab('create-opportunity');
    } else if (item === 'deployment-management') {
      setActiveTab('deployment-management');
    } else if (item === 'maintenance-management') {
      setActiveTab('maintenance-management');
    } else if (item === 'failure-management') {
      setActiveTab('failure-management');
    } else if (item === 'toolbox-definition') {
      setActiveTab('toolbox-definition');
    } else if (item === 'req-deployment') {
      setActiveTab('req-deployment');
    } else if (item === 'req-maintenance') {
      setActiveTab('req-maintenance');
    } else if (item === 'req-repairs') {
      setActiveTab('req-repairs');
    } else if (item === 'rep-repairs') {
      setActiveTab('rep-repairs');
    } else if (item === 'rep-maintenance') {
      setActiveTab('rep-maintenance');
    } else if (item === 'rep-deployment') {
      setActiveTab('rep-deployment');
    } else if (
      [
        'target-calendar',
        'target-product-groups',
        'target-geo-groups',
        'target-team-members',
        'commission-tiers',
        'target-allocation',
        'commission-calculation',
        'commission-payment-request',
        'comprehensive-target-report',
        'team-achievement-report',
        'commission-balance-report',
      ].includes(item)
    ) {
      setActiveTab(item);
    } else if (item === 'customer-groups' || item === 'target-group-definition') {
      setActiveTab('customer-groups');
    }
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'media-definition') {
      setActiveMenuItem('media-definition');
    } else if (tabId === 'customer-groups') {
      setActiveMenuItem('customer-groups');
    } else {
      setActiveMenuItem(tabId);
    }
  };

  const [groups, setGroups] = useState<TargetGroup[]>(initialTargetGroups);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialTargetGroups[0].id);

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
          setActiveTab={handleSelectTab}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3">
          {activeTab === 'issue-invoice' || activeMenuItem === 'issue-invoice' ? (
             <CreateInvoiceView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'issue-proforma' || activeMenuItem === 'issue-proforma' ? (
             <CreateProformaInvoiceView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'create-opportunity' || activeMenuItem === 'create-opportunity' ? (
            <CreateOpportunityView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'sent-signal-metrics' || activeMenuItem === 'sent-signal-metrics' ? (
            <SentSignalMetricsHistoryView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'received-signal-metrics' || activeMenuItem === 'received-signal-metrics' ? (
            <ReceivedSignalMetricsHistoryView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'campaign-metrics' || activeMenuItem === 'campaign-metrics' ? (
            <CampaignMetricsHistoryView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'operational-calendar' || activeMenuItem === 'operational-calendar' ? (
            <OperationGanttView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'pulse-ops-report' || activeMenuItem === 'pulse-ops-report' ? (
            <PulseOperationalDashboard onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'media-metrics' || activeMenuItem === 'media-metrics' ? (
            <MediaMetricsHistoryView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'signal-feedback' || activeMenuItem === 'signal-feedback' ? (
            <ReceiveSignalView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'send-signal' || activeMenuItem === 'send-signal' ? (
            <SendSignalView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'create-campaign' || activeMenuItem === 'create-campaign' ? (
            <CampaignDefinitionView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'signal-definition' || activeMenuItem === 'signal-definition' ? (
            <SignalDefinitionView onBackToCustomerGroups={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'media-definition' || activeMenuItem === 'media-definition' ? (
            <MediaDefinitionView onBackToCustomerGroups={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'deployment-management' || activeMenuItem === 'deployment-management' ? (
            <DeploymentManagementView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'maintenance-management' || activeMenuItem === 'maintenance-management' ? (
            <MaintenanceManagementView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'failure-management' || activeMenuItem === 'failure-management' ? (
            <FailureManagementView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'toolbox-definition' || activeMenuItem === 'toolbox-definition' ? (
            <ToolboxDefinitionView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'req-deployment' || activeMenuItem === 'req-deployment' ? (
            <DeploymentRequestView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'req-maintenance' || activeMenuItem === 'req-maintenance' ? (
            <MaintenanceRequestView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'req-repairs' || activeMenuItem === 'req-repairs' ? (
            <RepairRequestView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'rep-deployment' || activeMenuItem === 'rep-deployment' ? (
            <DeploymentReportView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'rep-maintenance' || activeMenuItem === 'rep-maintenance' ? (
            <MaintenanceReportView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'rep-repairs' || activeMenuItem === 'rep-repairs' ? (
            <RepairReportView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'target-calendar' ? (
            <TargetCalendarView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'target-product-groups' ? (
            <ProductGroupsTargetView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'target-geo-groups' ? (
            <GeographicGroupsTargetView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'target-team-members' ? (
            <TeamMemberSettingsView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'commission-tiers' ? (
            <CommissionTiersView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'target-allocation' ? (
            <TargetAllocationView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'commission-calculation' ? (
            <CommissionCalculationView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'commission-payment-request' ? (
            <CommissionPaymentRequestView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'comprehensive-target-report' ? (
            <ComprehensiveTargetReportView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'team-achievement-report' ? (
            <TeamAchievementReportView onBack={() => handleSelectTab('customer-groups')} />
          ) : activeTab === 'commission-balance-report' ? (
            <CommissionBalanceReportView onBack={() => handleSelectTab('customer-groups')} />
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
