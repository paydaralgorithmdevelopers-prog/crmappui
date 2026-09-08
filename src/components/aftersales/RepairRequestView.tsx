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
