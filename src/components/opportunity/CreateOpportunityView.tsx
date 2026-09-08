import React, { useState } from 'react';
import { 
  Building2, Hash, FileText, CheckCircle, Target, Briefcase, 
  Calendar, Clock, Info, Search, Paperclip, Calculator, Plus, Trash2 
} from 'lucide-react';

interface CreateOpportunityViewProps {
  onBack: () => void;
}

export const CreateOpportunityView: React.FC<CreateOpportunityViewProps> = ({ onBack }) => {
  const [opportunityId] = useState(`OPP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const [baseCurrency, setBaseCurrency] = useState('IRR');
  const [mainExchangeRate, setMainExchangeRate] = useState<number>(1);
  const [secondaryExchangeRate, setSecondaryExchangeRate] = useState<number>(1);
  const [winProbability, setWinProbability] = useState<number>(50);

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: '',
      description: '',
      quantity: 1,
      unitId: 'دستگاه',
      unitPrice: 0,
      discountPercent: 0
    }
  ]);

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(),
      productId: '',
      description: '',
      quantity: 1,
      unitId: 'دستگاه',
      unitPrice: 0,
      discountPercent: 0
    }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateTotalBase = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (1 - item.discountPercent / 100)), 0);
  };

  const totalBase = calculateTotalBase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('فرصت با موفقیت ثبت شد.');
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">ایجاد فرصت جدید</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت اطلاعات، نیازها و اقلام فرصت تجاری</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      {/* Main Form Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 text-xs">
            
            {/* 1. اطلاعات اصلی */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Info className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">اطلاعات اصلی</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">شماره فرصت <span className="text-rose-500">*</span></label>
                  <input type="text" value={opportunityId} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono shadow-inner" />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">عنوان فرصت <span className="text-rose-500">*</span></label>
                  <input type="text" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" placeholder="مثال: ارتقاء تابلو برق کارخانه البرز" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع فرصت <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required>
                    <option value="">-- انتخاب کنید --</option>
                    <option value="new">فروش جدید</option>
                    <option value="renew">تمدید</option>
                    <option value="upsell">توسعه فروش - فروش مجدد</option>
                    <option value="support">خدمات پس از فروش</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ شناسایی <span className="text-rose-500">*</span></label>
                  <input type="date" defaultValue={date} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ احتمالی نهایی‌شدن <span className="text-rose-500">*</span></label>
                  <input type="date" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">اولویت</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="medium">متوسط</option>
                    <option value="low">کم</option>
                    <option value="high">زیاد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مالک فرصت <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required>
                    <option value="me">کاربر فعلی (شما)</option>
                    <option value="user1">علی احمدی (مدیر فروش)</option>
                    <option value="user2">سارا رضایی (کارشناس)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. منشأ فرصت */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">منشأ فرصت</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">سرنخ / شخص مرتبط</label>
                  <div className="relative">
                    <input type="text" className="w-full bg-white border border-slate-300 rounded-lg pr-3 pl-8 py-2 text-slate-800 focus:border-indigo-500" placeholder="جستجو..." />
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">واسطه‌ها</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="">بدون واسطه</option>
                    <option value="1">شرکت همکار ۱</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">سیگنال مرتبط</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="">انتخاب سیگنال</option>
                    <option value="s1">درخواست استعلام قیمت (سیگنال ورودی)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">رسانه مبدأ (اتوماتیک)</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500" placeholder="پس از انتخاب سیگنال پر می‌شود" disabled />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">کمپین مرتبط</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="">انتخاب کمپین</option>
                    <option value="c1">کمپین فروش بهاره</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 3. نیاز مشتری */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">نیاز مشتری</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">مسئله یا نیاز مشتری <span className="text-rose-500">*</span></label>
                  <textarea className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 min-h-[60px]" required></textarea>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">راهکار یا نتیجه مورد انتظار</label>
                  <textarea className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 min-h-[60px]"></textarea>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">الزامات مهم (فنی/تجاری)</label>
                  <textarea className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 min-h-[60px]"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">توضیحات فرصت</label>
                  <textarea className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 min-h-[60px]"></textarea>
                </div>
              </div>
            </section>

            {/* 4. ارزش فرصت */}
            <section className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">ارزش فرصت و تنظیمات ارز</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ارز پایه <span className="text-rose-500">*</span></label>
                  <select 
                    value={baseCurrency} 
                    onChange={(e) => setBaseCurrency(e.target.value)} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required>
                    <option value="IRR">ریال ایران</option>
                    <option value="USD">دلار آمریکا</option>
                    <option value="EUR">یورو</option>
                    <option value="AED">درهم امارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نرخ تبدیل ارز پایه به اصلی</label>
                  <input type="number" step="any" value={mainExchangeRate} onChange={(e) => setMainExchangeRate(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-left focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نرخ تبدیل ارز پایه به فرعی</label>
                  <input type="number" step="any" value={secondaryExchangeRate} onChange={(e) => setSecondaryExchangeRate(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-left focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">احتمال موفقیت (%)</label>
                  <input type="number" min="0" max="100" value={winProbability} onChange={(e) => setWinProbability(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:border-indigo-500" />
                </div>
                <div className="md:col-span-4 mt-2">
                  <div className="flex items-center justify-between bg-indigo-900 text-white rounded-lg px-4 py-3">
                    <span className="font-semibold text-indigo-200">ارزش تخمینی کل (محاسبه سیستمی):</span>
                    <div className="font-mono text-lg font-bold">{totalBase.toLocaleString()} <span className="text-indigo-400 text-sm ml-1">{baseCurrency}</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. اقلام فرصت */}
            <section>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">اقلام فرصت</h2>
                </div>
                <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> افزودن قلم جدید
                </button>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-right min-w-[1000px]">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold">کالا / خدمت <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold">شرح قلم</th>
                      <th className="px-3 py-2 font-semibold w-20">مقدار <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold w-20">واحد <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold w-28">قیمت واحد<br/><span className="text-[10px] font-normal text-slate-400">(ارز پایه)</span></th>
                      <th className="px-3 py-2 font-semibold w-16">تخفیف<br/><span className="text-[10px] font-normal text-slate-400">(%)</span></th>
                      <th className="px-3 py-2 font-semibold w-28 text-indigo-700 bg-indigo-50/50">مبلغ<br/><span className="text-[10px] font-normal text-indigo-400">(ارز پایه)</span></th>
                      <th className="px-3 py-2 font-semibold w-28 text-sky-700 bg-sky-50/50">مبلغ<br/><span className="text-[10px] font-normal text-sky-400">(ارز اصلی)</span></th>
                      <th className="px-3 py-2 font-semibold w-28 text-emerald-700 bg-emerald-50/50">مبلغ<br/><span className="text-[10px] font-normal text-emerald-400">(ارز فرعی)</span></th>
                      <th className="px-3 py-2 font-semibold w-12 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item) => {
                      const baseAmount = item.quantity * item.unitPrice * (1 - item.discountPercent / 100);
                      const mainAmount = baseAmount * mainExchangeRate;
                      const secondaryAmount = baseAmount * secondaryExchangeRate;

                      return (
                        <tr key={item.id} className="bg-white group">
                          <td className="px-2 py-2">
                            <select value={item.productId} onChange={(e) => updateItem(item.id, 'productId', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700" required>
                              <option value="">انتخاب...</option>
                              <option value="p1">تابلو برق صنعتی مدل X</option>
                              <option value="p2">سرویس دوره‌ای الکتروموتور</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700" placeholder="شرح..." />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" step="any" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 text-center" required />
                          </td>
                          <td className="px-2 py-2">
                            <select value={item.unitId} onChange={(e) => updateItem(item.id, 'unitId', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700" required>
                              <option value="دستگاه">دستگاه</option>
                              <option value="عدد">عدد</option>
                              <option value="سرویس">سرویس</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" step="any" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 text-left font-mono text-[11px]" placeholder="0" />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" max="100" value={item.discountPercent} onChange={(e) => updateItem(item.id, 'discountPercent', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 text-center text-[11px]" placeholder="0" />
                          </td>
                          <td className="px-2 py-2 bg-indigo-50/30">
                            <input type="text" value={baseAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-indigo-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 bg-sky-50/30">
                            <input type="text" value={mainAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-sky-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 bg-emerald-50/30">
                            <input type="text" value={secondaryAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-emerald-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-rose-400 hover:text-rose-600 p-1 disabled:opacity-50" disabled={items.length <= 1}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. اسناد و پیوست‌ها */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Paperclip className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">پیوست‌ها</h2>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-700 mb-1">آپلود فایل‌های مرتبط</p>
                <p className="text-slate-500 max-w-sm">فایل نیازمندی‌ها، استعلامات یا مکاتبات (فرمت‌های مجاز: ZIP, PDF, DOCX)</p>
                <input type="file" className="hidden" multiple accept=".zip,.pdf,.docx,.doc" />
              </div>
            </section>

          </div>

          {/* Form Actions Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg font-bold transition-colors">
              انصراف
            </button>
            <button type="submit" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-indigo-600/30">
              <CheckCircle className="w-4 h-4" /> ذخیره فرصت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
