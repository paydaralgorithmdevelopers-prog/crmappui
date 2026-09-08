import React, { useState } from 'react';
import { Download, Calendar, Clock, Activity, Save, FileText, CheckCircle, Hash, Briefcase, Radio, Megaphone, Users } from 'lucide-react';
import { initialPredefinedMedia } from '../../data/mediaData';

interface ReceiveSignalViewProps {
  onBack: () => void;
}

// Mock Data for Sent Signals
const MOCK_SENT_SIGNALS = [
  { 
    id: 'SND-10045', 
    title: 'ارسال ایمیل خبرنامه بهاره', 
    campaignId: 'CAMP-001', 
    campaignTitle: 'کمپین فروش بهاره تابلو برق',
    mediaId: 'MED-WEB-01', 
    mediaTitle: 'پورتال جامع سازمانی و سامانه استعلام قیمت آنلاین',
    signalId: 'sig-6', 
    signalName: 'بازدیدکنندگان یکتای صنعتی (Unique Visitors)',
    audienceIds: ['AUD-01', 'GRP-01'],
    audiences: [
      { id: 'AUD-01', name: 'شرکت پتروشیمی زاگرس', type: 'lead' },
      { id: 'GRP-01', name: 'گروه مدیران خرید پتروشیمی', type: 'group' }
    ]
  },
  { 
    id: 'SND-20098', 
    title: 'ارسال پیامک نمایشگاه بین‌المللی', 
    campaignId: 'CAMP-002', 
    campaignTitle: 'کمپین نمایشگاه بین‌المللی',
    mediaId: 'MED-SMS-01', 
    mediaTitle: 'سامانه پیامک اطلاع‌رسانی مناقصات و استعلام به وندورها',
    signalId: 'sig-14', 
    signalName: 'نرخ تحویل پیامک به مدیران پروژه (Delivery Rate)',
    audienceIds: ['AUD-02', 'AUD-03'],
    audiences: [
      { id: 'AUD-02', name: 'فولاد مبارکه اصفهان', type: 'lead' },
      { id: 'AUD-03', name: 'پالایشگاه نفت پارس', type: 'lead' }
    ]
  },
  { 
    id: 'SND-30122', 
    title: 'ارسال سیگنال مستقیم لینکدین', 
    campaignId: '', 
    campaignTitle: 'ندارد',
    mediaId: 'MED-LNK-01', 
    mediaTitle: 'صفحه لینکدین B2B شرکت',
    signalId: 'sig-1', 
    signalName: 'نرخ تعامل (Engagement Rate)',
    audienceIds: ['AUD-04'],
    audiences: [
      { id: 'AUD-04', name: 'شرکت توزیع برق تهران', type: 'lead' }
    ]
  }
];

export const ReceiveSignalView: React.FC<ReceiveSignalViewProps> = ({ onBack }) => {
  const [receiveId, setReceiveId] = useState(`REC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  
  const [sentSignalId, setSentSignalId] = useState('');
  const [selectedAudienceId, setSelectedAudienceId] = useState('');

  const selectedSentSignal = MOCK_SENT_SIGNALS.find(s => s.id === sentSignalId);
  const mediaObj = selectedSentSignal ? initialPredefinedMedia.find(m => m.id === selectedSentSignal.mediaId) : null;
  const signalObj = mediaObj ? mediaObj.signals.find(s => s.id === selectedSentSignal?.signalId) : null;

  const handleSentSignalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSentSignalId(e.target.value);
    setSelectedAudienceId('');
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">ثبت دریافت سیگنال</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت بازخورد و سیگنال‌های دریافتی از مخاطبان در پاسخ به سیگنال‌های ارسالی</p>
          </div>
        </div>
        <button type="button" onClick={() => alert('فرم ایجاد فرصت باز شد.')} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
          <Briefcase className="w-3.5 h-3.5" />
          <span>ایجاد فرصت</span>
        </button>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 overflow-y-auto">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-xs text-slate-700">فرم ثبت عملیات دریافت</h2>
          </div>
        </div>

        <form className="p-4 space-y-6 text-xs">
          {/* Row 1: ID, Date, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/60 p-4 rounded-lg border border-slate-100">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-teal-600" /> ID اتوماتیک دریافت
              </label>
              <input type="text" value={receiveId} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono shadow-inner" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> تاریخ
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> ساعت
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-teal-500" />
            </div>
          </div>

          {/* Row 2: Select Sent Signal */}
          <div className="bg-teal-50/30 p-4 rounded-lg border border-teal-100">
            <label className="block text-slate-700 font-semibold mb-1 text-teal-700">
              انتخاب سیگنال ارسال شده (منبع دریافت) *
            </label>
            <select value={sentSignalId} onChange={handleSentSignalChange} className="w-full md:w-2/3 bg-white border border-teal-300 rounded-lg px-3 py-2 text-slate-800 focus:border-teal-500 shadow-xs" required>
              <option value="">-- انتخاب سیگنال ارسالی --</option>
              {MOCK_SENT_SIGNALS.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.title} ({s.campaignTitle})</option>
              ))}
            </select>
          </div>

          {/* Row 3: Read-only Connected Info */}
          {selectedSentSignal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1 flex items-center gap-1">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" /> کمپین مرتبط
                </label>
                <div className="font-bold text-slate-800 px-1 py-1">{selectedSentSignal.campaignTitle}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-slate-400" /> رسانه مرتبط
                </label>
                <div className="font-bold text-slate-800 px-1 py-1">{selectedSentSignal.mediaTitle}</div>
              </div>
            </div>
          )}

          {/* Row 4: Select Audience from the sent signal */}
          {selectedSentSignal && (
            <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-blue-700">
                <Users className="w-3.5 h-3.5" /> انتخاب مخاطب (گیرنده سیگنال) *
              </label>
              <select value={selectedAudienceId} onChange={(e) => setSelectedAudienceId(e.target.value)} className="w-full md:w-1/2 bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 shadow-xs" required>
                <option value="">-- انتخاب مخاطب مورد نظر --</option>
                {selectedSentSignal.audiences.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.type === 'group' ? 'گروه هدف' : 'سرنخ'})</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">فقط مخاطبانی که سیگنال اصلی به آن‌ها ارسال شده قابل انتخاب هستند.</p>
            </div>
          )}

          {/* Row 5: Signal Info Display */}
          {selectedSentSignal && signalObj && (
            <div className="bg-slate-800 text-white p-4 rounded-lg shadow-inner flex flex-col md:flex-row items-center gap-6 mt-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  اطلاعات سیگنال ارسالی مرتبط
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div><span className="text-slate-400">نام سیگنال:</span> {selectedSentSignal.signalName}</div>
                  <div><span className="text-slate-400">کد سیگنال:</span> {signalObj.code}</div>
                  <div><span className="text-slate-400">واحد سنجش:</span> {signalObj.unit}</div>
                  <div><span className="text-slate-400">وزن:</span> {signalObj.weight}</div>
                </div>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center shrink-0 min-w-[120px]">
                <div className="text-slate-400 text-[10px] mb-1">تارگت مورد انتظار</div>
                <div className="font-mono text-xl font-bold text-emerald-400">{signalObj.targetValue}</div>
                <div className="text-[10px] text-slate-400 mt-1">({signalObj.targetType})</div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors">
              انصراف
            </button>
            <button type="button" onClick={() => alert('دریافت سیگنال با موفقیت ثبت شد.')} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-teal-600/30">
              <CheckCircle className="w-4 h-4" /> ثبت دریافت سیگنال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
