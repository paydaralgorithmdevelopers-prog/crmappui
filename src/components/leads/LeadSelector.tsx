import React, { useState, useMemo } from 'react';
import { Lead, SelectionMode, TargetGroup } from '../../types';
import {
  Users,
  Search,
  SlidersHorizontal,
  Plus,
  CheckCircle2,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Check,
  Filter,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface LeadSelectorProps {
  currentGroup: TargetGroup;
  allLeads: Lead[];
  onToggleLeadAssignment: (leadId: string) => void;
  onBulkAssignLeads: (leadIds: string[]) => void;
  onAddNewCustomLead: (lead: Lead) => void;
}

export const LeadSelector: React.FC<LeadSelectorProps> = ({
  currentGroup,
  allLeads,
  onToggleLeadAssignment,
  onBulkAssignLeads,
  onAddNewCustomLead,
}) => {
  const [activeMode, setActiveMode] = useState<SelectionMode>('from_list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  // Custom filter state (برای تب «بصورت دلخواه»)
  const [customIndustry, setCustomIndustry] = useState<string>('all');
  const [customMinScore, setCustomMinScore] = useState<number>(70);
  const [customProvince, setCustomProvince] = useState<string>('all');

  // New ad-hoc lead form state (برای تب «بصورت دلخواه» -> ثبت دستی)
  const [newLeadForm, setNewLeadForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    city: 'اصفهان',
    province: 'اصفهان',
    industry: currentGroup.targetIndustry || 'صنایع سنگین و مادر',
    score: 85,
    estimatedValue: 10000000000,
    tags: 'سفارشی',
  });
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // Filter leads for standard list
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustryFilter === 'all' || lead.industry === selectedIndustryFilter;

      const matchesStatus =
        selectedStatusFilter === 'all' || lead.status === selectedStatusFilter;

      const isAssigned = currentGroup.assignedLeadIds.includes(lead.id);
      const matchesAssignedOnly = !showOnlyAssigned || isAssigned;

      return matchesSearch && matchesIndustry && matchesStatus && matchesAssignedOnly;
    });
  }, [allLeads, searchQuery, selectedIndustryFilter, selectedStatusFilter, showOnlyAssigned, currentGroup]);

  // Candidates for custom rule matching
  const customMatchedLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchInd = customIndustry === 'all' || lead.industry === customIndustry;
      const matchScore = lead.score >= customMinScore;
      const matchProv = customProvince === 'all' || lead.province === customProvince;
      return matchInd && matchScore && matchProv;
    });
  }, [allLeads, customIndustry, customMinScore, customProvince]);

  const assignedLeadsList = allLeads.filter((l) =>
    currentGroup.assignedLeadIds.includes(l.id)
  );

  const totalAssignedValue = assignedLeadsList.reduce(
    (sum, l) => sum + (l.estimatedValue || 0),
    0
  );

  const handleApplyCustomRule = () => {
    const idsToAssign = customMatchedLeads.map((l) => l.id);
    onBulkAssignLeads(idsToAssign);
  };

  const handleCreateCustomLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.companyName.trim()) {
      alert('لطفاً نام شرکت/سازمان را وارد نمایید');
      return;
    }

    const created: Lead = {
      id: `lead-${Date.now()}`,
      code: `LID-${Math.floor(5000 + Math.random() * 4000)}`,
      companyName: newLeadForm.companyName,
      contactPerson: newLeadForm.contactPerson || 'مسئول خرید',
      phone: newLeadForm.phone || '۰۲۱-۸۸۰۰۰۰۰۰',
      city: newLeadForm.city,
      province: newLeadForm.province,
      industry: newLeadForm.industry,
      source: 'معرف',
      status: 'تازه',
      score: Number(newLeadForm.score) || 75,
      estimatedValue: Number(newLeadForm.estimatedValue) || 5000000000,
      tags: newLeadForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      assignedDate: '۱۴۰۵/۱۱/۱۸',
    };

    onAddNewCustomLead(created);
    setShowNewLeadModal(false);
    setNewLeadForm({
      companyName: '',
      contactPerson: '',
      phone: '',
      city: 'اصفهان',
      province: 'اصفهان',
      industry: currentGroup.targetIndustry || 'صنایع سنگین و مادر',
      score: 85,
      estimatedValue: 10000000000,
      tags: 'سفارشی',
    });
  };

  const formatNumber = (n: number) => {
    return n.toLocaleString('fa-IR');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mt-3">
      {/* Top Title Bar: Unified Advanced Search */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-800">جستجوی پیشرفته و انتساب سرنخ‌ها</span>
            <span className="text-[10px] text-slate-500 font-medium">فیلتر هوشمند بر اساس ویژگی‌های گروه‌های مشتری</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold border border-sky-200 flex items-center gap-1.5 shadow-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{currentGroup.assignedLeadIds.length} سرنخ منتسب</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Advanced Filters Section */}
        <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            {/* Text Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 pr-1">جستجوی متنی:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="نام، کد، شهر، فرد رابط..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-700 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* Assignment Toggle - Removed and replaced by Advanced Search */}
            <div className="md:col-span-1 lg:col-span-2">
              <button
                type="button"
                className="w-full h-10 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <span>جستجوی پیشرفته</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">ردیف</th>
                  <th className="py-3 px-4 w-10 text-center">انتخاب</th>
                  <th className="py-3 px-4">کد سیستم</th>
                  <th className="py-3 px-4">نام شرکت / سازمان</th>
                  <th className="py-3 px-4">گروه مشتری</th>
                  <th className="py-3 px-4">موقعیت جغرافیایی</th>
                  <th className="py-3 px-4 text-left">جمع فاکتورهای فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead, idx) => {
                  const isAssigned = currentGroup.assignedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onToggleLeadAssignment(lead.id)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        isAssigned ? 'bg-rose-50/40' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {(idx + 1).toLocaleString('fa-IR')}
                      </td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => onToggleLeadAssignment(lead.id)}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                          {lead.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-bold">
                        {lead.companyName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lead.industry}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {lead.city} - {lead.province}
                      </td>
                      <td className="py-3 px-4 text-left font-mono font-bold text-slate-900">
                        {formatNumber(lead.estimatedValue)}
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                      موردی با این مشخصات در جستجوی پیشرفته یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
