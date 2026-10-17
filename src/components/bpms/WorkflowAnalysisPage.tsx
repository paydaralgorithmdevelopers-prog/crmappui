import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  User, 
  Eye, 
  ArrowRight,
  GitBranch,
  Calendar,
  Timer,
  AlertCircle,
  BarChart2,
  DollarSign,
  TrendingUp,
  X,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProcessDefinition } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import { WorkflowFormModal } from './WorkflowFormModal';

interface StepDuration {
  stepName: string;
  assignedTo: string;
  duration: string;
  durationHours: number;
  standardTimeHours?: number;
  hourlyRate: number;
  status: 'completed' | 'current' | 'pending';
}

interface WorkflowAnalysisInstance {
  id: string;
  code: string;
  title: string;
  requester: string;
  startDate: string;
  currentStage: string;
  totalDuration: string;
  totalDurationHours: number;
  stepDurations: StepDuration[];
}

const mockDefinitions: ProcessDefinition[] = [
  { id: 1, title: 'درخواست مرخصی', code: 'PRC-001', version: '1.2', status: 'active', creator: 'سیستم', createDate: '1405/01/10', usageCount: 145 },
  { id: 2, title: 'خرید کالا و خدمات', code: 'PRC-002', version: '2.0', status: 'active', creator: 'مدیر پلتفرم', createDate: '1405/02/15', usageCount: 89 },
  { id: 3, title: 'تسویه حساب پرسنل', code: 'PRC-003', version: '1.0', status: 'active', creator: 'منابع انسانی', createDate: '1405/03/20', usageCount: 34 },
  { id: 4, title: 'تعمیرات و نگهداری', code: 'PRC-004', version: '3.1', status: 'active', creator: 'فنی', createDate: '1405/04/05', usageCount: 56 },
  { id: 5, title: 'گزارش هزینه سفر', code: 'PRC-005', version: '1.1', status: 'active', creator: 'مالی', createDate: '1405/05/12', usageCount: 72 },
  { id: 6, title: 'تخصیص دارایی ثابت', code: 'PRC-006', version: '1.0', status: 'active', creator: 'اموال', createDate: '1405/06/01', usageCount: 21 },
];

const mockInstances: Record<number, WorkflowAnalysisInstance[]> = {
  1: [
    {
      id: 'INST-101',
      code: 'REQ-8821',
      title: 'درخواست مرخصی استحقاقی - علی رضایی',
      requester: 'علی رضایی',
      startDate: '1405/07/01',
      currentStage: 'تأیید مدیر واحد',
      totalDuration: '52 ساعت',
      totalDurationHours: 52,
      stepDurations: [
        { stepName: 'ثبت درخواست', assignedTo: 'علی رضایی', duration: '0.25 ساعت', durationHours: 0.25, standardTimeHours: 0.5, hourlyRate: 450000, status: 'completed' },
        { stepName: 'بررسی واحد اداری', assignedTo: 'مریم ساداتی', duration: '4 ساعت', durationHours: 4, standardTimeHours: 8, hourlyRate: 550000, status: 'completed' },
        { stepName: 'تأیید مدیر واحد', assignedTo: 'محمد حسینی', duration: '46 ساعت', durationHours: 46, standardTimeHours: 40, hourlyRate: 850000, status: 'current' },
        { stepName: 'صدور حکم مرخصی', assignedTo: 'سیستم', duration: '-', durationHours: 0, standardTimeHours: 1, hourlyRate: 0, status: 'pending' },
      ]
    },
    {
      id: 'INST-102',
      code: 'REQ-8825',
      title: 'مرخصی بدون حقوق - سارا محسنی',
      requester: 'سارا محسنی',
      startDate: '1405/07/02',
      currentStage: 'تأیید منابع انسانی',
      totalDuration: '26 ساعت',
      totalDurationHours: 26,
      stepDurations: [
        { stepName: 'ثبت درخواست', assignedTo: 'سارا محسنی', duration: '0.17 ساعت', durationHours: 0.16, standardTimeHours: 0.5, hourlyRate: 450000, status: 'completed' },
        { stepName: 'تأیید مدیر مستقیم', assignedTo: 'رضا علوی', duration: '6 ساعت', durationHours: 6, standardTimeHours: 12, hourlyRate: 750000, status: 'completed' },
        { stepName: 'تأیید منابع انسانی', assignedTo: 'احمد مرادی', duration: '20 ساعت', durationHours: 20, standardTimeHours: 24, hourlyRate: 600000, status: 'current' },
      ]
    }
  ],
  2: [
    {
      id: 'INST-201',
      code: 'PUR-5510',
      title: 'خرید تجهیزات شبکه دفتر مرکزی',
      requester: 'واحد IT',
      startDate: '1405/06/25',
      currentStage: 'استعلام بها',
      totalDuration: '156 ساعت',
      totalDurationHours: 156,
      stepDurations: [
        { stepName: 'درخواست خرید', assignedTo: 'رضا محمدی', duration: '2 ساعت', durationHours: 2, standardTimeHours: 4, hourlyRate: 500000, status: 'completed' },
        { stepName: 'تأیید بودجه', assignedTo: 'حمید کریمی', duration: '24 ساعت', durationHours: 24, standardTimeHours: 24, hourlyRate: 950000, status: 'completed' },
        { stepName: 'بررسی فنی', assignedTo: 'سعید رستمی', duration: '48 ساعت', durationHours: 48, standardTimeHours: 36, hourlyRate: 700000, status: 'completed' },
        { stepName: 'استعلام بها', assignedTo: 'واحد تدارکات', duration: '82 ساعت', durationHours: 82, standardTimeHours: 72, hourlyRate: 550000, status: 'current' },
      ]
    }
  ]
};

const HOURLY_RATE = 750000;

export const WorkflowAnalysisPage: React.FC = () => {
  const [selectedDefinition, setSelectedDefinition] = useState<ProcessDefinition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisInstance, setAnalysisInstance] = useState<WorkflowAnalysisInstance | null>(null);
  const [viewFormInstance, setViewFormInstance] = useState<{ instance: WorkflowAnalysisInstance; mode: 'view' | 'edit' } | null>(null);
  const [definitionAnalytics, setDefinitionAnalytics] = useState<ProcessDefinition | null>(null);

  const filteredDefinitions = mockDefinitions.filter(def => 
    def.title.includes(searchTerm) || def.code.includes(searchTerm)
  );

  const instances = selectedDefinition ? (mockInstances[selectedDefinition.id as number] || []) : [];

  return (
    <div className="flex flex-col h-full bg-slate-50 rtl">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">روندنما</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">تحلیل هوشمند زمان‌بندی و پویایی روندهای سازمانی</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {selectedDefinition && (
          <button 
            onClick={() => setSelectedDefinition(null)}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all text-sm font-bold"
          >
            <ChevronRight className="w-4 h-4" />
            بازگشت به لیست روندها
          </button>
        )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {!selectedDefinition ? (
            <motion.div 
              key="tiles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="جستجوی روند (مثلاً مرخصی...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pr-12 pl-4 py-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Tiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDefinitions.map((def) => {
                  // Mock stats for display
                  const stats = {
                    avgTime: (24 + (def.id as number) * 4.5).toFixed(1),
                    efficiency: 92 - (def.id as number) * 2,
                    totalCost: (def.usageCount * 1.25).toFixed(1),
                    trend: (def.id as number) % 2 === 0 ? 'up' : 'down'
                  };

                  return (
                    <div key={def.id} className="relative group">
                      <div className="w-full bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all text-right flex flex-col gap-6 overflow-hidden relative">
                        {/* Background Decoration - Moved to bottom-left to avoid masking top-left buttons */}
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-50/50 rounded-tr-[4rem] group-hover:bg-indigo-50/30 transition-colors duration-500"></div>
                        
                        {/* Header: Icon & Report Button */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <GitBranch className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{def.code}</span>
                              <span className="text-[9px] font-bold text-slate-400">نسخه {def.version}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDefinitionAnalytics(def);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all duration-300 font-black text-[9px] shadow-sm border border-sky-100/50 active:scale-95 z-20"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                            <span>گزارش جامع</span>
                          </button>
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-900 transition-colors leading-tight">{def.title}</h3>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-slate-300" />
                            <p className="text-[10px] text-slate-400 font-medium">طراح: <span className="text-slate-600">{def.creator}</span></p>
                          </div>
                        </div>

                        {/* Minimal Stats Grid - 4 columns for more detail */}
                        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 relative z-10">
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] text-slate-400 font-bold mb-0.5">زمان (س)</span>
                            <span className="text-[11px] font-black text-slate-700">{stats.avgTime}</span>
                          </div>
                          <div className="flex flex-col items-center border-r border-slate-100">
                            <span className="text-[8px] text-slate-400 font-bold mb-0.5">بهره‌وری</span>
                            <span className="text-[11px] font-black text-emerald-600">%{stats.efficiency}</span>
                          </div>
                          <div className="flex flex-col items-center border-r border-slate-100">
                            <span className="text-[8px] text-slate-400 font-bold mb-0.5">هزینه (M)</span>
                            <span className="text-[11px] font-black text-amber-600">{stats.totalCost}</span>
                          </div>
                          <div className="flex flex-col items-center border-r border-slate-100">
                            <span className="text-[8px] text-slate-400 font-bold mb-0.5">روند</span>
                            {stats.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-rose-500 rotate-180" />
                            )}
                          </div>
                        </div>

                        {/* Footer: Main Action (Instance List) */}
                        <button 
                          onClick={() => setSelectedDefinition(def)}
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group/btn hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 relative z-10 shadow-sm"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-[9px] text-slate-400 font-bold group-hover/btn:text-indigo-100 mb-0.5">نمونه‌های اجرایی</span>
                            <span className="text-xs font-black text-slate-700 group-hover/btn:text-white flex items-center gap-1.5">
                              {def.usageCount} مورد ثبت شده
                              <ArrowRight className="w-3 h-3 text-indigo-400 rotate-180 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                            </span>
                          </div>
                          <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover/btn:bg-white/20 group-hover/btn:text-white transition-all">
                            <ChevronLeft className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="instances"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Process Info Header */}
              <div className="bg-indigo-600 rounded-3xl p-8 text-white flex items-center justify-between shadow-lg shadow-indigo-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-32 -translate-y-32"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black">{selectedDefinition.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-indigo-100 text-sm">
                    <span className="bg-white/10 px-3 py-1 rounded-full">{selectedDefinition.code}</span>
                    <span>نسخه {selectedDefinition.version}</span>
                    <span>ایجاد شده در {selectedDefinition.createDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className="text-center">
                    <div className="text-2xl font-black">{selectedDefinition.usageCount}</div>
                    <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">تعداد کل</div>
                  </div>
                  <div className="w-px h-10 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-2xl font-black">57.6 ساعت</div>
                    <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">میانگین زمان</div>
                  </div>
                </div>
              </div>

              {/* Instances Table */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-md font-black text-slate-800">لیست روندهای در جریان</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">عنوان و شناسه</th>
                        <th className="px-6 py-4">درخواست کننده</th>
                        <th className="px-6 py-4">زمان کل</th>
                        <th className="px-6 py-4">مسئول فعلی</th>
                        <th className="px-6 py-4">تحلیل توقف در کارتابل‌ها</th>
                        <th className="px-6 py-4 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {instances.map((inst) => {
                        const currentStep = inst.stepDurations.find(s => s.status === 'current');
                        return (
                          <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-800">{inst.title}</span>
                                <span className="text-[10px] font-mono text-indigo-500 mt-0.5">{inst.code}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                  <User className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">{inst.requester}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-indigo-600">
                                <Timer className="w-4 h-4" />
                                <span className="text-xs font-black">{inst.totalDuration}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-black text-slate-800">{currentStep?.assignedTo || '-'}</span>
                                  <span className="text-[9px] text-amber-600 font-bold">{inst.currentStage}</span>
                                </div>
                              </div>
                            </td>
                          <td className="px-6 py-5 min-w-[200px]">
                            <div className="max-w-[280px] overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                              <div className="flex items-center gap-0 min-w-max">
                                {inst.stepDurations.map((step, idx) => (
                                  <div key={idx} className="flex items-center group/step">
                                    <div 
                                      className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all relative shrink-0 ${
                                        step.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' :
                                        step.status === 'current' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
                                      }`}
                                    >
                                      <span className="text-[10px] font-black leading-none">{idx + 1}</span>
                                      {step.duration !== '-' && (
                                        <span className="text-[7px] font-bold leading-none mt-1 opacity-90">{step.duration}</span>
                                      )}
                                      
                                      {/* Tooltip */}
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[9px] opacity-0 group-hover/step:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                        <div className="font-black border-b border-white/10 pb-1 mb-1">{step.stepName}</div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span className="text-slate-400">مسئول:</span>
                                          <span>{step.assignedTo}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span className="text-slate-400">مدت توقف:</span>
                                          <span className="text-indigo-300 font-bold">{step.duration}</span>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
                                      </div>
                                    </div>
                                    {idx < inst.stepDurations.length - 1 && (
                                      <div className={`w-6 h-0.5 shrink-0 ${step.status === 'completed' ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setViewFormInstance({ instance: inst, mode: 'view' })}
                                  className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group-hover:scale-110"
                                  title="مشاهده فرم"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setViewFormInstance({ instance: inst, mode: 'edit' })}
                                  className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group-hover:scale-110"
                                  title="ویرایش فرم"
                                >
                                  <History className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setAnalysisInstance(inst)}
                                  className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all group-hover:scale-110"
                                  title="تحلیل فرآیند"
                                >
                                  <BarChart2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-slate-50 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-black">نمایش {instances.length} مورد از {instances.length} روند فعال</div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-800 transition-all">
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[10px] shadow-lg shadow-indigo-100">1</button>
                    <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-800 transition-all">
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {analysisInstance && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnalysisInstance(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden text-right rtl"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">تحلیل هوشمند فرآیند</h2>
                    <p className="text-xs text-slate-400 mt-0.5">گزارش تحلیلی زمان‌بندی و هزینه‌های عملیاتی {analysisInstance.code}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysisInstance(null)}
                  className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-indigo-400 font-bold uppercase mb-1 whitespace-nowrap text-right">کل زمان فرآیند</div>
                    <div className="text-lg font-black text-indigo-900 text-right">{analysisInstance.totalDurationHours.toFixed(2)} ساعت</div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-emerald-400 font-bold uppercase mb-1 whitespace-nowrap text-right">تعداد گام‌ها</div>
                    <div className="text-lg font-black text-emerald-900 text-right">{analysisInstance.stepDurations.length} مرحله</div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-amber-400 font-bold uppercase mb-1 whitespace-nowrap text-right">کل هزینه نفرساعت</div>
                    <div className="text-lg font-black text-amber-900 text-right">
                      {analysisInstance.stepDurations.reduce((acc, step) => acc + (step.durationHours * step.hourlyRate), 0).toLocaleString()} <span className="text-[10px]">تومان</span>
                    </div>
                  </div>

                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-rose-400 font-bold uppercase mb-1 whitespace-nowrap text-right">انحراف از زمان استاندارد</div>
                    <div className="text-lg font-black text-rose-900 text-right">
                      {(analysisInstance.stepDurations.reduce((acc, step) => acc + (step.standardTimeHours || 0), 0) - analysisInstance.totalDurationHours).toFixed(2)} <span className="text-[10px]">ساعت</span>
                    </div>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-sky-400 font-bold uppercase mb-1 whitespace-nowrap text-right">تاریخ شروع</div>
                    <div className="text-lg font-black text-sky-900 text-right">{analysisInstance.startDate}</div>
                  </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart 1: Steps in Order */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800">روند توقف در مراحل (به ترتیب)</h3>
                      <span className="text-[9px] text-slate-400 font-bold px-2 py-1 bg-slate-50 rounded-full">ساعت</span>
                    </div>
                    <div className="w-full overflow-visible">
                      <ResponsiveContainer width="100%" height={analysisInstance.stepDurations.length * 50 + 40}>
                        <BarChart data={analysisInstance.stepDurations} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="stepName" 
                            type="category" 
                            width={110} 
                            fontSize={9} 
                            fontWeight="bold" 
                            tick={{ fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            orientation="right"
                          />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', direction: 'rtl', textAlign: 'right' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="durationHours" radius={[4, 0, 0, 4]}>
                            {analysisInstance.stepDurations.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.status === 'completed' ? '#10b981' : '#4f46e5'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Steps Sorted by Duration */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800">تحلیل گلوگاه‌ها (کم به زیاد)</h3>
                      <span className="text-[9px] text-slate-400 font-bold px-2 py-1 bg-slate-50 rounded-full">ساعت</span>
                    </div>
                    <div className="w-full overflow-visible">
                      <ResponsiveContainer width="100%" height={analysisInstance.stepDurations.filter(s => s.durationHours > 0).length * 50 + 40}>
                        <BarChart 
                          layout="vertical"
                          data={[...analysisInstance.stepDurations]
                            .filter(s => s.durationHours > 0)
                            .sort((a, b) => a.durationHours - b.durationHours)
                          }
                          margin={{ left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="stepName" 
                            type="category" 
                            width={110} 
                            fontSize={9} 
                            fontWeight="bold" 
                            tick={{ fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            orientation="right"
                          />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', direction: 'rtl', textAlign: 'right' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="durationHours" radius={[4, 0, 0, 4]}>
                            {[...analysisInstance.stepDurations]
                              .filter(s => s.durationHours > 0)
                              .sort((a, b) => a.durationHours - b.durationHours)
                              .map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.durationHours > 40 ? '#f43f5e' : '#0ea5e9'} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800">جزئیات مالی و زمانی گام‌ها</h3>
                    <div className="text-[10px] text-slate-400 font-bold">محاسبه بر اساس نرخ اختصاصی هر مسئول</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50">
                          <th className="p-4">نام مرحله</th>
                          <th className="p-4">مسئول</th>
                          <th className="p-4 text-center">نرخ ساعت (ت)</th>
                          <th className="p-4 text-center">زمان واقعی (س)</th>
                          <th className="p-4 text-center">زمان استاندارد (س)</th>
                          <th className="p-4 text-center">انحراف (س)</th>
                          <th className="p-4 text-left">هزینه نهایی</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {analysisInstance.stepDurations.map((step, idx) => {
                          const deviation = (step.standardTimeHours || 0) - step.durationHours;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                              <td className="p-4 text-xs font-bold text-slate-700">{step.stepName}</td>
                              <td className="p-4 text-xs text-slate-500 font-medium">{step.assignedTo}</td>
                              <td className="p-4 text-xs font-mono font-bold text-slate-600 text-center">{step.hourlyRate.toLocaleString()}</td>
                              <td className="p-4 text-xs font-mono font-bold text-sky-600 text-center">{step.durationHours || '-'}</td>
                              <td className="p-4 text-xs font-mono font-bold text-blue-500 text-center">{step.standardTimeHours || '-'}</td>
                              <td className={`p-4 text-xs font-mono font-black text-center ${deviation > 0 ? 'text-emerald-500' : deviation < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {step.durationHours > 0 ? (deviation > 0 ? `+${deviation.toFixed(2)}` : deviation.toFixed(2)) : '-'}
                              </td>
                              <td className="p-4 text-xs font-mono font-black text-amber-600 text-left">
                                {step.durationHours > 0 ? (step.durationHours * step.hourlyRate).toLocaleString() : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={3} className="p-4 text-sm font-black text-slate-800">مجموع مقادیر فرآیند</td>
                          <td className="p-4 text-sm font-mono font-black text-sky-700 text-center">{analysisInstance.totalDurationHours.toFixed(2)}</td>
                          <td className="p-4 text-sm font-mono font-black text-blue-700 text-center">
                            {analysisInstance.stepDurations.reduce((acc, step) => acc + (step.standardTimeHours || 0), 0).toFixed(2)}
                          </td>
                          <td className="p-4 text-sm font-mono font-black text-slate-700 text-center">
                            {(analysisInstance.stepDurations.reduce((acc, step) => acc + (step.standardTimeHours || 0), 0) - analysisInstance.totalDurationHours).toFixed(2)}
                          </td>
                          <td className="p-4 text-sm font-mono font-black text-amber-700 text-left">
                            {analysisInstance.stepDurations.reduce((acc, step) => acc + (step.durationHours * step.hourlyRate), 0).toLocaleString()} تومان
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setAnalysisInstance(null)}
                  className="px-8 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
                >
                  بستن گزارش
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Modal (View/Edit) */}
      <AnimatePresence>
        {viewFormInstance && (
          <WorkflowFormModal 
            instance={viewFormInstance.instance} 
            mode={viewFormInstance.mode} 
            onClose={() => setViewFormInstance(null)} 
          />
        )}
      </AnimatePresence>

      {/* Definition-Level Analytics Modal */}
      <AnimatePresence>
        {definitionAnalytics && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDefinitionAnalytics(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden text-right rtl"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">گزارش آماری جامع فرآیند</h2>
                    <p className="text-xs text-slate-400 mt-0.5">تحلیل عملکرد کلی {definitionAnalytics.title} (نسخه {definitionAnalytics.version})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDefinitionAnalytics(null)}
                  className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Aggregate Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-indigo-400 font-bold uppercase mb-1 whitespace-nowrap">تعداد کل دفعات اجرا</div>
                    <div className="text-lg font-black text-indigo-900">{definitionAnalytics.usageCount} بار</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-emerald-400 font-bold uppercase mb-1 whitespace-nowrap">میانگین زمان انجام</div>
                    <div className="text-lg font-black text-emerald-900">57.6 ساعت</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-amber-400 font-bold uppercase mb-1 whitespace-nowrap">میانگین هزینه هر فرآیند</div>
                    <div className="text-lg font-black text-amber-900">1.2M تومان</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-rose-400 font-bold uppercase mb-1 whitespace-nowrap">جمع کل هزینه‌های فرآیند</div>
                    <div className="text-lg font-black text-rose-900">145.5M تومان</div>
                  </div>
                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-3xl">
                    <div className="text-[9px] text-sky-400 font-bold uppercase mb-1 whitespace-nowrap">جمع زمان کل فرآیندها</div>
                    <div className="text-lg font-black text-sky-900">8,352 ساعت</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Stages Average Duration Chart */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-800">میانگین توقف در هر ایستگاه (ساعت)</h3>
                    <div className="w-full overflow-visible">
                      <ResponsiveContainer width="100%" height={5 * 50 + 40}>
                        <BarChart 
                          layout="vertical"
                          data={[
                            { stage: 'ثبت درخواست', avg: 0.5 },
                            { stage: 'بررسی اداری', avg: 12 },
                            { stage: 'تأیید فنی', avg: 36 },
                            { stage: 'تدارکات', avg: 72 },
                            { stage: 'تأیید نهایی', avg: 8 }
                          ]}
                          margin={{ left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="stage" type="category" width={110} fontSize={9} fontWeight="bold" orientation="right" axisLine={false} tickLine={false} />
                          <RechartsTooltip contentStyle={{ direction: 'rtl', textAlign: 'right', borderRadius: '12px' }} />
                          <Bar dataKey="avg" fill="#4f46e5" radius={[4, 0, 0, 4]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Operational Cost Chart */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-800">توزیع هزینه به تفکیک مراحل (تومان)</h3>
                    <div className="w-full overflow-visible">
                      <ResponsiveContainer width="100%" height={5 * 50 + 40}>
                        <BarChart 
                          layout="vertical"
                          data={[
                            { stage: 'ثبت', cost: 1200000 },
                            { stage: 'اداری', cost: 18500000 },
                            { stage: 'فنی', cost: 42000000 },
                            { stage: 'تدارکات', cost: 65000000 },
                            { stage: 'نهایی', cost: 18800000 }
                          ]}
                          margin={{ left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="stage" type="category" width={110} fontSize={9} fontWeight="bold" orientation="right" axisLine={false} tickLine={false} />
                          <RechartsTooltip contentStyle={{ direction: 'rtl', textAlign: 'right', borderRadius: '12px' }} />
                          <Bar dataKey="cost" fill="#f59e0b" radius={[4, 0, 0, 4]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Performance Table */}
                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-black text-slate-800">تحلیل بهره‌وری ایستگاه‌های کاری</h3>
                  </div>
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400">
                        <th className="p-4">ایستگاه کاری</th>
                        <th className="p-4">تعداد فیلد مرحله</th>
                        <th className="p-4">امتیاز هر مرحله</th>
                        <th className="p-4">کمترین زمان</th>
                        <th className="p-4">بیشترین زمان</th>
                        <th className="p-4">زمان استاندارد</th>
                        <th className="p-4">میانگین توقف</th>
                        <th className="p-4">انحراف</th>
                        <th className="p-4">هزینه کل انباشته</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { stage: 'ثبت درخواست', fields: 12, score: 12, min: 10, max: 120, std: 45, avg: 30, cost: '1,200,000' },
                        { stage: 'بررسی واحد اداری', fields: 8, score: 8, min: 120, max: 4320, std: 1440, avg: 720, cost: '18,500,000' },
                        { stage: 'تأیید فنی', fields: 15, score: 15, min: 1440, max: 14400, std: 2880, avg: 3600, cost: '42,000,000' },
                        { stage: 'واحد تدارکات', fields: 22, score: 22, min: 2880, max: 21600, std: 5760, avg: 5760, cost: '65,000,000' },
                      ].map((row, i) => {
                        const deviation = row.std - row.avg;
                        const formatTime = (mins: number) => {
                          const hours = mins / 60;
                          return `${hours.toFixed(2)} ساعت`;
                        };
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs font-bold text-slate-700">
                            <td className="p-4">{row.stage}</td>
                            <td className="p-4">{row.fields} فیلد</td>
                            <td className="p-4 text-emerald-600 font-black">{row.score} امتیاز</td>
                            <td className="p-4 text-slate-400">{formatTime(row.min)}</td>
                            <td className="p-4 text-rose-500">{formatTime(row.max)}</td>
                            <td className="p-4 text-blue-500">{formatTime(row.std)}</td>
                            <td className="p-4 text-indigo-600">{formatTime(row.avg)}</td>
                            <td className={`p-4 font-black ${deviation > 0 ? 'text-emerald-500' : deviation < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                              {deviation > 0 ? '+' : ''}{formatTime(deviation)}
                            </td>
                            <td className="p-4 text-amber-600">{row.cost} تومان</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setDefinitionAnalytics(null)}
                  className="px-8 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all"
                >
                  بستن گزارش آماری
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
