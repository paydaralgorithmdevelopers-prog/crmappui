import React, { useState } from 'react';
import { BarChart3, Calendar, Clock, Hash, CheckCircle, Target, FileDigit, Megaphone } from 'lucide-react';

interface CampaignMetricsHistoryViewProps {
  onBack: () => void;
}

// Mock Data for Campaigns
const MOCK_CAMPAIGNS = [
  { 
    id: 'CAMP-001', 
    title: 'کمپین فروش بهاره تابلو برق',
    startDate: '۱۴۰۳/۰۱/۰۱',
    endDate: '۱۴۰۳/۰۳/۳۱',
    targetValue: '500',
    unit: 'Lead',
    targetType: 'min',
    description: 'جذب لیدهای جدید از طریق نمایشگاه و دیجیتال مارکتینگ',
  },
  { 
    id: 'CAMP-002', 
    title: 'کمپین نمایشگاه بین‌المللی',
    startDate: '۱۴۰۳/۰۴/۰۱',
    endDate: '۱۴۰۳/۰۴/۱۵',
    targetValue: '2000',
    unit: 'Visitor',
    targetType: 'min',
    description: 'افزایش بازدیدکنندگان غرفه در نمایشگاه',
  },
  { 
    id: 'CAMP-003', 
    title: 'کمپین آگاهی از برند در لینکدین',
    startDate: '۱۴۰۳/۰۵/۰۱',
    endDate: '۱۴۰۳/۰۶/۳۱',
    targetValue: '10',
    unit: '%',
    targetType: 'min',
    description: 'افزایش نرخ تعامل (Engagement Rate)',
  }
];

export const CampaignMetricsHistoryView: React.FC<CampaignMetricsHistoryViewProps> = ({ onBack }) => {
  const [historyId] = useState(`CMH-${Math.floor(10000 + Math.random() * 90000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  
  const [campaignId, setCampaignId] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [description, setDescription] = useState('');

  const selectedCampaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampaignId(e.target.value);
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
            <h1 className="text-sm font-bold text-slate-800">ثبت سابقه اطلاعات کمپین</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت و به‌روزرسانی مقادیر تحقق‌یافته (KPI) برای کمپین‌ها</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 overflow-y-auto">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <FileDigit className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-xs text-slate-700">فرم ورود اطلاعات متریک کمپین</h2>
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

          {/* Row 2: Select Campaign */}
          <div className="bg-fuchsia-50/30 p-4 rounded-lg border border-fuchsia-100">
            <label className="block text-slate-700 font-semibold mb-1 text-fuchsia-700">
              انتخاب کمپین *
            </label>
            <select value={campaignId} onChange={handleCampaignChange} className="w-full md:w-2/3 bg-white border border-fuchsia-300 rounded-lg px-3 py-2 text-slate-800 focus:border-fuchsia-500 shadow-xs" required>
              <option value="">-- انتخاب کمپین --</option>
              {MOCK_CAMPAIGNS.map(c => (
                <option key={c.id} value={c.id}>{c.id} - {c.title}</option>
              ))}
            </select>
          </div>

          {/* Row 3: Read-only Connected Info */}
          {selectedCampaign && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1 flex items-center gap-1">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" /> توضیحات کمپین
                </label>
                <div className="font-bold text-slate-800 px-1 py-1">{selectedCampaign.description}</div>
              </div>
            </div>
          )}

          {/* Row 4: Metric Inputs */}
          {selectedCampaign && (
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
                    <span className="text-2xl font-mono font-bold text-sky-400">{selectedCampaign.targetValue}</span>
                    <span className="text-slate-400 mb-1">{selectedCampaign.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    شرط موفقیت: {selectedCampaign.targetType === 'min' ? 'حداقل' : selectedCampaign.targetType === 'max' ? 'حداکثر' : 'دقیقاً'} این مقدار
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
                      {selectedCampaign.unit}
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
            <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors">
              انصراف
            </button>
            <button type="submit" className="flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-5 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-fuchsia-600/30">
              <CheckCircle className="w-4 h-4" /> ثبت سابقه متریک
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
