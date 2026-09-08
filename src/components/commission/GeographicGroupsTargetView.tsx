import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  GitBranch, 
  MapPin, 
  Flag, 
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

// Simplified Geo types
interface GeoGroup {
  id: string;
  code: string;
  title: string;
  parentId: string | null;
  description: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  manager: string;
  share: number;
  multiplier: number;
  assignedLocationIds: string[];
}

interface Location {
  id: string;
  code: string;
  name: string;
  type: 'continent' | 'country' | 'city';
  parentGeoId: string | null;
}

const initialGeoGroups: GeoGroup[] = [
  {
    id: 'geo-1',
    code: 'GEO-100',
    title: 'بازار خاورمیانه و خلیج فارس',
    parentId: null,
    description: 'تمرکز بر کشورهای حاشیه خلیج فارس و بازارهای صادراتی فعال',
    isActive: true,
    priority: 'high',
    manager: 'مهندس رضایی',
    share: 40,
    multiplier: 1.5,
    assignedLocationIds: ['loc-1', 'loc-2'],
  },
  {
    id: 'geo-1-1',
    code: 'GEO-101',
    title: 'منطقه ویژه اقتصادی عمان',
    parentId: 'geo-1',
    description: 'تامین تجهیزات زیرساختی بندر صحار',
    isActive: true,
    priority: 'high',
    manager: 'علیرضا رفیعی',
    share: 15,
    multiplier: 1.8,
    assignedLocationIds: ['loc-1'],
  }
];

const masterLocations: Location[] = [
  { id: 'loc-1', code: 'OMN', name: 'عمان', type: 'country', parentGeoId: null },
  { id: 'loc-2', code: 'UAE', name: 'امارات متحده عربی', type: 'country', parentGeoId: null },
  { id: 'loc-3', code: 'IRQ', name: 'عراق', type: 'country', parentGeoId: null },
  { id: 'loc-4', code: 'QAT', name: 'قطر', type: 'country', parentGeoId: null },
  { id: 'loc-5', code: 'KWT', name: 'کویت', type: 'country', parentGeoId: null },
];

export const GeographicGroupsTargetView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [groups, setGroups] = useState<GeoGroup[]>(initialGeoGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialGeoGroups[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [treeSearchTerm, setTreeSearchTerm] = useState('');
  const [activeMode, setActiveMode] = useState<'from_list' | 'custom_filter'>('from_list');
  const [savedNotice, setSavedNotice] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'geo-1': true,
  });

  // Local state for inline edits in the bottom table
  const [locationSettings, setLocationSettings] = useState<Record<string, { share: number; multiplier: number }>>({
    'loc-1': { share: 10, multiplier: 1.2 },
    'loc-2': { share: 15, multiplier: 1.1 },
  });

  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleSaveAll = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleGroupChange = (id: string, field: keyof GeoGroup, value: any) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleAddSubGroup = (parentId: string | null) => {
    const newId = `geo-${Date.now()}`;
    const newGroup: GeoGroup = {
      id: newId,
      code: `GEO-${Math.floor(100 + Math.random() * 900)}`,
      title: parentId ? 'زیرگروه جدید' : 'گروه اصلی جدید',
      parentId: parentId,
      description: '',
      isActive: true,
      priority: 'medium',
      manager: 'نامشخص',
      share: 0,
      multiplier: 1,
      assignedLocationIds: [],
    };
    setGroups([...groups, newGroup]);
    setSelectedGroupId(newId);
    if (parentId) {
      setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
    }
  };

  const handleDeleteGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (groups.length <= 1) {
      alert('حداقل یک گروه جغرافیایی باید در سیستم باقی بماند.');
      return;
    }
    if (confirm('آیا از حذف این گروه و تمامی زیرمجموعه‌های آن اطمینان دارید؟')) {
      const idsToDelete = new Set<string>([id]);
      const findChildren = (pid: string) => {
        groups.forEach(g => {
          if (g.parentId === pid) {
            idsToDelete.add(g.id);
            findChildren(g.id);
          }
        });
      };
      findChildren(id);
      
      const updatedGroups = groups.filter(g => !idsToDelete.has(g.id));
      setGroups(updatedGroups);
      if (idsToDelete.has(selectedGroupId)) {
        setSelectedGroupId(updatedGroups[0].id);
      }
    }
  };

  const handleToggleLocationAssignment = (locId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === selectedGroupId) {
        const isAssigned = g.assignedLocationIds.includes(locId);
        const newAssigned = isAssigned 
          ? g.assignedLocationIds.filter(id => id !== locId)
          : [...g.assignedLocationIds, locId];
        return { ...g, assignedLocationIds: newAssigned };
      }
      return g;
    }));
  };

  const handleLocationSettingChange = (locId: string, field: 'share' | 'multiplier', value: number) => {
    setLocationSettings(prev => ({
      ...prev,
      [locId]: {
        ...(prev[locId] || { share: 0, multiplier: 1 }),
        [field]: value
      }
    }));
  };

  const filteredLocations = useMemo(() => {
    return masterLocations.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderGroupNode = (group: GeoGroup, depth = 0) => {
    const children = groups.filter(g => g.parentId === group.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes[group.id] ?? true;
    const isSelected = selectedGroupId === group.id;

    return (
      <div key={group.id} className="relative">
        <div 
          onClick={() => handleSelectGroup(group.id)}
          className={`group flex items-center justify-between p-2 rounded-lg my-0.5 border transition-all cursor-pointer text-xs ${
            isSelected 
              ? 'bg-rose-50 border-rose-200 shadow-xs ring-1 ring-rose-200/50 font-bold' 
              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
          }`}
          style={{ marginRight: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button onClick={(e) => toggleExpand(group.id, e)} className="p-0.5 text-slate-400 hover:text-slate-600">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <ChevronRight className="w-3.5 h-3.5 rotate-180" />}
              </button>
            ) : (
              <span className="w-4 text-center text-slate-300">•</span>
            )}
            <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
            <input 
              type="text"
              value={group.title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleGroupChange(group.id, 'title', e.target.value)}
              className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-inherit truncate min-w-[150px]"
            />
            <span className="hidden sm:inline-block font-mono text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">#{group.code}</span>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-400 ml-4">
              <div className="flex items-center gap-1">
                <Navigation2 className="w-3 h-3" />
                <input 
                  type="text"
                  value={group.manager}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleGroupChange(group.id, 'manager', e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 text-slate-600 w-20 text-center"
                />
              </div>
            </div>

            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{group.assignedLocationIds.length} منطقه</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddSubGroup(group.id); }}
                title="افزودن زیرگروه"
                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button 
                onClick={(e) => handleDeleteGroup(group.id, e)}
                title="حذف گروه"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mr-4 border-r border-slate-100 pr-1">
            {children.map(child => renderGroupNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTreeGroups = treeSearchTerm 
    ? groups.filter(g => g.title.includes(treeSearchTerm) || g.code.includes(treeSearchTerm))
    : groups.filter(g => !g.parentId);

  return (
    <div className="space-y-3 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#2e7d32] text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">• DEV</span>
          <nav className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>پایدار ERP</span>
            <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
            <span>مدیریت فروش و بازاریابی</span>
            <ChevronRight className="w-3 h-3 text-slate-400 rotate-180" />
            <span className="font-bold text-slate-900">گروه‌های جغرافیایی و تارگت (ویرایش در سطر)</span>
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
            <Save className="w-3.5 h-3.5" /> ذخیره نهایی تنظیمات
          </button>
          <button className="flex items-center gap-1 text-slate-600 hover:text-rose-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-xs transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>راهنما</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 items-start">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-[320px] flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-rose-600" />
              <h2 className="font-bold text-xs text-slate-800">ساختار درختی و تنظیمات گروه</h2>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">{groups.length} گروه</span>
            </div>
            <button 
              onClick={() => handleAddSubGroup(null)}
              className="flex items-center gap-1 text-rose-700 hover:text-rose-800 text-[11px] font-bold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> افزودن گروه ریشه
            </button>
          </div>

          <div className="p-2 border-b border-slate-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="جستجو در ساختار درختی..." 
                value={treeSearchTerm}
                onChange={(e) => setTreeSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-3 py-1 text-xs text-slate-700 focus:bg-white focus:border-rose-500 outline-hidden"
              />
              <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {treeSearchTerm ? (
              filteredTreeGroups.map(group => (
                <div 
                  key={group.id}
                  onClick={() => handleSelectGroup(group.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${selectedGroupId === group.id ? 'bg-rose-50 border-rose-200 font-bold text-rose-900' : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-rose-500" />
                    <input 
                      type="text"
                      value={group.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleGroupChange(group.id, 'title', e.target.value)}
                      className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-inherit"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">#{group.code}</span>
                </div>
              ))
            ) : (
              groups.filter(g => !g.parentId).map(root => renderGroupNode(root))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-rose-600" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">تنظیمات و انتساب مناطق جغرافیایی: <span className="text-rose-700">{currentGroup.title}</span></span>
              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-sky-200">{currentGroup.assignedLocationIds.length} منطقه منتسب</span>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold">
            <button onClick={() => setActiveMode('from_list')} className={`px-3 py-1 rounded-md transition-all ${activeMode === 'from_list' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'}`}>فهرست مناطق</button>
            <button onClick={() => setActiveMode('custom_filter')} className={`px-3 py-1 rounded-md transition-all ${activeMode === 'custom_filter' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'}`}>فیلتر پیشرفته</button>
          </div>
        </div>

        {activeMode === 'from_list' ? (
          <div>
            <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/30">
              <div className="relative flex-1 max-w-xs">
                <input 
                  type="text" 
                  placeholder="جستجو در مناطق..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pr-8 pl-3 py-1.5 text-[11px] outline-hidden focus:border-rose-500 shadow-2xs"
                />
                <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 italic">انتساب مناطق در این جدول آنی انجام می‌شود</span>
                <button className="text-[10px] bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-bold">انتخاب گروهی</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-4 w-12 text-center">ردیف</th>
                    <th className="py-2.5 px-4 w-10 text-center">انتساب</th>
                    <th className="py-2.5 px-4">کد ایزو</th>
                    <th className="py-2.5 px-4">نام کشور / منطقه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLocations.map((loc, idx) => {
                    const isAssigned = currentGroup.assignedLocationIds.includes(loc.id);
                    
                    return (
                      <tr 
                        key={loc.id} 
                        className={`hover:bg-slate-50 transition-colors ${isAssigned ? 'bg-rose-50/20' : 'opacity-80'}`}
                      >
                        <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[10px]">{(idx + 1).toLocaleString('fa-IR')}</td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isAssigned} 
                            onChange={() => handleToggleLocationAssignment(loc.id)}
                            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer shadow-2xs" 
                          />
                        </td>
                        <td className="py-2.5 px-4"><span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">{loc.code}</span></td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{loc.name}</td>
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
            <p className="text-xs font-bold italic">قواعد هوشمند جغرافیایی در این نسخه غیرفعال است.</p>
          </div>
        )}
      </div>
    </div>
  );
};
