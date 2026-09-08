import React, { useState } from 'react';
import { Layers, Settings, Save, CheckCircle, Upload, Link as LinkIcon, Plus, Trash2, FileText, User, Wrench, Box, Clock, ShieldAlert, ListChecks, FileArchive, CheckSquare, Type, Hash, List as ListIcon, GripVertical } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
}

type FieldType = 'text' | 'number' | 'checkbox' | 'select';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for select type
}

interface DeploySettingsViewProps {
  onBack: () => void;
}

export const DeploySettingsView: React.FC<DeploySettingsViewProps> = ({ onBack }) => {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: 'f-1', label: 'آیا محیط فیزیکی آماده نصب است؟', type: 'checkbox', required: true },
    { id: 'f-2', label: 'شماره سریال دستگاه جایگزین', type: 'text', required: false }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const [toolsList, setToolsList] = useState<ChecklistItem[]>([
    { id: 'tl-1', text: 'مجموعه پیچ‌گوشتی عایق' },
  ]);
  const [newTool, setNewTool] = useState('');

  const [consumablesList, setConsumablesList] = useState<ChecklistItem[]>([
    { id: 'cs-1', text: 'کابل شبکه (متر)' },
  ]);
  const [newConsumable, setNewConsumable] = useState('');

  const handleAddItem = (
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: value.trim()
    };
    setList([...list, newItem]);
    setValue('');
  };

  const handleRemoveItem = (
    id: string,
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => {
    setList(list.filter(item => item.id !== id));
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 9),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      options: newFieldType === 'select' ? ['گزینه ۱', 'گزینه ۲'] : undefined
    };
    setFormFields([...formFields, newField]);
    setNewFieldLabel('');
    setNewFieldType('checkbox');
    setNewFieldRequired(false);
  };

  const handleRemoveField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case 'text': return <Type className="w-3.5 h-3.5 text-slate-500" />;
      case 'number': return <Hash className="w-3.5 h-3.5 text-slate-500" />;
      case 'checkbox': return <CheckSquare className="w-3.5 h-3.5 text-slate-500" />;
      case 'select': return <ListIcon className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getFieldTypeName = (type: FieldType) => {
    switch (type) {
      case 'text': return 'متن کوتاه';
      case 'number': return 'عدد';
      case 'checkbox': return 'تیک‌تایید';
      case 'select': return 'انتخابی';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">تنظیمات استقرار (نصب و راه اندازی) محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">پیکربندی زمان‌بندی، دستورالعمل‌ها و ملزومات نصب برای هر محصول</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      {/* Main Form */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* 1. Base Configuration */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Box className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-slate-700 text-sm">انتخاب محصول و استقرار</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1.5">انتخاب محصول <span className="text-rose-500">*</span></label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" required>
                  <option value="">انتخاب محصول...</option>
                  <option value="p1">سرور HP ProLiant DL380</option>
                  <option value="p2">نرم افزار اتوماسیون اداری</option>
                  <option value="p3">دوربین مداربسته تحت شبکه</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1.5">انتخاب استقرار (نصب و راه اندازی) <span className="text-rose-500">*</span></label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" required>
                  <option value="">انتخاب استقرار...</option>
                  <option value="d1">نصب و راه اندازی سخت افزار</option>
                  <option value="d2">نصب و پیکربندی نرم افزار</option>
                  <option value="d3">کابل کشی و نصب فیزیکی</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. Timing and Alerts */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">زمان‌بندی و هشدارها</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان استقرار بعد از تحویل به مشتری (ساعت) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input type="number" min="0" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" placeholder="مثلاً: 48" required />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                </div>
              </div>
              
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان هشدار قبل از زمان استقرار (ساعت) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input type="number" min="0" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" placeholder="مثلاً: 24" required />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Instructions & Attachments */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-sky-500" />
              <h2 className="font-bold text-slate-700 text-sm">دستورالعمل‌ها و مستندات</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1.5">متن دستور العمل</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" placeholder="مراحل و دستورالعمل‌های لازم برای استقرار را در این بخش وارد کنید..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">درج لینک مستندات / راهنما</label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" placeholder="https://..." dir="ltr" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">آپلود فایل ضمیمه (فقط فرمت zip یا rar)</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <input type="file" accept=".zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-600 transition-colors">
                      <FileArchive className="w-4 h-4" />
                      <span className="text-xs font-medium">انتخاب یا رها کردن فایل آرشیو</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Form Builder Checklist */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-500" />
                <h2 className="font-bold text-slate-700 text-sm">ساخت چک لیست فرم عملیات</h2>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">فرم بیلدر</span>
            </div>
            
            <div className="space-y-4">
              {/* Add New Field Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3">افزودن فیلد جدید</h3>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={newFieldLabel} 
                      onChange={e => setNewFieldLabel(e.target.value)} 
                      onKeyPress={e => e.key === 'Enter' && handleAddField()}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-indigo-500"
                      placeholder="عنوان فیلد یا پرسش (مثلاً: وضعیت کابل‌ها...)" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={newFieldType}
                      onChange={e => setNewFieldType(e.target.value as FieldType)}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-700 focus:border-indigo-500 w-32"
                    >
                      <option value="checkbox">تیک تایید</option>
                      <option value="text">متن کوتاه</option>
                      <option value="number">عدد</option>
                      <option value="select">انتخابی</option>
                    </select>
                    
                    <label className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 text-xs">
                      <input 
                        type="checkbox" 
                        checked={newFieldRequired}
                        onChange={e => setNewFieldRequired(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-slate-600 font-medium whitespace-nowrap">الزامی</span>
                    </label>

                    <button 
                      type="button" 
                      onClick={handleAddField} 
                      className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> افزودن
                    </button>
                  </div>
                </div>
              </div>

              {/* Fields List */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">فیلدهای فرم چک‌لیست</span>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{formFields.length} مورد</span>
                </div>
                
                {formFields.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <ListChecks className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">هیچ فیلدی به فرم اضافه نشده است</p>
                    <p className="text-xs text-slate-400 mt-1">از طریق کادر بالا فیلدهای مورد نیاز برای استقرار را تعریف کنید</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {formFields.map((field, index) => (
                      <li key={field.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                        <GripVertical className="w-4 h-4 text-slate-300 cursor-move shrink-0 hidden sm:block" />
                        
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-sm font-semibold text-slate-700 truncate">{field.label}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="flex items-center gap-1 text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                              {getFieldIcon(field.type)}
                              {getFieldTypeName(field.type)}
                            </span>
                            {field.required && (
                              <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">الزامی</span>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveField(field.id)} 
                          className="text-slate-300 hover:text-rose-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                          title="حذف فیلد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </section>

          {/* 5. Requirements (Tools & Consumables) */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Wrench className="w-4 h-4 text-sky-500" />
              <h2 className="font-bold text-slate-700 text-sm">ملزومات فیزیکی نصب</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tools List */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-amber-600" /> لیست ابزارآلات مورد نیاز</h3>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newTool} 
                    onChange={e => setNewTool(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleAddItem(toolsList, setToolsList, newTool, setNewTool)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-700 focus:border-indigo-500"
                    placeholder="ابزار جدید..." 
                  />
                  <button type="button" onClick={() => handleAddItem(toolsList, setToolsList, newTool, setNewTool)} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1.5 rounded transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {toolsList.map(item => (
                    <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
                      <span className="text-xs text-slate-700 truncate mr-1">{item.text}</span>
                      <button onClick={() => handleRemoveItem(item.id, toolsList, setToolsList)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                  {toolsList.length === 0 && <li className="text-xs text-slate-400 text-center py-2">ابزاری ثبت نشده است</li>}
                </ul>
              </div>

              {/* Consumables List */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-sky-600" /> لیست اقلام مصرفی</h3>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newConsumable} 
                    onChange={e => setNewConsumable(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleAddItem(consumablesList, setConsumablesList, newConsumable, setNewConsumable)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-700 focus:border-indigo-500"
                    placeholder="قلم مصرفی جدید..." 
                  />
                  <button type="button" onClick={() => handleAddItem(consumablesList, setConsumablesList, newConsumable, setNewConsumable)} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1.5 rounded transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {consumablesList.map(item => (
                    <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
                      <span className="text-xs text-slate-700 truncate mr-1">{item.text}</span>
                      <button onClick={() => handleRemoveItem(item.id, consumablesList, setConsumablesList)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                  {consumablesList.length === 0 && <li className="text-xs text-slate-400 text-center py-2">قلم مصرفی ثبت نشده است</li>}
                </ul>
              </div>

            </div>
          </section>

          {/* 6. Assignment */}
          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-slate-700 text-sm">مسئول انجام</h2>
            </div>
            
            <div className="max-w-md">
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">سمت / پرسنل اجرایی (یوزر سیستم) <span className="text-rose-500">*</span></label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" required>
                <option value="">انتخاب پرسنل یا سمت...</option>
                <optgroup label="سمت‌های سازمانی">
                  <option value="role-1">تکنسین نصب سخت‌افزار</option>
                  <option value="role-2">کارشناس استقرار نرم‌افزار</option>
                </optgroup>
                <optgroup label="پرسنل">
                  <option value="user-1">علی رضایی (کد: 1042)</option>
                  <option value="user-2">محمد حسینی (کد: 1055)</option>
                  <option value="user-3">سارا احمدی (کد: 1089)</option>
                </optgroup>
              </select>
            </div>
          </section>
          
          <div className="flex items-center justify-end pt-2 pb-6 gap-3">
             <button type="button" onClick={onBack} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 border border-slate-200 rounded-lg font-bold transition-colors text-sm">
                انصراف
              </button>
              <button type="submit" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-bold transition-shadow shadow-sm shadow-indigo-600/30 text-sm">
                <CheckCircle className="w-4 h-4" /> ذخیره تنظیمات استقرار
              </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
