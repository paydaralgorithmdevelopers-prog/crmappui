import React, { useState, useEffect } from 'react';
import { Send, Calendar, Clock, Activity, Target, Save, FileText, CheckCircle, Hash, History as HistoryIcon } from 'lucide-react';
import { initialPredefinedMedia } from '../../data/mediaData';

interface SendSignalViewProps {
  onBack: () => void;
}

// Mock Data
const MOCK_CAMPAIGNS = [
  {
    id: 'CAMP-001',
    title: 'کمپین فروش بهاره تابلو برق',
    mediaSelections: [
      { mediaId: 'MED-LNK-01', selectedSignalIds: ['sig-1', 'sig-2'] },
      { mediaId: 'MED-WEB-01', selectedSignalIds: ['sig-6'] }
    ]
  },
  {
    id: 'CAMP-002',
    title: 'کمپین نمایشگاه بین‌المللی',
    mediaSelections: [
      { mediaId: 'MED-EXPO-01', selectedSignalIds: ['sig-17', 'sig-18'] }
    ]
  }
];

const MOCK_AUDIENCES = [
  { id: 'AUD-01', name: 'شرکت پتروشیمی زاگرس', type: 'lead', inCamp1: true, inCamp2: false },
  { id: 'AUD-02', name: 'فولاد مبارکه اصفهان', type: 'lead', inCamp1: true, inCamp2: true },
  { id: 'AUD-03', name: 'پالایشگاه نفت پارس', type: 'lead', inCamp1: false, inCamp2: true },
  { id: 'AUD-04', name: 'شرکت توزیع برق تهران', type: 'lead', inCamp1: false, inCamp2: false },
  { id: 'GRP-01', name: 'گروه مدیران خرید پتروشیمی', type: 'group', inCamp1: true, inCamp2: false },
  { id: 'GRP-02', name: 'گروه پیمانکاران رتبه یک', type: 'group', inCamp1: false, inCamp2: true },
];

const MOCK_OPPORTUNITIES = [
  { id: 'OPP-101', audienceId: 'AUD-01', title: 'توسعه فاز ۳' },
  { id: 'OPP-102', audienceId: 'AUD-02', title: 'خرید تابلوهای ۲۰ کیلوولت' },
  { id: 'OPP-103', audienceId: 'AUD-01', title: 'تعویض تابلوهای قدیمی' },
];

const MOCK_PROFORMAS = [
  { id: 'PRF-5001', audienceId: 'AUD-01', oppId: 'OPP-101', title: 'پیش‌فاکتور ۵۰۰۱ (فاز ۳)' },
  { id: 'PRF-5002', audienceId: 'AUD-02', oppId: 'OPP-102', title: 'پیش‌فاکتور ۵۰۰۲ (۲۰ کیلوولت)' },
];

const MOCK_INVOICES = [
  { id: 'INV-9001', audienceId: 'AUD-01', prfId: 'PRF-5001', title: 'فاکتور قطعی ۹۰۰۱' },
];

const MOCK_INBOUND_SIGNALS = [
  { 
    id: 'INB-001', 
    title: 'پیام استعلام لینکدین', 
    campaignId: 'CAMP-001',
    mediaId: 'MED-LNK-01',
    signalId: 'sig-1',
    audienceId: 'AUD-01'
  },
];

// Mock for already sent signals under a campaign
const MOCK_ALREADY_SENT = [
  { campaignId: 'CAMP-001', mediaId: 'MED-LNK-01', signalId: 'sig-1' } // sig-1 is already sent for CAMP-001
];

export const SendSignalView: React.FC<SendSignalViewProps> = ({ onBack }) => {
  const [sendId, setSendId] = useState(`SND-${Math.floor(10000 + Math.random() * 90000)}`);
  
  // Form State
  const [inboundSignalId, setInboundSignalId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [signalId, setSignalId] = useState('');
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [audienceSelectValue, setAudienceSelectValue] = useState('');
  const [oppId, setOppId] = useState('');
  const [prfId, setPrfId] = useState('');
  const [invId, setInvId] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));

  // Handle Inbound Signal Selection
  const handleInboundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInboundSignalId(val);
    if (val) {
      const inb = MOCK_INBOUND_SIGNALS.find(s => s.id === val);
      if (inb) {
        setCampaignId(inb.campaignId);
        setMediaId(inb.mediaId);
        setSignalId(inb.signalId);
        setAudienceIds([inb.audienceId]);
      }
    }
  };

  // Derived Options Based on State
  let availableMedia = initialPredefinedMedia;
  if (campaignId) {
    const camp = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    if (camp) {
      availableMedia = initialPredefinedMedia.filter(m => 
        camp.mediaSelections.some(sel => sel.mediaId === m.id)
      );
    }
  }

  // Handle Media change manually
  const handleMediaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMediaId(e.target.value);
    setSignalId('');
  };

  const selectedMediaObj = initialPredefinedMedia.find(m => m.id === mediaId);
  let availableSignals = selectedMediaObj ? selectedMediaObj.signals : [];

  if (campaignId && mediaId) {
    const camp = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    const mediaSel = camp?.mediaSelections.find(sel => sel.mediaId === mediaId);
    if (mediaSel) {
      // Filter to only signals in campaign
      availableSignals = availableSignals.filter(s => mediaSel.selectedSignalIds.includes(s.id));
      
      // EXCLUDE already sent signals in this campaign program
      availableSignals = availableSignals.filter(s => {
        const isSent = MOCK_ALREADY_SENT.some(sent => 
          sent.campaignId === campaignId && 
          sent.mediaId === mediaId && 
          sent.signalId === s.id
        );
        return !isSent;
      });
    }
  }

  let availableAudiences = MOCK_AUDIENCES;
  if (campaignId === 'CAMP-001') availableAudiences = MOCK_AUDIENCES.filter(a => a.inCamp1);
  if (campaignId === 'CAMP-002') availableAudiences = MOCK_AUDIENCES.filter(a => a.inCamp2);

  let availableOpps = MOCK_OPPORTUNITIES.filter(o => audienceIds.length === 0 || audienceIds.includes(o.audienceId));
  let availablePrfs = MOCK_PROFORMAS.filter(p => audienceIds.length === 0 || audienceIds.includes(p.audienceId));
  if (oppId) availablePrfs = availablePrfs.filter(p => p.oppId === oppId);

  let availableInvs = MOCK_INVOICES.filter(i => audienceIds.length === 0 || audienceIds.includes(i.audienceId));
  if (prfId) availableInvs = availableInvs.filter(i => i.prfId === prfId);

  const selectedSignalObj = selectedMediaObj?.signals.find(s => s.id === signalId);

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">ثبت ارسال سیگنال</h1>
            <p className="text-xs text-slate-500 mt-0.5">ثبت عملیات ارسال سیگنال به همراه اطلاعات کمپین، رسانه، مخاطب و اسناد فروش</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex-1 overflow-y-auto">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-xs text-slate-700">فرم ثبت عملیات ارسال</h2>
        </div>

        <form className="p-4 space-y-6 text-xs">
          {/* Row 1: ID, Date, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/60 p-4 rounded-lg border border-slate-100">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-600" /> ID اتوماتیک ارسال
              </label>
              <input type="text" value={sendId} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono shadow-inner" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> تاریخ
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> ساعت
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500" />
            </div>
          </div>

          {/* Row 2: Inbound Signal & Campaign */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                انتخاب سیگنال ورودی (جهت تکمیل خودکار)
              </label>
              <select value={inboundSignalId} onChange={handleInboundChange} className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="">-- بدون سیگنال ورودی --</option>
                {MOCK_INBOUND_SIGNALS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">با انتخاب سیگنال ورودی، اطلاعات کمپین، رسانه و مخاطب می‌تواند خودکار پر شود.</p>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                انتخاب کمپین (اختیاری)
              </label>
              <select value={campaignId} onChange={(e) => { setCampaignId(e.target.value); setMediaId(''); setSignalId(''); setAudienceIds([]); setAudienceSelectValue(''); }} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500">
                <option value="">-- بدون کمپین --</option>
                {MOCK_CAMPAIGNS.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              {campaignId && <p className="text-[10px] text-blue-600 mt-1">انتخاب رسانه‌ها و مخاطبان به این کمپین محدود شد.</p>}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Row 3: Media & Signal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-rose-700">
                انتخاب رسانه *
              </label>
              <select value={mediaId} onChange={handleMediaChange} className="w-full bg-white border border-rose-300 rounded-lg px-3 py-2 text-slate-800 focus:border-rose-500 shadow-xs" required>
                <option value="">-- انتخاب کنید --</option>
                {availableMedia.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-rose-700">
                انتخاب سیگنال *
              </label>
              <select value={signalId} onChange={(e) => setSignalId(e.target.value)} disabled={!mediaId} className="w-full bg-white border border-rose-300 rounded-lg px-3 py-2 text-slate-800 focus:border-rose-500 shadow-xs disabled:opacity-50 disabled:bg-slate-100" required>
                <option value="">-- انتخاب کنید --</option>
                {availableSignals.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {campaignId && mediaId && availableSignals.length === 0 && (
                <p className="text-[10px] text-rose-600 mt-1 font-bold">تمام سیگنال‌های این رسانه در این کمپین قبلاً ارسال شده‌اند.</p>
              )}
            </div>
          </div>

          {/* Row 4: Audience */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              انتخاب مخاطبان (سرنخ‌ها و گروه‌های هدف) *
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <div className="w-full md:w-1/2 flex items-center gap-2">
                <select
                  value={audienceSelectValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !audienceIds.includes(val)) {
                      setAudienceIds([...audienceIds, val]);
                    }
                    setAudienceSelectValue('');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 shadow-xs"
                >
                  <option value="">-- افزودن مخاطب / گروه هدف --</option>
                  <optgroup label="گروه‌های هدف">
                    {availableAudiences.filter(a => a.type === 'group').map(a => (
                      <option key={a.id} value={a.id} disabled={audienceIds.includes(a.id)}>{a.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="سرنخ‌ها">
                    {availableAudiences.filter(a => a.type === 'lead').map(a => (
                      <option key={a.id} value={a.id} disabled={audienceIds.includes(a.id)}>{a.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="flex-1 w-full min-h-[42px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap gap-2">
                {audienceIds.length === 0 ? (
                  <span className="text-slate-400 text-xs py-1">مخاطبی انتخاب نشده است...</span>
                ) : (
                  audienceIds.map(id => {
                    const aud = MOCK_AUDIENCES.find(a => a.id === id);
                    return (
                      <div key={id} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-200">
                        {aud?.type === 'group' ? <span className="bg-indigo-600 text-white text-[9px] px-1 py-0.5 rounded">گروه</span> : <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.5 rounded">سرنخ</span>}
                        <span>{aud?.name}</span>
                        <button
                          type="button"
                          onClick={() => setAudienceIds(audienceIds.filter(aid => aid !== id))}
                          className="text-blue-600 hover:text-blue-800 bg-blue-200/50 hover:bg-blue-300 rounded-sm p-0.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <input type="hidden" required value={audienceIds.length > 0 ? 'valid' : ''} />
          </div>

          <hr className="border-slate-100" />

          {/* Row 5: Sales Documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-50/30 p-4 rounded-lg border border-emerald-100">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                انتخاب فرصت
              </label>
              <select value={oppId} onChange={(e) => { setOppId(e.target.value); setPrfId(''); setInvId(''); }} disabled={audienceIds.length === 0} className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500 disabled:opacity-50">
                <option value="">-- انتخاب کنید --</option>
                {availableOpps.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                انتخاب پیش‌فاکتور
              </label>
              <select value={prfId} onChange={(e) => { setPrfId(e.target.value); setInvId(''); }} disabled={audienceIds.length === 0} className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500 disabled:opacity-50">
                <option value="">-- انتخاب کنید --</option>
                {availablePrfs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                انتخاب فاکتور
              </label>
              <select value={invId} onChange={(e) => setInvId(e.target.value)} disabled={audienceIds.length === 0} className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500 disabled:opacity-50">
                <option value="">-- انتخاب کنید --</option>
                {availableInvs.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
              </select>
            </div>
          </div>

          {/* Signal Info Display */}
          {selectedSignalObj && (
            <div className="bg-slate-800 text-white p-4 rounded-lg shadow-inner flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  اطلاعات سیگنال انتخابی
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div><span className="text-slate-400">کد سیگنال:</span> {selectedSignalObj.code}</div>
                  <div><span className="text-slate-400">واحد سنجش:</span> {selectedSignalObj.unit}</div>
                  <div><span className="text-slate-400">نوع اطلاعات:</span> {selectedSignalObj.metricType === 'rate' ? 'ریت' : 'متریک'}</div>
                  <div><span className="text-slate-400">وزن:</span> {selectedSignalObj.weight}</div>
                </div>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center shrink-0 min-w-[120px]">
                <div className="text-slate-400 text-[10px] mb-1">تارگت مورد انتظار</div>
                <div className="font-mono text-xl font-bold text-emerald-400">{selectedSignalObj.targetValue}</div>
                <div className="text-[10px] text-slate-400 mt-1">({selectedSignalObj.targetType})</div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors">
              انصراف
            </button>
            <button type="button" onClick={() => alert('ارسال سیگنال با موفقیت ثبت شد.')} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-blue-600/30">
              <CheckCircle className="w-4 h-4" /> ثبت ارسال سیگنال
            </button>
          </div>
        </form>

        {/* History of Recorded Records Section */}
        <div className="border-t border-slate-200 mt-2">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-xs text-slate-700">فهرست سوابق ثبت شده (بر اساس تاریخ)</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">نمایش ۱۰ مورد اخیر</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[11px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 font-bold">شناسه ارسال</th>
                  <th className="px-4 py-2 font-bold">تاریخ و زمان</th>
                  <th className="px-4 py-2 font-bold">مخاطبان</th>
                  <th className="px-4 py-2 font-bold">رسانه و سیگنال</th>
                  <th className="px-4 py-2 font-bold">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'SND-8821', date: '۱۴۰۵/۱۱/۲۰', time: '۰۹:۳۰', audience: 'پتروشیمی زاگرس + ۱ گروه', media: 'لینکدین', signal: 'تعامل', status: 'ارسال شده' },
                  { id: 'SND-8819', date: '۱۴۰۵/۱۱/۱۹', time: '۱۱:۱۵', audience: 'فولاد مبارکه', media: 'پیامک', signal: 'دلیوری', status: 'در صف ارسال' },
                  { id: 'SND-8815', date: '۱۴۰۵/۱۱/۱۸', time: '۱۶:۴۵', audience: 'توزیع برق تهران', media: 'وب‌سایت', signal: 'بازدید', status: 'ارسال شده' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-slate-600">{row.id}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-slate-800">{row.date}</span>
                        <span className="text-slate-400 text-[10px]">{row.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-700">{row.audience}</td>
                    <td className="px-4 py-2.5">
                       <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">{row.media}</span>
                        <span className="text-[10px] text-slate-400">{row.signal}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        row.status === 'ارسال شده' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {MOCK_CAMPAIGNS.length === 0 && (
            <div className="py-8 text-center text-slate-400 italic">سابقه‌ای برای ارسال‌های این سیگنال یافت نشد.</div>
          )}
        </div>
      </div>
    </div>
  );
};
