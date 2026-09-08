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
