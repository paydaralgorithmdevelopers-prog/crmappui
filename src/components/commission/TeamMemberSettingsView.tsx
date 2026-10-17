import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  GitBranch, 
  Building, 
  Tag, 
  HelpCircle, 
  Printer, 
  Trash2,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  FileText,
  Layers,
  Sparkles,
  Filter,
  Navigation2
} from 'lucide-react';

// Simplified Team and Member types for this view
interface Team {
  id: string;
  code: string;
  title: string;
  parentId: string | null;
  description: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  manager: string;
  targetRegion: string;
  share: number;
  expectedAnnualValue: number;
  assignedMemberIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  code: string;
  name: string;
  role: string;
  phone: string;
  city: string;
  department: string;
  status: 'active' | 'inactive';
  score: number;
  tags: string[];
}

const initialTeams: Team[] = [
  {
    id: 'team-1',
    code: 'TEAM-100',
    title: 'تیم فروش پروژه‌های صنعتی',
    parentId: null,
    description: 'تمرکز بر کارخانجات و صنایع بزرگ فولاد و پتروشیمی',
    isActive: true,
    priority: 'high',
    manager: 'مهندس احمدی',
    targetRegion: 'سراسری',
    share: 100,
    expectedAnnualValue: 85000000000,
    assignedMemberIds: ['member-1', 'member-2'],
    createdAt: '۱۴۰۴/۰۸/۱۰',
    updatedAt: '۱۴۰۵/۱۱/۱۸',
  },
  {
    id: 'team-1-1',
    code: 'TEAM-101',
    title: 'کارگروه فولاد و متالورژی',
    parentId: 'team-1',
    description: 'تامین پست‌های برق داخلی و تابلوهای توزیع اصلی کارخانجات نورد',
    isActive: true,
    priority: 'high',
    manager: 'علیرضا رفیعی',
    targetRegion: 'اصفهان و خوزستان',
    share: 45,
    expectedAnnualValue: 45000000000,
    assignedMemberIds: ['member-1'],
    createdAt: '۱۴۰۴/۰۹/۰۱',
    updatedAt: '۱۴۰۵/۱۱/۱۵',
  }
];

const initialMembers: Member[] = [
  {
    id: 'member-1',
    code: 'MEM-1001',
    name: 'علیرضا رفیعی',
    role: 'کارشناس ارشد فروش',
    phone: '۰۹۱۲۰۰۰۰۰۰۱',
    city: 'تهران',
    department: 'فروش صنعتی',
    status: 'active',
    score: 95,
    tags: ['متخصص PLC', 'فنی'],
  },
  {
    id: 'member-2',
    code: 'MEM-1002',
    name: 'حسین مرادی',
    role: 'کارشناس فروش',
    phone: '۰۹۱۲۰۰۰۰۰۰۲',
    city: 'اصفهان',
    department: 'فروش صنعتی',
    status: 'active',
    score: 88,
    tags: ['مذاکره‌کننده'],
  },
  {
    id: 'member-3',
    code: 'MEM-1003',
    name: 'آزاده اسدی',
    role: 'بازاریاب',
    phone: '۰۹۱۲۰۰۰۰۰۰۳',
    city: 'شیراز',
    department: 'ساختمانی',
    status: 'active',
    score: 82,
    tags: ['ارتباطات'],
  }
];

export const TeamMemberSettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeams[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [treeSearchTerm, setTreeSearchTerm] = useState('');
  const [activeMode, setActiveMode] = useState<'from_list' | 'custom_filter'>('from_list');
  const [savedNotice, setSavedNotice] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'team-1': true,
  });

  // Local state for inline edits in the bottom table
  const [memberSettings, setMemberSettings] = useState<Record<string, { target: number; commission: number; share: number; minAchievement: number; calculationModel: string; targetModel: string; position: string; multiplier: number }>>({
    'member-1': { target: 1200000000, commission: 5, share: 60, minAchievement: 70, calculationModel: '1', targetModel: '1', position: 'کارشناس فروش', multiplier: 1 },
    'member-2': { target: 800000000, commission: 3.5, share: 40, minAchievement: 75, calculationModel: '2', targetModel: '1', position: 'مدیر منطقه', multiplier: 1 },
  });

  const commissionModels = [
    { id: '1', title: 'صدور فاکتور' },
    { id: '2', title: 'صدور فاکتور و درصد تسویه' },
    { id: '3', title: 'صدور فاکتور و تسویه کامل' },
    { id: '4', title: 'صدور فاکتور و خروج انبار' },
    { id: '5', title: 'صدور فاکتور و (تسویه کامل یا خروج انبار)' },
  ];

  const getTeamSiblingsTotalShare = (parentId: string | null) => {
    return teams
      .filter(t => t.parentId === parentId)
      .reduce((sum, t) => sum + (t.share || 0), 0);
  };

  const getTeamMembersTotalShare = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 0;
    return team.assignedMemberIds.reduce((sum, memberId) => {
      return sum + (memberSettings[memberId]?.share || 0);
    }, 0);
  };

  // Find currently selected team
  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleSaveAll = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTeamChange = (id: string, field: keyof Team, value: any) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleAddSubTeam = (parentId: string | null) => {
    const newId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      code: `TEAM-${Math.floor(100 + Math.random() * 900)}`,
      title: parentId ? 'زیرتیم جدید' : 'تیم اصلی جدید',
      parentId: parentId,
      description: '',
      isActive: true,
      priority: 'medium',
      manager: 'نامشخص',
      targetRegion: 'نامشخص',
      share: 0,
      expectedAnnualValue: 0,
      assignedMemberIds: [],
      createdAt: '۱۴۰۵/۱۱/۱۸',
      updatedAt: '۱۴۰۵/۱۱/۱۸',
    };
    setTeams([...teams, newTeam]);
    setSelectedTeamId(newId);
    if (parentId) {
      setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
    }
  };

  const handleDeleteTeam = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (teams.length <= 1) {
      alert('حداقل یک تیم باید در سیستم باقی بماند.');
      return;
    }
    if (confirm('آیا از حذف این تیم و تمامی زیرتیم‌های آن اطمینان دارید؟')) {
      const idsToDelete = new Set<string>([id]);
      const findChildren = (pid: string) => {
        teams.forEach(t => {
          if (t.parentId === pid) {
            idsToDelete.add(t.id);
            findChildren(t.id);
          }
        });
      };
      findChildren(id);
      
      const updatedTeams = teams.filter(t => !idsToDelete.has(t.id));
      setTeams(updatedTeams);
      if (idsToDelete.has(selectedTeamId)) {
        setSelectedTeamId(updatedTeams[0].id);
      }
    }
  };

  const handleToggleMemberAssignment = (memberId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === selectedTeamId) {
        const isAssigned = t.assignedMemberIds.includes(memberId);
        const newAssigned = isAssigned 
          ? t.assignedMemberIds.filter(id => id !== memberId)
          : [...t.assignedMemberIds, memberId];
        return { ...t, assignedMemberIds: newAssigned };
      }
      return t;
    }));
  };

  const handleMemberSettingChange = (memberId: string, field: 'target' | 'commission' | 'share' | 'minAchievement' | 'calculationModel' | 'targetModel' | 'position' | 'multiplier', value: any) => {
    setMemberSettings(prev => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] || { target: 0, commission: 0, share: 0, minAchievement: 0, calculationModel: '1', targetModel: '1', position: '', multiplier: 1 }),
        [field]: value
      }
    }));
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTeamNode = (team: Team, depth = 0) => {
    const children = teams.filter(t => t.parentId === team.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes[team.id] ?? true;
    const isSelected = selectedTeamId === team.id;

    return (
      <div key={team.id} className="relative">
        <div 
          onClick={() => handleSelectTeam(team.id)}
          className={`group flex items-center justify-between p-2 rounded-lg my-0.5 border transition-all cursor-pointer text-xs ${
            isSelected 
              ? 'bg-rose-50 border-rose-200 shadow-xs ring-1 ring-rose-200/50 font-bold' 
              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
          }`}
          style={{ marginRight: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button onClick={(e) => toggleExpand(team.id, e)} className="p-0.5 text-slate-400 hover:text-slate-600">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <ChevronRight className="w-3.5 h-3.5 rotate-180" />}
              </button>
            ) : (
              <span className="w-4 text-center text-slate-300">•</span>
            )}
            <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
            
            {/* Inline Title Editing */}
            <input 
              type="text"
              value={team.title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleTeamChange(team.id, 'title', e.target.value)}
              className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-inherit truncate min-w-[150px]"
            />
            
            <span className="hidden sm:inline-block font-mono text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">#{team.code}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Inline Manager/Region previews or simple status */}
            <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-400 ml-4">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <input 
                  type="text"
                  value={team.manager}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleTeamChange(team.id, 'manager', e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 text-slate-600 w-20 text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <Navigation2 className="w-3 h-3" />
                <input 
                  type="text"
                  value={team.targetRegion}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleTeamChange(team.id, 'targetRegion', e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 text-slate-600 w-24 text-center"
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 ml-4 relative">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
                getTeamSiblingsTotalShare(team.parentId) > 100 
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-100' 
                  : 'bg-slate-100/50 border-slate-200'
              }`}>
                <span className="text-[10px] text-slate-500">سهم تیم:</span>
                <input 
                  type="number"
                  value={team.share}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleTeamChange(team.id, 'share', Number(e.target.value))}
                  className={`bg-transparent border-none focus:ring-0 p-0 w-8 text-center text-[11px] font-bold ${
                    getTeamSiblingsTotalShare(team.parentId) > 100 ? 'text-rose-600' : 'text-rose-700'
                  }`}
                />
                <span className="text-[10px] text-slate-400">%</span>
                
                {getTeamSiblingsTotalShare(team.parentId) > 100 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>مجموع تیم‌ها: {getTeamSiblingsTotalShare(team.parentId)}%</span>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{team.assignedMemberIds.length} عضو</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddSubTeam(team.id); }}
                title="افزودن زیرتیم"
                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button 
                onClick={(e) => handleDeleteTeam(team.id, e)}
                title="حذف تیم"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mr-4 border-r border-slate-100 pr-1">
            {children.map(child => renderTeamNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTreeTeams = treeSearchTerm 
    ? teams.filter(t => t.title.includes(treeSearchTerm) || t.code.includes(treeSearchTerm))
    : teams.filter(t => !t.parentId);

  return (
    <div className="space-y-3 animate-in fade-in duration-500 pb-10">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#2e7d32] text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">• DEV</span>
          <nav className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>پایدار ERP</span>
            <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
            <span>مدیریت فروش و بازاریابی</span>
            <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
            <span className="font-bold text-slate-900">تنظیمات تیم و افراد (ویرایش در سطر)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 animate-fade-in font-bold">تغییرات ذخیره شد</span>
          )}
          <button 
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-3.5 h-3.5" /> ذخیره نهایی کل تنظیمات
          </button>
          <button className="flex items-center gap-1 text-slate-600 hover:text-rose-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-xs transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>راهنما</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 items-start">
        {/* Team Tree Structure (Full Width) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-[320px] flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-rose-600" />
              <h2 className="font-bold text-xs text-slate-800">ساختار درختی و تنظیمات تیم</h2>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">{teams.length} تیم</span>
            </div>
            <button 
              onClick={() => handleAddSubTeam(null)}
              className="flex items-center gap-1 text-rose-700 hover:text-rose-800 text-[11px] font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> افزودن تیم ریشه
            </button>
          </div>

          <div className="p-2 border-b border-slate-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="جستجو و فیلتر آنی در کل درخت..." 
                value={treeSearchTerm}
                onChange={(e) => setTreeSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-3 py-1 text-xs text-slate-700 focus:bg-white focus:border-rose-500 outline-hidden"
              />
              <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {treeSearchTerm ? (
              filteredTreeTeams.map(team => (
                <div 
                  key={team.id}
                  onClick={() => handleSelectTeam(team.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${selectedTeamId === team.id ? 'bg-rose-50 border-rose-200 font-bold text-rose-900' : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-rose-500" />
                    <input 
                      type="text"
                      value={team.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleTeamChange(team.id, 'title', e.target.value)}
                      className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-inherit"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">#{team.code}</span>
                </div>
              ))
            ) : (
              teams.filter(t => !t.parentId).map(root => renderTeamNode(root))
            )}
          </div>
        </div>
      </div>

      {/* Member Selector & Settings (Bottom) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-rose-600" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">تنظیمات و انتساب اعضای تیم: <span className="text-rose-700">{currentTeam.title}</span></span>
              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-sky-200">{currentTeam.assignedMemberIds.length} عضو منتسب</span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold ${
                getTeamMembersTotalShare(currentTeam.id) > 100 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                مجموع سهم اعضا: {getTeamMembersTotalShare(currentTeam.id)}%
                {getTeamMembersTotalShare(currentTeam.id) > 100 && <HelpCircle className="w-3 h-3" />}
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold">
            <button onClick={() => setActiveMode('from_list')} className={`px-3 py-1 rounded-md transition-all ${activeMode === 'from_list' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'}`}>فهرست جامع اعضا</button>
            <button onClick={() => setActiveMode('custom_filter')} className={`px-3 py-1 rounded-md transition-all ${activeMode === 'custom_filter' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'}`}>فیلتر هوشمند</button>
          </div>
        </div>

        {activeMode === 'from_list' ? (
          <div>
            <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/30">
              <div className="relative flex-1 max-w-xs">
                <input 
                  type="text" 
                  placeholder="جستجو سریع در لیست اعضا..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pr-8 pl-3 py-1.5 text-[11px] outline-hidden focus:border-rose-500 shadow-2xs"
                />
                <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">انتساب اعضا در این جدول آنی انجام می‌شود</span>
                <button className="text-[10px] bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 transition-colors">انتخاب گروهی</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-4 w-12 text-center">ردیف</th>
                    <th className="py-2.5 px-4 w-10 text-center">انتساب</th>
                    <th className="py-2.5 px-4">اطلاعات پرسنلی</th>
                    <th className="py-2.5 px-4 text-center">سمت</th>
                    <th className="py-2.5 px-4 text-center">ضریب پورسانت</th>
                    <th className="py-2.5 px-4 text-center">سهم از تارگت (%)</th>
                    <th className="py-2.5 px-4 text-center">حداقل تحقق (%)</th>
                    <th className="py-2.5 px-4 text-center">مدل محاسبه تارگت</th>
                    <th className="py-2.5 px-4 text-center">مدل محاسبه پورسانت</th>
                    <th className="py-2.5 px-4">واحد سازمانی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member, idx) => {
                    const isAssigned = currentTeam.assignedMemberIds.includes(member.id);
                    
                    return (
                      <tr 
                        key={member.id} 
                        className={`hover:bg-slate-50 transition-colors ${isAssigned ? 'bg-rose-50/20' : 'opacity-80'}`}
                      >
                        <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[10px]">{(idx + 1).toLocaleString('fa-IR')}</td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isAssigned} 
                            onChange={() => handleToggleMemberAssignment(member.id)}
                            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer shadow-2xs" 
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{member.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{member.code}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <input 
                              type="text"
                              value={memberSettings[member.id]?.position || member.role}
                              onChange={(e) => handleMemberSettingChange(member.id, 'position', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-center text-[11px] text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                            />
                          ) : (
                            <span className="text-slate-500">{member.role}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <div className="flex items-center justify-center gap-1">
                              <input 
                                type="number"
                                step="0.1"
                                value={memberSettings[member.id]?.multiplier ?? 1}
                                onChange={(e) => handleMemberSettingChange(member.id, 'multiplier', Number(e.target.value))}
                                className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-center font-bold text-[11px] text-emerald-700 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                              />
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <div className="flex items-center justify-center gap-1">
                              <input 
                                type="number"
                                value={memberSettings[member.id]?.share || 0}
                                onChange={(e) => handleMemberSettingChange(member.id, 'share', Number(e.target.value))}
                                className={`w-16 bg-white border rounded px-2 py-1 text-center font-bold text-[11px] focus:ring-1 outline-hidden ${
                                  getTeamMembersTotalShare(currentTeam.id) > 100 ? 'border-rose-300 text-rose-600 focus:ring-rose-500' : 'border-slate-200 text-indigo-700 focus:ring-indigo-500'
                                }`}
                              />
                              <span className="text-slate-400">%</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <div className="flex items-center justify-center gap-1">
                              <input 
                                type="number"
                                value={memberSettings[member.id]?.minAchievement || 0}
                                onChange={(e) => handleMemberSettingChange(member.id, 'minAchievement', Number(e.target.value))}
                                className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-center font-bold text-[11px] text-amber-700 focus:ring-1 focus:ring-amber-500 outline-hidden"
                              />
                              <span className="text-slate-400">%</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <select
                              value={memberSettings[member.id]?.targetModel || '1'}
                              onChange={(e) => handleMemberSettingChange(member.id, 'targetModel', e.target.value)}
                              className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-amber-700 font-medium focus:ring-1 focus:ring-amber-500 outline-hidden w-full max-w-[180px]"
                            >
                              {commissionModels.map(model => (
                                <option key={model.id} value={model.id}>{model.title}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isAssigned ? (
                            <select
                              value={memberSettings[member.id]?.calculationModel || '1'}
                              onChange={(e) => handleMemberSettingChange(member.id, 'calculationModel', e.target.value)}
                              className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-indigo-700 font-medium focus:ring-1 focus:ring-indigo-500 outline-hidden w-full max-w-[180px]"
                            >
                              {commissionModels.map(model => (
                                <option key={model.id} value={model.id}>{model.title}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-50">{member.department}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 bg-slate-50/20">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-xs font-bold italic">قواعد هوشمند انتساب و تنظیم در این نسخه فعال نیست.</p>
          </div>
        )}
      </div>
    </div>
  );
};
