import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  FolderTree, 
  Tag, 
  Barcode, 
  Box,
  Save,
  X,
  Layers,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  status: 'فعال' | 'غیرفعال';
}

export const ProductDefinitionView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', code: 'PRD-1001', name: 'لوله پلی اتیلن فشار قوی', price: 1250000, unit: 'متر', stock: 450, status: 'فعال' },
    { id: '2', code: 'PRD-1002', name: 'شیر فلکه صنعتی ۱۰ اینچ', price: 15800000, unit: 'عدد', stock: 25, status: 'فعال' },
    { id: '3', code: 'PRD-1003', name: 'زانو ۴۵ درجه فولادی', price: 450000, unit: 'عدد', stock: 1200, status: 'فعال' },
    { id: '4', code: 'PRD-1004', name: 'واشر تخت لاستیکی', price: 15000, unit: 'عدد', stock: 5000, status: 'غیرفعال' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">تعریف و مدیریت محصولات</h1>
            <p className="text-[10px] text-slate-500">مدیریت کاتالوگ محصولات، قیمت پایه و موجودی انبار</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-md shadow-rose-100"
          >
            <Plus className="w-4 h-4" /> تعریف محصول جدید
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Product List Table */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-bold">کد کالا</th>
                  <th className="px-4 py-3 font-bold">نام و عنوان محصول</th>
                  <th className="px-4 py-3 font-bold text-center">واحد</th>
                  <th className="px-4 py-3 font-bold">قیمت پایه (ریال)</th>
                  <th className="px-4 py-3 font-bold text-center">موجودی</th>
                  <th className="px-4 py-3 font-bold text-center">وضعیت</th>
                  <th className="px-4 py-3 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prd) => (
                  <tr key={prd.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{prd.code}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{prd.name}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{prd.unit}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{prd.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${prd.stock > 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {prd.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${prd.status === 'فعال' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[10px] text-slate-600">{prd.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span>نمایش ۱ تا ۴ از ۴ محصول تعریف شده</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50">قبلی</button>
              <button className="px-2 py-1 rounded bg-rose-600 text-white font-bold shadow-sm">۱</button>
              <button className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50">بعدی</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">تعریف محصول جدید</h2>
                    <p className="text-[10px] text-slate-500">اطلاعات کالا را با دقت وارد نمایید</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      <Barcode className="w-3.5 h-3.5 text-slate-400" /> کد کالا (SKU)
                    </label>
                    <input 
                      type="text" 
                      placeholder="PRD-XXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" /> نام و عنوان محصول
                    </label>
                    <input 
                      type="text" 
                      placeholder="مثلاً لوله پلی اتیلن..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-slate-400" /> واحد اندازه‌گیری
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer">
                      <option>عدد</option>
                      <option>متر</option>
                      <option>کیلوگرم</option>
                      <option>بسته</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      قیمت پایه (ریال)
                    </label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-bold text-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      موجودی اولیه
                    </label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-400" /> توضیحات تکمیلی محصول
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="مشخصات فنی، برند، کشور سازنده و..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  انصراف
                </button>
                <button className="bg-rose-600 text-white px-8 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                  <Save className="w-4 h-4" /> ذخیره اطلاعات محصول
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
