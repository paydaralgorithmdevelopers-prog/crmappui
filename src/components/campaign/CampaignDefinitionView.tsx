import React, { useState } from 'react';
import { Megaphone, Settings, Save, Plus, Trash2, Target, TrendingUp, Radio, Activity, ChevronDown, Sparkles } from 'lucide-react';
import { Campaign, CampaignMetric, CampaignMediaSelection } from '../../types';
import { initialPredefinedMedia } from '../../data/mediaData';

interface CampaignDefinitionViewProps {
  onBack: () => void;
}

export const CampaignDefinitionView: React.FC<CampaignDefinitionViewProps> = ({ onBack }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'CAMP-001',
      title: 'کمپین فروش بهاره تابلو برق',
      startDate: '۱۴۰۳/۰۱/۰۱',
      endDate: '۱۴۰۳/۰۳/۳۱',
      status: 'draft',
      metrics: [
        {
          id: 'cm-1',
          name: 'تعداد سرنخ فروش (CPL)',
          unit: 'سرنخ',
          targetType: 'min',
          targetValue: 500,
          metricType: 'metric',
          isActive: true,
        },
        {
          id: 'cm-2',
          name: 'نرخ تبدیل فروش (CVR)',
          unit: 'درصد (%)',
          targetType: 'min',
          targetValue: 5,
          metricType: 'rate',
          isActive: true,
        }
      ],
      mediaSelections: []
    }
  ]);

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0].id);
  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const updateCurrentCampaign = (updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === currentCampaign.id ? { ...c, ...updates } : c));
  };

  const isDateInRange = (date: string, start: string, end: string) => {
    // Simple string comparison for Persian dates (YYYY/MM/DD format assumed)
    return date >= start && date <= end;
  };

  const handleUpdateMetric = (id: string, key: keyof CampaignMetric, value: any) => {
    const newMetrics = currentCampaign.metrics.map(m => m.id === id ? { ...m, [key]: value } : m);
    updateCurrentCampaign({ metrics: newMetrics });
  };

  const [selectedMediaToAdd, setSelectedMediaToAdd] = useState('');
  
  const unaddedMedia = initialPredefinedMedia.filter(
    m => !currentCampaign.mediaSelections.some(sel => sel.mediaId === m.id)
  );

  const handleAddMedia = () => {
    if (!selectedMediaToAdd) return;
    const newSelection: CampaignMediaSelection = {
      mediaId: selectedMediaToAdd,
      signals: []
    };
    updateCurrentCampaign({
      mediaSelections: [...currentCampaign.mediaSelections, newSelection]
    });
    setSelectedMediaToAdd('');
  };

  const handleDeleteMedia = (mediaId: string) => {
    updateCurrentCampaign({
      mediaSelections: currentCampaign.mediaSelections.filter(m => m.mediaId !== mediaId)
    });
  };

  const handleAddSignalToMedia = (mediaId: string, signalId: string) => {
    if (!signalId) return;
    const newSelections = currentCampaign.mediaSelections.map(sel => {
      if (sel.mediaId === mediaId) {
        if (!sel.signals.some(s => s.signalId === signalId)) {
          return { 
            ...sel, 
            signals: [...sel.signals, { signalId, startDate: currentCampaign.startDate }] 
          };
        }
      }
      return sel;
    });
    updateCurrentCampaign({ mediaSelections: newSelections });
  };

  const handleUpdateSignalDate = (mediaId: string, signalId: string, date: string) => {
    const newSelections = currentCampaign.mediaSelections.map(sel => {
      if (sel.mediaId === mediaId) {
        return {
          ...sel,
          signals: sel.signals.map(s => s.signalId === signalId ? { ...s, startDate: date } : s)
        };
      }
      return sel;
    });
    updateCurrentCampaign({ mediaSelections: newSelections });
  };

  const handleDeleteSignalFromMedia = (mediaId: string, signalId: string) => {
    const newSelections = currentCampaign.mediaSelections.map(sel => {
      if (sel.mediaId === mediaId) {
        return { ...sel, signals: sel.signals.filter(s => s.signalId !== signalId) };
      }
      return sel;
    });
    updateCurrentCampaign({ mediaSelections: newSelections });
  };

  const handleCreateCampaign = () => {
    const newCamp: Campaign = {
      id: `CAMP-${Math.floor(100 + Math.random() * 900)}`,
      title: 'کمپین جدید',
      startDate: '۱۴۰۳/۰۱/۰۱',
      endDate: '۱۴۰۳/۱۲/۲۹',
      status: 'draft',
      metrics: [],
      mediaSelections: []
    };
    setCampaigns([...campaigns, newCamp]);
    setSelectedCampaignId(newCamp.id);
  };

  const renderMetricsTable = (items: CampaignMetric[], typeLabel: string) => (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <th className="p-2.5 text-center w-10">فعال</th>
            <th className="p-2.5 min-w-[150px]">نام {typeLabel}</th>
            <th className="p-2.5 w-28 text-center">نوع مقایسه</th>
            <th className="p-2.5 w-32 text-center bg-rose-50/40 text-rose-900 font-bold">تارگت (OKR)</th>
            <th className="p-2.5 w-24 text-center">واحد سنجش</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map(m => (
            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-2 text-center">
                <input type="checkbox" checked={m.isActive} onChange={(e) => handleUpdateMetric(m.id, 'isActive', e.target.checked)} className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer" />
              </td>
              <td className="p-2">
                <input type="text" value={m.name} onChange={(e) => handleUpdateMetric(m.id, 'name', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:border-indigo-400" />
              </td>
              <td className="p-2 text-center">
                <select value={m.targetType} onChange={(e) => handleUpdateMetric(m.id, 'targetType', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700 focus:border-indigo-400">
                  <option value="min">حداقل (≥)</option>
                  <option value="max">حداکثر (≤)</option>
                  <option value="exact">دقیق (=)</option>
                </select>
              </td>
              <td className="p-2 text-center bg-rose-50/20">
                <input type="number" value={m.targetValue} onChange={(e) => handleUpdateMetric(m.id, 'targetValue', Number(e.target.value))} className="w-full font-mono font-bold text-center bg-white border border-rose-300 rounded px-2 py-1.5 text-slate-900 shadow-sm focus:border-rose-500" />
              </td>
              <td className="p-2 text-center">
                <input type="text" value={m.unit} onChange={(e) => handleUpdateMetric(m.id, 'unit', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 text-center focus:border-indigo-400" />
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">موردی یافت نشد.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">تعریف کمپین</h1>
            <p className="text-xs text-slate-500 mt-0.5">مدیریت کمپین‌ها، متریک‌ها، رسانه‌ها و سیگنال‌های زیرمجموعه (بدون تکرار)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCreateCampaign}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ایجاد کمپین جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start flex-1 overflow-hidden">
        {/* Sidebar: List of Campaigns */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="px-3.5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>کمپین‌های تعریف شده</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
              {campaigns.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {campaigns.map(camp => (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer text-right relative ${
                  camp.id === selectedCampaignId ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40 shadow-xs' : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-bold text-xs text-slate-800 truncate mb-1">{camp.title}</div>
                <div className="font-mono text-[9px] text-slate-500">{camp.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Edit Campaign */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-xs text-slate-700">ویرایش کمپین</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
              {/* Campaign Definition Fields */}
            <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-slate-700 border-b border-slate-200/70 pb-2 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-emerald-600" /> تعریف کمپین
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">عنوان کمپین</label>
                  <input 
                    type="text" 
                    value={currentCampaign.title} 
                    onChange={(e) => updateCurrentCampaign({ title: e.target.value })} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500" 
                    placeholder="مثال: کمپین تابستانه ۱۴۰۳"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">انتخاب گروه هدف</label>
                  <select 
                    value={currentCampaign.targetGroupId || ''} 
                    onChange={(e) => updateCurrentCampaign({ targetGroupId: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500"
                  >
                    <option value="">-- انتخاب گروه هدف --</option>
                    <option value="g1">صنایع فولاد و متالورژی</option>
                    <option value="g2">پیمانکاران تاسیسات</option>
                    <option value="g3">مجتمع‌های پتروشیمی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شعار کمپین</label>
                  <input 
                    type="text" 
                    value={currentCampaign.slogan || ''} 
                    onChange={(e) => updateCurrentCampaign({ slogan: e.target.value })} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500" 
                    placeholder="شعار تبلیغاتی کمپین"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">هدف کمپین</label>
                  <input 
                    type="text" 
                    value={currentCampaign.goal || ''} 
                    onChange={(e) => updateCurrentCampaign({ goal: e.target.value })} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500" 
                    placeholder="هدف اصلی (مثلاً افزایش فروش ۵۰٪)"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">بودجه (ریال)</label>
                  <input 
                    type="number" 
                    value={currentCampaign.budget || ''} 
                    onChange={(e) => updateCurrentCampaign({ budget: Number(e.target.value) })} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500 font-mono" 
                    placeholder="مبلغ کل بودجه"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-[11px]">تاریخ شروع</label>
                    <input type="text" value={currentCampaign.startDate} placeholder="۱۴۰۳/۰۱/۰۱" onChange={(e) => updateCurrentCampaign({ startDate: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-slate-800 focus:border-emerald-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-[11px]">تاریخ پایان</label>
                    <input type="text" value={currentCampaign.endDate} placeholder="۱۴۰۳/۰۳/۳۱" onChange={(e) => updateCurrentCampaign({ endDate: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-slate-800 focus:border-emerald-500 font-mono" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">دستورالعمل اجرایی</label>
                  <textarea 
                    value={currentCampaign.instructions || ''} 
                    onChange={(e) => updateCurrentCampaign({ instructions: e.target.value })} 
                    rows={4}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-emerald-500 text-xs leading-relaxed" 
                    placeholder="توضیحات و دستورالعمل‌های مربوط به اجرای کمپین..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">آپلود فایل‌های پیوستی</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer group">
                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-colors mb-2" />
                    <span className="text-slate-400 text-[10px]">برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</span>
                    <input type="file" className="hidden" />
                  </div>
                  
                  {/* File List Mockup */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between bg-emerald-50 px-2 py-1 rounded text-[10px] text-emerald-800 border border-emerald-100">
                      <span>Proposal_V1.pdf</span>
                      <Trash2 className="w-3 h-3 cursor-pointer text-rose-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="px-3 py-2.5 bg-gradient-to-l from-slate-50 to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-indigo-600" /> متریک کمپین</h3>
              </div>
              {renderMetricsTable(currentCampaign.metrics.filter(m => m.metricType === 'metric'), 'متریک')}
            </div>

            {/* Campaign Rates */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="px-3 py-2.5 bg-gradient-to-l from-slate-50 to-amber-50/40 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-600" /> ریت کمپین</h3>
              </div>
              {renderMetricsTable(currentCampaign.metrics.filter(m => m.metricType === 'rate'), 'ریت')}
            </div>

            {/* Assigned Media & Signals */}
            <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-600" /> رسانه‌ها و سیگنال‌های تحت پوشش کمپین
                </h3>
                <div className="flex items-center gap-2">
                  <select value={selectedMediaToAdd} onChange={(e) => setSelectedMediaToAdd(e.target.value)} className="bg-white border border-slate-300 rounded px-2 py-1 text-xs">
                    <option value="">-- انتخاب رسانه جدید --</option>
                    {unaddedMedia.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  <button type="button" onClick={handleAddMedia} disabled={!selectedMediaToAdd} className="bg-rose-600 text-white disabled:opacity-50 px-2.5 py-1 rounded text-xs font-bold shadow-sm">افزودن رسانه</button>
                </div>
              </div>

              {currentCampaign.mediaSelections.length === 0 ? (
                <div className="text-center text-slate-400 py-4">هیچ رسانه‌ای به این کمپین اختصاص نیافته است.</div>
              ) : (
                <div className="space-y-3">
                  {currentCampaign.mediaSelections.map(sel => {
                    const mediaObj = initialPredefinedMedia.find(m => m.id === sel.mediaId);
                    if (!mediaObj) return null;
                    const unaddedSignals = mediaObj.signals.filter(s => !sel.signals.some(ss => ss.signalId === s.id));
                    
                    return (
                      <div key={sel.mediaId} className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                        <div className="bg-rose-50/30 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-rose-500" /> {mediaObj.title}
                          </div>
                          <button onClick={() => handleDeleteMedia(sel.mediaId)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                        </div>
                        <div className="p-3">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[10px] font-semibold text-slate-600">سیگنال‌های این رسانه:</span>
                            <select id={`sig-sel-${sel.mediaId}`} className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs flex-1 max-w-xs">
                              <option value="">-- افزودن سیگنال --</option>
                              {unaddedSignals.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <button 
                              type="button" 
                              onClick={() => {
                                const selEl = document.getElementById(`sig-sel-${sel.mediaId}`) as HTMLSelectElement;
                                if (selEl && selEl.value) {
                                  handleAddSignalToMedia(sel.mediaId, selEl.value);
                                  selEl.value = '';
                                }
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-[10px] font-bold"
                            >
                              افزودن سیگنال
                            </button>
                          </div>
                          
                          {sel.signals.length > 0 ? (
                            <div className="space-y-2">
                              {sel.signals.map(signalSel => {
                                const sigObj = mediaObj.signals.find(s => s.id === signalSel.signalId);
                                if (!sigObj) return null;
                                const isInvalidDate = !isDateInRange(signalSel.startDate, currentCampaign.startDate, currentCampaign.endDate);

                                return (
                                  <div key={signalSel.signalId} className={`flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg border transition-all ${isInvalidDate ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                      <Activity className={`w-3.5 h-3.5 ${isInvalidDate ? 'text-rose-500' : 'text-slate-400'}`} />
                                      <span className={`font-bold text-xs ${isInvalidDate ? 'text-rose-900' : 'text-slate-700'}`}>{sigObj.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                      <label className="text-[10px] text-slate-500 whitespace-nowrap">تاریخ شروع سیگنال:</label>
                                      <input 
                                        type="text" 
                                        value={signalSel.startDate}
                                        placeholder="۱۴۰۳/۰۱/۰۱"
                                        onChange={(e) => handleUpdateSignalDate(sel.mediaId, signalSel.signalId, e.target.value)}
                                        className={`flex-1 bg-white border rounded px-2 py-1 text-[11px] font-mono ${isInvalidDate ? 'border-rose-400 focus:border-rose-600 text-rose-800' : 'border-slate-300 focus:border-indigo-500 text-slate-800'}`}
                                      />
                                      {isInvalidDate && (
                                        <span className="text-[9px] text-rose-600 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200 animate-pulse">
                                          خارج از بازه کمپین!
                                        </span>
                                      )}
                                    </div>

                                    <button onClick={() => handleDeleteSignalFromMedia(sel.mediaId, signalSel.signalId)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400">هیچ سیگنالی افزوده نشده است.</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button type="button" onClick={() => alert('تغییرات کمپین با موفقیت ذخیره شد.')} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
                <Save className="w-4 h-4" /> ذخیره اطلاعات کمپین
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
