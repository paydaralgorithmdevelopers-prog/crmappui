import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Package,
  TrendingUp,
  Target,
  BarChart3,
  X,
  Check,
  FolderTree,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  code: string;
  name: string;
  type: string;
}

interface ProductGroup {
  id: string;
  code: string;
  name: string;
  products: Product[];
  share: number; // percentage
  multiplier: number; // coefficient
  status: 'active' | 'inactive';
  isExpanded?: boolean;
}

const initialGroups: ProductGroup[] = [
  { 
    id: '1', 
    code: 'GP-001', 
    name: 'محصولات راهبردی (High-Tech)', 
    products: [
      { id: 'p1', code: 'PRD-101', name: 'سرور HP DL380 G11', type: 'سخت‌افزار' },
      { id: 'p2', code: 'PRD-102', name: 'تجهیزات شبکه Cisco 9300', type: 'شبکه' }
    ], 
    share: 45, 
    multiplier: 1.3, 
    status: 'active',
    isExpanded: true
  },
  { 
    id: '2', 
    code: 'GP-002', 
    name: 'محصولات عادی (Standard)', 
    products: [
      { id: 'p3', code: 'PRD-201', name: 'مانیتور Dell 27"', type: 'لوازم جانبی' },
      { id: 'p4', code: 'PRD-202', name: 'کیبورد و ماوس بی‌سیم', type: 'لوازم جانبی' }
    ], 
    share: 30, 
    multiplier: 1, 
    status: 'active' 
  },
  { 
    id: '3', 
    code: 'GP-003', 
    name: 'محصولات کم‌اولویت (Legacy)', 
    products: [
      { id: 'p5', code: 'PRD-301', name: 'قطعات یدکی سرور G9', type: 'قطعات' }
    ], 
    share: 25, 
    multiplier: 0.8, 
    status: 'active' 
  },
];

export const ProductGroupsTargetView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
  
  const totalShare = groups.filter(g => g.status === 'active').reduce((sum, g) => sum + g.share, 0);

  const toggleGroup = (id: string) => {
    setGroups(groups.map(g => g.id === id ? { ...g, isExpanded: !g.isExpanded } : g));
  };

  const handleUpdateGroup = (id: string, field: keyof ProductGroup, value: number) => {
    setGroups(groups.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleToggleStatus = (id: string) => {
    setGroups(groups.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">مجموع سهم تعریف شده</p>
            <p className={`text-lg font-mono font-bold ${totalShare === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalShare}%
            </p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">بالاترین ضریب تأثیر</p>
            <p className="text-lg font-mono font-bold text-slate-800">
              {Math.max(...groups.map(g => g.multiplier))}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">تعداد گروه‌های فعال</p>
            <p className="text-lg font-mono font-bold text-slate-800">
              {groups.filter(g => g.status === 'active').length}
            </p>
          </div>
        </div>
      </div>

      {totalShare !== 100 && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <p className="text-xs font-bold text-rose-700">
            هشدار: مجموع سهم گروه‌های فعال باید دقیقاً ۱۰۰٪ باشد. در حال حاضر {totalShare}% است.
          </p>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">گروه‌بندی محصولات و ضرایب پورسانت</h3>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
              {groups.length} مورد
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                placeholder="جستجوی گروه یا محصول..."
                className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs w-64 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-100">کد / نام</th>
                <th className="px-6 py-4 border-b border-slate-100">تعداد اقلام</th>
                <th className="px-6 py-4 border-b border-slate-100 w-40">سهم از تارگت (%)</th>
                <th className="px-6 py-4 border-b border-slate-100 w-40">ضریب تأثیر</th>
                <th className="px-6 py-4 border-b border-slate-100 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => (
                <React.Fragment key={group.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => toggleGroup(group.id)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {group.isExpanded ? <ChevronDown className="w-4 h-4 text-rose-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{group.name}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{group.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Box className="w-3.5 h-3.5" /> {group.products.length} کالا
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <Target className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="number"
                          value={group.share}
                          onChange={(e) => handleUpdateGroup(group.id, 'share', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-1.5 text-xs font-mono font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all text-center"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <BarChart3 className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="number"
                          step="0.1"
                          value={group.multiplier}
                          onChange={(e) => handleUpdateGroup(group.id, 'multiplier', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-1.5 text-xs font-mono font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden transition-all text-center"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(group.id); }}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          group.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {group.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Tree View for Products */}
                  <AnimatePresence>
                    {group.isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 border-b border-slate-100">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50/50"
                          >
                            <div className="pr-12 pl-6 py-3 space-y-2">
                              {group.products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 group/item">
                                  <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-rose-500 transition-colors" />
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-medium text-slate-600 group-hover/item:text-slate-900 transition-colors">{product.name}</span>
                                      <span className="text-[9px] font-mono text-slate-400">{product.code}</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">{product.type}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 border-dashed flex items-center gap-3 text-slate-500">
        <AlertCircle className="w-4 h-4 text-sky-500" />
        <p className="text-[10px] font-medium">
          گروه‌های فوق بر اساس تعاریف سیستم در بخش کالا فراخوانی شده‌اند. شما می‌توانید سهم هر گروه و ضریب تأثیر آن در پورسانت را مستقیماً در جدول فوق تنظیم نمایید.
        </p>
      </div>
    </div>
  );
};

const PieChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
