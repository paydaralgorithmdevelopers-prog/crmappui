import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Users, 
  User, 
  ChevronLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  Play, 
  Edit3, 
  Check,
  X,
  Plus,
  Filter
} from 'lucide-react';

interface BPMSAccessLevelsViewProps {
  processes: any[];
  onBack?: () => void;
}

type PermissionType = 'view' | 'hidden' | 'execute' | 'edit';

interface ElementPermission {
  targetId: string; // user or role id
  targetName: string;
  targetType: 'user' | 'role';
  permission: PermissionType;
}

interface FormElement {
  id: string;
  label: string;
  type: 'input' | 'select' | 'button' | 'date' | 'textarea';
  stage: string;
}

const mockUsers = [
  { id: 'u1', name: 'سهراب ابراهیمی', role: 'مدیر سیستم' },
  { id: 'u2', name: 'مریم حسینی', role: 'کارشناس فروش' },
  { id: 'u3', name: 'علیرضا کریمی', role: 'مدیر مالی' },
  { id: 'u4', name: 'سارا رضایی', role: 'تدارکات' },
];

const mockRoles = [
  { id: 'r1', name: 'مدیران دپارتمان' },
  { id: 'r2', name: 'کارشناسان عملیاتی' },
  { id: 'r3', name: 'ناظران کیفی' },
];

const mockFormElements: FormElement[] = [
  { id: 'f1', label: 'نام متقاضی', type: 'input', stage: 'درخواست' },
  { id: 'f2', label: 'واحد مربوطه', type: 'select', stage: 'درخواست' },
  { id: 'f3', label: 'توضیحات درخواست', type: 'textarea', stage: 'درخواست' },
  { id: 'b1', label: 'ثبت موقت', type: 'button', stage: 'درخواست' },
  { id: 'b2', label: 'ارسال برای تایید', type: 'button', stage: 'درخواست' },
  
  { id: 'f4', label: 'نظر کارشناس', type: 'textarea', stage: 'بررسی واحد' },
  { id: 'f5', label: 'تاییدیه بودجه', type: 'select', stage: 'بررسی واحد' },
  { id: 'b3', label: 'تایید و ارجاع', type: 'button', stage: 'بررسی واحد' },
  { id: 'b4', label: 'عدم تایید', type: 'button', stage: 'بررسی واحد' },

  { id: 'f6', label: 'شماره فاکتور', type: 'input', stage: 'تایید نهایی' },
  { id: 'f7', label: 'تاریخ سررسید', type: 'date', stage: 'تایید نهایی' },
  { id: 'b5', label: 'صدور نهایی', type: 'button', stage: 'تایید نهایی' },
];

export const BPMSAccessLevelsView: React.FC<BPMSAccessLevelsViewProps> = ({ processes, onBack }) => {
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [searchTarget, setSearchTarget] = useState('');
  
  // Storage for permissions: elementId -> Array of ElementPermission
  const [allPermissions, setAllPermissions] = useState<Record<string, ElementPermission[]>>({});

  const handleSelectElement = (element: FormElement) => {
    setSelectedElement(element);
    setShowPermissionModal(true);
  };

  const handleSavePermission = (target: any, type: 'user' | 'role', permission: PermissionType) => {
    if (!selectedElement) return;

    const newPermission: ElementPermission = {
      targetId: target.id,
      targetName: target.name,
      targetType: type,
      permission
    };

    setAllPermissions(prev => {
      const existing = prev[selectedElement.id] || [];
      // Remove if target already exists to avoid duplicates
      const filtered = existing.filter(p => p.targetId !== target.id);
      return {
        ...prev,
        [selectedElement.id]: [...filtered, newPermission]
      };
    });
  };

  const removePermission = (elementId: string, targetId: string) => {
    setAllPermissions(prev => ({
      ...prev,
      [elementId]: (prev[elementId] || []).filter(p => p.targetId !== targetId)
    }));
  };

  const filteredTargets = [
    ...mockUsers.map(u => ({ ...u, type: 'user' as const })),
    ...mockRoles.map(r => ({ ...r, type: 'role' as const }))
  ].filter(t => t.name.includes(searchTarget));

  const getElementPermissions = (elementId: string) => allPermissions[elementId] || [];

  if (!selectedProcess) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">تنظیمات سطح دسترسی روندها</h2>
              <p className="text-xs text-slate-500">روند مورد نظر را برای تنظیم ماتریس دسترسی انتخاب کنید</p>
            </div>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>بازگشت</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processes.map(proc => (
            <button
              key={proc.id}
              onClick={() => setSelectedProcess(proc)}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all text-right group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors">
                  <Play className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-wider">
                  {proc.code}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{proc.title}</h3>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {proc.creator}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {proc.usageCount} بار استفاده
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const stages = Array.from(new Set(mockFormElements.map(e => e.stage)));

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedProcess(null)}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 rotate-180" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">ماتریس دسترسی: {selectedProcess.title}</h2>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
              <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{selectedProcess.code}</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                تعیین دسترسی فیلدها و عملیات در هر مرحله
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] border-l border-slate-200 pl-4 ml-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-indigo-100 border border-indigo-300 rounded-xs"></div>
              <span className="text-slate-500">فیلد ورودی</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-amber-50 border border-amber-200 rounded-xs"></div>
              <span className="text-slate-500">دکمه عملیاتی</span>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            ذخیره نهایی تنظیمات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Form Preview - Interactive Canvas */}
        <div className="xl:col-span-8 space-y-6">
          {stages.map((stageName, sIndex) => (
            <div key={stageName} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {sIndex + 1}
                  </span>
                  <h3 className="font-bold text-slate-700 text-sm">{stageName}</h3>
                </div>
                <div className="text-[10px] text-slate-400 font-medium bg-white px-2 py-1 rounded-full border border-slate-100">
                  {mockFormElements.filter(e => e.stage === stageName).length} المان قابل تنظیم
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {mockFormElements.filter(e => e.stage === stageName && e.type !== 'button').map(element => (
                    <div 
                      key={element.id}
                      onClick={() => handleSelectElement(element)}
                      className="group relative cursor-pointer"
                    >
                      <label className="block text-xs font-bold text-slate-600 mb-2 mr-1 transition-colors group-hover:text-indigo-600">
                        {element.label}
                        {getElementPermissions(element.id).length > 0 && (
                          <span className="mr-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {getElementPermissions(element.id).length} دسترسی ویژه
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="w-full bg-indigo-50/30 border border-slate-200 rounded-lg h-10 px-4 flex items-center text-slate-400 text-xs transition-all group-hover:border-indigo-300 group-hover:bg-indigo-50/50">
                          {element.type === 'date' ? 'انتخاب تاریخ...' : element.type === 'select' ? 'انتخاب کنید...' : 'مقدار ورودی...'}
                        </div>
                        <div className="absolute inset-y-0 left-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-indigo-500" />
                        </div>
                      </div>
                      
                      {/* Permission Summary Pips */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {getElementPermissions(element.id).map(p => (
                          <div key={p.targetId} className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[9px]">
                            <span className="text-slate-600">{p.targetName}:</span>
                            <span className={`font-bold ${
                              p.permission === 'edit' ? 'text-indigo-600' : 
                              p.permission === 'view' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {p.permission === 'edit' ? 'ویرایش' : p.permission === 'view' ? 'رویت' : 'پنهان'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buttons in Stage */}
                <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                  {mockFormElements.filter(e => e.stage === stageName && e.type === 'button').map(element => (
                    <div key={element.id} className="relative group">
                      <button
                        onClick={() => handleSelectElement(element)}
                        className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2 rounded-lg text-xs font-bold transition-all group-hover:shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-600" />
                        {element.label}
                        {getElementPermissions(element.id).length > 0 && (
                          <span className="mr-1 w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[9px]">
                            {getElementPermissions(element.id).length}
                          </span>
                        )}
                      </button>
                      
                      {/* Permission Summary Pips for Buttons */}
                      {getElementPermissions(element.id).length > 0 && (
                        <div className="absolute top-full right-0 mt-2 z-10 hidden group-hover:block w-48 bg-white border border-slate-200 shadow-xl rounded-lg p-2 animate-in fade-in zoom-in-95">
                          <h4 className="text-[10px] font-bold text-slate-500 mb-1.5 border-b pb-1">سطوح دسترسی دکمه</h4>
                          <div className="space-y-1">
                            {getElementPermissions(element.id).map(p => (
                              <div key={p.targetId} className="flex items-center justify-between text-[9px]">
                                <span className="text-slate-700">{p.targetName}</span>
                                <span className={`font-bold px-1 rounded-sm ${
                                  p.permission === 'execute' ? 'bg-indigo-50 text-indigo-600' : 
                                  p.permission === 'view' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                  {p.permission === 'execute' ? 'اجرا' : p.permission === 'view' ? 'رویت' : 'پنهان'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Info Panel - Guide & Element Detail */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              راهنمای سطوح دسترسی
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  دسترسی فیلدها
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-2 list-disc pr-4">
                  <li><strong className="text-slate-800">ویرایش:</strong> کاربر می‌تواند مقدار را مشاهده و تغییر دهد.</li>
                  <li><strong className="text-slate-800">رویت:</strong> کاربر فقط مقدار را می‌بیند (Read-only).</li>
                  <li><strong className="text-slate-800">پنهان:</strong> فیلد برای کاربر نمایش داده نمی‌شود.</li>
                </ul>
              </div>
              
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  دسترسی دکمه‌ها
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-2 list-disc pr-4">
                  <li><strong className="text-slate-800">اجرا:</strong> دکمه فعال و قابل کلیک است.</li>
                  <li><strong className="text-slate-800">رویت:</strong> دکمه نمایش داده می‌شود اما غیرفعال است.</li>
                  <li><strong className="text-slate-800">پنهان:</strong> دکمه برای کاربر نمایش داده نمی‌شود.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              تنظیمات عمومی
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              اگر برای یک المان هیچ دسترسی خاصی تعریف نشود، دسترسی پیش‌فرض سیستمی (بر اساس نقش سازمانی در روند) اعمال خواهد شد.
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-slate-700">دسترسی سلسله مراتبی (ارث‌بری)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-slate-700">اعمال محدودیت زمانی بر تنظیمات</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Assignment Modal */}
      {showPermissionModal && selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedElement.type === 'button' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                  {selectedElement.type === 'button' ? <Play className="w-6 h-6 text-amber-600" /> : <Edit3 className="w-6 h-6 text-indigo-600" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">تنظیم دسترسی: {selectedElement.label}</h3>
                  <p className="text-[10px] text-slate-500">مرحله: {selectedElement.stage}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="w-8 h-8 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="جستجوی کاربر یا سمت (مثلاً: مدیر فروش، سهراب...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-11 pr-10 pl-4 text-xs focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Target List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  انتخاب مخاطب و تعیین سطح دسترسی
                </h4>
                
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {filteredTargets.length > 0 ? filteredTargets.map((target) => {
                    const existingPerm = getElementPermissions(selectedElement.id).find(p => p.targetId === target.id);
                    
                    return (
                      <div key={target.id} className="group bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 p-3 rounded-2xl flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${target.type === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {target.type === 'user' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{target.name}</div>
                            <div className="text-[10px] text-slate-400">{(target as any).role || 'سمت سازمانی'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl">
                          {selectedElement.type === 'button' ? (
                            <>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'execute')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'execute' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <Play className="w-3 h-3 inline-block ml-1" />
                                اجرا
                              </button>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'view')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'view' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <Eye className="w-3 h-3 inline-block ml-1" />
                                رویت
                              </button>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'hidden')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'hidden' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <EyeOff className="w-3 h-3 inline-block ml-1" />
                                پنهان
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'edit')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'edit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <Edit3 className="w-3 h-3 inline-block ml-1" />
                                ویرایش
                              </button>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'view')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'view' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <Eye className="w-3 h-3 inline-block ml-1" />
                                رویت
                              </button>
                              <button 
                                onClick={() => handleSavePermission(target, target.type, 'hidden')}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${existingPerm?.permission === 'hidden' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                              >
                                <EyeOff className="w-3 h-3 inline-block ml-1" />
                                پنهان
                              </button>
                            </>
                          )}
                          
                          {existingPerm && (
                            <button 
                              onClick={() => removePermission(selectedElement.id, target.id)}
                              className="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="حذف دسترسی"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-12 text-center text-slate-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs">کاربری با این مشخصات یافت نشد.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};
