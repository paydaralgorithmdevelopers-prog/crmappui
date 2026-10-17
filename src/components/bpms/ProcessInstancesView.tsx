import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  User, 
  CheckCircle2, 
  MoreVertical,
  Activity,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { ProcessDefinition, ProcessInstance } from '../../types';

interface ProcessInstancesViewProps {
  definition: ProcessDefinition;
  instances: ProcessInstance[];
  onBack: () => void;
  onCreateNew: () => void;
}

export const ProcessInstancesView: React.FC<ProcessInstancesViewProps> = ({
  definition,
  instances,
  onBack,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstances = instances.filter(inst => 
    inst.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.currentStage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 lg:p-6 space-y-6 overflow-hidden rtl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{definition.title}</h1>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-100">
                {definition.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">مدیریت و پیگیری تراکنش‌های فعال و بایگانی شده این روند</p>
          </div>
        </div>

        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          ایجاد فرآیند جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">فرآیندهای در جریان</div>
            <div className="text-lg font-black text-slate-800">{instances.filter(i => i.progress < 100).length} <span className="text-[10px] font-normal">مورد</span></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">تکمیل شده</div>
            <div className="text-lg font-black text-slate-800">{instances.filter(i => i.progress === 100).length} <span className="text-[10px] font-normal">مورد</span></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">میانگین زمان اجرا</div>
            <div className="text-lg font-black text-slate-800">۴.۲ <span className="text-[10px] font-normal">روز</span></div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="جستجو در عنوان، مرحله یا مسئول..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-hidden focus:border-rose-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instances Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">عنوان فرآیند</th>
                <th className="px-6 py-4 text-center">تاریخ ایجاد</th>
                <th className="px-6 py-4">مرحله فعلی</th>
                <th className="px-6 py-4">پیشرفت</th>
                <th className="px-6 py-4 text-center">آخرین ویرایش</th>
                <th className="px-6 py-4">مسئول مرحله</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInstances.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{inst.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-slate-500">{inst.createdAt}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-black border border-blue-100">
                      {inst.currentStage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            inst.progress === 100 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${inst.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-600">{inst.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-slate-500">{inst.lastUpdate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white">
                        {inst.responsible.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{inst.responsible}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInstances.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-slate-200" />
                      <p className="text-sm font-bold text-slate-400">فرآیندی با این مشخصات یافت نشد.</p>
                      <button 
                        onClick={onCreateNew}
                        className="text-rose-600 text-xs font-black mt-2 hover:underline"
                      >
                        + ایجاد اولین فرآیند
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
