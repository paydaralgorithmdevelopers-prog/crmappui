import React from 'react';
import { 
  GitBranch, 
  Play, 
  ArrowLeft, 
  Activity, 
  Clock, 
  TrendingUp,
  LayoutGrid,
  ChevronLeft
} from 'lucide-react';
import { ProcessDefinition } from '../../types';

interface ProcessDashboardViewProps {
  definitions: ProcessDefinition[];
  onSelectProcess: (id: string | number) => void;
}

export const ProcessDashboardView: React.FC<ProcessDashboardViewProps> = ({
  definitions,
  onSelectProcess
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 lg:p-8 space-y-8 overflow-y-auto rtl" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-600 rounded-xl shadow-lg shadow-rose-600/20">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">داشبورد عملیاتی روندها</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">برای شروع یا پیگیری، یکی از روندهای زیر را انتخاب کنید</p>
          </div>
        </div>
      </div>

      {/* Grid of Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {definitions.map((proc) => (
          <button
            key={proc.id}
            onClick={() => onSelectProcess(proc.id)}
            className="group relative bg-white border border-slate-200 rounded-3xl p-6 text-right transition-all duration-300 hover:border-rose-300 hover:shadow-2xl hover:shadow-rose-600/5 hover:-translate-y-1 flex flex-col gap-4 overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-rose-600/30">
                <GitBranch className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
                  {proc.code}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">نسخه {proc.version}</span>
              </div>
            </div>

            <div className="relative mt-2">
              <h3 className="text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors leading-snug">
                {proc.title}
              </h3>
            </div>

            <div className="relative mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500">
                  {proc.usageCount} اجرای فعال
                </span>
              </div>
              <div className="flex items-center gap-1 text-rose-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <span className="text-[10px] font-black">ورود به عملیات</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 w-1.5 h-full ${
              proc.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
          </button>
        ))}

        {/* Placeholder for empty state */}
        {definitions.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
             <Activity className="w-12 h-12 text-slate-200" />
             <p className="text-sm font-bold text-slate-400">هنوز روندی تعریف نشده است.</p>
          </div>
        )}
      </div>

      {/* Global Stats or Recent Activity can be added here if requested */}
    </div>
  );
};
