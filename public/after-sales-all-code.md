# 📦 سورس کد کامل ماژول خدمات پس از فروش (React 19 + TypeScript + Tailwind CSS)

مجموع فایل‌ها: ۱۰ فایل کامپوننت کامل | مجموع خطوط: ۴٬۷۱۳ خط کد واقعی

---

## 📁 فایل: `src/components/aftersales/DeploymentRequestView.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Calendar, 
  FileText, 
  Package, 
  Users, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileArchive,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  products: Product[];
  responsiblePersons: string[];
}

interface Product {
  id: string;
  name: string;
  serialNumber: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-40201',
    date: '۱۴۰۲/۰۵/۱۵',
    products: [
      { id: 'p-1', name: 'سرور HP G10 Plus', serialNumber: 'SN-992011' },
      { id: 'p-2', name: 'مانیتور DELL 24"', serialNumber: 'SN-443022' }
    ],
    responsiblePersons: ['علی رضایی (مدیر پروژه)', 'مریم سعیدی (تکنسین)']
  },
  {
    id: 'inv-2',
    number: 'INV-40205',
    date: '۱۴۰۲/۰۶/۱۰',
    products: [
      { id: 'p-3', name: 'رک دیواری 9U', serialNumber: 'SN-102233' }
    ],
    responsiblePersons: ['سعید محمدی (مدیر فنی)']
  }
];

interface DeploymentRequestViewProps {
  onBack: () => void;
}

export const DeploymentRequestView: React.FC<DeploymentRequestViewProps> = ({ onBack }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [requestDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedInvoice = mockInvoices.find(inv => inv.id === selectedInvoiceId);

  useEffect(() => {
    if (selectedInvoice && !selectedInvoice.products.find(p => p.id === selectedProductId)) {
      setSelectedProductId('');
    }
  }, [selectedInvoiceId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files as FileList).filter((file: File) => 
        file.name.endsWith('.zip') || file.name.endsWith('.rar')
      );
      if (newFiles.length !== e.target.files.length) {
        alert('فقط فایل‌های با فرمت zip و rar مجاز هستند.');
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !selectedProductId || !description) {
      alert('لطفاً تمامی فیلدهای اجباری را تکمیل کنید.');
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تیکت با موفقیت ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            درخواست شما با شماره پیگیری <span className="font-mono font-bold text-sky-600">TCK-77203</span> در سیستم ثبت گردید. کارشناسان ما به زودی با شما تماس خواهند گرفت.
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-600/20"
          >
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800">ثبت درخواست استقرار (نصب و راه اندازی)</h1>
              <span className="bg-sky-50 text-sky-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-100">پورتال مشتریان</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">درخواست نصب، راه‌اندازی و استقرار محصولات خریداری شده</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Date */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-sky-600" />
                <label className="text-slate-700 text-xs font-bold">تاریخ درخواست</label>
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-slate-800 text-sm font-mono flex items-center justify-between">
                <span>{requestDate}</span>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">امروز</span>
              </div>
            </div>

            {/* 2. Invoice Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-sky-600" />
                <label className="text-slate-700 text-xs font-bold">انتخاب فاکتور <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden cursor-pointer"
                required
              >
                <option value="">انتخاب از فهرست فاکتورها...</option>
                {mockInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.number} - مورخ {inv.date}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Product Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-sky-600" />
              <label className="text-slate-700 text-xs font-bold">نمایش محصول مرتبط <span className="text-rose-500">*</span></label>
            </div>
            <select 
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!selectedInvoiceId}
            >
              <option value="">{selectedInvoiceId ? 'انتخاب از فهرست محصولات فاکتور...' : 'ابتدا فاکتور را انتخاب کنید'}</option>
              {selectedInvoice?.products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (سریال: {p.serialNumber})</option>
              ))}
            </select>
          </div>

          {/* 4. Responsible Persons (Auto) */}
          <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-sky-600" />
              <label className="text-sky-800 text-xs font-bold">نمایش مسئولان (اتوماتیک)</label>
            </div>
            {selectedInvoiceId ? (
              <div className="flex flex-wrap gap-2">
                {selectedInvoice?.responsiblePersons.map((person, idx) => (
                  <div key={idx} className="bg-white border border-sky-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-sky-700 shadow-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    {person}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
                <Info className="w-3.5 h-3.5" />
                پس از انتخاب فاکتور، مسئولان فنی مرتبط در این بخش نمایش داده می‌شوند.
              </div>
            )}
          </div>

          {/* 5. Request Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-sky-600" />
              <label className="text-slate-700 text-xs font-bold">شرح درخواست استقرار <span className="text-rose-500">*</span></label>
            </div>
            <textarea 
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden leading-relaxed"
              placeholder="لطفاً جزئیات مربوط به محل نصب و زمان پیشنهادی خود را بنویسید..."
              required
            ></textarea>
          </div>

          {/* 6. File Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-sky-600" />
              <label className="text-slate-700 text-xs font-bold">آپلود فایل (Log / Screenshot)</label>
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="group cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 group-hover:border-sky-400 group-hover:bg-sky-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500 rounded-full flex items-center justify-center transition-colors">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">انتخاب فایل‌های فشرده</p>
                    <p className="text-[10px] text-slate-500 mt-1">فقط فرمت‌های zip. و rar. مجاز هستند</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".zip,.rar" 
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </label>

              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileArchive className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                          <span className="text-[9px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button"
              onClick={onBack}
              className="px-8 py-3 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold transition-all text-xs"
            >
              انصراف
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20 text-xs transform hover:scale-[1.02] active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> ثبت نهایی درخواست
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

```

---

## 📁 فایل: `src/components/aftersales/DeploymentReportView.tsx`

```tsx
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  Package, 
  Briefcase, 
  FileText, 
  Box, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  ExternalLink,
  Upload,
  Search,
  Wrench,
  ShoppingBag,
  History,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  type: 'boolean' | 'text' | 'select';
  options?: string[];
  value?: any;
}

interface Task {
  id: string;
  title: string;
  customer: string;
  product: string;
  invoiceNumber: string;
  responsible: string;
  inventoryExitNumber: string;
  instructions: string;
  checklist: ChecklistItem[];
  tools: string[];
  consumables: { id: string; name: string; unit: string; stock: number }[];
  salesOpportunity?: { id: string; status: string; invoiceLink?: string };
  servicePurchase?: { id: string; status: string; purchaseInvoiceLink?: string };
}

const mockTasks: Task[] = [
  {
    id: 'TSK-501',
    title: 'نصب سرور شعبه مرکزی بانک ملی',
    customer: 'بانک ملی - شعبه مرکزی',
    product: 'سرور HP G10 Plus (SN-992011)',
    invoiceNumber: 'INV-40201',
    responsible: 'علی رضایی',
    inventoryExitNumber: 'EXT-7702',
    instructions: 'نصب در رک طبقه دوم، کابل‌کشی فیبر نوری و پیکربندی RAID 10.',
    checklist: [
      { id: 'ch-1', label: 'بررسی سلامت فیزیکی بسته بندی', type: 'boolean' },
      { id: 'ch-2', label: 'دمای محیط اتاق سرور (درجه سانتی‌گراد)', type: 'text' },
      { id: 'ch-3', label: 'وضعیت تهویه رک', type: 'select', options: ['عالی', 'مناسب', 'نیاز به اصلاح'] },
      { id: 'ch-4', label: 'بروزرسانی Firmware', type: 'boolean' },
      { id: 'ch-5', label: 'توضیحات تکمیلی نصب', type: 'text' }
    ],
    tools: ['مجموعه پیچ‌گوشتی برقی', 'تستر کابل شبکه', 'لبل‌زن برچسب', 'آچار آلن'],
    consumables: [
      { id: 'C-101', name: 'کابل شبکه Cat6 (متر)', unit: 'متر', stock: 100 },
      { id: 'C-102', name: 'سوکت RJ45', unit: 'عدد', stock: 50 },
      { id: 'C-103', name: 'بست کمربندی', unit: 'عدد', stock: 200 }
    ],
    salesOpportunity: { id: 'OPP-1022', status: 'در جریان', invoiceLink: 'INV-SALE-991' }
  }
];

interface ConsumedItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface DeploymentReportViewProps {
  onBack: () => void;
}

export const DeploymentReportView: React.FC<DeploymentReportViewProps> = ({ onBack }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [checklistValues, setChecklistValues] = useState<Record<string, any>>({});
  const [consumedItems, setConsumedItems] = useState<ConsumedItem[]>([]);
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<any>(null);
  const [activePurchase, setActivePurchase] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const task = mockTasks.find(t => t.id === selectedTaskId);

  // Initialize active states when task changes
  React.useEffect(() => {
    if (task) {
      setActiveOpportunity(task.salesOpportunity);
      setActivePurchase(task.servicePurchase);
    }
  }, [task]);

  const handleRegisterOpportunity = () => {
    // Simulate registering a new opportunity
    setActiveOpportunity({
      id: `OPP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ثبت شده (در انتظار تایید)',
      invoiceLink: 'در حال صدور...'
    });
  };

  const handleRegisterPurchase = () => {
    // Simulate registering a new service purchase
    setActivePurchase({
      id: `SRV-PR-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ثبت شده (توسط تکنسین)',
      purchaseInvoiceLink: 'در حال استعلام...'
    });
  };

  const updateChecklist = (id: string, value: any) => {
    setChecklistValues(prev => ({ ...prev, [id]: value }));
  };

  const addConsumedItem = (item: { id: string; name: string; unit: string }) => {
    if (consumedItems.find(i => i.id === item.id)) return;
    setConsumedItems([...consumedItems, { ...item, amount: 1 }]);
  };

  const removeConsumedItem = (id: string) => {
    setConsumedItems(consumedItems.filter(i => i.id !== id));
  };

  const updateAmount = (id: string, amount: number) => {
    setConsumedItems(consumedItems.map(i => i.id === id ? { ...i, amount } : i));
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">گزارش با موفقیت ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            گزارش استقرار شما با موفقیت در سیستم ثبت گردید و لینک‌های مرتبط در اسناد مالی و عملیاتی درج شد.
          </p>
          <button onClick={onBack} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all">
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">ثبت گزارش استقرار (نصب و راه اندازی)</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت نتایج، چک‌لیست‌ها و اقلام مصرفی عملیات نصب</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
          
          {/* 1. Task Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-sky-600" /> انتخاب از فهرست وظایف
                  </label>
                  <select 
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden cursor-pointer"
                  >
                    <option value="">انتخاب وظیفه (دستور کار)...</option>
                    {mockTasks.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" /> تاریخ استقرار
                  </label>
                  <input 
                    type="text" 
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden"
                  />
                </div>
             </div>
          </div>

          {task && (
            <>
              {/* 2. Header Info (Inventory Exit Style) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                   <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                      <History className="w-4 h-4 text-slate-500" /> اطلاعات پایه استقرار (خروج انبار خدمات)
                   </h3>
                   <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-700 px-3 py-1 rounded-full border border-sky-200">
                      TYPE: AFTER_SALES_EXIT
                   </span>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                   <InfoBlock icon={User} label="مسئول" value={task.responsible} />
                   <InfoBlock icon={Package} label="محصول مرتبط" value={task.product} />
                   <InfoBlock icon={Briefcase} label="مشتری مرتبط" value={task.customer} />
                   <InfoBlock icon={FileText} label="شماره فاکتور" value={task.invoiceNumber} />
                   <InfoBlock icon={Box} label="شماره خروج انبار" value={task.inventoryExitNumber} />
                   <InfoBlock icon={LinkIcon} label="لینک فرصت فروش" value="OPP-1022" isLink />
                   <InfoBlock icon={LinkIcon} label="درخواست خرید خدمات" value="SRV-PR-99" isLink />
                   <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1.5 flex items-center gap-1.5 uppercase">
                         <FileCheck className="w-3.5 h-3.5" /> متن دستور العمل نصب
                      </label>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{task.instructions}</p>
                   </div>
                </div>
              </div>

              {/* 3. Reorganized Sections */}
              <div className="space-y-6">
                
                {/* Complex Checklist Section - Independent & Above Tools */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-800 text-sm">چک‌لیست تخصصی استقرار (فرم)</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">تکمیل دقیق تمامی موارد الزامی برای ثبت نهایی گزارش</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                         {Object.keys(checklistValues).length} از {task.checklist.length} مورد
                      </span>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {task.checklist.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                              <Plus className="w-3 h-3 text-emerald-400" /> {item.label}
                           </label>
                           
                           {item.type === 'boolean' && (
                             <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => updateChecklist(item.id, true)}
                                  className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === true ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                >
                                   تایید / صحیح
                                </button>
                                <button 
                                  onClick={() => updateChecklist(item.id, false)}
                                  className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === false ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                >
                                   عدم تایید / خطا
                                </button>
                             </div>
                           )}

                           {item.type === 'text' && (
                             <input 
                               type="text"
                               placeholder="درج پاسخ..."
                               value={checklistValues[item.id] || ''}
                               onChange={(e) => updateChecklist(item.id, e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-emerald-400 outline-hidden transition-all"
                             />
                           )}

                           {item.type === 'select' && (
                             <select 
                               value={checklistValues[item.id] || ''}
                               onChange={(e) => updateChecklist(item.id, e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-emerald-400 outline-hidden transition-all cursor-pointer"
                             >
                                <option value="">انتخاب کنید...</option>
                                {item.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                             </select>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Sales Opportunity & Service Purchase - Integration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Sales Opportunity Section */}
                   <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-sky-900 text-xs flex items-center gap-2">
                           <ShoppingBag className="w-4 h-4" /> صدور یا انتخاب فرصت فروش
                         </h3>
                         <button 
                           onClick={handleRegisterOpportunity}
                           className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-sky-100 transition-all active:scale-95"
                         >
                           <Plus className="w-3 h-3" /> ثبت فرصت جدید (مازاد)
                         </button>
                      </div>
                      
                      <div className="space-y-3">
                         {activeOpportunity ? (
                           <div className="bg-white p-3 rounded-xl border border-sky-100 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-sky-900">{activeOpportunity.id}</span>
                                    <span className="text-[9px] text-sky-400">وضعیت: {activeOpportunity.status}</span>
                                 </div>
                              </div>
                              {activeOpportunity.invoiceLink && (
                                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                                   <LinkIcon className="w-3 h-3" /> لینک فاکتور فروش: {activeOpportunity.invoiceLink}
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="text-[10px] text-sky-400 italic bg-white/50 p-4 rounded-xl border border-dashed border-sky-100 text-center">
                             موردی یافت نشد. می‌توانید فرصت فروش مازاد بر روتین ثبت کنید.
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Service Purchase Request Section */}
                   <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-amber-900 text-xs flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4" /> درخواست خرید خدمات (برون‌سپاری)
                         </h3>
                         <button 
                           onClick={handleRegisterPurchase}
                           className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-amber-100 transition-all active:scale-95"
                         >
                           <Plus className="w-3 h-3" /> ثبت درخواست خرید خدمات
                         </button>
                      </div>

                      <div className="space-y-3">
                         {activePurchase ? (
                           <div className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-amber-900">{activePurchase.id}</span>
                                    <span className="text-[9px] text-amber-400">وضعیت: {activePurchase.status}</span>
                                 </div>
                              </div>
                              {activePurchase.purchaseInvoiceLink && (
                                <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                                   <LinkIcon className="w-3 h-3" /> لینک فاکتور خرید: {activePurchase.purchaseInvoiceLink}
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="text-[10px] text-amber-400 italic bg-white/50 p-4 rounded-xl border border-dashed border-amber-100 text-center">
                             موردی یافت نشد. در صورت نیاز به تخصص خارجی درخواست خرید خدمات دهید.
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Consumables and Tools - Stacked Rows */}
                <div className="space-y-6">
                   {/* Tools Display */}
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                      <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-4">
                        <Wrench className="w-4 h-4 text-amber-500" /> لیست ابزارآلات (نمایش مرجع)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {task.tools.map((tool, idx) => (
                           <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600 font-medium shadow-xs">
                             {tool}
                           </span>
                         ))}
                      </div>
                   </div>

                   {/* Consumables Usage */}
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-sky-500" /> درج اقلام مصرفی شده واقعی
                        </h3>
                        <div className="relative group">
                           <select 
                             className="text-[10px] font-bold bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg border border-sky-100 outline-hidden hover:bg-sky-100 transition-all cursor-pointer"
                             onChange={(e) => {
                               const item = task.consumables.find(c => c.id === e.target.value);
                               if (item) addConsumedItem(item);
                               e.target.value = '';
                             }}
                           >
                             <option value="">افزودن کالا از موجودی...</option>
                             {task.consumables.map(c => (
                               <option key={c.id} value={c.id}>{c.name}</option>
                             ))}
                           </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right">
                           <thead>
                              <tr className="border-b border-slate-100">
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-right">عنوان کالا</th>
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center w-24">مقدار</th>
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center">واحد</th>
                                 <th className="py-3 text-center"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {consumedItems.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="py-10 text-center text-slate-400 text-[11px] italic">
                                     هیچ کالای مصرفی ثبت نشده است.
                                  </td>
                                </tr>
                              ) : (
                                consumedItems.map((item) => (
                                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                     <td className="py-4 text-xs font-bold text-slate-700">{item.name}</td>
                                     <td className="py-4 px-2 text-center">
                                        <input 
                                          type="number" 
                                          value={item.amount}
                                          onChange={(e) => updateAmount(item.id, parseFloat(e.target.value))}
                                          className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold focus:bg-white focus:border-sky-500 outline-hidden transition-all"
                                        />
                                     </td>
                                     <td className="py-4 text-xs text-slate-500 text-center">{item.unit}</td>
                                     <td className="py-4 text-center">
                                        <button 
                                          onClick={() => removeConsumedItem(item.id)}
                                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                     </td>
                                  </tr>
                                ))
                              )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              </div>

                 {/* 4. Document Upload Section */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <Upload className="w-4 h-4 text-sky-600" /> آپلود مستندات نهایی و فایل‌های ضمیمه
                    </label>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <label className="group cursor-pointer">
                          <div className="border-2 border-dashed border-slate-200 group-hover:border-sky-400 group-hover:bg-sky-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                             <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500 rounded-full flex items-center justify-center transition-colors">
                                <Upload className="w-6 h-6" />
                             </div>
                             <div className="text-center">
                                <p className="text-sm font-bold text-slate-700">انتخاب فایل‌های مستندات</p>
                                <p className="text-[10px] text-slate-500 mt-1">عکس، PDF یا فایل‌های فشرده (ZIP/RAR)</p>
                             </div>
                             <input 
                               type="file" 
                               className="hidden" 
                               multiple
                               onChange={handleFileChange}
                             />
                          </div>
                       </label>

                       <div className="space-y-3">
                          {files.length === 0 ? (
                             <div className="h-full flex items-center justify-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30 text-slate-400 text-[10px] italic">
                                فایلی انتخاب نشده است
                             </div>
                          ) : (
                             <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                                {files.map((file, idx) => (
                                   <div key={idx} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between group shadow-2xs">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                         <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <FileText className="w-4 h-4" />
                                         </div>
                                         <div className="flex flex-col overflow-hidden">
                                            <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                                            <span className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                                         </div>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                      >
                                         <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

              {/* 5. Description and Submission */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                 <div>
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-400" /> شرح عملیات استقرار و نصب
                    </label>
                    <textarea 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-sky-500 text-sm transition-all outline-hidden leading-relaxed"
                      placeholder="گزارش نهایی و ملاحظات فنی خود را در این بخش وارد کنید..."
                    ></textarea>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                    <div className="hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                       <button onClick={onBack} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold text-xs">
                          انصراف
                       </button>
                       <button 
                         onClick={() => setIsSubmitted(true)}
                         className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 text-xs"
                       >
                         <CheckCircle2 className="w-4 h-4" /> تایید و ثبت نهایی گزارش
                       </button>
                    </div>
                 </div>
              </div>
            </>
          )}

          {!task && (
            <div className="bg-white p-20 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-400">ابتدا یک وظیفه را از لیست بالا انتخاب کنید</h3>
               <p className="text-slate-300 text-xs mt-2">اطلاعات پایه و چک‌لیست‌ها پس از انتخاب وظیفه نمایش داده می‌شوند.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value, isLink }: { icon: any, label: string, value: string, isLink?: boolean }) => (
  <div className="flex flex-col gap-1 overflow-hidden">
     <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
     </div>
     <div className={`text-xs font-bold truncate ${isLink ? 'text-sky-600 hover:underline cursor-pointer flex items-center gap-1' : 'text-slate-700'}`}>
        {value}
        {isLink && <ExternalLink className="w-2.5 h-2.5" />}
     </div>
  </div>
);

```

---

## 📁 فایل: `src/components/aftersales/MaintenanceRequestView.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Calendar, 
  FileText, 
  Package, 
  Users, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileArchive,
  Info,
  Activity
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  products: Product[];
  responsiblePersons: string[];
}

interface Product {
  id: string;
  name: string;
  serialNumber: string;
}

interface MaintenanceType {
  id: string;
  productId: string;
  label: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-40201',
    date: '۱۴۰۲/۰۵/۱۵',
    products: [
      { id: 'p-1', name: 'سرور HP G10 Plus', serialNumber: 'SN-992011' },
      { id: 'p-2', name: 'مانیتور DELL 24"', serialNumber: 'SN-443022' }
    ],
    responsiblePersons: ['علی رضایی (مدیر پروژه)', 'مریم سعیدی (تکنسین)']
  },
  {
    id: 'inv-2',
    number: 'INV-40205',
    date: '۱۴۰۲/۰۶/۱۰',
    products: [
      { id: 'p-3', name: 'رک دیواری 9U', serialNumber: 'SN-102233' }
    ],
    responsiblePersons: ['سعید محمدی (مدیر فنی)']
  }
];

const mockMaintenanceTypes: MaintenanceType[] = [
  { id: 'm-1', productId: 'p-1', label: 'سرویس دوره‌ای ۶ ماهه' },
  { id: 'm-2', productId: 'p-1', label: 'بروزرسانی لایسنس و فریمور' },
  { id: 'm-3', productId: 'p-2', label: 'کالیبراسیون تصویر' },
  { id: 'm-4', productId: 'p-3', label: 'نظافت فیزیکی و غبارگیری' }
];

interface MaintenanceRequestViewProps {
  onBack: () => void;
}

export const MaintenanceRequestView: React.FC<MaintenanceRequestViewProps> = ({ onBack }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [maintenanceTypeId, setMaintenanceTypeId] = useState<string>('');
  const [failureDescription, setFailureDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [requestDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedInvoice = mockInvoices.find(inv => inv.id === selectedInvoiceId);
  const availableMaintenanceTypes = mockMaintenanceTypes.filter(m => m.productId === selectedProductId);

  useEffect(() => {
    if (selectedInvoice && !selectedInvoice.products.find(p => p.id === selectedProductId)) {
      setSelectedProductId('');
      setMaintenanceTypeId('');
    }
  }, [selectedInvoiceId]);

  useEffect(() => {
    setMaintenanceTypeId('');
  }, [selectedProductId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files as FileList).filter((file: File) => 
        file.name.endsWith('.zip') || file.name.endsWith('.rar')
      );
      if (newFiles.length !== e.target.files.length) {
        alert('فقط فایل‌های با فرمت zip و rar مجاز هستند.');
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !selectedProductId || !maintenanceTypeId || !failureDescription) {
      alert('لطفاً تمامی فیلدهای اجباری را تکمیل کنید.');
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">درخواست با موفقیت ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            درخواست نگهداشت شما با شماره پیگیری <span className="font-mono font-bold text-sky-600">MNT-44091</span> در سیستم ثبت گردید. کارشناسان پشتیبانی به زودی پیگیری خواهند کرد.
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-600/20"
          >
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800">ثبت درخواست نگهداشت و تعمیرات</h1>
              <span className="bg-rose-50 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100">پورتال مشتریان</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">درخواست سرویس دوره‌ای، بروزرسانی یا رفع خرابی محصولات</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Date */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">تاریخ درخواست</label>
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-slate-800 text-sm font-mono flex items-center justify-between">
                <span>{requestDate}</span>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">امروز</span>
              </div>
            </div>

            {/* 2. Invoice Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">انتخاب فاکتور <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer"
                required
              >
                <option value="">انتخاب از فهرست فاکتورهای خریداری شده...</option>
                {mockInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.number} - مورخ {inv.date}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Product Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">نمایش محصول مرتبط <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!selectedInvoiceId}
              >
                <option value="">{selectedInvoiceId ? 'انتخاب از فهرست محصولات فاکتور...' : 'ابتدا فاکتور را انتخاب کنید'}</option>
                {selectedInvoice?.products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (سریال: {p.serialNumber})</option>
                ))}
              </select>
            </div>

            {/* 4. Maintenance Type */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">نوع نگهداشت <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={maintenanceTypeId}
                onChange={(e) => setMaintenanceTypeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!selectedProductId}
              >
                <option value="">{selectedProductId ? 'انتخاب نوع سرویس/نگهداشت...' : 'ابتدا محصول را انتخاب کنید'}</option>
                {availableMaintenanceTypes.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Responsible Persons (Auto) */}
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-rose-600" />
              <label className="text-rose-800 text-xs font-bold">نمایش مسئولان (اتوماتیک)</label>
            </div>
            {selectedInvoiceId ? (
              <div className="flex flex-wrap gap-2">
                {selectedInvoice?.responsiblePersons.map((person, idx) => (
                  <div key={idx} className="bg-white border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-rose-700 shadow-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                    {person}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
                <Info className="w-3.5 h-3.5" />
                پس از انتخاب فاکتور، مسئولان پشتیبانی مرتبط در این بخش نمایش داده می‌شوند.
              </div>
            )}
          </div>

          {/* 6. Failure Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <label className="text-slate-700 text-xs font-bold">شرح خرابی / درخواست <span className="text-rose-500">*</span></label>
            </div>
            <textarea 
              rows={5}
              value={failureDescription}
              onChange={(e) => setFailureDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden leading-relaxed"
              placeholder="لطفاً شرح دقیق خرابی یا جزئیات مورد نیاز برای نگهداشت محصول را بنویسید..."
              required
            ></textarea>
          </div>

          {/* 7. File Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-rose-600" />
              <label className="text-slate-700 text-xs font-bold">آپلود فایل (zip.rar)</label>
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="group cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 group-hover:border-rose-400 group-hover:bg-rose-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500 rounded-full flex items-center justify-center transition-colors">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">انتخاب فایل‌های فشرده</p>
                    <p className="text-[10px] text-slate-500 mt-1">فرمت‌های مجاز: zip. , rar.</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".zip,.rar" 
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </label>

              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileArchive className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                          <span className="text-[9px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button"
              onClick={onBack}
              className="px-8 py-3 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold transition-all text-xs"
            >
              انصراف
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20 text-xs transform hover:scale-[1.02] active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> ثبت نهایی درخواست
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

```

---

## 📁 فایل: `src/components/aftersales/MaintenanceReportView.tsx`

```tsx
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  Package, 
  Briefcase, 
  FileText, 
  Box, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  ExternalLink,
  Upload,
  Search,
  Wrench,
  ShoppingBag,
  History,
  FileCheck,
  AlertTriangle,
  Activity,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  type: 'boolean' | 'text' | 'select';
  options?: string[];
  value?: any;
}

interface MaintenanceTask {
  id: string;
  title: string;
  customer: string;
  product: string;
  invoiceNumber: string;
  responsible: string;
  inventoryExitNumber: string;
  instructions: string;
  checklist: ChecklistItem[];
  tools: string[];
  consumables: { id: string; name: string; unit: string; stock: number }[];
  salesOpportunity?: { id: string; status: string; invoiceLink?: string };
  servicePurchase?: { id: string; status: string; purchaseInvoiceLink?: string };
}

const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'MNT-OP-901',
    title: 'سرویس دوره‌ای ۶ ماهه سیستم UPS - پتروشیمی عسلویه',
    customer: 'پتروشیمی عسلویه (فاز ۲)',
    product: 'UPS Industrial 200KVA (SN-MNT-8812)',
    invoiceNumber: 'INV-40188',
    responsible: 'سعید محمدی',
    inventoryExitNumber: 'EXT-MNT-102',
    instructions: 'تست ولتاژ باتری‌ها، غبارگیری بردها، چک کردن اتصالات کابل‌های قدرت و تست سوئیچ بای‌پس.',
    checklist: [
      { id: 'ch-1', label: 'وضعیت ظاهری باتری‌ها (بدون بادکردگی)', type: 'boolean' },
      { id: 'ch-2', label: 'ولتاژ خروجی اینورتر (ولت)', type: 'text' },
      { id: 'ch-3', label: 'وضعیت فن‌های خنک‌کننده', type: 'select', options: ['سالم', 'صدای ناهنجار', 'نیاز به تعویض'] },
      { id: 'ch-4', label: 'تست سوئیچ استاتیک', type: 'boolean' },
      { id: 'ch-5', label: 'دمای محیط کابینت (درجه)', type: 'text' }
    ],
    tools: ['مولتی‌متر کالیبره شده', 'دستگاه تست دشارژ باتری', 'دمنده هوا (Blower)', 'ست آچار عایق'],
    consumables: [
      { id: 'C-201', name: 'فیوز شیشه‌ای ۱۰ آمپر', unit: 'عدد', stock: 20 },
      { id: 'C-202', name: 'کانکتور باتری', unit: 'عدد', stock: 15 },
      { id: 'C-203', name: 'اسپری تمیزکننده برد', unit: 'عدد', stock: 5 }
    ],
    servicePurchase: { id: 'PUR-MNT-55', status: 'تایید شده', purchaseInvoiceLink: 'PRCH-441' }
  }
];

interface ConsumedItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface MaintenanceReportViewProps {
  onBack: () => void;
}

export const MaintenanceReportView: React.FC<MaintenanceReportViewProps> = ({ onBack }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [checklistValues, setChecklistValues] = useState<Record<string, any>>({});
  const [consumedItems, setConsumedItems] = useState<ConsumedItem[]>([]);
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<any>(null);
  const [activePurchase, setActivePurchase] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const task = mockMaintenanceTasks.find(t => t.id === selectedTaskId);

  // Initialize active states when task changes
  React.useEffect(() => {
    if (task) {
      setActiveOpportunity(task.salesOpportunity);
      setActivePurchase(task.servicePurchase);
    }
  }, [task]);

  const handleRegisterOpportunity = () => {
    setActiveOpportunity({
      id: `OPP-SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ثبت شده (توسط تکنسین)',
      invoiceLink: 'در حال صدور...'
    });
  };

  const handleRegisterPurchase = () => {
    setActivePurchase({
      id: `SRV-PR-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ثبت شده (در انتظار استعلام)',
      purchaseInvoiceLink: 'در حال استعلام...'
    });
  };

  const updateChecklist = (id: string, value: any) => {
    setChecklistValues(prev => ({ ...prev, [id]: value }));
  };

  const addConsumedItem = (item: { id: string; name: string; unit: string }) => {
    if (consumedItems.find(i => i.id === item.id)) return;
    setConsumedItems([...consumedItems, { ...item, amount: 1 }]);
  };

  const removeConsumedItem = (id: string) => {
    setConsumedItems(consumedItems.filter(i => i.id !== id));
  };

  const updateAmount = (id: string, amount: number) => {
    setConsumedItems(consumedItems.map(i => i.id === id ? { ...i, amount } : i));
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">گزارش نگهداشت ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            گزارش عملیات نگهداشت دوره‌ای شما با موفقیت در کارتابل فنی و مالی ثبت گردید.
          </p>
          <button onClick={onBack} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20">
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">ثبت گزارش نگهداشت دوره‌ای</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت نتایج بازدید فنی، تست‌های عملکردی و اقلام مصرفی</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
          
          {/* 1. Task Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-rose-600" /> انتخاب از فهرست وظایف نگهداشت
                  </label>
                  <select 
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer"
                  >
                    <option value="">انتخاب دستور کار نگهداشت...</option>
                    {mockMaintenanceTasks.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" /> تاریخ بازدید
                  </label>
                  <input 
                    type="text" 
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden"
                  />
                </div>
             </div>
          </div>

          {task && (
            <>
              {/* 2. Header Info (Inventory Exit Style) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                   <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                      <History className="w-4 h-4 text-rose-500" /> خروج انبار خدمات پس از فروش (نگهداشت)
                   </h3>
                   <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200">
                      TYPE: AFTER_SALES_MAINTENANCE_EXIT
                   </span>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                   <InfoBlock icon={User} label="مسئول" value={task.responsible} />
                   <InfoBlock icon={Package} label="محصول مرتبط" value={task.product} />
                   <InfoBlock icon={Briefcase} label="مشتری مرتبط" value={task.customer} />
                   <InfoBlock icon={FileText} label="شماره فاکتور مرتبط" value={task.invoiceNumber} />
                   <InfoBlock icon={Box} label="شماره خروج انبار مرتبط" value={task.inventoryExitNumber} />
                   <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1.5 flex items-center gap-1.5 uppercase">
                         <FileCheck className="w-3.5 h-3.5 text-rose-500" /> متن دستور العمل نگهداشت
                      </label>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{task.instructions}</p>
                   </div>
                </div>
              </div>

              {/* 3. Sections */}
              <div className="space-y-6">
                
                {/* Checklist Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-800 text-sm">چک‌لیست تخصصی نگهداشت (فرم)</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">تکمیل موارد کنترلی و تست‌های عملکردی</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                         {Object.keys(checklistValues).length} از {task.checklist.length} مورد
                      </span>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {task.checklist.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                              <Plus className="w-3 h-3 text-rose-400" /> {item.label}
                           </label>
                           
                           {item.type === 'boolean' && (
                             <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => updateChecklist(item.id, true)}
                                  className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === true ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                >
                                   تایید / پاس شده
                                </button>
                                <button 
                                  onClick={() => updateChecklist(item.id, false)}
                                  className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === false ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                >
                                   عدم تایید / خطا
                                </button>
                             </div>
                           )}

                           {item.type === 'text' && (
                             <input 
                               type="text"
                               placeholder="درج مقدار یا نتیجه..."
                               value={checklistValues[item.id] || ''}
                               onChange={(e) => updateChecklist(item.id, e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-rose-400 outline-hidden transition-all"
                             />
                           )}

                           {item.type === 'select' && (
                             <select 
                               value={checklistValues[item.id] || ''}
                               onChange={(e) => updateChecklist(item.id, e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-rose-400 outline-hidden transition-all cursor-pointer"
                             >
                                <option value="">انتخاب وضعیت...</option>
                                {item.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                             </select>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Integration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-sky-900 text-xs flex items-center gap-2">
                           <ShoppingBag className="w-4 h-4" /> صدور یا انتخاب فاکتور فروش خدمات
                         </h3>
                         <button 
                           onClick={handleRegisterOpportunity}
                           className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-sky-100 transition-all active:scale-95"
                         >
                           <Plus className="w-3 h-3" /> ثبت فرصت فروش خدمات
                         </button>
                      </div>
                      
                      <div className="space-y-3">
                         {activeOpportunity ? (
                           <div className="bg-white p-3 rounded-xl border border-sky-100 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-sky-900">{activeOpportunity.id}</span>
                                    <span className="text-[9px] text-sky-400">وضعیت: {activeOpportunity.status}</span>
                                 </div>
                              </div>
                              {activeOpportunity.invoiceLink && (
                                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                                   <LinkIcon className="w-3 h-3" /> لینک فاکتور خدمات: {activeOpportunity.invoiceLink}
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="text-[10px] text-sky-400 italic bg-white/50 p-4 rounded-xl border border-dashed border-sky-100 text-center">
                             موردی یافت نشد. می‌توانید برای خدمات ارائه شده فاکتور صادر کنید.
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-amber-900 text-xs flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4" /> درخواست خرید خدمات (برون‌سپاری)
                         </h3>
                         <button 
                           onClick={handleRegisterPurchase}
                           className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-amber-100 transition-all active:scale-95"
                         >
                           <Plus className="w-3 h-3" /> ثبت درخواست خرید خدمات
                         </button>
                      </div>

                      <div className="space-y-3">
                         {activePurchase ? (
                           <div className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-amber-900">{activePurchase.id}</span>
                                    <span className="text-[9px] text-amber-400">وضعیت: {activePurchase.status}</span>
                                 </div>
                              </div>
                              {activePurchase.purchaseInvoiceLink && (
                                <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                                   <LinkIcon className="w-3 h-3" /> لینک فاکتور خرید: {activePurchase.purchaseInvoiceLink}
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="text-[10px] text-amber-400 italic bg-white/50 p-4 rounded-xl border border-dashed border-amber-100 text-center">
                             در صورت نیاز به تخصص پیمانکاران خارجی، درخواست خرید خدمات ثبت کنید.
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Consumables and Tools */}
                <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                      <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-4">
                        <Wrench className="w-4 h-4 text-rose-500" /> لیست ابزارآلات همراه (نمایش مرجع)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {task.tools.map((tool, idx) => (
                           <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600 font-medium shadow-xs">
                             {tool}
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-rose-500" /> درج اقلام مصرفی شده در محل مشتری
                        </h3>
                        <select 
                          className="text-[10px] font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 outline-hidden hover:bg-rose-100 transition-all cursor-pointer"
                          onChange={(e) => {
                            const item = task.consumables.find(c => c.id === e.target.value);
                            if (item) addConsumedItem(item);
                            e.target.value = '';
                          }}
                        >
                          <option value="">افزودن کالا از لیست مصرفی...</option>
                          {task.consumables.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right">
                           <thead>
                              <tr className="border-b border-slate-100">
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-right">عنوان کالا</th>
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center w-24">مقدار</th>
                                 <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center">واحد</th>
                                 <th className="py-3 text-center"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {consumedItems.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="py-10 text-center text-slate-400 text-[11px] italic">
                                     هیچ کالای مصرفی ثبت نشده است.
                                  </td>
                                </tr>
                              ) : (
                                consumedItems.map((item) => (
                                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                     <td className="py-4 text-xs font-bold text-slate-700">{item.name}</td>
                                     <td className="py-4 px-2 text-center">
                                        <input 
                                          type="number" 
                                          value={item.amount}
                                          onChange={(e) => updateAmount(item.id, parseFloat(e.target.value))}
                                          className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold focus:bg-white focus:border-rose-500 outline-hidden transition-all"
                                        />
                                     </td>
                                     <td className="py-4 text-xs text-slate-500 text-center">{item.unit}</td>
                                     <td className="py-4 text-center">
                                        <button 
                                          onClick={() => removeConsumedItem(item.id)}
                                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                     </td>
                                  </tr>
                                ))
                              )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              </div>

                 {/* Document Upload Section */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <Upload className="w-4 h-4 text-rose-600" /> آپلود مستندات نهایی و فایل‌های ضمیمه
                    </label>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <label className="group cursor-pointer">
                          <div className="border-2 border-dashed border-slate-200 group-hover:border-rose-400 group-hover:bg-rose-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                             <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500 rounded-full flex items-center justify-center transition-colors">
                                <Upload className="w-6 h-6" />
                             </div>
                             <div className="text-center">
                                <p className="text-sm font-bold text-slate-700">انتخاب فایل‌های مستندات</p>
                                <p className="text-[10px] text-slate-500 mt-1">عکس، PDF یا فایل‌های فشرده (ZIP/RAR)</p>
                             </div>
                             <input 
                               type="file" 
                               className="hidden" 
                               multiple
                               onChange={handleFileChange}
                             />
                          </div>
                       </label>

                       <div className="space-y-3">
                          {files.length === 0 ? (
                             <div className="h-full flex items-center justify-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30 text-slate-400 text-[10px] italic">
                                فایلی انتخاب نشده است
                             </div>
                          ) : (
                             <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                                {files.map((file, idx) => (
                                   <div key={idx} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between group shadow-2xs">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                         <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <FileText className="w-4 h-4" />
                                         </div>
                                         <div className="flex flex-col overflow-hidden">
                                            <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                                            <span className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                                         </div>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                      >
                                         <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

              {/* 4. Description and Submission */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                 <div>
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-400" /> شرح عملیات نگهداشت و سرویس
                    </label>
                    <textarea 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden leading-relaxed"
                      placeholder="جزئیات فنی و اقدامات صورت گرفته در محل مشتری را بنویسید..."
                    ></textarea>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                    <div className="hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                       <button onClick={onBack} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold text-xs">
                          انصراف
                       </button>
                       <button 
                         onClick={() => setIsSubmitted(true)}
                         className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-10 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20 text-xs"
                       >
                         <CheckCircle2 className="w-4 h-4" /> تایید و ثبت نهایی گزارش نگهداشت
                       </button>
                    </div>
                 </div>
              </div>
            </>
          )}

          {!task && (
            <div className="bg-white p-20 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-400">ابتدا یک دستور کار نگهداشت انتخاب کنید</h3>
               <p className="text-slate-300 text-xs mt-2">چک‌لیست‌ها و اطلاعات محصول پس از انتخاب وظیفه فعال می‌شوند.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value, isLink }: { icon: any, label: string, value: string, isLink?: boolean }) => (
  <div className="flex flex-col gap-1 overflow-hidden">
     <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
     </div>
     <div className={`text-xs font-bold truncate ${isLink ? 'text-rose-600 hover:underline cursor-pointer flex items-center gap-1' : 'text-slate-700'}`}>
        {value}
        {isLink && <ExternalLink className="w-2.5 h-2.5" />}
     </div>
  </div>
);

```

---

## 📁 فایل: `src/components/aftersales/RepairRequestView.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Calendar, 
  FileText, 
  Package, 
  Users, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileArchive,
  Info,
  AlertTriangle
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  products: Product[];
  responsiblePersons: string[];
}

interface Product {
  id: string;
  name: string;
  serialNumber: string;
}

interface FailureType {
  id: string;
  productId: string;
  label: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-40201',
    date: '۱۴۰۲/۰۵/۱۵',
    products: [
      { id: 'p-1', name: 'سرور HP G10 Plus', serialNumber: 'SN-992011' },
      { id: 'p-2', name: 'مانیتور DELL 24"', serialNumber: 'SN-443022' }
    ],
    responsiblePersons: ['علی رضایی (مدیر پروژه)', 'مریم سعیدی (تکنسین)']
  },
  {
    id: 'inv-2',
    number: 'INV-40205',
    date: '۱۴۰۲/۰۶/۱۰',
    products: [
      { id: 'p-3', name: 'رک دیواری 9U', serialNumber: 'SN-102233' }
    ],
    responsiblePersons: ['سعید محمدی (مدیر فنی)']
  }
];

const mockFailureTypes: FailureType[] = [
  { id: 'f-1', productId: 'p-1', label: 'روشن نشدن دستگاه' },
  { id: 'f-2', productId: 'p-1', label: 'صدای غیرعادی فن' },
  { id: 'f-3', productId: 'p-1', label: 'خطای حافظه (Memory Error)' },
  { id: 'f-4', productId: 'p-2', label: 'پیکسل سوخته' },
  { id: 'f-5', productId: 'p-2', label: 'قطع و وصل شدن تصویر' },
  { id: 'f-6', productId: 'p-3', label: 'شکستگی فیزیکی درب یا بدنه' }
];

interface RepairRequestViewProps {
  onBack: () => void;
}

export const RepairRequestView: React.FC<RepairRequestViewProps> = ({ onBack }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [failureTypeId, setFailureTypeId] = useState<string>('');
  const [failureDescription, setFailureDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [requestDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedInvoice = mockInvoices.find(inv => inv.id === selectedInvoiceId);
  const availableFailureTypes = mockFailureTypes.filter(f => f.productId === selectedProductId);

  useEffect(() => {
    if (selectedInvoice && !selectedInvoice.products.find(p => p.id === selectedProductId)) {
      setSelectedProductId('');
      setFailureTypeId('');
    }
  }, [selectedInvoiceId]);

  useEffect(() => {
    setFailureTypeId('');
  }, [selectedProductId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files as FileList).filter((file: File) => 
        file.name.endsWith('.zip') || file.name.endsWith('.rar')
      );
      if (newFiles.length !== e.target.files.length) {
        alert('فقط فایل‌های با فرمت zip و rar مجاز هستند.');
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !selectedProductId || !failureTypeId || !failureDescription) {
      alert('لطفاً تمامی فیلدهای اجباری را تکمیل کنید.');
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">درخواست تعمیرات ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            درخواست تعمیرات شما با شماره پیگیری <span className="font-mono font-bold text-sky-600">RP-22805</span> در سیستم ثبت گردید. تیم فنی در اولین فرصت بررسی خواهد کرد.
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-600/20"
          >
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800">ثبت درخواست تعمیرات (رفع خرابی)</h1>
              <span className="bg-rose-50 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100">پورتال مشتریان</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">اعلام خرابی، نقص فنی و درخواست اعزام کارشناس یا ارسال قطعه</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Date */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">تاریخ درخواست</label>
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-slate-800 text-sm font-mono flex items-center justify-between">
                <span>{requestDate}</span>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">امروز</span>
              </div>
            </div>

            {/* 2. Invoice Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">انتخاب فاکتور <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer"
                required
              >
                <option value="">انتخاب از فهرست فاکتورهای خریداری شده...</option>
                {mockInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.number} - مورخ {inv.date}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Product Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">نمایش محصول مرتبط <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!selectedInvoiceId}
              >
                <option value="">{selectedInvoiceId ? 'انتخاب از فهرست محصولات فاکتور...' : 'ابتدا فاکتور را انتخاب کنید'}</option>
                {selectedInvoice?.products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (سریال: {p.serialNumber})</option>
                ))}
              </select>
            </div>

            {/* 4. Failure Type */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <label className="text-slate-700 text-xs font-bold">نوع خرابی <span className="text-rose-500">*</span></label>
              </div>
              <select 
                value={failureTypeId}
                onChange={(e) => setFailureTypeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!selectedProductId}
              >
                <option value="">{selectedProductId ? 'انتخاب از فهرست خرابی های مرتبط...' : 'ابتدا محصول را انتخاب کنید'}</option>
                {availableFailureTypes.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Responsible Persons (Auto) */}
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-rose-600" />
              <label className="text-rose-800 text-xs font-bold">نمایش مسئولان (اتوماتیک)</label>
            </div>
            {selectedInvoiceId ? (
              <div className="flex flex-wrap gap-2">
                {selectedInvoice?.responsiblePersons.map((person, idx) => (
                  <div key={idx} className="bg-white border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-rose-700 shadow-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                    {person}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
                <Info className="w-3.5 h-3.5" />
                پس از انتخاب فاکتور، کارشناسان پشتیبانی مختص شما نمایش داده می‌شوند.
              </div>
            )}
          </div>

          {/* 6. Failure Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <label className="text-slate-700 text-xs font-bold">شرح خرابی <span className="text-rose-500">*</span></label>
            </div>
            <textarea 
              rows={5}
              value={failureDescription}
              onChange={(e) => setFailureDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden leading-relaxed"
              placeholder="لطفاً شرح دقیق خرابی یا رفتار غیرعادی دستگاه را بنویسید..."
              required
            ></textarea>
          </div>

          {/* 7. File Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-rose-600" />
              <label className="text-slate-700 text-xs font-bold">آپلود فایل (zip.rar)</label>
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="group cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 group-hover:border-rose-400 group-hover:bg-rose-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500 rounded-full flex items-center justify-center transition-colors">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">انتخاب مستندات خرابی</p>
                    <p className="text-[10px] text-slate-500 mt-1">فرمت‌های مجاز: zip. , rar. (عکس یا لاگ)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".zip,.rar" 
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </label>

              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileArchive className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                          <span className="text-[9px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button"
              onClick={onBack}
              className="px-8 py-3 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold transition-all text-xs"
            >
              انصراف
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20 text-xs transform hover:scale-[1.02] active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> ثبت نهایی درخواست تعمیر
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

```

---

## 📁 فایل: `src/components/aftersales/RepairReportView.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  Package, 
  Briefcase, 
  FileText, 
  Box, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  ExternalLink,
  Upload,
  Search,
  Wrench,
  ShoppingBag,
  History,
  FileCheck,
  AlertTriangle,
  Clock,
  Settings,
  ShieldCheck,
  FileArchive,
  Info,
  Timer
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  type: 'boolean' | 'text' | 'select';
  options?: string[];
  value?: any;
}

interface RepairTask {
  id: string;
  title: string;
  customer: string;
  product: string;
  invoiceNumber: string;
  responsible: string;
  failureType: string;
  failureDescription: string;
  uploadedFile?: string;
  requestDate: string;
  checklist: ChecklistItem[];
  tools: string[];
  consumables: { id: string; name: string; unit: string; stock: number }[];
  salesOpportunity?: { id: string; status: string; invoiceLink?: string };
  servicePurchase?: { id: string; status: string; purchaseInvoiceLink?: string };
  productRequest?: { id: string; status: string; link?: string };
}

const mockRepairTasks: RepairTask[] = [
  {
    id: 'RP-REQ-2201',
    title: 'نقص فنی در منبع تغذیه سرور - فولاد مبارکه',
    customer: 'فولاد مبارکه اصفهان',
    product: 'Power Supply 750W Hot-Plug (SN-PS-9901)',
    invoiceNumber: 'INV-39902',
    responsible: 'مهندس احمدی',
    failureType: 'روشن نشدن دستگاه / نوسان برق',
    failureDescription: 'پس از نوسان شدید برق در خط تولید، یکی از پاورهای سرور از مدار خارج شده و چراغ وضعیت قرمز است.',
    uploadedFile: 'logs_and_photos.zip',
    requestDate: '۱۴۰۲/۰۶/۱۸',
    checklist: [
      { id: 'ch-1', label: 'بررسی سلامت فیزیکی بدنه', type: 'boolean' },
      { id: 'ch-2', label: 'ولتاژ ورودی منبع تغذیه', type: 'text' },
      { id: 'ch-3', label: 'وضعیت خازن‌های برد اصلی', type: 'select', options: ['سالم', 'متورم', 'سوخته'] },
      { id: 'ch-4', label: 'تست سلامت مدار محافظ', type: 'boolean' }
    ],
    tools: ['هویه دیجیتال T12', 'مولتی‌متر Fluke', 'تستر پاور', 'ذره‌بین صنعتی'],
    consumables: [
      { id: 'C-301', name: 'خازن ۴۷۰ میکروفاراد', unit: 'عدد', stock: 50 },
      { id: 'C-302', name: 'فیوز ۳ آمپر گچی', unit: 'عدد', stock: 100 },
      { id: 'C-303', name: 'خمیر سیلیکون', unit: 'گرم', stock: 500 }
    ],
    productRequest: { id: 'PRQ-8820', status: 'تایید شده (در انتظار ارسال از انبار)' }
  }
];

interface ConsumedItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface RepairReportViewProps {
  onBack: () => void;
}

export const RepairReportView: React.FC<RepairReportViewProps> = ({ onBack }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [checklistValues, setChecklistValues] = useState<Record<string, any>>({});
  const [consumedItems, setConsumedItems] = useState<ConsumedItem[]>([]);
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<any>(null);
  const [activePurchase, setActivePurchase] = useState<any>(null);
  const [activeProductRequest, setActiveProductRequest] = useState<any>(null);
  
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('11:30');
  const [downtimeDuration, setDowntimeDuration] = useState<string>('۳ ساعت و ۳۰ دقیقه');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const task = mockRepairTasks.find(t => t.id === selectedTaskId);

  useEffect(() => {
    if (task) {
      setActiveOpportunity(task.salesOpportunity);
      setActivePurchase(task.servicePurchase);
      setActiveProductRequest(task.productRequest);
    }
  }, [task]);

  // Handle duration calculation (mock logic)
  useEffect(() => {
    if (startTime && endTime) {
      setDowntimeDuration('محاسبه شده بر اساس ساعت');
    }
  }, [startTime, endTime]);

  const handleRegisterOpportunity = () => {
    setActiveOpportunity({
      id: `OPP-RP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ثبت شده',
      invoiceLink: 'در حال صدور...'
    });
  };

  const handleRegisterPurchase = () => {
    setActivePurchase({
      id: `PUR-RP-${Math.floor(100 + Math.random() * 900)}`,
      status: 'در انتظار تایید فنی',
      purchaseInvoiceLink: '...'
    });
  };

  const handleRegisterProductRequest = () => {
    setActiveProductRequest({
      id: `REQ-INV-${Math.floor(500 + Math.random() * 500)}`,
      status: 'منتظر تایید انبار',
      link: 'VIEW-PRQ'
    });
  };

  const updateChecklist = (id: string, value: any) => {
    setChecklistValues(prev => ({ ...prev, [id]: value }));
  };

  const addConsumedItem = (item: { id: string; name: string; unit: string }) => {
    if (consumedItems.find(i => i.id === item.id)) return;
    setConsumedItems([...consumedItems, { ...item, amount: 1 }]);
  };

  const removeConsumedItem = (id: string) => {
    setConsumedItems(consumedItems.filter(i => i.id !== id));
  };

  const updateAmount = (id: string, amount: number) => {
    setConsumedItems(consumedItems.map(i => i.id === id ? { ...i, amount } : i));
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">گزارش تعمیرات ثبت شد</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            گزارش رفع خرابی و تعمیرات با موفقیت در کارتابل فنی ثبت گردید. شماره گزارش سیستمی: <span className="font-mono font-bold text-rose-600">REP-77012</span>
          </p>
          <button onClick={onBack} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20">
            بازگشت به کارتابل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">ثبت گزارش تعمیرات (رفع خرابی)</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت اقدامات اصلاحی، تعویض قطعات و نتایج تست پس از تعمیر</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
          
          {/* 1. Task Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-rose-600" /> انتخاب از مرجع درخواست تعمیرات
                  </label>
                  <select 
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden cursor-pointer"
                  >
                    <option value="">انتخاب درخواست تعمیرات...</option>
                    {mockRepairTasks.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-slate-700 text-xs font-bold mb-3 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-rose-600" /> تاریخ بازدید
                      </label>
                      <input 
                        type="text" 
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden"
                      />
                   </div>
                   <div className="flex items-end">
                      <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-rose-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 h-[46px] rounded-xl transition-all">
                        <Upload className="w-3.5 h-3.5" /> آپلود فایل (zip/rar)
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {task && (
            <>
              {/* 2. Reference Information (Inventory Exit Style) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                   <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                      <History className="w-4 h-4 text-rose-500" /> اطلاعات مرجع درخواست (اتوماتیک)
                   </h3>
                   <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200">
                      REF_DATE: {task.requestDate}
                   </span>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                   <InfoBlock icon={User} label="مسئول" value={task.responsible} />
                   <InfoBlock icon={Package} label="محصول مرتبط" value={task.product} />
                   <InfoBlock icon={Briefcase} label="مشتری مرتبط" value={task.customer} />
                   <InfoBlock icon={FileText} label="شماره فاکتور مرتبط" value={task.invoiceNumber} />
                   <InfoBlock icon={AlertTriangle} label="نوع خرابی اعلام شده" value={task.failureType} />
                   <InfoBlock icon={FileArchive} label="فایل آپلود شده مرجع" value={task.uploadedFile || 'ندارد'} isLink />
                   <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1.5 flex items-center gap-1.5 uppercase">
                         <FileCheck className="w-3.5 h-3.5 text-rose-500" /> شرح خرابی اعلام شده توسط مشتری
                      </label>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium italic">{task.failureDescription}</p>
                   </div>
                </div>
              </div>

              {/* 3. Downtime Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm">مدیریت توقف سیستم (Downtime)</h3>
                       <p className="text-[10px] text-slate-400 mt-0.5">محاسبه مدت زمان از مدار خارج شدن دستگاه</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-600">تاریخ و ساعت شروع توقف</label>
                       <div className="flex gap-2">
                          <input type="text" defaultValue="۱۴۰۲/۰۶/۱۸" className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs" />
                          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-24 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-600">تاریخ و ساعت اتمام توقف</label>
                       <div className="flex gap-2">
                          <input type="text" defaultValue="۱۴۰۲/۰۶/۱۸" className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs" />
                          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-24 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs" />
                       </div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col justify-center items-center">
                       <span className="text-[10px] font-bold text-rose-700/60 uppercase mb-1">مدت کل توقف</span>
                       <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-rose-600" />
                          <span className="text-lg font-black text-rose-900">{downtimeDuration}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* 4. Checklist Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 text-sm">چک‌لیست تخصصی تعمیرات (فرم)</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">تکمیل تست‌های عیب‌یابی و تایید سلامت پس از تعمیر</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                       {Object.keys(checklistValues).length} از {task.checklist.length} مورد
                    </span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {task.checklist.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                            <Plus className="w-3 h-3 text-rose-400" /> {item.label}
                         </label>
                         
                         {item.type === 'boolean' && (
                           <div className="flex items-center gap-4">
                              <button 
                                onClick={() => updateChecklist(item.id, true)}
                                className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === true ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                              >
                                 تایید / سالم
                              </button>
                              <button 
                                onClick={() => updateChecklist(item.id, false)}
                                className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition-all ${checklistValues[item.id] === false ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                              >
                                 عدم تایید / نیاز به تعویض
                              </button>
                           </div>
                         )}

                         {item.type === 'text' && (
                           <input 
                             type="text"
                             placeholder="درج نتیجه تست..."
                             value={checklistValues[item.id] || ''}
                             onChange={(e) => updateChecklist(item.id, e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-rose-400 outline-hidden transition-all"
                           />
                         )}

                         {item.type === 'select' && (
                           <select 
                             value={checklistValues[item.id] || ''}
                             onChange={(e) => updateChecklist(item.id, e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-rose-400 outline-hidden transition-all cursor-pointer"
                           >
                              <option value="">انتخاب وضعیت...</option>
                              {item.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                           </select>
                         )}
                      </div>
                    ))}
                 </div>
              </div>

              {/* 5. Integration Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Opportunity */}
                 <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100/50 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-sky-900 text-[10px] flex items-center gap-2 uppercase">
                         <ShoppingBag className="w-3.5 h-3.5" /> فرصت فروش (قطعات/خدمات)
                       </h3>
                       <button onClick={handleRegisterOpportunity} className="p-1 hover:bg-sky-100 rounded transition-colors text-sky-600"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1">
                       {activeOpportunity ? (
                         <div className="bg-white p-3 rounded-xl border border-sky-100 text-[10px]">
                            <div className="font-bold text-sky-900">{activeOpportunity.id}</div>
                            <div className="text-sky-500 mt-1">وضعیت: {activeOpportunity.status}</div>
                         </div>
                       ) : (
                         <div className="text-[9px] text-sky-400 italic text-center py-4 border border-dashed border-sky-100 rounded-xl">موردی ثبت نشده</div>
                       )}
                    </div>
                 </div>

                 {/* Purchase */}
                 <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-amber-900 text-[10px] flex items-center gap-2 uppercase">
                         <AlertTriangle className="w-3.5 h-3.5" /> خرید خدمات برون‌سپاری
                       </h3>
                       <button onClick={handleRegisterPurchase} className="p-1 hover:bg-amber-100 rounded transition-colors text-amber-600"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1">
                       {activePurchase ? (
                         <div className="bg-white p-3 rounded-xl border border-amber-100 text-[10px]">
                            <div className="font-bold text-amber-900">{activePurchase.id}</div>
                            <div className="text-amber-500 mt-1">وضعیت: {activePurchase.status}</div>
                         </div>
                       ) : (
                         <div className="text-[9px] text-amber-400 italic text-center py-4 border border-dashed border-amber-100 rounded-xl">موردی ثبت نشده</div>
                       )}
                    </div>
                 </div>

                 {/* Product Request */}
                 <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-emerald-900 text-[10px] flex items-center gap-2 uppercase">
                         <Box className="w-3.5 h-3.5" /> درخواست کالا از انبار
                       </h3>
                       <button onClick={handleRegisterProductRequest} className="p-1 hover:bg-emerald-100 rounded transition-colors text-emerald-600"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1">
                       {activeProductRequest ? (
                         <div className="bg-white p-3 rounded-xl border border-emerald-100 text-[10px] flex items-center justify-between">
                            <div>
                               <div className="font-bold text-emerald-900">{activeProductRequest.id}</div>
                               <div className="text-emerald-500 mt-1">وضعیت: {activeProductRequest.status}</div>
                            </div>
                            <LinkIcon className="w-3 h-3 text-emerald-400" />
                         </div>
                       ) : (
                         <div className="text-[9px] text-emerald-400 italic text-center py-4 border border-dashed border-emerald-100 rounded-xl">موردی ثبت نشده</div>
                       )}
                    </div>
                 </div>
              </div>

              {/* 6. Consumables and Tools */}
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-4">
                      <Wrench className="w-4 h-4 text-rose-500" /> لیست ابزارآلات مورد استفاده
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {task.tools.map((tool, idx) => (
                         <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600 font-medium shadow-xs">
                           {tool}
                         </span>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-rose-500" /> درج اقلام مصرفی و قطعات تعویض شده
                      </h3>
                      <select 
                        className="text-[10px] font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 outline-hidden hover:bg-rose-100 transition-all cursor-pointer"
                        onChange={(e) => {
                          const item = task.consumables.find(c => c.id === e.target.value);
                          if (item) addConsumedItem(item);
                          e.target.value = '';
                        }}
                      >
                        <option value="">جستجو و افزودن قطعه...</option>
                        {task.consumables.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right">
                         <thead>
                            <tr className="border-b border-slate-100">
                               <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-right">عنوان قطعه/کالا</th>
                               <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center w-24">مقدار</th>
                               <th className="py-3 text-[10px] text-slate-400 font-bold uppercase text-center">واحد</th>
                               <th className="py-3 text-center"></th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {consumedItems.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-10 text-center text-slate-400 text-[11px] italic">
                                   هیچ قطعه یا کالای مصرفی ثبت نشده است.
                                </td>
                              </tr>
                            ) : (
                              consumedItems.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                   <td className="py-4 text-xs font-bold text-slate-700">{item.name}</td>
                                   <td className="py-4 px-2 text-center">
                                      <input 
                                        type="number" 
                                        value={item.amount}
                                        onChange={(e) => updateAmount(item.id, parseFloat(e.target.value))}
                                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold focus:bg-white focus:border-rose-500 outline-hidden transition-all"
                                      />
                                   </td>
                                   <td className="py-4 text-xs text-slate-500 text-center">{item.unit}</td>
                                   <td className="py-4 text-center">
                                      <button 
                                        onClick={() => removeConsumedItem(item.id)}
                                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                   </td>
                                </tr>
                              ))
                            )}
                         </tbody>
                      </table>
                    </div>
                 </div>
              </div>

                 {/* Document Upload Section */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <Upload className="w-4 h-4 text-rose-600" /> آپلود مستندات نهایی و فایل‌های ضمیمه
                    </label>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <label className="group cursor-pointer">
                          <div className="border-2 border-dashed border-slate-200 group-hover:border-rose-400 group-hover:bg-rose-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                             <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500 rounded-full flex items-center justify-center transition-colors">
                                <Upload className="w-6 h-6" />
                             </div>
                             <div className="text-center">
                                <p className="text-sm font-bold text-slate-700">انتخاب فایل‌های مستندات</p>
                                <p className="text-[10px] text-slate-500 mt-1">عکس، PDF یا فایل‌های فشرده (ZIP/RAR)</p>
                             </div>
                             <input 
                               type="file" 
                               className="hidden" 
                               multiple
                               onChange={handleFileChange}
                             />
                          </div>
                       </label>

                       <div className="space-y-3">
                          {files.length === 0 ? (
                             <div className="h-full flex items-center justify-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30 text-slate-400 text-[10px] italic">
                                فایلی انتخاب نشده است
                             </div>
                          ) : (
                             <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                                {files.map((file, idx) => (
                                   <div key={idx} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between group shadow-2xs">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                         <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <FileText className="w-4 h-4" />
                                         </div>
                                         <div className="flex flex-col overflow-hidden">
                                            <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                                            <span className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                                         </div>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                      >
                                         <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

              {/* 7. Description and Submission */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                 <div>
                    <label className="block text-slate-700 text-xs font-bold mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-400" /> شرح عملیات تعمیرات و اقدامات اصلاحی
                    </label>
                    <textarea 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-rose-500 text-sm transition-all outline-hidden leading-relaxed"
                      placeholder="جزئیات فنی تعمیرات، علت خرابی و تست‌های نهایی را بنویسید..."
                    ></textarea>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                    <div className="hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                       <button onClick={onBack} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold text-xs">
                          انصراف
                       </button>
                       <button 
                         onClick={() => setIsSubmitted(true)}
                         className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-10 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20 text-xs"
                       >
                         <CheckCircle2 className="w-4 h-4" /> تایید و ثبت نهایی گزارش تعمیرات
                       </button>
                    </div>
                 </div>
              </div>
            </>
          )}

          {!task && (
            <div className="bg-white p-20 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-400">ابتدا یک درخواست تعمیرات انتخاب کنید</h3>
               <p className="text-slate-300 text-xs mt-2">اطلاعات مرجع و چک‌لیست‌های فنی پس از انتخاب فعال می‌شوند.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value, isLink }: { icon: any, label: string, value: string, isLink?: boolean }) => (
  <div className="flex flex-col gap-1 overflow-hidden">
     <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
     </div>
     <div className={`text-xs font-bold truncate ${isLink ? 'text-rose-600 hover:underline cursor-pointer flex items-center gap-1' : 'text-slate-700'}`}>
        {value}
        {isLink && <ExternalLink className="w-2.5 h-2.5" />}
     </div>
  </div>
);

```

---

## 📁 فایل: `src/components/aftersales/ToolboxDefinitionView.tsx`

```tsx
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

```

---

## 📁 فایل: `src/components/deployment/DeploymentManagementView.tsx`

```tsx
import React, { useState } from 'react';
import { 
  Layers, 
  Settings, 
  Save, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  FileText, 
  User, 
  Wrench, 
  Box, 
  Clock, 
  ListChecks, 
  FileArchive, 
  CheckSquare, 
  Type, 
  Hash, 
  List as ListIcon, 
  GripVertical,
  Server,
  Monitor,
  Globe,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
}

type FieldType = 'text' | 'number' | 'checkbox' | 'select';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

interface DeploymentType {
  id: string;
  title: string;
  group: string;
  productId: string;
  timingAfterDelivery: number;
  alertBeforeTime: number;
  instructions: string;
  link: string;
  formFields: FormField[];
  tools: ChecklistItem[];
  consumables: ChecklistItem[];
  assignedTo: string;
}

const initialDeployTypes: DeploymentType[] = [
  {
    id: 'DT-1',
    title: 'نصب و راه اندازی سرور HP',
    group: 'hardware',
    productId: 'p1',
    timingAfterDelivery: 48,
    alertBeforeTime: 24,
    instructions: 'بررسی فیزیکی، نصب در رک، کابل کشی برق و شبکه.',
    link: 'https://docs.hp.com/dl380',
    formFields: [
      { id: 'f1', label: 'آیا محیط فیزیکی آماده است؟', type: 'checkbox', required: true }
    ],
    tools: [{ id: 't1', text: 'پیچ گوشتی چهارسو' }],
    consumables: [{ id: 'c1', text: 'کابل پاور' }],
    assignedTo: 'role-1'
  },
  {
    id: 'DT-2',
    title: 'استقرار نرم‌افزار ERP',
    group: 'software',
    productId: 'p2',
    timingAfterDelivery: 24,
    alertBeforeTime: 12,
    instructions: 'نصب دیتابیس، پیکربندی سرویس دهنده، تست دسترسی کاربران.',
    link: '',
    formFields: [],
    tools: [],
    consumables: [],
    assignedTo: 'role-2'
  }
];

interface DeploymentManagementViewProps {
  onBack: () => void;
}

export const DeploymentManagementView: React.FC<DeploymentManagementViewProps> = ({ onBack }) => {
  const [deployTypes, setDeployTypes] = useState<DeploymentType[]>(initialDeployTypes);
  const [selectedId, setSelectedId] = useState<string>(initialDeployTypes[0].id);

  const currentType = deployTypes.find(d => d.id === selectedId) || deployTypes[0];

  const handleAdd = () => {
    const newId = `DT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newType: DeploymentType = {
      id: newId,
      title: 'استقرار جدید',
      group: 'software',
      productId: '',
      timingAfterDelivery: 0,
      alertBeforeTime: 0,
      instructions: '',
      link: '',
      formFields: [],
      tools: [],
      consumables: [],
      assignedTo: ''
    };
    setDeployTypes([...deployTypes, newType]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (deployTypes.length <= 1) return;
    const filtered = deployTypes.filter(d => d.id !== id);
    setDeployTypes(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  const updateCurrentType = (updates: Partial<DeploymentType>) => {
    setDeployTypes(prev => prev.map(d => d.id === currentType.id ? { ...d, ...updates } : d));
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'hardware': return <Server className="w-4 h-4 text-emerald-500" />;
      case 'software': return <Monitor className="w-4 h-4 text-sky-500" />;
      case 'network': return <Globe className="w-4 h-4 text-indigo-500" />;
      default: return <Cpu className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">مدیریت انواع نصب و راه اندازی محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">تعریف و تنظیم کامل فرآیندهای استقرار و نصب</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">لیست انواع نصب</h2>
            <button 
              onClick={handleAdd}
              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="افزودن مورد جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {deployTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedId(type.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-right transition-colors ${
                  selectedId === type.id 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700 border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                {getGroupIcon(type.group)}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{type.title}</span>
                  <span className="text-[10px] opacity-70">{type.id}</span>
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
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مشخصات پایه</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">عنوان استقرار (نصب و راه اندازی) <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={currentType.title}
                      onChange={(e) => updateCurrentType({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">گروه بندی <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentType.group}
                      onChange={(e) => updateCurrentType({ group: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                      required
                    >
                      <option value="software">نرم‌افزار</option>
                      <option value="hardware">سخت‌افزار</option>
                      <option value="network">شبکه و زیرساخت</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 2. Product Selection & Timing */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Box className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">محصول و زمان‌بندی</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1">
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">انتخاب محصول مرتبط</label>
                    <select 
                      value={currentType.productId}
                      onChange={(e) => updateCurrentType({ productId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                    >
                      <option value="">انتخاب محصول...</option>
                      <option value="p1">سرور HP ProLiant DL380</option>
                      <option value="p2">نرم افزار اتوماسیون اداری</option>
                      <option value="p3">دوربین مداربسته تحت شبکه</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان استقرار بعد از تحویل (ساعت)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.timingAfterDelivery}
                        onChange={(e) => updateCurrentType({ timingAfterDelivery: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان هشدار قبل از استقرار (ساعت)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.alertBeforeTime}
                        onChange={(e) => updateCurrentType({ alertBeforeTime: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Instructions & Documents */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">دستورالعمل‌ها و مستندات</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">متن دستور العمل</label>
                    <textarea 
                      rows={4} 
                      value={currentType.instructions}
                      onChange={(e) => updateCurrentType({ instructions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      placeholder="مراحل و دستورالعمل‌های لازم برای استقرار..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">درج لینک مستندات / راهنما</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url" 
                          value={currentType.link}
                          onChange={(e) => updateCurrentType({ link: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                          placeholder="https://..." dir="ltr" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">آپلود فایل ضمیمه (فقط فرمت zip یا rar)</label>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                        <input type="file" accept=".zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-600 transition-colors">
                          <FileArchive className="w-4 h-4" />
                          <span className="text-xs font-medium">انتخاب یا رها کردن فایل آرشیو</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Form Builder Checklist */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-emerald-500" />
                    <h2 className="font-bold text-slate-700 text-sm">ساخت چک لیست فرم عملیات</h2>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">فرم بیلدر</span>
                </div>
                
                <div className="space-y-4">
                  {/* Internal Form Builder Logic would go here, reusing the states from the currentType.formFields */}
                  <FormBuilder 
                    fields={currentType.formFields} 
                    onUpdate={(fields) => updateCurrentType({ formFields: fields })} 
                  />
                </div>
              </section>

              {/* 5. Requirements (Tools & Consumables) */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Wrench className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">ملزومات فیزیکی نصب</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChecklistEditor 
                    title="لیست ابزارآلات مورد نیاز" 
                    icon={<Wrench className="w-3.5 h-3.5 text-amber-600" />} 
                    items={currentType.tools} 
                    onUpdate={(items) => updateCurrentType({ tools: items })} 
                  />
                  <ChecklistEditor 
                    title="لیست اقلام مصرفی" 
                    icon={<Layers className="w-3.5 h-3.5 text-sky-600" />} 
                    items={currentType.consumables} 
                    onUpdate={(items) => updateCurrentType({ consumables: items })} 
                  />
                </div>
              </section>

              {/* 6. Assignment */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مسئول انجام</h2>
                </div>
                
                <div className="max-w-md">
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">سمت / پرسنل اجرایی (یوزر سیستم)</label>
                  <select 
                    value={currentType.assignedTo}
                    onChange={(e) => updateCurrentType({ assignedTo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="">انتخاب پرسنل یا سمت...</option>
                    <optgroup label="سمت‌های سازمانی">
                      <option value="role-1">تکنسین نصب سخت‌افزار</option>
                      <option value="role-2">کارشناس استقرار نرم‌افزار</option>
                    </optgroup>
                    <optgroup label="پرسنل">
                      <option value="user-1">علی رضایی (کد: 1042)</option>
                      <option value="user-2">محمد حسینی (کد: 1055)</option>
                    </optgroup>
                  </select>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-100">
                <button 
                  onClick={() => handleDelete(currentType.id)}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف این نوع استقرار
                </button>
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg font-bold transition-colors text-xs">
                    انصراف
                  </button>
                  <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-indigo-600/30 text-xs">
                    <CheckCircle className="w-4 h-4" /> ذخیره نهایی
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

// Sub-components for cleaner code
const FormBuilder = ({ fields, onUpdate }: { fields: FormField[], onUpdate: (fields: FormField[]) => void }) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 9),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired
    };
    onUpdate([...fields, newField]);
    setNewFieldLabel('');
  };

  const removeField = (id: string) => onUpdate(fields.filter(f => f.id !== id));

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={newFieldLabel} 
            onChange={e => setNewFieldLabel(e.target.value)} 
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
            placeholder="عنوان فیلد جدید..." 
          />
          <div className="flex gap-2">
            <select 
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FieldType)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs w-32"
            >
              <option value="checkbox">تیک تایید</option>
              <option value="text">متن کوتاه</option>
              <option value="number">عدد</option>
              <option value="select">انتخابی</option>
            </select>
            <button onClick={handleAddField} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold">افزودن</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {fields.map((f, i) => (
          <div key={f.id} className="p-3 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{f.type}</span>
            </div>
            <button onClick={() => removeField(f.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistEditor = ({ title, icon, items, onUpdate }: { title: string, icon: React.ReactNode, items: ChecklistItem[], onUpdate: (items: ChecklistItem[]) => void }) => {
  const [newValue, setNewValue] = useState('');
  const addItem = () => {
    if (!newValue.trim()) return;
    onUpdate([...items, { id: Math.random().toString(36).substring(2, 9), text: newValue.trim() }]);
    setNewValue('');
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
      <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">{icon} {title}</h3>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)} 
          className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs"
          placeholder="افزودن..." 
        />
        <button onClick={addItem} className="bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
            <span className="text-xs text-slate-700 truncate">{item.text}</span>
            <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## 📁 فایل: `src/components/maintenance/MaintenanceManagementView.tsx`

```tsx
import React, { useState } from 'react';
import { 
  Layers, 
  Settings, 
  Save, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  FileText, 
  User, 
  Wrench, 
  Box, 
  Clock, 
  ListChecks, 
  FileArchive, 
  CheckSquare, 
  Type, 
  Hash, 
  List as ListIcon, 
  GripVertical,
  Server,
  Monitor,
  Globe,
  Cpu,
  RotateCw,
  AlertTriangle
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
}

type FieldType = 'text' | 'number' | 'checkbox' | 'select';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

interface MaintenanceType {
  id: string;
  title: string;
  group: string;
  productId: string;
  intervalDays: number;
  alertBeforeDays: number;
  instructions: string;
  link: string;
  formFields: FormField[];
  tools: ChecklistItem[];
  consumables: ChecklistItem[];
  assignedTo: string;
}

const initialMaintenanceTypes: MaintenanceType[] = [
  {
    id: 'MT-1',
    title: 'بازدید دوره‌ای سرور HP',
    group: 'hardware',
    productId: 'p1',
    intervalDays: 90,
    alertBeforeDays: 7,
    instructions: 'بررسی دمای رک، سلامت هاردها، تمیز کردن فن‌ها و لاگ‌گیری سیستم.',
    link: 'https://docs.hp.com/maintenance',
    formFields: [
      { id: 'f1', label: 'آیا دمای محیط استاندارد است؟', type: 'checkbox', required: true },
      { id: 'f2', label: 'درصد اشغال دیسک', type: 'number', required: false }
    ],
    tools: [{ id: 't1', text: 'بلوور (Blower)' }],
    consumables: [{ id: 'c1', text: 'خمیر سیلیکون' }],
    assignedTo: 'role-1'
  },
  {
    id: 'MT-2',
    title: 'بروزرسانی نرم‌افزار ERP',
    group: 'software',
    productId: 'p2',
    intervalDays: 30,
    alertBeforeDays: 3,
    instructions: 'بکاپ‌گیری از دیتابیس، آپدیت پچ‌ها، تست یکپارچگی.',
    link: '',
    formFields: [],
    tools: [],
    consumables: [],
    assignedTo: 'role-2'
  }
];

interface MaintenanceManagementViewProps {
  onBack: () => void;
}

export const MaintenanceManagementView: React.FC<MaintenanceManagementViewProps> = ({ onBack }) => {
  const [types, setTypes] = useState<MaintenanceType[]>(initialMaintenanceTypes);
  const [selectedId, setSelectedId] = useState<string>(initialMaintenanceTypes[0].id);

  const currentType = types.find(d => d.id === selectedId) || types[0];

  const handleAdd = () => {
    const newId = `MT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newType: MaintenanceType = {
      id: newId,
      title: 'نگهداشت جدید',
      group: 'hardware',
      productId: '',
      intervalDays: 0,
      alertBeforeDays: 0,
      instructions: '',
      link: '',
      formFields: [],
      tools: [],
      consumables: [],
      assignedTo: ''
    };
    setTypes([...types, newType]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (types.length <= 1) return;
    const filtered = types.filter(d => d.id !== id);
    setTypes(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  const updateCurrentType = (updates: Partial<MaintenanceType>) => {
    setTypes(prev => prev.map(d => d.id === currentType.id ? { ...d, ...updates } : d));
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'hardware': return <Server className="w-4 h-4 text-emerald-500" />;
      case 'software': return <Monitor className="w-4 h-4 text-sky-500" />;
      case 'network': return <Globe className="w-4 h-4 text-indigo-500" />;
      default: return <Cpu className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">مدیریت انواع نگهداشت محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">تعریف و تنظیم کامل فرآیندهای نگهداشت و بازدید دوره‌ای</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">لیست انواع نگهداشت</h2>
            <button 
              onClick={handleAdd}
              className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
              title="افزودن مورد جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {types.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedId(type.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-right transition-colors ${
                  selectedId === type.id 
                    ? 'bg-amber-50 border-amber-100 text-amber-700 border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                {getGroupIcon(type.group)}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{type.title}</span>
                  <span className="text-[10px] opacity-70">{type.id}</span>
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
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مشخصات پایه</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">عنوان نگهداشت محصول <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={currentType.title}
                      onChange={(e) => updateCurrentType({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">گروه بندی <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentType.group}
                      onChange={(e) => updateCurrentType({ group: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                      required
                    >
                      <option value="software">نرم‌افزار</option>
                      <option value="hardware">سخت‌افزار</option>
                      <option value="network">شبکه و زیرساخت</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 2. Product Selection & Interval */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Box className="w-4 h-4 text-amber-600" />
                  <h2 className="font-bold text-slate-700 text-sm">محصول و دوره تکرار</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1">
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">انتخاب محصول مرتبط</label>
                    <select 
                      value={currentType.productId}
                      onChange={(e) => updateCurrentType({ productId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                    >
                      <option value="">انتخاب محصول...</option>
                      <option value="p1">سرور HP ProLiant DL380</option>
                      <option value="p2">نرم افزار اتوماسیون اداری</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">دوره تکرار نگهداشت (روز)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.intervalDays}
                        onChange={(e) => updateCurrentType({ intervalDays: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">روز</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان هشدار قبل از سررسید (روز)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.alertBeforeDays}
                        onChange={(e) => updateCurrentType({ alertBeforeDays: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">روز</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Instructions & Documents */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">دستورالعمل‌ها و مستندات</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">متن دستور العمل نگهداشت</label>
                    <textarea 
                      rows={4} 
                      value={currentType.instructions}
                      onChange={(e) => updateCurrentType({ instructions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      placeholder="مراحل و دستورالعمل‌های لازم برای نگهداشت و بازدید..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">درج لینک مستندات / راهنما</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url" 
                          value={currentType.link}
                          onChange={(e) => updateCurrentType({ link: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                          placeholder="https://..." dir="ltr" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">آپلود فایل ضمیمه (فقط فرمت zip یا rar)</label>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                        <input type="file" accept=".zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-600 transition-colors">
                          <FileArchive className="w-4 h-4" />
                          <span className="text-xs font-medium">انتخاب یا رها کردن فایل آرشیو</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Form Builder Checklist */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-emerald-500" />
                    <h2 className="font-bold text-slate-700 text-sm">ساخت چک لیست فرم نگهداشت</h2>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">فرم بیلدر</span>
                </div>
                
                <div className="space-y-4">
                  <FormBuilder 
                    fields={currentType.formFields} 
                    onUpdate={(fields) => updateCurrentType({ formFields: fields })} 
                  />
                </div>
              </section>

              {/* 5. Requirements (Tools & Consumables) */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Wrench className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">ملزومات فیزیکی نگهداشت</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChecklistEditor 
                    title="لیست ابزارآلات مورد نیاز" 
                    icon={<Wrench className="w-3.5 h-3.5 text-amber-600" />} 
                    items={currentType.tools} 
                    onUpdate={(items) => updateCurrentType({ tools: items })} 
                  />
                  <ChecklistEditor 
                    title="لیست اقلام مصرفی" 
                    icon={<Layers className="w-3.5 h-3.5 text-sky-600" />} 
                    items={currentType.consumables} 
                    onUpdate={(items) => updateCurrentType({ consumables: items })} 
                  />
                </div>
              </section>

              {/* 6. Assignment */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مسئول انجام</h2>
                </div>
                
                <div className="max-w-md">
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">سمت / پرسنل اجرایی (یوزر سیستم)</label>
                  <select 
                    value={currentType.assignedTo}
                    onChange={(e) => updateCurrentType({ assignedTo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="">انتخاب پرسنل یا سمت...</option>
                    <optgroup label="سمت‌های سازمانی">
                      <option value="role-1">تکنسین تعمیرات</option>
                      <option value="role-2">کارشناس پشتیبانی</option>
                    </optgroup>
                    <optgroup label="پرسنل">
                      <option value="user-1">علی رضایی (کد: 1042)</option>
                      <option value="user-2">محمد حسینی (کد: 1055)</option>
                    </optgroup>
                  </select>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-100">
                <button 
                  onClick={() => handleDelete(currentType.id)}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف این نوع نگهداشت
                </button>
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg font-bold transition-colors text-xs">
                    انصراف
                  </button>
                  <button className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-8 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-amber-600/30 text-xs">
                    <CheckCircle className="w-4 h-4" /> ذخیره نهایی نگهداشت
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

// Sub-components (could be extracted to a shared lib/components)
const FormBuilder = ({ fields, onUpdate }: { fields: FormField[], onUpdate: (fields: FormField[]) => void }) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 9),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired
    };
    onUpdate([...fields, newField]);
    setNewFieldLabel('');
  };

  const removeField = (id: string) => onUpdate(fields.filter(f => f.id !== id));

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={newFieldLabel} 
            onChange={e => setNewFieldLabel(e.target.value)} 
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
            placeholder="عنوان فیلد جدید..." 
          />
          <div className="flex gap-2">
            <select 
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FieldType)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs w-32"
            >
              <option value="checkbox">تیک تایید</option>
              <option value="text">متن کوتاه</option>
              <option value="number">عدد</option>
              <option value="select">انتخابی</option>
            </select>
            <button onClick={handleAddField} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold">افزودن</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {fields.map((f, i) => (
          <div key={f.id} className="p-3 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{f.type}</span>
            </div>
            <button onClick={() => removeField(f.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistEditor = ({ title, icon, items, onUpdate }: { title: string, icon: React.ReactNode, items: ChecklistItem[], onUpdate: (items: ChecklistItem[]) => void }) => {
  const [newValue, setNewValue] = useState('');
  const addItem = () => {
    if (!newValue.trim()) return;
    onUpdate([...items, { id: Math.random().toString(36).substring(2, 9), text: newValue.trim() }]);
    setNewValue('');
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
      <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">{icon} {title}</h3>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)} 
          className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs"
          placeholder="افزودن..." 
        />
        <button onClick={addItem} className="bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
            <span className="text-xs text-slate-700 truncate">{item.text}</span>
            <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## 📁 فایل: `src/components/failure/FailureManagementView.tsx`

```tsx
import React, { useState } from 'react';
import { 
  Layers, 
  Settings, 
  Save, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  FileText, 
  User, 
  Wrench, 
  Box, 
  ListChecks, 
  FileArchive, 
  CheckSquare, 
  Type, 
  Hash, 
  List as ListIcon, 
  Server,
  Monitor,
  Globe,
  Cpu,
  AlertTriangle,
  Activity,
  ShieldAlert
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
}

type FieldType = 'text' | 'number' | 'checkbox' | 'select';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

interface FailureType {
  id: string;
  title: string;
  group: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triageInstructions: string;
  repairInstructions: string;
  link: string;
  formFields: FormField[];
  tools: ChecklistItem[];
  consumables: ChecklistItem[];
  assignedTo: string;
}

const initialFailureTypes: FailureType[] = [
  {
    id: 'FT-1',
    title: 'سوختگی پاور (منبع تغذیه)',
    group: 'hardware',
    severity: 'critical',
    triageInstructions: 'بررسی چراغ‌های وضعیت در پشت کیس، تست با کابل پاور سالم.',
    repairInstructions: 'تعویض منبع تغذیه با مدل مشابه، تست نوسان گیر برق.',
    link: 'https://kb.paydar.com/power-failure',
    formFields: [
      { id: 'f1', label: 'آیا پاور جایگزین موجود است؟', type: 'checkbox', required: true },
      { id: 'f2', label: 'ولتاژ خروجی تستر', type: 'number', required: false }
    ],
    tools: [{ id: 't1', text: 'مولتی‌متر' }, { id: 't2', text: 'پیچ‌گوشتی' }],
    consumables: [{ id: 'c1', text: 'بست کمربندی' }],
    assignedTo: 'role-1'
  },
  {
    id: 'FT-2',
    title: 'خطای دیتابیس (SQL Error)',
    group: 'software',
    severity: 'high',
    triageInstructions: 'بررسی لاگ‌های SQL، بررسی فضای دیسک، بررسی سرویس‌های ویندوز.',
    repairInstructions: 'پاکسازی لاگ‌ها، ریستارت سرویس SQL، بهینه‌سازی جداول.',
    link: '',
    formFields: [],
    tools: [],
    consumables: [],
    assignedTo: 'role-2'
  }
];

interface FailureManagementViewProps {
  onBack: () => void;
}

export const FailureManagementView: React.FC<FailureManagementViewProps> = ({ onBack }) => {
  const [types, setTypes] = useState<FailureType[]>(initialFailureTypes);
  const [selectedId, setSelectedId] = useState<string>(initialFailureTypes[0].id);

  const currentType = types.find(d => d.id === selectedId) || types[0];

  const handleAdd = () => {
    const newId = `FT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newType: FailureType = {
      id: newId,
      title: 'خرابی جدید',
      group: 'hardware',
      severity: 'medium',
      triageInstructions: '',
      repairInstructions: '',
      link: '',
      formFields: [],
      tools: [],
      consumables: [],
      assignedTo: ''
    };
    setTypes([...types, newType]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (types.length <= 1) return;
    const filtered = types.filter(d => d.id !== id);
    setTypes(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  const updateCurrentType = (updates: Partial<FailureType>) => {
    setTypes(prev => prev.map(d => d.id === currentType.id ? { ...d, ...updates } : d));
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'hardware': return <Server className="w-4 h-4 text-emerald-500" />;
      case 'software': return <Monitor className="w-4 h-4 text-sky-500" />;
      case 'network': return <Globe className="w-4 h-4 text-indigo-500" />;
      default: return <Cpu className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">مدیریت انواع خرابی محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">تعریف و تنظیم پروتکل‌های رفع خرابی و تعمیرات</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">لیست انواع خرابی</h2>
            <button 
              onClick={handleAdd}
              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
              title="افزودن مورد جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {types.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedId(type.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-right transition-colors ${
                  selectedId === type.id 
                    ? 'bg-rose-50 border-rose-100 text-rose-700 border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                {getGroupIcon(type.group)}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{type.title}</span>
                  <span className="text-[10px] opacity-70">{type.id}</span>
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
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مشخصات پایه خرابی</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1">
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">عنوان نوع خرابی <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={currentType.title}
                      onChange={(e) => updateCurrentType({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">گروه بندی <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentType.group}
                      onChange={(e) => updateCurrentType({ group: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                      required
                    >
                      <option value="software">نرم‌افزار</option>
                      <option value="hardware">سخت‌افزار</option>
                      <option value="network">شبکه و زیرساخت</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">سطح اهمیت (Severity) <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentType.severity}
                      onChange={(e) => updateCurrentType({ severity: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                      required
                    >
                      <option value="low">کم (Low)</option>
                      <option value="medium">متوسط (Medium)</option>
                      <option value="high">زیاد (High)</option>
                      <option value="critical">بحرانی (Critical)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 3. Instructions & Documents */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">دستورالعمل‌های عیب‌یابی و رفع</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">دستورالعمل عیب‌یابی (Triage)</label>
                      <textarea 
                        rows={4} 
                        value={currentType.triageInstructions}
                        onChange={(e) => updateCurrentType({ triageInstructions: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                        placeholder="چگونه خرابی را تشخیص دهیم؟"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">دستورالعمل رفع خرابی (Repair)</label>
                      <textarea 
                        rows={4} 
                        value={currentType.repairInstructions}
                        onChange={(e) => updateCurrentType({ repairInstructions: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                        placeholder="چگونه خرابی را برطرف کنیم؟"
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">لینک به پایگاه دانش (Knowledge Base)</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url" 
                          value={currentType.link}
                          onChange={(e) => updateCurrentType({ link: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                          placeholder="https://..." dir="ltr" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">فایل ضمیمه / نقشه فنی</label>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-600 transition-colors">
                          <FileArchive className="w-4 h-4" />
                          <span className="text-xs font-medium">انتخاب فایل مستندات فنی</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Form Builder Checklist */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-emerald-500" />
                    <h2 className="font-bold text-slate-700 text-sm">ساخت چک لیست گزارش تعمیرات</h2>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">فرم بیلدر</span>
                </div>
                
                <div className="space-y-4">
                  <FormBuilder 
                    fields={currentType.formFields} 
                    onUpdate={(fields) => updateCurrentType({ formFields: fields })} 
                  />
                </div>
              </section>

              {/* 5. Requirements (Tools & Consumables) */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Wrench className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">ملزومات رفع خرابی</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChecklistEditor 
                    title="لیست ابزارآلات تعمیراتی" 
                    icon={<Wrench className="w-3.5 h-3.5 text-amber-600" />} 
                    items={currentType.tools} 
                    onUpdate={(items) => updateCurrentType({ tools: items })} 
                  />
                  <ChecklistEditor 
                    title="قطعات یدکی / اقلام مصرفی" 
                    icon={<Layers className="w-3.5 h-3.5 text-sky-600" />} 
                    items={currentType.consumables} 
                    onUpdate={(items) => updateCurrentType({ consumables: items })} 
                  />
                </div>
              </section>

              {/* 6. Assignment */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">ارجاع پیش‌فرض</h2>
                </div>
                
                <div className="max-w-md">
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">واحد یا شخص مسئول رفع این نوع خرابی</label>
                  <select 
                    value={currentType.assignedTo}
                    onChange={(e) => updateCurrentType({ assignedTo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="">انتخاب واحد یا پرسنل...</option>
                    <optgroup label="واحدهای سازمانی">
                      <option value="dept-1">واحد تعمیرات سخت‌افزار</option>
                      <option value="dept-2">واحد پشتیبانی نرم‌افزار</option>
                    </optgroup>
                    <optgroup label="پرسنل">
                      <option value="user-1">علی رضایی</option>
                      <option value="user-2">محمد حسینی</option>
                    </optgroup>
                  </select>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-100">
                <button 
                  onClick={() => handleDelete(currentType.id)}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف این نوع خرابی
                </button>
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg font-bold transition-colors text-xs">
                    انصراف
                  </button>
                  <button className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-8 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-rose-600/30 text-xs">
                    <CheckCircle className="w-4 h-4" /> ذخیره پروتکل خرابی
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

// Sub-components
const FormBuilder = ({ fields, onUpdate }: { fields: FormField[], onUpdate: (fields: FormField[]) => void }) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 9),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired
    };
    onUpdate([...fields, newField]);
    setNewFieldLabel('');
  };

  const removeField = (id: string) => onUpdate(fields.filter(f => f.id !== id));

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={newFieldLabel} 
            onChange={e => setNewFieldLabel(e.target.value)} 
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
            placeholder="عنوان فیلد جدید..." 
          />
          <div className="flex gap-2">
            <select 
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FieldType)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs w-32"
            >
              <option value="checkbox">تیک تایید</option>
              <option value="text">متن کوتاه</option>
              <option value="number">عدد</option>
              <option value="select">انتخابی</option>
            </select>
            <button onClick={handleAddField} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold">افزودن</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {fields.map((f, i) => (
          <div key={f.id} className="p-3 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{f.type}</span>
            </div>
            <button onClick={() => removeField(f.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistEditor = ({ title, icon, items, onUpdate }: { title: string, icon: React.ReactNode, items: ChecklistItem[], onUpdate: (items: ChecklistItem[]) => void }) => {
  const [newValue, setNewValue] = useState('');
  const addItem = () => {
    if (!newValue.trim()) return;
    onUpdate([...items, { id: Math.random().toString(36).substring(2, 9), text: newValue.trim() }]);
    setNewValue('');
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
      <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">{icon} {title}</h3>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)} 
          className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs"
          placeholder="افزودن..." 
        />
        <button onClick={addItem} className="bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
            <span className="text-xs text-slate-700 truncate">{item.text}</span>
            <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

