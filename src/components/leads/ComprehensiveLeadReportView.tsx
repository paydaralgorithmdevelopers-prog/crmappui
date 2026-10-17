import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  Send, 
  Inbox, 
  Target, 
  FileText, 
  FileCheck, 
  FileSpreadsheet,
  Search, 
  Filter,
  Layers,
  ChevronLeft,
  Calendar,
  Tag,
  Radio,
  Share2,
  ExternalLink,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lead, MediaChannel, Campaign } from '../../types';

interface ComprehensiveLeadReportViewProps {
  leads: Lead[];
  mediaList: MediaChannel[];
}

export const ComprehensiveLeadReportView: React.FC<ComprehensiveLeadReportViewProps> = ({ leads, mediaList }) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Mock data for the graph connections
  const mockConnections = {
    sentSignals: [
      { id: 'S-101', date: '۱۴۰۵/۱۱/۰۵', media: 'پیامک صنعتی', campaign: 'جشنواره فجر پایدار', signal: 'اطلاع‌رسانی تخفیف تابلو برق', status: 'تحویل شده' },
      { id: 'S-102', date: '۱۴۰۵/۱۱/۱۲', media: 'ایمیل مارکتینگ', campaign: 'معرفی تابلوهای فشار متوسط', signal: 'ارسال کاتالوگ فنی', status: 'باز شده' },
    ],
    receivedSignals: [
      { id: 'R-201', date: '۱۴۰۵/۱۱/۰۷', media: 'وب‌سایت', campaign: 'جشنواره فجر پایدار', signal: 'ثبت فرم استعلام (RFQ)', sentiment: 'مثبت' },
      { id: 'R-202', date: '۱۴۰۵/۱۱/۱۵', media: 'تماس تلفنی', campaign: 'معرفی تابلوهای فشار متوسط', signal: 'درخواست جلسه فنی', sentiment: 'بسیار مشتاق' },
    ],
    opportunities: [
      { id: 'OPP-550', title: 'تجهیز پست برق واحد نورد', value: '۱۲,۵۰۰,۰۰۰,۰۰۰ ریال', prob: '۷۵٪', status: 'مذاکره فنی' },
    ],
    proformas: [
      { id: 'PRF-8821', date: '۱۴۰۵/۱۱/۱۸', total: '۱۲,۴۸۰,۰۰۰,۰۰۰ ریال', status: 'در انتظار تایید مشتری' },
    ],
    invoices: [
      { id: 'INV-3301', date: '---', total: '-', status: 'صادر نشده' },
    ]
  };

  const filteredLeads = leads.filter(l => 
    l.companyName.includes(searchTerm) || 
    l.contactPerson.includes(searchTerm) ||
    l.code.includes(searchTerm)
  );

  const StepCard = ({ icon: Icon, title, count, colorClass, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center shadow-lg border-2 border-white relative`}>
        <Icon className="w-7 h-7 text-white" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-slate-800 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold text-slate-600 text-center whitespace-nowrap">{title}</span>
    </motion.div>
  );

  const ConnectionLine = ({ delay }: { delay: number }) => (
    <motion.div 
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex-1 h-[2px] bg-slate-200 min-w-[20px] relative origin-right"
    >
      <div className="absolute right-full top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[6px] border-r-slate-300" />
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">گزارش جامع سرنخ (CRM Comprehensive Report)</h1>
            <p className="text-[11px] text-slate-500">تحلیل گراف اتصالات، سیگنال‌ها و چرخه عمر فروش در سطح ردیف هر سرنخ</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجوی سرنخ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Vertical List - One Row Per Lead */}
      <div className="flex flex-col gap-4">
        {filteredLeads.map(lead => {
          const isExpanded = selectedLeadId === lead.id;
          // Mock counters for the report
          const oppCount = Math.floor(Math.random() * 3) + 1;
          const profCount = Math.floor(Math.random() * 2) + 1;
          const invCount = Math.floor(Math.random() * 2);

          return (
            <div 
              key={lead.id}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-indigo-300 shadow-lg ring-1 ring-indigo-100' : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {/* Row Header / Summary */}
              <button 
                onClick={() => setSelectedLeadId(isExpanded ? '' : lead.id)}
                className="w-full p-4 flex flex-wrap items-center justify-between gap-4 text-right"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    isExpanded ? 'bg-indigo-100 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">{lead.companyName}</h3>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{lead.code}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1.5"><Radio className="w-3 h-3" /> {lead.contactPerson}</span>
                      <span className="w-px h-2.5 bg-slate-200" />
                      <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {lead.industry}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-50 rounded-lg px-3 py-1.5 flex flex-col items-center border border-amber-100 min-w-[60px]">
                      <span className="text-sm font-black text-amber-700 leading-none">{oppCount}</span>
                      <span className="text-[7px] text-amber-600 font-bold mt-0.5">فرصت منتظر</span>
                    </div>
                    <div className="bg-indigo-50 rounded-lg px-3 py-1.5 flex flex-col items-center border border-indigo-100 min-w-[60px]">
                      <span className="text-sm font-black text-indigo-700 leading-none">{profCount}</span>
                      <span className="text-[7px] text-indigo-600 font-bold mt-0.5">پ‌فاکتور منتظر</span>
                    </div>
                    <div className="bg-emerald-50 rounded-lg px-3 py-1.5 flex flex-col items-center border border-emerald-100 min-w-[60px]">
                      <span className="text-sm font-black text-emerald-700 leading-none">{invCount}</span>
                      <span className="text-[7px] text-emerald-600 font-bold mt-0.5">فاکتور منتظر</span>
                    </div>
                  </div>
                  <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`} />
                </div>
              </button>

              {/* Row Body / Reports (Visible when expanded) */}
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-6"
                >
                  {/* Connection Graph Visualization */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Share2 className="w-32 h-32 text-slate-900" />
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-xs mb-8 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-indigo-600" />
                      گراف چرخه عمر و اتصالات سرنخ
                    </h3>

                    <div className="flex items-center justify-between gap-1 max-w-full mx-auto overflow-x-auto pb-4 px-2">
                      <StepCard icon={Users} title="سرنخ" count={0} colorClass="bg-slate-700" delay={0.1} />
                      <ConnectionLine delay={0.2} />
                      
                      <div className="flex flex-col gap-4">
                        <StepCard icon={Send} title="سیگنال‌های ارسالی" count={2} colorClass="bg-blue-500" delay={0.3} />
                        <StepCard icon={Inbox} title="سیگنال‌های دریافتی" count={2} colorClass="bg-rose-500" delay={0.4} />
                      </div>
                      
                      <ConnectionLine delay={0.5} />
                      <StepCard icon={Target} title="فرصت‌های فروش" count={oppCount} colorClass="bg-amber-500" delay={0.6} />
                      
                      <ConnectionLine delay={0.65} />
                      <div className="flex flex-col gap-2">
                        <Circle className="w-2 h-2 text-blue-400 fill-current" />
                        <Circle className="w-2 h-2 text-rose-400 fill-current" />
                      </div>
                      <ConnectionLine delay={0.7} />

                      <StepCard icon={FileText} title="پیش‌فاکتور" count={profCount} colorClass="bg-indigo-500" delay={0.8} />

                      <ConnectionLine delay={0.85} />
                      <div className="flex flex-col gap-2">
                        <Circle className="w-2 h-2 text-blue-400 fill-current" />
                        <Circle className="w-2 h-2 text-rose-400 fill-current" />
                      </div>
                      <ConnectionLine delay={0.9} />

                      <StepCard icon={FileCheck} title="فاکتور نهایی" count={invCount} colorClass="bg-emerald-500" delay={1.0} />

                      <ConnectionLine delay={1.05} />
                      <div className="flex flex-col gap-2">
                        <Circle className="w-2 h-2 text-blue-400 fill-current" />
                        <Circle className="w-2 h-2 text-rose-400 fill-current" />
                      </div>
                      <ConnectionLine delay={1.1} />

                      <StepCard icon={FileSpreadsheet} title="تسویه حساب" count={0} colorClass="bg-slate-900" delay={1.2} />
                    </div>
                  </div>

                  {/* Tabbed Detailed Data */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Sent Signals Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-800 flex items-center gap-2">
                          <Send className="w-4 h-4" /> سیگنال‌های ارسالی به سرنخ
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-[10px]">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-2 font-bold">تاریخ</th>
                              <th className="px-3 py-2 font-bold">رسانه/کمپین</th>
                              <th className="px-3 py-2 font-bold">شرح سیگنال</th>
                              <th className="px-3 py-2 font-bold">وضعیت</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {mockConnections.sentSignals.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{s.date}</td>
                                <td className="px-3 py-2.5">
                                  <div className="font-bold text-slate-700">{s.media}</div>
                                  <div className="text-[9px] text-slate-400">{s.campaign}</div>
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">{s.signal}</td>
                                <td className="px-3 py-2.5">
                                  <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">{s.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Received Signals Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-3 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-800 flex items-center gap-2">
                          <Inbox className="w-4 h-4" /> سیگنال‌های دریافتی از سرنخ
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-[10px]">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-2 font-bold">تاریخ</th>
                              <th className="px-3 py-2 font-bold">رسانه/کمپین</th>
                              <th className="px-3 py-2 font-bold">شرح سیگنال</th>
                              <th className="px-3 py-2 font-bold">احساس</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {mockConnections.receivedSignals.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{s.date}</td>
                                <td className="px-3 py-2.5">
                                  <div className="font-bold text-slate-700">{s.media}</div>
                                  <div className="text-[9px] text-slate-400">{s.campaign}</div>
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">{s.signal}</td>
                                <td className="px-3 py-2.5">
                                  <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full font-medium">{s.sentiment}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Opportunities Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-800 flex items-center gap-2">
                          <Target className="w-4 h-4" /> فرصت‌های فروش مرتبط
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-[10px]">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-2 font-bold">شناسه</th>
                              <th className="px-3 py-2 font-bold">عنوان فرصت</th>
                              <th className="px-3 py-2 font-bold">ارزش تخمینی</th>
                              <th className="px-3 py-2 font-bold">وضعیت</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {mockConnections.opportunities.map((o, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2.5 font-mono text-slate-400">{o.id}</td>
                                <td className="px-3 py-2.5 font-bold text-slate-700">{o.title}</td>
                                <td className="px-3 py-2.5 text-amber-600 font-bold">{o.value}</td>
                                <td className="px-3 py-2.5">
                                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-medium border border-amber-100">{o.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Proformas & Invoices */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-800 flex items-center gap-2">
                          <FileCheck className="w-4 h-4" /> اسناد مالی (پیش‌فاکتور و فاکتور)
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-[10px]">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-2 font-bold">نوع</th>
                              <th className="px-3 py-2 font-bold">شناسه/تاریخ</th>
                              <th className="px-3 py-2 font-bold">مبلغ نهایی</th>
                              <th className="px-3 py-2 font-bold">وضعیت</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {mockConnections.proformas.map((p, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2.5 text-slate-600 font-bold">پیش‌فاکتور</td>
                                <td className="px-3 py-2.5">
                                  <div className="font-mono text-slate-700">{p.id}</div>
                                  <div className="text-[9px] text-slate-400">{p.date}</div>
                                </td>
                                <td className="px-3 py-2.5 font-bold text-slate-700">{p.total}</td>
                                <td className="px-3 py-2.5 text-indigo-600 font-bold">{p.status}</td>
                              </tr>
                            ))}
                            {mockConnections.invoices.map((i, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors bg-slate-50/30">
                                <td className="px-3 py-2.5 text-slate-400 font-bold">فاکتور نهایی</td>
                                <td className="px-3 py-2.5">
                                  <div className="font-mono text-slate-400">{i.id}</div>
                                  <div className="text-[9px] text-slate-300">{i.date}</div>
                                </td>
                                <td className="px-3 py-2.5 font-bold text-slate-400">{i.total}</td>
                                <td className="px-3 py-2.5 text-slate-300 font-bold">{i.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
