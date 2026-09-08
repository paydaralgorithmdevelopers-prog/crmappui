import React, { useState } from 'react';
import { 
  Building2, Hash, FileText, CheckCircle, Target, Briefcase, 
  Calendar, Clock, Info, Search, Paperclip, Calculator, Plus, Trash2,
  FileDigit, User, ShoppingCart, Percent, DollarSign, Package, Minus
} from 'lucide-react';

interface CreateInvoiceViewProps {
  onBack: () => void;
}

export const CreateInvoiceView: React.FC<CreateInvoiceViewProps> = ({ onBack }) => {
  const [invoiceNumber] = useState(`PF-${Math.floor(10000 + Math.random() * 90000)}`);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  
  const [baseCurrency, setBaseCurrency] = useState('IRR');
  const [mainExchangeRate, setMainExchangeRate] = useState<number>(1);
  const [secondaryExchangeRate, setSecondaryExchangeRate] = useState<number>(1);

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: '',
      description: '',
      quantity: 1,
      unitId: 'دستگاه',
      unitPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxAmount: 0,
      additionalChargeAmount: 0
    }
  ]);

  const [totalDiscountPercent, setTotalDiscountPercent] = useState<number>(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState<number>(0);
  const [totalAdditionalPercent, setTotalAdditionalPercent] = useState<number>(0);
  const [totalAdditionalAmount, setTotalAdditionalAmount] = useState<number>(0);

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(),
      productId: '',
      description: '',
      quantity: 1,
      unitId: 'دستگاه',
      unitPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxAmount: 0,
      additionalChargeAmount: 0
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

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalGrossForCalc = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const computedAdditionalAmount = totalAdditionalPercent > 0 
    ? totalGrossForCalc * (totalAdditionalPercent / 100) 
    : totalAdditionalAmount;

  const calculateItemTotals = (item: any) => {
    const grossAmount = item.quantity * item.unitPrice;
    let discount = 0;
    
    if (item.discountPercent > 0) {
        discount = grossAmount * (item.discountPercent / 100);
    } else if (item.discountAmount > 0) {
        discount = item.discountAmount;
    }

    const distributedAddition = totalQuantity > 0 ? (computedAdditionalAmount * (item.quantity / totalQuantity)) : 0;

    const netAmount = grossAmount - discount + (item.taxAmount || 0) + (item.additionalChargeAmount || 0) + distributedAddition;
    return { grossAmount, discount, netAmount, distributedAddition };
  };

  const calculateTotals = () => {
    let totalGross = 0;
    let totalItemDiscount = 0;
    let totalTax = 0;
    let totalAdditional = 0;

    items.forEach(item => {
      const { grossAmount, discount, distributedAddition } = calculateItemTotals(item);
      totalGross += grossAmount;
      totalItemDiscount += discount;
      totalTax += (item.taxAmount || 0);
      totalAdditional += (item.additionalChargeAmount || 0) + distributedAddition;
    });

    let overallDiscount = totalItemDiscount;
    if (totalDiscountPercent > 0) {
       overallDiscount += (totalGross - totalItemDiscount) * (totalDiscountPercent / 100);
    } else if (totalDiscountAmount > 0) {
       overallDiscount += totalDiscountAmount;
    }

    const finalNet = totalGross - overallDiscount + totalTax + totalAdditional;

    return {
      totalGross,
      totalDiscount: overallDiscount,
      totalTax,
      totalAdditional,
      finalNet
    };
  };

  const totals = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('فاکتور با موفقیت ثبت شد.');
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <FileDigit className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">صدور فاکتور جدید</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت اطلاعات، مشتری، اقلام و مبالغ فاکتور</p>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-5 space-y-8 flex-1">
            
            {/* 1. سربرگ فاکتور */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">مشخصات سند و منشا</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                  <label className="block text-slate-700 font-semibold mb-1">پیش فاکتور مرتبط (منشا)</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-indigo-500">
                    <option value="">بدون پیش فاکتور مرتبط</option>
                    <option value="op1">PF-45892 - تامین تجهیزات شرکت نفت</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره فاکتور <span className="text-rose-500">*</span></label>
                  <input type="text" value={invoiceNumber.replace('PF', 'INV')} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono text-left" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ فاکتور <span className="text-rose-500">*</span></label>
                  <input type="date" defaultValue={date} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ساعت صدور</label>
                  <input type="time" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" />
                </div>
              </div>
            </section>

            {/* 2. مشتری و فروش */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">مشتری و اطلاعات فروش</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">مشتری <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 pl-10 focus:border-indigo-500" required>
                      <option value="">انتخاب مشتری...</option>
                      <option value="c1">شرکت پتروشیمی زاگرس (CUST-102)</option>
                      <option value="c2">گروه صنعتی مپنا (CUST-105)</option>
                    </select>
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                 <div>
                  <label className="block text-slate-700 font-semibold mb-1">گروه فروش</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="">انتخاب...</option>
                    <option value="s1">فروش داخلی</option>
                    <option value="s2">فروش صادراتی</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-slate-700 font-semibold mb-1">آدرس مشتری</label>
                  <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-indigo-500" placeholder="آدرس ثبت شده مشتری به صورت خودکار واکشی می‌شود..." />
                </div>
                 <div>
                  <label className="block text-slate-700 font-semibold mb-1">محل تحویل (اینکوترمز) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" required>
                    <option value="">انتخاب...</option>
                    <option value="exw">EXW - درب کارخانه</option>
                    <option value="fob">FOB - تحویل روی عرشه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع تسویه</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="cash">نقدی</option>
                    <option value="credit">اعتباری</option>
                    <option value="installments">اقساطی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">واسطه / عامل فروش</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500">
                    <option value="">بدون واسطه...</option>
                    <option value="v1">نمایندگی غرب</option>
                  </select>
                </div>
              </div>
            </section>

             {/* 2.5 حسابداری */}
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <h2 className="font-bold text-slate-700 text-sm">تنظیمات سرفصل حسابها</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">حساب معین بدهکار (مطالبات) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 text-sm" required>
                    <option value="">انتخاب...</option>
                    <option value="a1">حسابهای دریافتنی تجاری</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">حساب معین بستانکار (فروش) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 text-sm" required>
                    <option value="">انتخاب...</option>
                    <option value="a2">فروش محصولات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">حساب معین بستانکار (مالیات) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 text-sm" required>
                    <option value="">انتخاب...</option>
                    <option value="a3">مالیات بر ارزش افزوده فروش</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">حساب معین بدهکار (بهای تمام شده) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 text-sm" required>
                    <option value="">انتخاب...</option>
                    <option value="a4">بهای تمام شده کالای فروش رفته</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">حساب معین بستانکار (موجودی) <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500 text-sm" required>
                    <option value="">انتخاب...</option>
                    <option value="a5">موجودی کالای ساخته شده</option>
                  </select>
                </div>
              </div>
            </section>

             {/* 3. ارز و اطلاعات مالی */}
             <section className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-700 text-sm">ارز پایه و اطلاعات مالی</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع ارز پایه <span className="text-rose-500">*</span></label>
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
                  <label className="block text-slate-700 font-semibold mb-1">نرخ تبدیل پایه به اصلی <span className="text-rose-500">*</span></label>
                  <input type="number" step="any" value={mainExchangeRate} onChange={(e) => setMainExchangeRate(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-left focus:border-indigo-500" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نرخ تبدیل پایه به فرعی <span className="text-rose-500">*</span></label>
                  <input type="number" step="any" value={secondaryExchangeRate} onChange={(e) => setSecondaryExchangeRate(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-left focus:border-indigo-500" required />
                </div>
                 <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ تقریبی تصفیه نهایی</label>
                  <input type="date" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-indigo-500" />
                </div>
              </div>
            </section>

            {/* 4. اقلام فاکتور */}
            <section>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">اقلام کالا و خدمات</h2>
                </div>
                <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> افزودن سطر جدید
                </button>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-right min-w-[1400px]">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold w-10 text-center">ردیف</th>
                      <th className="px-3 py-2 font-semibold w-40">کالا / خدمت <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold w-32">انبار</th>
                      <th className="px-3 py-2 font-semibold w-32">توضیحات</th>
                      <th className="px-3 py-2 font-semibold w-20">مقدار <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold w-20">واحد <span className="text-rose-500">*</span></th>
                      <th className="px-3 py-2 font-semibold w-28">فی مصرف<br/><span className="text-[10px] font-normal text-slate-400">(ارز پایه)</span></th>
                      <th className="px-3 py-2 font-semibold w-16">تخفیف<br/><span className="text-[10px] font-normal text-slate-400">(%)</span></th>
                      <th className="px-3 py-2 font-semibold w-20">مالیات و عوارض</th>
                      <th className="px-3 py-2 font-semibold w-28 text-indigo-700 bg-indigo-50/50">مبلغ خالص<br/><span className="text-[10px] font-normal text-indigo-400">(ارز پایه)</span></th>
                      <th className="px-3 py-2 font-semibold w-28 text-sky-700 bg-sky-50/50">مبلغ خالص<br/><span className="text-[10px] font-normal text-sky-400">(ارز اصلی)</span></th>
                      <th className="px-3 py-2 font-semibold w-28 text-emerald-700 bg-emerald-50/50">مبلغ خالص<br/><span className="text-[10px] font-normal text-emerald-400">(ارز فرعی)</span></th>
                      <th className="px-3 py-2 font-semibold w-12 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item, index) => {
                      const { netAmount } = calculateItemTotals(item);
                      const mainAmount = netAmount * mainExchangeRate;
                      const secondaryAmount = netAmount * secondaryExchangeRate;

                      return (
                        <tr key={item.id} className="bg-white group">
                          <td className="px-2 py-2 text-center text-slate-500 text-sm">
                            {index + 1}
                          </td>
                          <td className="px-2 py-2">
                            <select value={item.productId} onChange={(e) => updateItem(item.id, 'productId', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs" required>
                              <option value="">انتخاب...</option>
                              <option value="p1">تابلو برق صنعتی مدل X</option>
                              <option value="p2">سرویس دوره‌ای الکتروموتور</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <select className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs">
                              <option value="">بدون انبار (خدمات)</option>
                              <option value="w1">انبار مرکزی</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs" placeholder="توضیحات..." />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" step="any" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-center text-xs" required />
                          </td>
                          <td className="px-2 py-2">
                            <select value={item.unitId} onChange={(e) => updateItem(item.id, 'unitId', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs" required>
                              <option value="دستگاه">دستگاه</option>
                              <option value="عدد">عدد</option>
                              <option value="سرویس">سرویس</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" step="any" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-left font-mono text-[11px]" placeholder="0" required />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min="0" max="100" value={item.discountPercent} onChange={(e) => updateItem(item.id, 'discountPercent', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-center text-[11px]" placeholder="0" />
                          </td>
                          <td className="px-2 py-2">
                             <input type="number" min="0" value={item.taxAmount} onChange={(e) => updateItem(item.id, 'taxAmount', Number(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-center text-[11px]" placeholder="مبلغ" />
                          </td>
                          <td className="px-2 py-2 bg-indigo-50/30">
                            <input type="text" value={netAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-indigo-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 bg-sky-50/30">
                            <input type="text" value={mainAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-sky-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 bg-emerald-50/30">
                            <input type="text" value={secondaryAmount.toLocaleString()} className="w-full bg-transparent border-0 rounded px-1 py-1 text-emerald-700 font-mono text-[11px] text-left font-bold focus:ring-0" readOnly placeholder="0" />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50" disabled={items.length <= 1}>
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

             {/* 5. تخفیفات، عوامل افزاینده و توضیحات */}
             <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                        <Minus className="w-3.5 h-3.5 text-slate-500" />
                        <h3 className="font-bold text-slate-700 text-xs">تخفیفات کلی</h3>
                    </div>
                    <div className="space-y-2">
                         <div>
                            <label className="block text-slate-600 text-[10px] font-semibold mb-1">درصد تخفیف (%)</label>
                            <input type="number" min="0" max="100" value={totalDiscountPercent} onChange={(e) => setTotalDiscountPercent(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 text-center text-xs" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-[10px] font-semibold mb-1">مبلغ تخفیف</label>
                            <input type="number" min="0" value={totalDiscountAmount} onChange={(e) => setTotalDiscountAmount(Number(e.target.value) || 0)} disabled={totalDiscountPercent > 0} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 text-center disabled:bg-slate-100 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 lg:col-span-1">
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                        <h3 className="font-bold text-slate-700 text-xs">اضافات کلی</h3>
                    </div>
                    <div className="space-y-2">
                         <div>
                            <label className="block text-slate-600 text-[10px] font-semibold mb-1">درصد اضافات (%)</label>
                            <input type="number" min="0" max="100" value={totalAdditionalPercent} onChange={(e) => setTotalAdditionalPercent(Number(e.target.value) || 0)} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 text-center text-xs" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-[10px] font-semibold mb-1">مبلغ اضافات</label>
                            <input type="number" min="0" value={totalAdditionalAmount} onChange={(e) => setTotalAdditionalAmount(Number(e.target.value) || 0)} disabled={totalAdditionalPercent > 0} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 text-center disabled:bg-slate-100 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 lg:col-span-3">
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <h3 className="font-bold text-slate-700 text-xs">توضیحات فاکتور</h3>
                  </div>
                  <textarea rows={4} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-700 focus:border-indigo-500 text-xs resize-none" placeholder="شرایط پرداخت، تحویل و ..." />
                </div>
            </section>

             {/* 6. پیوست‌ها */}
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
                <p className="text-xs text-slate-500 max-w-sm">فایل نیازمندی‌ها، استعلامات یا مکاتبات (فرمت‌های مجاز: ZIP, PDF, DOCX)</p>
                <input type="file" className="hidden" multiple accept=".zip,.pdf,.docx,.doc" />
              </div>
            </section>

          </div>

          {/* Form Actions Footer & Summary Bar */}
          <div className="border-t border-slate-200 bg-white flex flex-col shrink-0 drop-shadow-md">
             {/* Summary Bar */}
             <div className="bg-slate-800 text-slate-200 p-3 flex items-center justify-between text-sm overflow-x-auto">
                 <div className="flex items-center gap-6 min-w-max px-2">
                     <div className="flex flex-col">
                         <span className="text-slate-400 text-[10px]">جمع مبلغ ناخالص</span>
                         <span className="font-mono font-bold text-white">{totals.totalGross.toLocaleString()}</span>
                     </div>
                     <div className="w-px h-6 bg-slate-600"></div>
                     <div className="flex flex-col text-rose-300">
                         <span className="text-[10px]">جمع تخفیفات</span>
                         <span className="font-mono font-bold">{totals.totalDiscount.toLocaleString()}</span>
                     </div>
                     <div className="w-px h-6 bg-slate-600"></div>
                     <div className="flex flex-col text-sky-300">
                         <span className="text-[10px]">جمع مالیات و عوارض</span>
                         <span className="font-mono font-bold">{totals.totalTax.toLocaleString()}</span>
                     </div>
                     <div className="w-px h-6 bg-slate-600"></div>
                     <div className="flex flex-col text-amber-300">
                         <span className="text-[10px]">جمع اضافات</span>
                         <span className="font-mono font-bold">{totals.totalAdditional.toLocaleString()}</span>
                     </div>
                     <div className="w-px h-6 bg-slate-600"></div>
                     <div className="flex flex-col text-emerald-300">
                         <span className="text-[10px]">سود/زیان برآوردی</span>
                         <span className="font-mono font-bold">۱۴,۵۰۰,۰۰۰</span>
                     </div>
                      <div className="w-px h-6 bg-slate-600"></div>
                      <div className="flex items-center gap-3 bg-slate-900 rounded-lg px-4 py-1 border border-slate-700">
                           <span className="text-indigo-300 text-xs font-bold">مبلغ نهایی قابل پرداخت:</span>
                           <span className="font-mono font-bold text-lg text-white">{totals.finalNet.toLocaleString()}</span>
                           <span className="text-slate-500 text-[10px] ml-1">{baseCurrency}</span>
                      </div>
                 </div>
             </div>

            {/* Actions */}
            <div className="p-3 bg-slate-50 flex justify-end gap-3 items-center">
               <div className="mr-auto">
                   <select className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 text-sm focus:border-indigo-500 font-semibold">
                       <option value="draft">وضعیت: پیش‌نویس</option>
                       <option value="approved">وضعیت: تایید شده</option>
                       <option value="final">وضعیت: قطعی</option>
                   </select>
               </div>
              <button type="button" onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 border border-slate-200 rounded-lg font-bold transition-colors text-sm">
                انصراف
              </button>
              <button type="submit" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-indigo-600/30 text-sm">
                <CheckCircle className="w-4 h-4" /> ثبت و صدور فاکتور
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
