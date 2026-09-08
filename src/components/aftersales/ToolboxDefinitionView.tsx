import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Briefcase, 
  User, 
  Link as LinkIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Calculator,
  LayoutGrid,
  Box
} from 'lucide-react';

interface Toolbox {
  id: string;
  title: string;
  type: string;
  responsibleId: string;
  accountingGlId: string;
  accountingGlTitle: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const initialToolboxes: Toolbox[] = [
  {
    id: 'TB-101',
    title: 'جعبه ابزار تکنسین نصب ۱',
    type: 'نصب و راه اندازی',
    responsibleId: 'user-1',
    accountingGlId: '10101',
    accountingGlTitle: 'موجودی انبار ابزارآلات - تکنسین ۱',
    description: 'مجموعه ابزارهای عمومی برای نصب سرور و کابل‌کشی.',
    isActive: true,
    createdAt: '۱۴۰۵/۰۵/۱۰'
  },
  {
    id: 'TB-102',
    title: 'جعبه ابزار نگهداشت پیشگیرانه',
    type: 'نگهداشت',
    responsibleId: 'role-mgr',
    accountingGlId: '10102',
    accountingGlTitle: 'موجودی انبار ابزارآلات - نگهداشت',
    description: 'ابزارهای تست و تمیزکاری سرورها.',
    isActive: true,
    createdAt: '۱۴۰۵/۰۶/۱۲'
  }
];

interface ToolboxDefinitionViewProps {
  onBack: () => void;
}

export const ToolboxDefinitionView: React.FC<ToolboxDefinitionViewProps> = ({ onBack }) => {
  const [toolboxes, setToolboxes] = useState<Toolbox[]>(initialToolboxes);
  const [selectedId, setSelectedId] = useState<string>(initialToolboxes[0].id);

  const currentToolbox = toolboxes.find(t => t.id === selectedId) || toolboxes[0];

  const handleAdd = () => {
    const newId = `TB-${Math.floor(100 + Math.random() * 900)}`;
    const newToolbox: Toolbox = {
      id: newId,
      title: 'جعبه ابزار جدید',
      type: 'سایر',
      responsibleId: '',
      accountingGlId: '',
      accountingGlTitle: '',
      description: '',
      isActive: true,
      createdAt: '۱۴۰۵/۰۶/۱۷'
    };
    setToolboxes([...toolboxes, newToolbox]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (toolboxes.length <= 1) return;
    const filtered = toolboxes.filter(t => t.id !== id);
    setToolboxes(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  const updateCurrentToolbox = (updates: Partial<Toolbox>) => {
    setToolboxes(prev => prev.map(t => t.id === currentToolbox.id ? { ...t, ...updates } : t));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">تعریف جعبه ابزار خدمات پس از فروش</h1>
            <p className="text-xs text-slate-500 mt-0.5">مدیریت انبارها و جعبه‌های ابزار پرسنل فنی</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-700">لیست جعبه ابزارها</h2>
            <button 
              onClick={handleAdd}
              className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
              title="افزودن جعبه ابزار جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {toolboxes.map(tb => (
              <button
                key={tb.id}
                onClick={() => setSelectedId(tb.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-right transition-all duration-200 ${
                  selectedId === tb.id 
                    ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedId === tb.id ? 'bg-white text-sky-600 shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                   <Box className="w-4 h-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{tb.title}</span>
                  <span className="text-[10px] opacity-70 mt-0.5 font-mono">{tb.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* 1. Basic Definition */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <LayoutGrid className="w-4 h-4 text-sky-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مشخصات عمومی (انبار ابزار)</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-2">عنوان جعبه ابزار (تایپ جعبه ابزار) <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={currentToolbox.title}
                      onChange={(e) => updateCurrentToolbox({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-sm transition-all outline-hidden" 
                      placeholder="مثلاً: جعبه ابزار نصب شعبه مرکز"
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-2">نوع / دسته‌بندی انبار</label>
                    <select 
                      value={currentToolbox.type}
                      onChange={(e) => updateCurrentToolbox({ type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden"
                    >
                      <option value="نصب">نصب و راه اندازی</option>
                      <option value="نگهداشت">نگهداشت پیشگیرانه</option>
                      <option value="تعمیرات">تعمیرات و رفع خرابی</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 2. Assignment & Accounting */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <User className="w-4 h-4 text-sky-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مسئول و تنظیمات حسابداری</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-2">انتخاب مسئول جعبه ابزار (سمت/شخص) <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentToolbox.responsibleId}
                      onChange={(e) => updateCurrentToolbox({ responsibleId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden"
                    >
                      <option value="">انتخاب مسئول...</option>
                      <optgroup label="سمت‌های سازمانی">
                        <option value="role-mgr">مدیر پشتیبانی فنی</option>
                        <option value="role-tech">تکنسین ارشد</option>
                      </optgroup>
                      <optgroup label="پرسنل / کاربران">
                        <option value="user-1">علی رضایی (کد: 1042)</option>
                        <option value="user-2">محمد حسینی (کد: 1055)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-2">انتخاب معین حسابداری <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={currentToolbox.accountingGlTitle}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-11 pl-4 py-2.5 text-slate-800 text-sm cursor-pointer hover:border-sky-300 transition-all outline-hidden"
                        placeholder="انتخاب حساب معین..."
                        onClick={() => alert('نمایش درخت‌واره حساب‌های معین')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{currentToolbox.accountingGlId || 'کد'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 mr-1">
                  تخصیص مسئول و حساب معین جهت ردیابی موجودی و مسئولیت ابزارهای موجود در این جعبه ابزار (انبار).
                </p>
              </section>

              {/* 4. Description */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <h2 className="font-bold text-slate-700 text-sm">توضیحات تکمیلی</h2>
                </div>
                <textarea 
                  rows={3} 
                  value={currentToolbox.description}
                  onChange={(e) => updateCurrentToolbox({ description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden" 
                  placeholder="توضیحات مربوط به نحوه استفاده یا محدودیت‌های این جعبه ابزار..."
                ></textarea>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 pb-12 border-t border-slate-100">
                <button 
                  onClick={() => handleDelete(currentToolbox.id)}
                  className="flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                >
                  <Trash2 className="w-4 h-4" /> حذف این جعبه ابزار
                </button>
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold transition-all text-xs">
                    انصراف
                  </button>
                  <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-10 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-sky-600/20 text-xs transform hover:scale-[1.02] active:scale-95">
                    <CheckCircle className="w-4 h-4" /> ذخیره نهایی انبار
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon proxy
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);
