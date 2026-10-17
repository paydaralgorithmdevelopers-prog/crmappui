import React from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Shield, 
  ChevronDown,
  Paperclip,
  History,
  CheckCircle2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowFormModalProps {
  instance: {
    id: string;
    code: string;
    title: string;
    requester: string;
    startDate: string;
    currentStage: string;
  };
  mode: 'view' | 'edit';
  onClose: () => void;
}

export const WorkflowFormModal: React.FC<WorkflowFormModalProps> = ({ instance, mode, onClose }) => {
  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 rtl text-right">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-50 w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isReadOnly ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800">{instance.title}</h2>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isReadOnly ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600'}`}>
                  {isReadOnly ? 'فقط مشاهده' : 'در حال ویرایش'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">شناسه فرآیند: {instance.code} • مرحله: {instance.currentStage}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                <Save className="w-4 h-4" />
                ثبت تغییرات
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Section: Basic Info */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <h3 className="text-md font-black text-slate-800">اطلاعات پایه و احراز هویت</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 mr-1">درخواست کننده</label>
                <input 
                  type="text" 
                  defaultValue={instance.requester} 
                  disabled={isReadOnly}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-75"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 mr-1">تاریخ شروع</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    defaultValue={instance.startDate} 
                    disabled={isReadOnly}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-75 text-left font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 mr-1">اولویت درخواست</label>
                <select 
                  disabled={isReadOnly}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-75 appearance-none"
                >
                  <option>عادی</option>
                  <option>فوری</option>
                  <option>خیلی فوری</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section: Operational Details (Representative of the long form) */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <h3 className="text-md font-black text-slate-800">جزئیات عملیاتی و فنی</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 mr-1">شرح کامل درخواست</label>
                <textarea 
                  rows={4}
                  disabled={isReadOnly}
                  placeholder="لطفاً جزئیات دقیق درخواست را اینجا بنویسید..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-75 resize-none"
                  defaultValue="با توجه به نیاز مبرم واحد IT به ارتقای زیرساخت شبکه دفتر مرکزی، تقاضای خرید تجهیزات ذکر شده در لیست پیوست ارسال می‌گردد. این ارتقا باعث بهبود ۴۰ درصدی سرعت انتقال داده‌ها خواهد شد."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-900">پیوست‌های فنی</span>
                    <button disabled={isReadOnly} className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-50">
                      <Paperclip className="w-3 h-3 inline-block ml-1" />
                      افزودن فایل
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'technical_spec.pdf', size: '1.2 MB' },
                      { name: 'vendor_quotes.zip', size: '4.5 MB' }
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-600">{file.name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-amber-50/30 border border-amber-100/50 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">سوابق و نظرات</span>
                    <History className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { user: 'مریم ساداتی', text: 'بودجه برای این مورد در سرفصل ۳۰۲ تأیید شده است.', date: '۱۴۰۵/۰۷/۰۵' },
                      { user: 'احمد مرادی', text: 'لطفاً استعلام بها از حداقل ۳ شرکت معتبر گرفته شود.', date: '۱۴۰۵/۰۷/۰۸' }
                    ].map((comment, i) => (
                      <div key={i} className="bg-white/60 p-3 rounded-xl border border-amber-100/30 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-slate-800">{comment.user}</span>
                          <span className="text-[8px] text-slate-400 font-mono">{comment.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Status Timeline */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-32 -translate-y-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-lg font-black">وضعیت گردش کار</h3>
                <p className="text-xs text-slate-400 mt-1">آخرین تغییرات و مراحل تأیید فرآیند</p>
              </div>
              
              <div className="flex flex-1 items-center justify-end gap-1 overflow-x-auto pb-2 min-w-0">
                {[
                  { name: 'ثبت', status: 'done' },
                  { name: 'بررسی اداری', status: 'done' },
                  { name: 'تأیید فنی', status: 'active' },
                  { name: 'تدارکات', status: 'pending' },
                  { name: 'نهایی', status: 'pending' }
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        s.status === 'done' ? 'bg-emerald-500 text-white' :
                        s.status === 'active' ? 'bg-amber-500 text-white animate-pulse shadow-lg shadow-amber-500/20' :
                        'bg-white/10 text-white/30'
                      }`}>
                        {s.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                         s.status === 'active' ? <AlertCircle className="w-5 h-5" /> : (i + 1)}
                      </div>
                      <span className={`text-[9px] font-black ${s.status === 'active' ? 'text-amber-400' : 'text-slate-400'}`}>{s.name}</span>
                    </div>
                    {i < 4 && <div className={`w-8 h-px shrink-0 mt-[-18px] ${s.status === 'done' ? 'bg-emerald-500' : 'bg-white/10'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        {!isReadOnly && (
          <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">با کلیک روی «ثبت تغییرات»، تمامی اصلاحات شما در تاریخچه فرآیند ذخیره خواهد شد.</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
              >
                انصراف
              </button>
              <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                ارسال به مرحله بعد
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
