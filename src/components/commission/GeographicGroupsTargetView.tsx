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
  name: string;
  type: 'continent' | 'country' | 'city';
  children?: Location[];
}

const masterLocations: Location[] = [
  {
    id: 'cont-asia',
    name: 'آسیا',
    type: 'continent',
    children: [
      {
        id: 'country-iran',
        name: 'ایران',
        type: 'country',
        children: [
          { id: 'city-tehran', name: 'تهران', type: 'city' },
          { id: 'city-isfahan', name: 'اصفهان', type: 'city' },
          { id: 'city-shiraz', name: 'شیراز', type: 'city' },
        ]
      },
      {
        id: 'country-oman',
        name: 'عمان',
        type: 'country',
        children: [
          { id: 'city-muscat', name: 'مسقط', type: 'city' },
          { id: 'city-sohar', name: 'صحار', type: 'city' },
        ]
      },
      {
        id: 'country-iraq',
        name: 'عراق',
        type: 'country',
        children: [
          { id: 'city-baghdad', name: 'بغداد', type: 'city' },
          { id: 'city-basra', name: 'بصره', type: 'city' },
        ]
      }
    ]
  },
  {
    id: 'cont-europe',
    name: 'اروپا',
    type: 'continent',
    children: [
      {
        id: 'country-germany',
        name: 'آلمان',
        type: 'country',
        children: [
          { id: 'city-berlin', name: 'برلین', type: 'city' },
          { id: 'city-hamburg', name: 'هامبورگ', type: 'city' },
        ]
      }
    ]
  }
];

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
    assignedLocationIds: ['country-oman', 'city-sohar'],
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
    assignedLocationIds: ['city-sohar'],
  }
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
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({
    'cont-asia': true,
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
    setGroups(prev => {
      const newGroups = prev.map(g => g.id === id ? { ...g, [field]: value } : g);
      
      // If we're updating share, we might want to check the sum of siblings
      // But we allow the user to type, and just show visual feedback instead of blocking
      return newGroups;
    });
  };

  const getSiblingsTotalShare = (parentId: string | null) => {
    return groups
      .filter(g => g.parentId === parentId)
      .reduce((sum, g) => sum + (g.share || 0), 0);
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

  const getAllChildIds = (location: Location): string[] => {
    let ids = [location.id];
    if (location.children) {
      location.children.forEach(child => {
        ids = [...ids, ...getAllChildIds(child)];
      });
    }
    return ids;
  };

  const handleToggleLocationAssignment = (location: Location) => {
    const idsToToggle = getAllChildIds(location);
    const isAssigned = currentGroup.assignedLocationIds.includes(location.id);

    setGroups(prev => prev.map(g => {
      if (g.id === selectedGroupId) {
        let newAssigned;
        if (isAssigned) {
          // Unassign all children as well
          newAssigned = g.assignedLocationIds.filter(id => !idsToToggle.includes(id));
        } else {
          // Assign all children as well
          const currentSet = new Set(g.assignedLocationIds);
          idsToToggle.forEach(id => currentSet.add(id));
          newAssigned = Array.from(currentSet);
        }
        return { ...g, assignedLocationIds: newAssigned };
      }
      return g;
    }));
  };

  const filteredMasterLocations = useMemo(() => {
    if (!searchQuery) return masterLocations;

    const filterNodes = (nodes: Location[]): Location[] => {
      return nodes.reduce((acc: Location[], node) => {
        const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        
        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          });
        }
        return acc;
      }, []);
    };

    return filterNodes(masterLocations);
  }, [searchQuery]);

  // Auto-expand nodes when searching
  React.useEffect(() => {
    if (searchQuery) {
      const expandMatchedNodes = (nodes: Location[]) => {
        nodes.forEach(node => {
          if (node.children && node.children.some(child => 
            child.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (child.children && child.children.length > 0)
          )) {
            setExpandedLocations(prev => ({ ...prev, [node.id]: true }));
            expandMatchedNodes(node.children || []);
          }
        });
      };
      expandMatchedNodes(filteredMasterLocations);
    }
  }, [searchQuery, filteredMasterLocations]);

  const toggleExpandLocation = (id: string) => {
    setExpandedLocations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderLocationNode = (location: Location, depth = 0) => {
    const isAssigned = currentGroup.assignedLocationIds.includes(location.id);
    const hasChildren = location.children && location.children.length > 0;
    const isExpanded = expandedLocations[location.id];

    return (
      <div key={location.id} className="select-none">
        <div 
          className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${isAssigned ? 'bg-rose-50/50' : 'hover:bg-slate-50'}`}
          style={{ paddingRight: `${depth * 24 + 12}px` }}
          onClick={() => handleToggleLocationAssignment(location)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpandLocation(location.id); }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-transform duration-200"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="w-5.5" />
            )}
            
            <input 
              type="checkbox" 
              checked={isAssigned}
              onChange={() => handleToggleLocationAssignment(location)}
              className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            />
            
            <span className={`text-[11px] ${isAssigned ? 'font-bold text-rose-700' : 'text-slate-700'}`}>
              {location.name}
            </span>

            <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-mono">
              {location.type === 'continent' ? 'continent' : location.type === 'country' ? 'country' : 'city'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAssigned && (
              <span className="bg-rose-600 w-1.5 h-1.5 rounded-full shadow-xs animate-pulse" />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-r border-slate-100 mr-4">
            {location.children?.map(child => renderLocationNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
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

            <div className="hidden lg:flex items-center gap-3 ml-4 relative group/share">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
                getSiblingsTotalShare(group.parentId) > 100 
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-100' 
                  : 'bg-slate-100/50 border-slate-200'
              }`}>
                <span className="text-[10px] text-slate-500">سهم از تارگت:</span>
                <input 
                  type="number"
                  value={group.share}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleGroupChange(group.id, 'share', Number(e.target.value))}
                  className={`bg-transparent border-none focus:ring-0 p-0 w-8 text-center text-[11px] font-bold ${
                    getSiblingsTotalShare(group.parentId) > 100 ? 'text-rose-600' : 'text-rose-700'
                  }`}
                />
                <span className="text-[10px] text-slate-400">%</span>
                
                {getSiblingsTotalShare(group.parentId) > 100 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>مجموع: {getSiblingsTotalShare(group.parentId)}% (بیش از ۱۰۰٪)</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-rose-600"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500">ضریب پورسانت:</span>
                <input 
                  type="number"
                  step="0.1"
                  value={group.multiplier}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleGroupChange(group.id, 'multiplier', Number(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 p-0 text-indigo-700 w-10 text-center text-[11px] font-bold"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-[400px] flex flex-col overflow-hidden">
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
                  placeholder="جستجو در قاره‌ها، کشورها و شهرها..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pr-8 pl-3 py-1.5 text-[11px] outline-hidden focus:border-rose-500 shadow-2xs"
                />
                <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 italic">با انتخاب والد، تمامی زیرمجموعه‌ها نیز انتخاب می‌شوند</span>
                <button 
                  onClick={() => {
                    setGroups(prev => prev.map(g => g.id === selectedGroupId ? { ...g, assignedLocationIds: [] } : g));
                  }}
                  className="text-[10px] bg-white text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-50 transition-colors"
                >
                  حذف تمامی انتخاب‌ها
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-1">
                {filteredMasterLocations.length > 0 ? (
                  filteredMasterLocations.map(continent => renderLocationNode(continent))
                ) : (
                  <div className="py-10 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-[11px]">موردی برای جستجوی شما یافت نشد.</p>
                  </div>
                )}
              </div>
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
