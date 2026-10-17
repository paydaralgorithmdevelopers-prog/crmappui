import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Radio as MediaIcon, 
  TrendingUp, 
  Target, 
  History as HistoryIcon, 
  Search, 
  Users,
  Filter, 
  ArrowLeft, 
  ChevronRight,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

interface MediaLog {
  id: string;
  date: string;
  user: string;
  action: string;
  comment: string;
}

interface MediaMetric {
  id: string;
  name: string;
  kpi: number;
  okr: number;
  unit: string;
}

interface MediaOpsData {
  id: string;
  code: string;
  name: string;
  type: string;
  channel: string;
  status: 'active' | 'archived' | 'pending';
  metrics: MediaMetric[];
  growthRate: number; // %
  history: { date: string; value: number }[];
  logs: MediaLog[];
}

const MOCK_MEDIA_OPS: MediaOpsData[] = [
  {
    id: '1',
    code: 'MED-WEB-01',
    name: 'پورتال جامع سازمانی (وب‌سایت)',
    type: 'دیجیتال',
    channel: 'Direct',
    status: 'active',
    metrics: [
      { id: 'm1', name: 'ترافیک ورودی', kpi: 12500, okr: 15000, unit: 'نفر' },
      { id: 'm2', name: 'نرخ پرش', kpi: 35, okr: 30, unit: '%' },
      { id: 'm3', name: 'زمان ماندگاری', kpi: 180, okr: 240, unit: 'ثانیه' },
      { id: 'm4', name: 'لیدهای تولید شده', kpi: 450, okr: 500, unit: 'عدد' },
      { id: 'm5', name: 'درخواست دمو', kpi: 85, okr: 100, unit: 'عدد' },
      { id: 'm6', name: 'امتیاز سئو', kpi: 88, okr: 90, unit: '%' },
    ],
    growthRate: 8.4,
    history: [
      { date: '۰۱-فروردین', value: 8000 },
      { date: '۱۰-فروردین', value: 9500 },
      { date: '۲۰-فروردین', value: 11000 },
      { date: '۳۰-فروردین', value: 12500 },
    ],
    logs: [
      { id: 'l1', date: '۱۴۰۳/۰۱/۱۰', user: 'مهندس احمدی', action: 'بهینه‌سازی محتوا', comment: 'کلمات کلیدی بخش ترانسفورماتورها اصلاح شد.' },
      { id: 'l2', date: '۱۴۰۳/۰۱/۲۰', user: 'سارا رضایی', action: 'کمپین تبلیغاتی', comment: 'کمپین کلیکی گوگل ادز برای بخش تابلو برق فعال شد.' },
    ]
  },
  {
    id: '2',
    code: 'MED-LNK-01',
    name: 'صفحه لینکدین B2B شرکت',
    type: 'شبکه‌های اجتماعی',
    channel: 'Organic',
    status: 'active',
    metrics: [
      { id: 'm1', name: 'دنبال‌کنندگان جدید', kpi: 120, okr: 200, unit: 'نفر' },
      { id: 'm2', name: 'نرخ تعامل', kpi: 4.5, okr: 5, unit: '%' },
      { id: 'm3', name: 'تعداد اشتراک‌گذاری', kpi: 25, okr: 40, unit: 'عدد' },
      { id: 'm4', name: 'لیدهای دریافتی', kpi: 12, okr: 20, unit: 'عدد' },
    ],
    growthRate: 15.2,
    history: [
      { date: '۰۱-فروردین', value: 500 },
      { date: '۱۰-فروردین', value: 540 },
      { date: '۲۰-فروردین', value: 590 },
      { date: '۳۰-فروردین', value: 620 },
    ],
    logs: [
      { id: 'l3', date: '۱۴۰۳/۰۱/۲۵', user: 'علی کریمی', action: 'انتشار پست فنی', comment: 'ویدیوی معرفی خط تولید جدید بازخورد خوبی داشت.' },
    ]
  }
];

export const MediaOperationalDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaOpsData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedia = MOCK_MEDIA_OPS.filter(p => 
    p.name.includes(searchQuery) || p.code.includes(searchQuery)
  );

  const renderDashboard = (data: MediaOpsData) => {
    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-left duration-500 pb-12">
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedMedia(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg">
              <MediaIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{data.name}</h2>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-100 font-mono">
                  {data.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">نوع: {data.type} • کانال: {data.channel}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold">وضعیت عملیاتی</span>
               <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${
                 data.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
               }`}>
                 {data.status === 'active' ? 'فعال و در حال رصد' : 'آرشیو شده'}
               </span>
             </div>
          </div>
        </div>

        {/* Charts & Metrics Area */}
        <div className="flex flex-col gap-6">
          {/* Growth Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-800">تحلیل اثربخشی رسانه (Effectiveness Trend)</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                 <span className={`flex items-center gap-1 ${data.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {data.growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                   {Math.abs(data.growthRate)}% رشد عملکرد
                 </span>
              </div>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorMedia)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Deviations Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">پایش انحراف متریک‌های رسانه از OKR</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.metrics.map(metric => {
                const deviation = ((metric.kpi - metric.okr) / metric.okr) * 100;
                const isUnderTarget = metric.kpi < metric.okr;
                
                return (
                  <div key={metric.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-rose-300 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">{metric.name}</span>
                      <div className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        deviation >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {deviation >= 0 ? '+' : ''}{deviation.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-black text-slate-800">{metric.kpi}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{metric.unit}</span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>تحقق</span>
                        <span>هدف: {metric.okr}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            isUnderTarget ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min((metric.kpi / metric.okr) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">سوابق عملیاتی و تغییرات رسانه (Media Logs)</h3>
            </div>
            <button className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-xs">
              ثبت گزارش جدید
            </button>
          </div>
          
          <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
            {data.logs.map((log) => (
              <div key={log.id} className="p-4 flex gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">{log.action}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-white/50 p-2 rounded-lg border border-dashed border-slate-200 mt-2 italic">
                    "{log.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List of Recorded Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-slate-800 text-sm">فهرست سوابق ثبت شده (بر اساس تاریخ)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[11px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">شناسه رکورد</th>
                  <th className="px-4 py-3 font-bold">تاریخ و زمان ثبت</th>
                  <th className="px-4 py-3 font-bold">کاربر ثبت‌کننده</th>
                  <th className="px-4 py-3 font-bold">مقدار شاخص (KPI)</th>
                  <th className="px-4 py-3 font-bold">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'MED-REC-502', date: '۱۴۰۳/۰۱/۳۰', time: '۱۵:۲۰', user: 'سارا رضایی', value: '۱۲,۵۰۰', status: 'نهایی شده' },
                  { id: 'MED-REC-485', date: '۱۴۰۳/۰۱/۲۰', time: '۱۰:۴۵', user: 'مهندس احمدی', value: '۹,۵۰۰', status: 'نهایی شده' },
                  { id: 'MED-REC-460', date: '۱۴۰۳/۰۱/۱۰', time: '۰۸:۳۰', user: 'سارا رضایی', value: '۸,۰۰۰', status: 'نهایی شده' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-slate-800">{row.date}</span>
                        <span className="text-slate-400 text-[10px]">{row.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{row.user}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">{row.value}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-100">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      {/* Search & Filter Header */}
      {!selectedMedia && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">گزارش عملیاتی و پایش عملکرد رسانه‌ها</h1>
              <p className="text-xs text-slate-500 font-medium">تجزیه و تحلیل اثربخشی کانال‌های ارتباطی و رسانه‌های CEM</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input 
                type="text" 
                placeholder="جستجو در نام رسانه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 outline-none w-72 transition-all"
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {selectedMedia ? (
          renderDashboard(selectedMedia)
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700">
            {filteredMedia.map((media) => (
              <div 
                key={media.id}
                onClick={() => setSelectedMedia(media)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-rose-50 transition-colors" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-rose-100 text-slate-400 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                      <MediaIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-rose-700 transition-colors">#{media.code}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-rose-900 transition-colors">{media.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate">نوع: {media.type}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold">رشد عملکرد</span>
                      <span className="text-sm font-black text-slate-800">{media.metrics[0]?.kpi.toLocaleString() || 0}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${
                      media.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {media.growthRate >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                      {Math.abs(media.growthRate)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-rose-600 group-hover:translate-x-[-4px] transition-transform">
                    <span>مشاهده جزئیات عملکرد رسانه</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-rose-300 hover:text-rose-600 transition-all cursor-pointer bg-slate-50/50">
              <Zap className="w-8 h-8 mb-3 opacity-20" />
              <span className="text-xs font-bold">تعریف رسانه جدید برای پایش</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
