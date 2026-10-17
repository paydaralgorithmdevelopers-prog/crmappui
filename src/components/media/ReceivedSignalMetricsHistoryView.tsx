import React, { useState } from 'react';
import { BarChart3, Calendar, Clock, Hash, Megaphone, Radio, Save, FileText, CheckCircle, Target, FileDigit, History as HistoryIcon } from 'lucide-react';
import { initialPredefinedMedia } from '../../data/mediaData';

interface ReceivedSignalMetricsHistoryViewProps {
  onBack: () => void;
}

// Mock Data for Received Signals (Inbound)
const MOCK_RECEIVED_SIGNALS = [
  { 
    id: 'RCV-10045', 
    title: 'بازدید از لندینگ پیج بهاره', 
    campaignId: 'CAMP-001', 
    campaignTitle: 'کمپین فروش بهاره تابلو برق',
    mediaId: 'MED-WEB-01', 
    mediaTitle: 'پورتال جامع سازمانی و سامانه استعلام قیمت آنلاین',
    signalId: 'sig-6', 
    signalName: 'بازدیدکنندگان یکتای صنعتی (Unique Visitors)',
  },
  { 
    id: 'RCV-20098', 
    title: 'تماس تلفنی مشتریان از نمایشگاه', 
    campaignId: 'CAMP-002', 
    campaignTitle: 'کمپین نمایشگاه بین‌المللی',
    mediaId: 'MED-SMS-01', 
    mediaTitle: 'سامانه پیامک اطلاع‌رسانی مناقصات و استعلام به وندورها',
    signalId: 'sig-14', 
    signalName: 'نرخ کلیک روی لینک پیامک (CTR)',
  },
  { 
    id: 'RCV-30122', 
    title: 'ثبت نام در وبینار', 
    campaignId: '', 
    campaignTitle: 'ندارد',
    mediaId: 'MED-LNK-01', 
    mediaTitle: 'صفحه لینکدین B2B شرکت',
    signalId: 'sig-1', 
    signalName: 'نرخ تبدیل (Conversion Rate)',
  }
];

export const ReceivedSignalMetricsHistoryView: React.FC<ReceivedSignalMetricsHistoryViewProps> = ({ onBack }) => {
  const [historyId] = useState(`RSMH-${Math.floor(10000 + Math.random() * 90000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  
  const [receivedSignalId, setReceivedSignalId] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [description, setDescription] = useState('');

  const selectedReceivedSignal = MOCK_RECEIVED_SIGNALS.find(s => s.id === receivedSignalId);
  const mediaObj = selectedReceivedSignal ? initialPredefinedMedia.find(m => m.id === selectedReceivedSignal.mediaId) : null;
  const signalObj = mediaObj ? mediaObj.signals.find(s => s.id === selectedReceivedSignal?.signalId) : null;

  const handleReceivedSignalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReceivedSignalId(e.target.value);
    setMetricValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('سابقه متریک با موفقیت ثبت شد.');
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">ثبت سابقه اطلاعات و متریک سیگنال دریافتی</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت و به‌روزرسانی مقادیر تحقق‌یافته (KPI) برای سیگنال‌های ورودی</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 overflow-y-auto">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <FileDigit className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-xs text-slate-700">فرم ورود اطلاعات متریک</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 text-xs">
          {/* Row 1: ID, Date, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/60 p-4 rounded-lg border border-slate-100">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-fuchsia-600" /> ID اتوماتیک
              </label>
              <input type="text" value={historyId} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono shadow-inner" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-fuchsia-600" /> تاریخ ثبت
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-fuchsia-500" required />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-fuchsia-600" /> ساعت ثبت
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-fuchsia-500" required />
            </div>
          </div>

          {/* Row 2: Select Inbound Signal */}
          <div className="bg-fuchsia-50/30 p-4 rounded-lg border border-fuchsia-100">
            <label className="block text-slate-700 font-semibold mb-1 text-fuchsia-700">
              انتخاب سیگنال ورودی (جهت سینک شدن) *
            </label>
            <select value={receivedSignalId} onChange={handleReceivedSignalChange} className="w-full md:w-2/3 bg-white border border-fuchsia-300 rounded-lg px-3 py-2 text-slate-800 focus:border-fuchsia-500 shadow-xs" required>
              <option value="">-- انتخاب سیگنال دریافتی (ورودی) --</option>
              {MOCK_RECEIVED_SIGNALS.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.title} (سیگنال: {s.signalName})</option>
              ))}
            </select>
          </div>

          {/* Row 3: Read-only Connected Info */}
          {selectedReceivedSignal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1 flex items-center gap-1">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" /> کمپین مرتبط
                </label>
                <div className="font-bold text-slate-800 px-1 py-1">{selectedReceivedSignal.campaignTitle}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-slate-400" /> رسانه مرتبط
                </label>
                <div className="font-bold text-slate-800 px-1 py-1">{selectedReceivedSignal.mediaTitle}</div>
              </div>
            </div>
          )}

          {/* Row 4: Metric Inputs */}
          {selectedReceivedSignal && signalObj && (
            <div className="bg-slate-800 p-4 rounded-lg shadow-inner">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-400" />
                درج اطلاعات و متریک (KPI)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expected Target Info */}
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                  <div className="text-slate-300 mb-2 font-semibold">تارگت تعریف شده (OKR):</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-mono font-bold text-sky-400">{signalObj.targetValue}</span>
                    <span className="text-slate-400 mb-1">{signalObj.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    شرط موفقیت: {signalObj.targetType === 'min' ? 'حداقل' : signalObj.targetType === 'max' ? 'حداکثر' : 'دقیقاً'} این مقدار
                  </div>
                </div>

                {/* Actual Input */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    مقدار تحقق یافته (KPI) *
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={metricValue}
                      onChange={(e) => setMetricValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-3 pr-16 py-2.5 text-white font-mono text-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
                      required 
                      placeholder="0"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                      {signalObj.unit}
                    </div>
                  </div>
                </div>

                {/* Extra Details */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    توضیحات و اطلاعات تکمیلی
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors h-24 resize-none"
                    placeholder="تحلیل وضعیت، دلایل انحراف از تارگت یا توضیحات بیشتر..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="submit" className="flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-5 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-fuchsia-600/30">
              <CheckCircle className="w-4 h-4" /> ثبت سابقه متریک
            </button>
          </div>
        </form>

        {/* History Table - Redesigned to show recorded logs */}
        <div className="mt-8 border-t border-slate-200">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-fuchsia-600" />
              <h2 className="font-bold text-xs text-slate-700">فهرست سوابق ثبت شده (بر اساس تاریخ)</h2>
            </div>
            <div className="text-[10px] text-slate-400 font-bold">آخرین بروزرسانی: امروز</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">تاریخ و ساعت</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">شناسه سیگنال</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">عنوان سیگنال</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">مقدار (KPI)</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">هدف (OKR)</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">انحراف</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">توضیحات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { date: '۱۴۰۳/۰۶/۱۵', time: '۱۱:۰۰', id: 'RCV-10045', name: 'لندینگ پیج بهاره', kpi: 120, okr: 100, unit: 'نفر', desc: 'تحقق بالاتر از هدف به دلیل تبلیغات متمرکز.' },
                  { date: '۱۴۰۳/۰۶/۱۰', time: '۰۹:۴۵', id: 'RCV-20098', name: 'تماس از نمایشگاه', kpi: 45, okr: 50, unit: 'عدد', desc: 'تعداد تماس‌ها نزدیک به هدف بود.' },
                  { date: '۱۴۰۳/۰۶/۰۵', time: '۱۶:۳۰', id: 'RCV-30122', name: 'ثبت نام وبینار', kpi: 18, okr: 30, unit: 'نفر', desc: 'نیاز به یادآوری مجدد در شبکه‌های اجتماعی.' }
                ].map((row, idx) => {
                  const deviation = ((row.kpi - row.okr) / row.okr) * 100;
                  const isPositive = deviation >= 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{row.date}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{row.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{row.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold">{row.kpi} {row.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.okr} {row.unit}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {isPositive ? '+' : ''}{deviation.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-500 italic max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                        {row.desc}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
