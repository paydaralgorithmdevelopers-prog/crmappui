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
