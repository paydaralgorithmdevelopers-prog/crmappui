import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  Target, 
  FileText, 
  FileCheck, 
  Send, 
  Inbox, 
  StickyNote, 
  CreditCard,
  Plus,
  Filter,
  ChevronDown,
  History,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lead } from '../../types';

interface TimelineEvent {
  id: string;
  type: 'opportunity' | 'note' | 'pre-invoice' | 'received-signal' | 'sent-signal' | 'invoice' | 'settlement';
  title: string;
  date: string;
  code: string;
  description?: string;
  status?: string;
}

interface LeadTimelineReportViewProps {
  leads: Lead[];
}

export const LeadTimelineReportView: React.FC<LeadTimelineReportViewProps> = ({ leads }) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filter States
  const [filterType, setFilterType] = useState<string>('all');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const events: TimelineEvent[] = [
    { id: '1', type: 'opportunity', title: 'فرصت فروش ۱۱۸', date: '۱۴۰۵/۰۱/۰۱', code: 'OPP-118', status: 'فعال' },
    { id: '2', type: 'note', title: 'یادداشت ۱۰۰۰۱', date: '۱۴۰۵/۰۱/۰۲', code: 'NOTE-10001', description: 'پیگیری دمو فنی محصولات' },
    { id: '3', type: 'pre-invoice', title: 'پیش فاکتور ۲۰۱۸', date: '۱۴۰۵/۰۱/۰۳', code: 'PRF-2018', status: 'در انتظار تایید' },
    { id: '4', type: 'received-signal', title: 'سیگنال ۲۱۸ تماس تلفنی', date: '۱۴۰۵/۰۱/۰۴', code: 'SIG-R-218', description: 'درخواست تخفیف خرید عمده' },
    { id: '5', type: 'received-signal', title: 'سیگنال دریافتی ۵۰۰۸ پیامک', date: '۱۴۰۵/۰۱/۰۵', code: 'SIG-R-5008', description: 'تایید زمان ارسال' },
    { id: '6', type: 'invoice', title: 'فاکتور ۲۱۵', date: '۱۴۰۵/۰۱/۰۶', code: 'INV-215', status: 'صادر شده' },
    { id: '7', type: 'sent-signal', title: 'سیگنال ارسالی ۳۱۵ پیام واتساپ', date: '۱۴۰۵/۰۱/۰۷', code: 'SIG-S-315', description: 'ارسال لوکیشن کارخانه' },
    { id: '8', type: 'settlement', title: 'تسویه ۲۱۶', date: '۱۴۰۵/۰۱/۰۸', code: 'STL-216', status: 'تسویه کامل' },
  ];

  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterKeyword && !event.title.includes(filterKeyword) && !event.description?.includes(filterKeyword)) return false;
    return true;
  });

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4" />;
      case 'note': return <StickyNote className="w-4 h-4" />;
      case 'pre-invoice': return <FileText className="w-4 h-4" />;
      case 'received-signal': return <Inbox className="w-4 h-4" />;
      case 'sent-signal': return <Send className="w-4 h-4" />;
      case 'invoice': return <FileCheck className="w-4 h-4" />;
      case 'settlement': return <CreditCard className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'opportunity': return 'bg-amber-500';
      case 'note': return 'bg-slate-500';
      case 'pre-invoice': return 'bg-indigo-500';
      case 'received-signal': return 'bg-rose-500';
      case 'sent-signal': return 'bg-blue-500';
      case 'invoice': return 'bg-emerald-500';
      case 'settlement': return 'bg-slate-900';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header Filters */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all cursor-pointer"
            >
              <option value="">جستجو و انتخاب سرنخ / مشتری...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.companyName} ({lead.code})</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="w-48">
          <div className="relative">
            <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجو و انتخاب کاربر"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="w-56">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="فیلتر تاریخ از ... تا ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`p-2.5 rounded-xl transition-all ${showAdvancedFilters ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvancedFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-2">نوع رویداد</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="all">همه رویدادها</option>
              <option value="opportunity">فرصت فروش</option>
              <option value="note">یادداشت</option>
              <option value="pre-invoice">پیش فاکتور</option>
              <option value="invoice">فاکتور</option>
              <option value="received-signal">سیگنال دریافتی</option>
              <option value="sent-signal">سیگنال ارسالی</option>
              <option value="settlement">تسویه حساب</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-2">جستجو در متن/عنوان</label>
            <input 
              type="text"
              placeholder="کلمه کلیدی..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-2">حداقل مبلغ (ریال)</label>
            <input 
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 mr-2">حداکثر مبلغ (ریال)</label>
            <input 
              type="number"
              placeholder="مثلاً ۱۰۰,۰۰۰,۰۰۰"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Main Timeline View */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />

          <div className="flex flex-col gap-8 relative z-10">
            {filteredEvents.length > 0 ? filteredEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={event.id} className="relative flex items-center justify-center">
                  {/* Timeline Dot */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center text-white border-4 border-white shadow-md z-20`}>
                    {getEventIcon(event.type)}
                  </div>

                  {/* Content Card (Alternating) */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full md:w-5/12 ${isEven ? 'md:mr-auto' : 'md:ml-auto'} relative`}
                  >
                    <div className={`bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group ${isEven ? 'text-right' : 'text-right md:text-left'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${isEven ? 'justify-start' : 'justify-start md:justify-end'} flex-row-reverse`}>
                        <span className="font-bold text-[13px] text-slate-800">{event.title}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${getEventColor(event.type)}`} />
                      </div>
                      
                      <div className={`flex items-center gap-3 text-[10px] text-slate-500 mb-2 ${isEven ? 'justify-start' : 'justify-start md:justify-end'} flex-row-reverse`}>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                        <span className="flex items-center gap-1 font-mono">{event.code}</span>
                      </div>

                      {event.description && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mb-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {event.status && (
                        <div className={`flex ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {event.status}
                          </span>
                        </div>
                      )}
                      
                      <button className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Connective Line to Dot */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-slate-100 hidden md:block ${isEven ? 'right-full' : 'left-full'}`} />
                  </motion.div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Search className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-xs font-bold">رویدادی با فیلترهای انتخابی یافت نشد</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">جمع فرصت‌های ایجاد شده</span>
              <span className="text-sm font-black text-amber-600">۱۲</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">جمع پیش فاکتورهای صادر شده</span>
              <span className="text-sm font-black text-indigo-600">۸</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">جمع فاکتورهای صادر شده</span>
              <span className="text-sm font-black text-emerald-600">۵</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">جمع تسویه‌های انجام شده</span>
              <span className="text-sm font-black text-slate-800">۳</span>
            </div>
          </div>
          
          <div className="bg-slate-900 px-5 py-1.5 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-400 font-bold">مانده حساب (ریال)</span>
            <span className="text-sm font-black text-white">۱,۲۸۰,۰۰۰,۰۰۰</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-2">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
          <Send className="w-4 h-4" /> ارسال سیگنال
        </button>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-900 hover:-translate-y-0.5 transition-all">
          <StickyNote className="w-4 h-4" /> ایجاد یادداشت
        </button>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-amber-100 hover:bg-amber-600 hover:-translate-y-0.5 transition-all">
          <Target className="w-4 h-4" /> ایجاد فرصت
        </button>
        <button className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-6 py-2.5 rounded-2xl font-bold text-xs border border-indigo-200 hover:bg-indigo-200 hover:-translate-y-0.5 transition-all">
          <FileText className="w-4 h-4" /> ایجاد پیش فاکتور
        </button>
        <button className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-2xl font-bold text-xs border border-emerald-200 hover:bg-emerald-200 hover:-translate-y-0.5 transition-all">
          <FileCheck className="w-4 h-4" /> ایجاد فاکتور
        </button>
      </div>
    </div>
  );
};
