import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Users, 
  Search, 
  Filter,
  Activity,
  Megaphone,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  type: 'campaign' | 'media' | 'signal';
  start: string; // ISO format or Persian YYYY/MM/DD
  end: string;
  progress: number;
  assignee?: string;
  status: 'active' | 'completed' | 'pending' | 'delayed';
  parentId?: string;
}

const MOCK_GANTT_DATA: GanttTask[] = [
  // Campaign 1
  { id: 'c1', name: 'کمپین فروش بهاره تابلو برق', type: 'campaign', start: '2026-03-21', end: '2026-06-20', progress: 45, status: 'active' },
  { id: 'c1-m1', name: 'رسانه: لینکدین صنعتی', type: 'media', start: '2026-04-01', end: '2026-05-15', progress: 60, parentId: 'c1', status: 'active' },
  { id: 'c1-m1-s1', name: 'سیگنال: مقاله تخصصی فشار قوی', type: 'signal', start: '2026-04-05', end: '2026-04-10', progress: 100, parentId: 'c1-m1', assignee: 'مهندس احمدی', status: 'completed' },
  { id: 'c1-m1-s2', name: 'سیگنال: وبینار تابلوهای کمپکت', type: 'signal', start: '2026-04-20', end: '2026-04-25', progress: 20, parentId: 'c1-m1', assignee: 'سارا رضایی', status: 'active' },
  { id: 'c1-m2', name: 'رسانه: نمایشگاه صنعت برق', type: 'media', start: '2026-05-10', end: '2026-05-25', progress: 10, parentId: 'c1', status: 'pending' },
  
  // Campaign 2
  { id: 'c2', name: 'کمپین نوسازی ترانسفورماتورها', type: 'campaign', start: '2026-05-01', end: '2026-08-30', progress: 15, status: 'active' },
  { id: 'c2-m1', name: 'رسانه: ایمیل مارکتینگ مستقیم', type: 'media', start: '2026-05-05', end: '2026-06-30', progress: 30, parentId: 'c2', status: 'active' },
  { id: 'c2-m1-s1', name: 'سیگنال: خبرنامه فنی خرداد', type: 'signal', start: '2026-06-01', end: '2026-06-05', progress: 0, parentId: 'c2-m1', assignee: 'علی کریمی', status: 'pending' },
];

export const OperationGanttView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['c1', 'c1-m1', 'c2']));
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  // Helper to flatten tree based on expansion
  const visibleTasks = useMemo(() => {
    const result: GanttTask[] = [];
    const addChildren = (parentId: string) => {
      MOCK_GANTT_DATA.filter(t => t.parentId === parentId).forEach(child => {
        result.push(child);
        if (expandedIds.has(child.id)) {
          addChildren(child.id);
        }
      });
    };

    MOCK_GANTT_DATA.filter(t => !t.parentId).forEach(campaign => {
      result.push(campaign);
      if (expandedIds.has(campaign.id)) {
        addChildren(campaign.id);
      }
    });

    return result.filter(t => t.name.includes(searchQuery));
  }, [expandedIds, searchQuery]);

  // Timeline setup
  const startDate = new Date('2026-03-01');
  const endDate = new Date('2026-09-01');
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const getPosition = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (diff / totalDays) * 100;
  };

  const getWidth = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return (diff / totalDays) * 100;
  };

  const months = ['مارچ', 'آپریل', 'می', 'جون', 'جولای', 'آگوست'];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">تقویم عملیاتی (گانت چارت)</h1>
            <p className="text-xs text-slate-500">برنامه‌ریزی زمانی کمپین‌ها، رسانه‌ها و سیگنال‌ها</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input 
              type="text" 
              placeholder="جستجو در تقویم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none w-64"
            />
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div className="w-72 p-3 border-l border-slate-200 shrink-0 font-bold text-xs text-slate-600">
            ساختار عملیاتی
          </div>
          <div className="flex-1 relative flex">
            {months.map((m, i) => (
              <div key={m} className="flex-1 border-l border-slate-100 p-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {visibleTasks.map((task) => {
            const hasChildren = MOCK_GANTT_DATA.some(t => t.parentId === task.id);
            const isExpanded = expandedIds.has(task.id);
            const level = task.parentId ? (task.id.split('-').length - 1) : 0;
            
            return (
              <div key={task.id} className="flex group hover:bg-slate-50/50 transition-colors border-b border-slate-100 min-h-[48px] items-center">
                {/* Task Info Sidebar */}
                <div 
                  className="w-72 p-2 border-l border-slate-200 shrink-0 flex items-center gap-2 overflow-hidden"
                  style={{ paddingRight: `${level * 16 + 8}px` }}
                >
                  <button 
                    onClick={() => hasChildren && toggleExpand(task.id)}
                    className={`p-1 rounded hover:bg-slate-200 transition-all ${!hasChildren && 'opacity-0 cursor-default'}`}
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  
                  <div className={`p-1 rounded-md ${
                    task.type === 'campaign' ? 'bg-indigo-100 text-indigo-700' :
                    task.type === 'media' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {task.type === 'campaign' ? <Megaphone className="w-3.5 h-3.5" /> :
                     task.type === 'media' ? <Radio className="w-3.5 h-3.5" /> :
                     <Activity className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className={`truncate text-xs ${task.type === 'campaign' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                      {task.name}
                    </span>
                    {task.assignee && (
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> {task.assignee}
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Bar Area */}
                <div className="flex-1 relative h-12 flex items-center px-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="flex-1 border-l border-slate-50" />
                    ))}
                  </div>

                  {/* The Bar */}
                  <div 
                    className="absolute h-7 rounded-lg shadow-sm flex items-center px-2 group/bar transition-all hover:brightness-95 cursor-pointer overflow-hidden"
                    style={{ 
                      right: `${getPosition(task.start)}%`, 
                      width: `${getWidth(task.start, task.end)}%`,
                      backgroundColor: 
                        task.type === 'campaign' ? '#4f46e5' : 
                        task.type === 'media' ? '#f59e0b' : 
                        '#10b981'
                    }}
                  >
                    {/* Progress Fill */}
                    <div 
                      className="absolute inset-0 bg-black/10 transition-all"
                      style={{ width: `${task.progress}%`, right: 0 }}
                    />
                    
                    {/* Progress Label */}
                    <span className="relative z-10 text-[9px] font-bold text-white whitespace-nowrap drop-shadow-sm">
                      {task.progress}%
                    </span>

                    {/* Status Dot */}
                    <div className={`absolute left-2 w-1.5 h-1.5 rounded-full ${
                      task.status === 'completed' ? 'bg-emerald-300' :
                      task.status === 'active' ? 'bg-blue-300 animate-pulse' :
                      'bg-slate-300'
                    }`} />
                  </div>

                  {/* Tooltip on hover (Simulated) */}
                  <div className="absolute top-0 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white p-2 rounded-lg text-[10px] z-20 pointer-events-none shadow-xl border border-slate-700 -translate-y-full mt-[-8px]">
                    <div className="font-bold border-b border-slate-700 pb-1 mb-1">{task.name}</div>
                    <div>شروع: {task.start}</div>
                    <div>پایان: {task.end}</div>
                    {task.assignee && <div>مسئول: {task.assignee}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Legend */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between text-[10px] text-slate-500 font-bold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
              <span>کمپین</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>رسانه</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>سیگنال</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>آخرین به‌روزرسانی: امروز ۱۰:۴۵</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>۲ سیگنال با تاخیر مواجه هستند</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
