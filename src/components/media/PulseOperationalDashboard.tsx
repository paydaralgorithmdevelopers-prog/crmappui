import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Activity as PulseIcon, 
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
  Clock
} from 'lucide-react';

interface PulseLog {
  id: string;
  date: string;
  user: string;
  action: string;
  comment: string;
}

interface PulseMetric {
  id: string;
  name: string;
  kpi: number;
  okr: number;
  unit: string;
}

interface PulseData {
  id: string;
  code: string;
  name: string;
  source: string;
  campaign: string;
  status: 'active' | 'processed' | 'pending';
  metrics: PulseMetric[];
  growthRate: number; // %
  history: { date: string; value: number }[];
  logs: PulseLog[];
}

const MOCK_PULSES: PulseData[] = [
  {
    id: '1',
    code: 'SIG-8821',
    name: 'تکمیل فرم درخواست کاتالوگ ترانس',
    source: 'لینکدین',
    campaign: 'فروش بهاره تابلو برق',
    status: 'active',
    metrics: [
      { id: 'm1', name: 'تعداد کلیک', kpi: 85, okr: 100, unit: 'عدد' },
      { id: 'm2', name: 'نرخ تبدیل فیلد', kpi: 12, okr: 15, unit: '%' },
      { id: 'm3', name: 'زمان صرف شده', kpi: 45, okr: 40, unit: 'ثانیه' },
      { id: 'm4', name: 'کیفیت دیتا', kpi: 90, okr: 95, unit: '%' },
      { id: 'm5', name: 'تعداد ارجاع', kpi: 8, okr: 10, unit: 'عدد' },
      { id: 'm6', name: 'رضایت مشتری', kpi: 4.2, okr: 4.5, unit: 'امتیاز' },
      { id: 'm7', name: 'تعداد اشتراک', kpi: 25, okr: 30, unit: 'عدد' },
      { id: 'm8', name: 'نرخ خروج', kpi: 5, okr: 3, unit: '%' },
      { id: 'm9', name: 'تکمیل پروفایل', kpi: 78, okr: 80, unit: '%' },
      { id: 'm10', name: 'پاسخگویی', kpi: 95, okr: 100, unit: '%' },
    ],
    growthRate: 12.5,
    history: [
      { date: '۰۱-فروردین', value: 20 },
      { date: '۱۰-فروردین', value: 45 },
      { date: '۲۰-فروردین', value: 65 },
      { date: '۳۰-فروردین', value: 85 },
    ],
    logs: [
      { id: 'l1', date: '۱۴۰۳/۰۱/۱۵', user: 'سارا رضایی', action: 'بررسی اولیه', comment: 'اطلاعات ناقص بود، با مشتری تماس گرفته شد.' },
      { id: 'l2', date: '۱۴۰۳/۰۱/۲۰', user: 'مهندس احمدی', action: 'تایید فنی', comment: 'نیازمندی‌ها با استانداردهای شرکت مطابقت دارد.' },
    ]
  },
  {
    id: '2',
    code: 'SIG-9044',
    name: 'درخواست دمو آنلاین نرم‌افزار مانیتورینگ',
    source: 'وب‌سایت اصلی',
    campaign: 'نوسازی ترانسفورماتورها',
    status: 'pending',
    metrics: [
      { id: 'm1', name: 'تعداد درخواست', kpi: 40, okr: 150, unit: 'عدد' },
      { id: 'm2', name: 'زمان انتظار', kpi: 120, okr: 60, unit: 'دقیقه' },
      { id: 'm3', name: 'نرخ کلیک دمو', kpi: 5, okr: 15, unit: '%' },
      { id: 'm4', name: 'تعداد پیگیری', kpi: 2, okr: 5, unit: 'عدد' },
    ],
    growthRate: -5.2,
    history: [
      { date: '۰۱-فروردین', value: 10 },
      { date: '۱۰-فروردین', value: 25 },
      { date: '۲۰-فروردین', value: 50 },
      { date: '۳۰-فروردین', value: 40 },
    ],
    logs: [
      { id: 'l3', date: '۱۴۰۳/۰۱/۲۵', user: 'علی کریمی', action: 'ارجاع به فروش', comment: 'مشتری عجله دارد، اولویت بالا.' },
    ]
  }
];

export const PulseOperationalDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedPulse, setSelectedPulse] = useState<PulseData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPulses = MOCK_PULSES.filter(p => 
    p.name.includes(searchQuery) || p.code.includes(searchQuery)
  );

  const renderDashboard = (data: PulseData) => {
    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-left duration-500 pb-12">
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedPulse(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <PulseIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{data.name}</h2>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 font-mono">
                  {data.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">کمپین: {data.campaign} • منبع: {data.source}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold">وضعیت عملیاتی</span>
               <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${
                 data.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
               }`}>
                 {data.status === 'active' ? 'در حال پردازش' : 'معلق'}
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
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">تحلیل روند رشد (Growth Trend)</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                 <span className={`flex items-center gap-1 ${data.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {data.growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                   {Math.abs(data.growthRate)}% رشد دوره اخیر
                 </span>
              </div>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Deviations Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">پایش انحراف متریک‌ها از OKR</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.metrics.map(metric => {
                const deviation = ((metric.kpi - metric.okr) / metric.okr) * 100;
                const isUnderTarget = metric.kpi < metric.okr;
                
                return (
                  <div key={metric.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-indigo-300 transition-all group">
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
                            isUnderTarget ? 'bg-amber-400' : 'bg-indigo-500'
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
              <HistoryIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">سوابق و رهگیری عملیات (Activity Logs)</h3>
            </div>
            <button className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-xs">
              ثبت لاگ جدید
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
      </div>
    );
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      {/* Search & Filter Header */}
      {!selectedPulse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">داشبورد مدیریتی شاخص‌های عملیاتی</h1>
              <p className="text-xs text-slate-500 font-medium">تحلیل هوشمند، پایش KPI و رهگیری عملیاتی</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input 
                type="text" 
                placeholder="جستجو در نام یا کد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none w-72 transition-all"
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
        {selectedPulse ? (
          renderDashboard(selectedPulse)
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700">
            {filteredPulses.map((pulse) => (
              <div 
                key={pulse.id}
                onClick={() => setSelectedPulse(pulse)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                      <PulseIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-emerald-700 transition-colors">#{pulse.code}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-emerald-900 transition-colors">{pulse.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate">{pulse.campaign}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold">میزان تحقق (KPI)</span>
                      <span className="text-sm font-black text-slate-800">{pulse.metrics[0]?.kpi || 0}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${
                      pulse.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {pulse.growthRate >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                      {Math.abs(pulse.growthRate)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600 group-hover:translate-x-[-4px] transition-transform">
                    <span>مشاهده جزئیات داشبورد</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 transition-all cursor-pointer bg-slate-50/50">
              <Zap className="w-8 h-8 mb-3 opacity-20" />
              <span className="text-xs font-bold">افزودن مورد جدید</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
