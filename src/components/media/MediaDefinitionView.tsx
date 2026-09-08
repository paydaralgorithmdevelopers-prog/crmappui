import React, { useState } from 'react';
import { MediaChannel, MainMediaType, MediaSignalField } from '../../types';
import {
  mediaTypeTemplates,
  initialPredefinedMedia,
  MediaTypeOption
} from '../../data/mediaData';
import { renderFieldsTable } from './renderTable';
import {
  Radio,
  Target,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  Globe,
  Share2,
  MessageSquare,
  CalendarCheck,
  Mail,
  Save,
  Sliders,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

interface MediaDefinitionViewProps {
  onBackToCustomerGroups?: () => void;
}

export const MediaDefinitionView: React.FC<MediaDefinitionViewProps> = ({
  onBackToCustomerGroups,
}) => {
  // All media list (initialized with pre-defined backend media)
  const [mediaList, setMediaList] = useState<MediaChannel[]>(initialPredefinedMedia);
  const [selectedMediaId, setSelectedMediaId] = useState<string>(initialPredefinedMedia[0].id);

  // Current media being edited
  const currentMedia = mediaList.find((m) => m.id === selectedMediaId) || mediaList[0];

  // Form states
  const [mediaId, setMediaId] = useState<string>(currentMedia.id);
  const [mediaCode, setMediaCode] = useState<string>(currentMedia.code);
  const [mediaTitle, setMediaTitle] = useState<string>(currentMedia.title);
  const [mainType, setMainType] = useState<MainMediaType>(currentMedia.mainType);
  const [category, setCategory] = useState<string>(currentMedia.category);
  const [urlOrHandle, setUrlOrHandle] = useState<string>(currentMedia.urlOrHandle || '');
  const [manager, setManager] = useState<string>(currentMedia.manager || '');
  const [status, setStatus] = useState<'active' | 'inactive' | 'testing'>(currentMedia.status);
  const [signals, setSignals] = useState<MediaSignalField[]>(currentMedia.signals);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showAddCustomSignal, setShowAddCustomSignal] = useState<boolean>(false);
  const [newSignalName, setNewSignalName] = useState<string>('');
  const [newSignalUnit, setNewSignalUnit] = useState<string>('عدد');
  const [newSignalTarget, setNewSignalTarget] = useState<number>(100);
  const [newSignalType, setNewSignalType] = useState<'metric' | 'rate'>('metric');

  // Synchronize form when selected media changes
  const handleSelectMedia = (selected: MediaChannel) => {
    setSelectedMediaId(selected.id);
    setMediaId(selected.id);
    setMediaCode(selected.code);
    setMediaTitle(selected.title);
    setMainType(selected.mainType);
    setCategory(selected.category);
    setUrlOrHandle(selected.urlOrHandle || '');
    setManager(selected.manager || '');
    setStatus(selected.status);
    setSignals(selected.signals);
  };

  // When user changes "انتخاب تایپ اصلی", load fields automatically!
  const handleMainTypeChange = (newType: MainMediaType) => {
    setMainType(newType);
    const template: MediaTypeOption = mediaTypeTemplates[newType];
    setCategory(template.category);

    // Auto-generate fields from backend template
    const autoFields: MediaSignalField[] = template.defaultSignals.map((ds, index) => ({
      ...ds,
      id: `sig-auto-${Date.now()}-${index}`,
    }));

    setSignals(autoFields);
  };

  // KPI Target updates for individual fields
  const handleUpdateSignalTarget = (
    sigId: string,
    key: keyof MediaSignalField,
    value: any
  ) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === sigId ? { ...s, [key]: value } : s))
    );
  };

  const handleToggleSignalActive = (sigId: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === sigId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleDeleteSignal = (sigId: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== sigId));
  };

  const handleResetToTemplate = () => {
    const template = mediaTypeTemplates[mainType];
    const resetFields: MediaSignalField[] = template.defaultSignals.map((ds, index) => ({
      ...ds,
      id: `sig-auto-${Date.now()}-${index}`,
    }));
    setSignals(resetFields);
  };

  const handleCreateNewMedia = () => {
    const defaultType: MainMediaType = 'linkedin';
    const template = mediaTypeTemplates[defaultType];
    const newId = `MED-NEW-${Math.floor(100 + Math.random() * 900)}`;

    const newMedia: MediaChannel = {
      id: newId,
      code: `CHN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'رسانه تبلیغاتی و ارتباطی جدید',
      mainType: defaultType,
      category: template.category,
      urlOrHandle: '',
      manager: 'کارشناس توسعه بازار',
      status: 'active',
      createdAt: '۱۴۰۵/۱۱/۱۸',
      updatedAt: '۱۴۰۵/۱۱/۱۸',
      signals: template.defaultSignals.map((ds, index) => ({
        ...ds,
        id: `sig-${Date.now()}-${index}`,
      })),
    };

    setMediaList((prev) => [newMedia, ...prev]);
    handleSelectMedia(newMedia);
  };

  const handleAddCustomSignalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignalName.trim()) return;

    const newField: MediaSignalField = {
      id: `sig-custom-${Date.now()}`,
      code: `METRIC-CUST-${Math.floor(10 + Math.random() * 90)}`,
      name: newSignalName.trim(),
      unit: newSignalUnit,
      targetType: 'min',
      targetValue: Number(newSignalTarget) || 0,
      kpiValue: 0,
      metricType: newSignalType,
      period: 'monthly',
      weight: 10,
      isActive: true,
    };

    setSignals((prev) => [...prev, newField]);
    setNewSignalName('');
    setShowAddCustomSignal(false);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) {
      alert('لطفاً عنوان رسانه را وارد نمایید.');
      return;
    }

    const updated: MediaChannel = {
      id: mediaId,
      code: mediaCode.trim() || `MED-${Math.floor(100 + Math.random() * 900)}`,
      title: mediaTitle.trim(),
      mainType,
      category,
      urlOrHandle,
      manager,
      status,
      signals,
      createdAt: currentMedia.createdAt || '۱۴۰۵/۱۱/۱۸',
      updatedAt: '۱۴۰۵/۱۱/۱۸',
    };

    setMediaList((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Categorize for UI
  const metrics = signals.filter((s) => s.metricType === 'metric' || (!s.metricType && !s.unit.includes('%') && !s.unit.includes('درصد')));
  const rates = signals.filter((s) => s.metricType === 'rate' || (!s.metricType && (s.unit.includes('%') || s.unit.includes('درصد'))));

  // Calculations for KPI weights
  const totalWeight = signals.reduce((sum, s) => (s.isActive ? sum + (Number(s.weight) || 0) : sum), 0);
  const activeSignalsCount = signals.filter((s) => s.isActive).length;

  const getTypeIcon = (type: MainMediaType) => {
    switch (type) {
      case 'linkedin':
        return <Share2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-emerald-600" />;
      case 'instagram':
        return <Share2 className="w-3.5 h-3.5 text-rose-600" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-600" />;
      case 'exhibition':
        return <CalendarCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner / Breadcrumb info */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xs text-slate-800">
                فرم تعریف رسانه و تنظیم شاخص‌های کلیدی (KPI)
              </h1>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                سیستم CEM پایدار
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ساختار هرمی رسانه‌ها در بک‌اند تعبیه شده است؛ با انتخاب رسانه یا تایپ اصلی، فیلدهای متریک و ریت بصورت اتوماتیک بارگذاری شده و امکان ست کردن تارگت KPI روی هر فیلد فراهم است.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToCustomerGroups && (
            <button
              type="button"
              onClick={onBackToCustomerGroups}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <span>بازگشت به تعریف گروه هدف</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCreateNewMedia}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تعریف رسانه جدید</span>
          </button>
        </div>
      </div>

      {/* Main Grid: انتخاب از بین رسانه‌های تعریف شده در بک‌اند (سمت راست/ستون جانبی) + فرم اصلی تعریف رسانه و KPI (فضای اصلی) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* ستون جانبی: فهرست رسانه‌های تعریف شده در ساختار هرمی بک‌اند */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-bold text-xs text-slate-800">
                رسانه‌های تعریف شده (ساختار هرمی)
              </span>
            </div>
            <span className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {mediaList.length} رسانه
            </span>
          </div>

          <div className="p-2 border-b border-slate-100 bg-amber-50/50 text-[11px] text-amber-800 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
            <span>
              رسانه‌های زیر در بک‌اند تعریف شده‌اند. برای مشاهده یا ست کردن KPIها، رسانه مورد نظر را انتخاب کنید:
            </span>
          </div>

          {/* List of Pre-defined Media */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {mediaList.map((m) => {
              const isSelected = m.id === selectedMediaId;
              const activeCount = m.signals.filter((s) => s.isActive).length;

              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMedia(m)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer text-right relative ${
                    isSelected
                      ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/40 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {getTypeIcon(m.mainType)}
                      </div>
                      <span className="font-bold text-xs text-slate-800 truncate">
                        {m.title}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                      {m.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                    <span className="text-slate-600 font-medium truncate max-w-[140px]">
                      {m.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                      <Target className="w-2.5 h-2.5 text-emerald-600" />
                      {activeCount} فیلد KPI
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* فرم اصلی: اطلاعات رسانه + انتخاب تایپ اصلی + ست کردن KPI روی فیلدها */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Header of Form */}
          <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <span>مشخصات رسانه و تنظیم فیلدهای KPI</span>
                  <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-full">
                    {mediaId}
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md animate-fade-in">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  اطلاعات رسانه و تارگت‌ها ذخیره شد
                </span>
              )}

              <button
                type="button"
                onClick={handleResetToTemplate}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
                title="بازنشانی فیلدهای این تایپ به پیش‌فرض هرمی بک‌اند"
              >
                <RotateCcw className="w-3 h-3" />
                <span>بازیابی فیلدهای پیش‌فرض</span>
              </button>
            </div>
          </div>

          {/* Form Scrollable Area */}
          <form onSubmit={handleSaveMedia} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* بخش ۱: فیلدهای اصلی رسانه (ID رسانه + انتخاب تایپ اصلی + عنوان) */}
            <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold border-b border-slate-200/70 pb-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>اطلاعات شناسنامه‌ای رسانه</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* ID رسانه */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ID رسانه <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaId}
                    onChange={(e) => setMediaId(e.target.value)}
                    placeholder="مثلاً: MED-LNK-01"
                    className="w-full font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs shadow-2xs"
                    required
                  />
                </div>

                {/* انتخاب تایپ اصلی (نمایش فیلدها بصورت اتوماتیک) */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>انتخاب تایپ اصلی</span>
                      <span className="text-rose-600">*</span>
                      <span className="text-[10px] text-indigo-700 font-normal mr-1">
                        (نمایش فیلدها بصورت اوتوماتیک)
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      هرمی بک‌اند
                    </span>
                  </label>
                  <select
                    value={mainType}
                    onChange={(e) => handleMainTypeChange(e.target.value as MainMediaType)}
                    className="w-full bg-white border-2 border-indigo-200 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs shadow-2xs"
                  >
                    <option value="linkedin">لینکدین (LinkedIn B2B) - شبکه‌های اجتماعی سازمانی</option>
                    <option value="website">وب‌سایت و پورتال سازمانی (Corporate Website) - رسانه اختصاصی</option>
                    <option value="instagram">اینستاگرام سازمانی (Instagram Business) - رسانه بصری</option>
                    <option value="sms">سامانه پیامک هدفمند صنعتی (Industrial SMS) - ارتباط مستقیم</option>
                    <option value="exhibition">نمایشگاه و رویدادهای تخصصی (Expo & Events) - رویدادی</option>
                    <option value="email">ایمیل مارکتینگ سازمانی (Corporate B2B Email) - بازاریابی ایمیلی</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* عنوان رسانه */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    نام عنوان رسانه <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="مثلاً: صفحه رسمی لینکدین تابلو برق پایدار"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <label className="block text-slate-600 mb-1">
                    لینک / آدرس کانال یا صفحه
                  </label>
                  <input
                    type="text"
                    value={urlOrHandle}
                    onChange={(e) => setUrlOrHandle(e.target.value)}
                    placeholder="https://... یا @handle"
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    کارشناس / مسئول رسانه
                  </label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="مدیر یا کارشناس مربوطه"
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    وضعیت عملیاتی رسانه
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs"
                  >
                    <option value="active">فعال و در حال پیگیری</option>
                    <option value="testing">در حال راه‌اندازی آزمایشی</option>
                    <option value="inactive">غیرفعال / موقت</option>
                  </select>
                </div>
              </div>
            </div>

            {/* بخش ۲: اطلاعات متریک رسانه */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-3.5 py-2.5 bg-gradient-to-l from-slate-50 to-indigo-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Sliders className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>اطلاعات متریک رسانه</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-mono">
                        {metrics.filter(s => s.isActive).length} فیلد فعال
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              
              {renderFieldsTable(metrics, handleToggleSignalActive, handleUpdateSignalTarget, handleDeleteSignal)}
            </div>

            {/* بخش ۳: ریتهای رسانه */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs mt-4">
              <div className="px-3.5 py-2.5 bg-gradient-to-l from-slate-50 to-amber-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>ریتهای رسانه</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full font-mono">
                        {rates.filter(s => s.isActive).length} ریت فعال
                      </span>
                    </h3>
                  </div>
                </div>
              </div>

              {renderFieldsTable(rates, handleToggleSignalActive, handleUpdateSignalTarget, handleDeleteSignal)}
            </div>

            {/* Footer Form Action Buttons */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  تارگت‌های ثبت شده در این فرم به عنوان مبنای پایش خودکار متریک‌ها و ریت‌ها و ارزیابی اثربخشی کمپین‌های بازاریابی مورد استفاده قرار می‌گیرد.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectMedia(currentMedia)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بازنشانی</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ذخیره رسانه و تارگت‌های KPI</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
