import React, { useState, useEffect } from 'react';
import { Activity, Settings, Save, Sparkles, Hash, Plus, Trash2, TrendingUp, Target, Radio } from 'lucide-react';
import { MediaChannel, MediaSignalField } from '../../types';
import { initialPredefinedMedia } from '../../data/mediaData';
import { renderFieldsTable } from './renderTable';

interface DefinedSignalEntity {
  id: string;
  mediaId: string;
  signalType: string;
  title: string;
  fields: MediaSignalField[];
}

interface SignalDefinitionViewProps {
  onBackToCustomerGroups: () => void;
}

export const SignalDefinitionView: React.FC<SignalDefinitionViewProps> = ({ onBackToCustomerGroups }) => {
  const [definedSignals, setDefinedSignals] = useState<DefinedSignalEntity[]>([
    {
      id: 'SIG-1001',
      mediaId: 'MED-LNK-01',
      signalType: 'sig-1',
      title: 'نرخ تعامل لینکدین',
      fields: [
        {
          id: 'f1',
          code: 'MET-01',
          name: 'تعداد لایک',
          unit: 'عدد',
          targetType: 'min',
          targetValue: 100,
          kpiValue: 0,
          metricType: 'metric',
          period: 'monthly',
          weight: 50,
          isActive: true,
        },
        {
          id: 'f2',
          code: 'RAT-01',
          name: 'نرخ تبدیل لایک به کامنت',
          unit: 'درصد (%)',
          targetType: 'min',
          targetValue: 10,
          kpiValue: 0,
          metricType: 'rate',
          period: 'monthly',
          weight: 50,
          isActive: true,
        }
      ]
    }
  ]);

  const [selectedSignalId, setSelectedSignalId] = useState<string>(definedSignals[0].id);
  const currentSignal = definedSignals.find(s => s.id === selectedSignalId) || definedSignals[0];

  const [signalId, setSignalId] = useState(currentSignal.id);
  const [selectedMediaId, setSelectedMediaId] = useState<string>(currentSignal.mediaId);
  const [signalType, setSignalType] = useState<string>(currentSignal.signalType);
  const [signalTitle, setSignalTitle] = useState<string>(currentSignal.title);
  const [fields, setFields] = useState<MediaSignalField[]>(currentSignal.fields);

  useEffect(() => {
    if (currentSignal) {
      setSignalId(currentSignal.id);
      setSelectedMediaId(currentSignal.mediaId);
      setSignalType(currentSignal.signalType);
      setSignalTitle(currentSignal.title);
      setFields(currentSignal.fields);
    }
  }, [currentSignal]);

  const selectedMedia = initialPredefinedMedia.find(m => m.id === selectedMediaId) || initialPredefinedMedia[0];

  const handleMediaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mId = e.target.value;
    setSelectedMediaId(mId);
    const media = initialPredefinedMedia.find(m => m.id === mId);
    if (media && media.signals.length > 0) {
      setSignalType(media.signals[0].id);
      generateAutomaticFields(media.signals[0].id, media.signals[0].name);
    }
  };

  const handleSignalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSignalType(sId);
    const sig = selectedMedia.signals.find(s => s.id === sId);
    if (sig) {
      generateAutomaticFields(sId, sig.name);
    }
  };

  const generateAutomaticFields = (sigId: string, sigName: string) => {
    // Generate some mock fields automatically when signal type changes
    setFields([
      {
        id: `f-${Date.now()}-1`,
        code: `MET-${Math.floor(100 + Math.random() * 900)}`,
        name: `مقدار مطلق ${sigName}`,
        unit: 'عدد',
        targetType: 'min',
        targetValue: 0,
        kpiValue: 0,
        metricType: 'metric',
        period: 'monthly',
        weight: 50,
        isActive: true,
      },
      {
        id: `f-${Date.now()}-2`,
        code: `RAT-${Math.floor(100 + Math.random() * 900)}`,
        name: `نرخ رشد ${sigName}`,
        unit: 'درصد (%)',
        targetType: 'min',
        targetValue: 0,
        kpiValue: 0,
        metricType: 'rate',
        period: 'monthly',
        weight: 50,
        isActive: true,
      }
    ]);
  };

  const handleSaveSignal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DefinedSignalEntity = {
      id: signalId,
      mediaId: selectedMediaId,
      signalType,
      title: signalTitle,
      fields
    };
    
    setDefinedSignals(prev => {
      const exists = prev.find(s => s.id === updated.id);
      if (exists) {
        return prev.map(s => s.id === updated.id ? updated : s);
      } else {
        return [updated, ...prev];
      }
    });
    alert('اطلاعات سیگنال و تارگت‌های آن با موفقیت ذخیره شد.');
  };

  const handleCreateNewSignal = () => {
    const newId = `SIG-${Math.floor(1000 + Math.random() * 9000)}`;
    const media = initialPredefinedMedia[0];
    const sType = media.signals[0]?.id || '';
    const newSignal: DefinedSignalEntity = {
      id: newId,
      mediaId: media.id,
      signalType: sType,
      title: 'سیگنال جدید',
      fields: []
    };
    setDefinedSignals(prev => [newSignal, ...prev]);
    setSelectedSignalId(newId);
  };

  const handleToggleFieldActive = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const handleUpdateFieldTarget = (id: string, key: keyof MediaSignalField, val: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: val } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const metrics = fields.filter((s) => s.metricType === 'metric' || (!s.metricType && !s.unit.includes('%') && !s.unit.includes('درصد')));
  const rates = fields.filter((s) => s.metricType === 'rate' || (!s.metricType && (s.unit.includes('%') || s.unit.includes('درصد'))));

  return (
    <div className="space-y-3.5">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xs text-slate-800">
                فرم تعریف و تنظیم سیگنال
              </h1>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                سیستم CEM پایدار
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              مدیریت سیگنال‌ها، انتخاب رسانه، تنظیم تایپ اصلی و ست کردن تارگت‌های OKR روی فیلدهای متریک و ریت.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCreateNewSignal}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ایجاد سیگنال جدید</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Right Sidebar: List of Signals */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[600px]">
          <div className="px-3.5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
              <Radio className="w-4 h-4 text-indigo-600" />
              <span>سیگنال‌های تعریف شده</span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">
              {definedSignals.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {definedSignals.map((sig) => {
              const isSelected = sig.id === selectedSignalId;
              const mediaTitle = initialPredefinedMedia.find(m => m.id === sig.mediaId)?.title || 'نامشخص';
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignalId(sig.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer text-right relative ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/40 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-bold text-xs text-slate-800 truncate">
                      {sig.title}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                      {sig.id}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <span>رسانه:</span>
                    <span className="text-slate-600 font-medium">{mediaTitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left Form: Edit Signal */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[600px]">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-xs text-slate-700">ویرایش سیگنال</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {signalId}
            </span>
          </div>

          <form onSubmit={handleSaveSignal} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Section 1: Signal Info */}
            <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold border-b border-slate-200/70 pb-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>اطلاعات پایه سیگنال</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ID اختصاصی سیگنال
                  </label>
                  <input
                    type="text"
                    value={signalId}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500 font-mono shadow-inner text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    عنوان سیگنال <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={signalTitle}
                    onChange={(e) => setSignalTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    انتخاب رسانه از بین رسانه های تعریف شده
                  </label>
                  <select
                    value={selectedMediaId}
                    onChange={handleMediaChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs text-xs"
                  >
                    {initialPredefinedMedia.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    انتخاب تایپ اصلی سیگنال
                  </label>
                  <select
                    value={signalType}
                    onChange={handleSignalTypeChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs text-xs"
                  >
                    {selectedMedia.signals.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Metrics Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-3.5 py-2.5 bg-gradient-to-l from-slate-50 to-indigo-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Target className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>اطلاعات متریک سیگنال (OKR)</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-mono">
                        {metrics.filter(s => s.isActive).length} فیلد فعال
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              {renderFieldsTable(metrics, handleToggleFieldActive, handleUpdateFieldTarget, handleDeleteField)}
            </div>

            {/* Section 3: Rates Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs mt-4">
              <div className="px-3.5 py-2.5 bg-gradient-to-l from-slate-50 to-amber-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>ریت‌های سیگنال</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full font-mono">
                        {rates.filter(s => s.isActive).length} ریت فعال
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              {renderFieldsTable(rates, handleToggleFieldActive, handleUpdateFieldTarget, handleDeleteField)}
            </div>

            {/* Footer Form Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between mt-6">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  تارگت‌های ثبت شده در این فرم به عنوان مبنای پایش خودکار سیگنال مورد استفاده قرار می‌گیرد.
                </span>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تنظیمات سیگنال</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
