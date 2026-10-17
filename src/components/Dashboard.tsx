import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Settings, 
  Activity, 
  FileText, 
  X, 
  Pin,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PinnedItem {
  id: string;
  title: string;
  type: 'definition' | 'operation' | 'report';
  icon?: any;
}

interface DashboardProps {
  pinnedItems: PinnedItem[];
  onRemovePin: (id: string) => void;
  onOpenItem: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  pinnedItems, 
  onRemovePin,
  onOpenItem 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'definitions' | 'operations' | 'reports'>('definitions');

  const tabs = [
    { id: 'definitions', title: 'تعاریف', icon: Settings },
    { id: 'operations', title: 'عملیات', icon: Activity },
    { id: 'reports', title: 'گزارشات', icon: FileText },
  ];

  const filteredItems = pinnedItems.filter(item => {
    if (activeSubTab === 'definitions') return item.type === 'definition';
    if (activeSubTab === 'operations') return item.type === 'operation';
    if (activeSubTab === 'reports') return item.type === 'report';
    return false;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Dashboard Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">میز کار من</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">دسترسی سریع به فرم‌ها و گزارش‌های پین شده</p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all cursor-pointer ${
              activeSubTab === tab.id 
                ? 'border-rose-600 text-rose-700 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-rose-600' : 'text-slate-400'}`} />
            <span className="text-sm">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Tiles Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-rose-200 transition-all cursor-pointer relative"
                onClick={() => onOpenItem(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'definition' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'operation' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {item.icon ? <item.icon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePin(item.id);
                    }}
                    className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="حذف از میز کار"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-700 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">
                      {item.type === 'definition' ? 'فروم تعاریف' :
                       item.type === 'operation' ? 'فروم عملیاتی' : 'گزارش تحلیلی'}
                    </span>
                    <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-slate-100 rounded-full mb-4">
              <Pin className="w-10 h-10 text-slate-300 rotate-45" />
            </div>
            <h3 className="text-slate-600 font-bold">موردی در این بخش پین نشده است</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-xs">
              می‌توانید فرم‌ها و گزارش‌های پرکاربرد خود را از منوی کناری به این بخش اضافه کنید تا دسترسی سریع‌تری داشته باشید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
