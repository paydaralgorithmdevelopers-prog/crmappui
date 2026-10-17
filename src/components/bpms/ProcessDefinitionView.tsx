import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  GitBranch, 
  MoreVertical, 
  Play, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { ProcessDefinition } from '../../types';
import { FormBuilderView } from './FormBuilderView';

interface ProcessDefinitionViewProps {
  processes: ProcessDefinition[];
  onUpdateProcesses: (processes: ProcessDefinition[]) => void;
}

export const ProcessDefinitionView: React.FC<ProcessDefinitionViewProps> = ({
  processes,
  onUpdateProcesses
}) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  if (isBuilderOpen) {
    return (
      <FormBuilderView 
        onBack={() => setIsBuilderOpen(false)} 
        onSave={(formData) => {
          const newProcess: ProcessDefinition = {
            id: Date.now(),
            title: formData.title || 'روند جدید',
            code: `BP-${Math.floor(Math.random() * 1000)}`,
            version: '1.0',
            status: 'draft',
            creator: 'کاربر فعلی',
            createDate: '۱۴۰۵/۰۶/۲۵',
            usageCount: 0
          };
          onUpdateProcesses([newProcess, ...processes]);
          setIsBuilderOpen(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 lg:p-6 space-y-6 overflow-hidden rtl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-rose-600" />
            تعریف و مدیریت روندها
          </h1>
          <p className="text-xs text-slate-500 mt-1">مدیریت چرخه حیات، نسخه‌گذاری و پیکربندی روندهای سازمانی (BPMS)</p>
        </div>

        <button 
          onClick={() => setIsBuilderOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          روند جدید
        </button>
      </div>

      {/* Stats / Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">کل روندها</div>
            <div className="text-lg font-black text-slate-800">۲۴ <span className="text-[10px] font-normal">روند</span></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">فعال</div>
            <div className="text-lg font-black text-slate-800">۱۸ <span className="text-[10px] font-normal">روند</span></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">در حال طراحی</div>
            <div className="text-lg font-black text-slate-800">۴ <span className="text-[10px] font-normal">روند</span></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">تعداد اجرا</div>
            <div className="text-lg font-black text-slate-800">۱,۲۴۰ <span className="text-[10px] font-normal">تراکنش</span></div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="جستجو در نام یا کد روند..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-hidden focus:border-rose-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">همه</button>
            <button className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg">فعال</button>
            <button className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-white rounded-lg">بایگانی شده</button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-right text-sm border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">عنوان روند</th>
                <th className="px-6 py-4">کد</th>
                <th className="px-6 py-4">نسخه</th>
                <th className="px-6 py-4">ایجاد کننده</th>
                <th className="px-6 py-4">تاریخ ایجاد</th>
                <th className="px-6 py-4 text-center">دفعات اجرا</th>
                <th className="px-6 py-4">وضعیت</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processes.map((proc) => (
                <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{proc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{proc.code}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">v{proc.version}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-700">{proc.creator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{proc.createDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{proc.usageCount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    {proc.status === 'active' && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> فعال
                      </span>
                    )}
                    {proc.status === 'draft' && (
                      <span className="flex items-center gap-1 text-amber-600 font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> در حال طراحی
                      </span>
                    )}
                    {proc.status === 'archived' && (
                      <span className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
                        <AlertCircle className="w-3 h-3" /> بایگانی شده
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-[10px] text-slate-400">
          <div>نمایش {processes.length} روند از مجموع ۲۴ روند تعریف شده</div>
          <div className="flex items-center gap-1">
             <span>صفحه ۱ از ۳</span>
             <div className="flex gap-1 mr-2">
                <button className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">۱</button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">۲</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
