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
  Megaphone as CampaignIcon, 
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
  Flag
} from 'lucide-react';

interface CampaignLog {
  id: string;
  date: string;
  user: string;
  action: string;
  comment: string;
}

interface CampaignMetric {
  id: string;
  name: string;
  kpi: number;
  okr: number;
  unit: string;
}

interface CampaignOpsData {
  id: string;
  code: string;
  name: string;
  type: string;
  budget: string;
  status: 'active' | 'completed' | 'planning';
  metrics: CampaignMetric[];
  growthRate: number; // %
  history: { date: string; value: number }[];
  logs: CampaignLog[];
}

const MOCK_CAMPAIGN_OPS: CampaignOpsData[] = [
  {
    id: '1',
    code: 'CAMP-SPRING-05',
    name: 'جشنواره فروش بهاره تجهیزات فشار قوی',
    type: 'فروش مستقیم',
    budget: '۲.۵ میلیارد تومان',
    status: 'active',
    metrics: [
      { id: 'm1', name: 'تحقق فروش', kpi: 1850, okr: 2500, unit: 'میلیون' },
      { id: 'm2', name: 'لیدهای باکیفیت (SQL)', kpi: 120, okr: 150, unit: 'عدد' },
      { id: 'm3', name: 'نرخ برد (Win Rate)', kpi: 18, okr: 25, unit: '%' },
      { id: 'm4', name: 'هزینه اکتساب (CAC)', kpi: 4.2, okr: 3.5, unit: 'میلیون' },
      { id: 'm5', name: 'بازگشت سرمایه (ROI)', kpi: 3.2, okr: 4.5, unit: 'X' },
    ],
    growthRate: 18.5,
    history: [
      { date: 'هفته ۱', value: 150 },
      { date: 'هفته ۲', value: 450 },
      { date: 'هفته ۳', value: 980 },
      { date: 'هفته ۴', value: 1850 },
    ],
    logs: [
      { id: 'l1', date: '۱۴۰۳/۰۱/۰۵', user: 'مدیر بازاریابی', action: 'لانچ کمپین', comment: 'کمپین در تمام کانال‌های دیجیتال و محیطی فعال شد.' },
      { id: 'l2', date: '۱۴۰۳/۰۱/۲۰', user: 'مهندس احمدی', action: 'تعدیل بودجه', comment: 'بودجه بخش لینکدین به دلیل بازخورد بالا ۲۰٪ افزایش یافت.' },
    ]
  },
  {
    id: '2',
    code: 'CAMP-EXPO-24',
    name: 'حضور در نمایشگاه بین‌المللی صنعت برق',
    type: 'برندینگ و نمایشگاهی',
    budget: '۸۰۰ میلیون تومان',
    status: 'planning',
    metrics: [
      { id: 'm1', name: 'تعداد بازدید غرفه', kpi: 0, okr: 5000, unit: 'نفر' },
      { id: 'm2', name: 'مذاکرات جدی (B2B)', kpi: 0, okr: 200, unit: 'مورد' },
      { id: 'm3', name: 'توزیع کاتالوگ', kpi: 0, okr: 3000, unit: 'نسخه' },
    ],
    growthRate: 0,
    history: [
      { date: 'پیش‌بینی', value: 0 },
    ],
    logs: [
      { id: 'l3', date: '۱۴۰۳/۰۱/۲۸', user: 'سارا رضایی', action: 'طراحی غرفه', comment: 'طرح نهایی غرفه تایید و به پیمانکار ارجاع شد.' },
    ]
  }
];

export const CampaignOperationalDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignOpsData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = MOCK_CAMPAIGN_OPS.filter(p => 
    p.name.includes(searchQuery) || p.code.includes(searchQuery)
  );

  const renderDashboard = (data: CampaignOpsData) => {
    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-left duration-500 pb-12">
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCampaign(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-lg">
              <CampaignIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{data.name}</h2>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 font-mono">
                  {data.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">نوع: {data.type} • بودجه تخصیصی: {data.budget}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold">وضعیت کمپین</span>
               <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${
                 data.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
               }`}>
                 {data.status === 'active' ? 'درحال اجرا' : data.status === 'completed' ? 'خاتمه یافته' : 'در شرف اجرا'}
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
                <BarChart3 className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-slate-800">تحلیل روند تحقق اهداف کمپین</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                 <span className={`flex items-center gap-1 ${data.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {data.growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                   {Math.abs(data.growthRate)}% پیشرفت دوره
                 </span>
              </div>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorCampaign" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4338ca" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={3} fillOpacity={1} fill="url(#colorCampaign)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Deviations Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">پایش انحراف شاخص‌های کلیدی کمپین از OKR</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.metrics.map(metric => {
                const deviation = metric.okr > 0 ? ((metric.kpi - metric.okr) / metric.okr) * 100 : 0;
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
                            isUnderTarget ? 'bg-amber-400' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${metric.okr > 0 ? Math.min((metric.kpi / metric.okr) * 100, 100) : 0}%` }}
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
              <HistoryIcon className="w-4 h-4 text-indigo-700" />
              <h3 className="font-bold text-slate-800 text-sm">وقایع‌نگاری و رهگیری کمپین (Campaign Logs)</h3>
            </div>
            <button className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-xs">
              ثبت رویداد جدید
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
      {!selectedCampaign && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-lg">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">داشبورد پایش عملیاتی و مالی کمپین‌ها</h1>
              <p className="text-xs text-slate-500 font-medium">مدیریت بودجه، رهگیری تحقق اهداف و تحلیل ROI کمپین‌های بازاریابی</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input 
                type="text" 
                placeholder="جستجو در نام کمپین..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none w-72 transition-all"
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
        {selectedCampaign ? (
          renderDashboard(selectedCampaign)
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700">
            {filteredCampaigns.map((campaign) => (
              <div 
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-700 flex items-center justify-center transition-colors">
                      <CampaignIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-indigo-700 transition-colors">#{campaign.code}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-900 transition-colors">{campaign.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate">بودجه: {campaign.budget}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold">پیشرفت تحقق</span>
                      <span className="text-sm font-black text-slate-800">{campaign.metrics[0]?.kpi.toLocaleString() || 0}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${
                      campaign.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {campaign.growthRate >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                      {Math.abs(campaign.growthRate)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 group-hover:translate-x-[-4px] transition-transform">
                    <span>مشاهده جزئیات گزارش عملیاتی</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-pointer bg-slate-50/50">
              <Zap className="w-8 h-8 mb-3 opacity-20" />
              <span className="text-xs font-bold">افزودن کمپین جدید برای پایش</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
