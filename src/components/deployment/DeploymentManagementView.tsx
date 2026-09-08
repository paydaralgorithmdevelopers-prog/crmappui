import React, { useState } from 'react';
import { 
  Layers, 
  Settings, 
  Save, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  FileText, 
  User, 
  Wrench, 
  Box, 
  Clock, 
  ListChecks, 
  FileArchive, 
  CheckSquare, 
  Type, 
  Hash, 
  List as ListIcon, 
  GripVertical,
  Server,
  Monitor,
  Globe,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';

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
  options?: string[];
}

interface DeploymentType {
  id: string;
  title: string;
  group: string;
  productId: string;
  timingAfterDelivery: number;
  alertBeforeTime: number;
  instructions: string;
  link: string;
  formFields: FormField[];
  tools: ChecklistItem[];
  consumables: ChecklistItem[];
  assignedTo: string;
}

const initialDeployTypes: DeploymentType[] = [
  {
    id: 'DT-1',
    title: 'نصب و راه اندازی سرور HP',
    group: 'hardware',
    productId: 'p1',
    timingAfterDelivery: 48,
    alertBeforeTime: 24,
    instructions: 'بررسی فیزیکی، نصب در رک، کابل کشی برق و شبکه.',
    link: 'https://docs.hp.com/dl380',
    formFields: [
      { id: 'f1', label: 'آیا محیط فیزیکی آماده است؟', type: 'checkbox', required: true }
    ],
    tools: [{ id: 't1', text: 'پیچ گوشتی چهارسو' }],
    consumables: [{ id: 'c1', text: 'کابل پاور' }],
    assignedTo: 'role-1'
  },
  {
    id: 'DT-2',
    title: 'استقرار نرم‌افزار ERP',
    group: 'software',
    productId: 'p2',
    timingAfterDelivery: 24,
    alertBeforeTime: 12,
    instructions: 'نصب دیتابیس، پیکربندی سرویس دهنده، تست دسترسی کاربران.',
    link: '',
    formFields: [],
    tools: [],
    consumables: [],
    assignedTo: 'role-2'
  }
];

interface DeploymentManagementViewProps {
  onBack: () => void;
}

export const DeploymentManagementView: React.FC<DeploymentManagementViewProps> = ({ onBack }) => {
  const [deployTypes, setDeployTypes] = useState<DeploymentType[]>(initialDeployTypes);
  const [selectedId, setSelectedId] = useState<string>(initialDeployTypes[0].id);

  const currentType = deployTypes.find(d => d.id === selectedId) || deployTypes[0];

  const handleAdd = () => {
    const newId = `DT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newType: DeploymentType = {
      id: newId,
      title: 'استقرار جدید',
      group: 'software',
      productId: '',
      timingAfterDelivery: 0,
      alertBeforeTime: 0,
      instructions: '',
      link: '',
      formFields: [],
      tools: [],
      consumables: [],
      assignedTo: ''
    };
    setDeployTypes([...deployTypes, newType]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (deployTypes.length <= 1) return;
    const filtered = deployTypes.filter(d => d.id !== id);
    setDeployTypes(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  const updateCurrentType = (updates: Partial<DeploymentType>) => {
    setDeployTypes(prev => prev.map(d => d.id === currentType.id ? { ...d, ...updates } : d));
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'hardware': return <Server className="w-4 h-4 text-emerald-500" />;
      case 'software': return <Monitor className="w-4 h-4 text-sky-500" />;
      case 'network': return <Globe className="w-4 h-4 text-indigo-500" />;
      default: return <Cpu className="w-4 h-4 text-slate-500" />;
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
            <h1 className="text-base font-bold text-slate-800">مدیریت انواع نصب و راه اندازی محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">تعریف و تنظیم کامل فرآیندهای استقرار و نصب</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">لیست انواع نصب</h2>
            <button 
              onClick={handleAdd}
              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="افزودن مورد جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {deployTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedId(type.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-right transition-colors ${
                  selectedId === type.id 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700 border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                {getGroupIcon(type.group)}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{type.title}</span>
                  <span className="text-[10px] opacity-70">{type.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* 1. Basic Definition */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مشخصات پایه</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">عنوان استقرار (نصب و راه اندازی) <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={currentType.title}
                      onChange={(e) => updateCurrentType({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">گروه بندی <span className="text-rose-500">*</span></label>
                    <select 
                      value={currentType.group}
                      onChange={(e) => updateCurrentType({ group: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                      required
                    >
                      <option value="software">نرم‌افزار</option>
                      <option value="hardware">سخت‌افزار</option>
                      <option value="network">شبکه و زیرساخت</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 2. Product Selection & Timing */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Box className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">محصول و زمان‌بندی</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1">
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">انتخاب محصول مرتبط</label>
                    <select 
                      value={currentType.productId}
                      onChange={(e) => updateCurrentType({ productId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                    >
                      <option value="">انتخاب محصول...</option>
                      <option value="p1">سرور HP ProLiant DL380</option>
                      <option value="p2">نرم افزار اتوماسیون اداری</option>
                      <option value="p3">دوربین مداربسته تحت شبکه</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان استقرار بعد از تحویل (ساعت)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.timingAfterDelivery}
                        onChange={(e) => updateCurrentType({ timingAfterDelivery: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">زمان هشدار قبل از استقرار (ساعت)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentType.alertBeforeTime}
                        onChange={(e) => updateCurrentType({ alertBeforeTime: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ساعت</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Instructions & Documents */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">دستورالعمل‌ها و مستندات</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-semibold mb-1.5">متن دستور العمل</label>
                    <textarea 
                      rows={4} 
                      value={currentType.instructions}
                      onChange={(e) => updateCurrentType({ instructions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors" 
                      placeholder="مراحل و دستورالعمل‌های لازم برای استقرار..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-semibold mb-1.5">درج لینک مستندات / راهنما</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url" 
                          value={currentType.link}
                          onChange={(e) => updateCurrentType({ link: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors text-left" 
                          placeholder="https://..." dir="ltr" 
                        />
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
                  {/* Internal Form Builder Logic would go here, reusing the states from the currentType.formFields */}
                  <FormBuilder 
                    fields={currentType.formFields} 
                    onUpdate={(fields) => updateCurrentType({ formFields: fields })} 
                  />
                </div>
              </section>

              {/* 5. Requirements (Tools & Consumables) */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Wrench className="w-4 h-4 text-sky-500" />
                  <h2 className="font-bold text-slate-700 text-sm">ملزومات فیزیکی نصب</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChecklistEditor 
                    title="لیست ابزارآلات مورد نیاز" 
                    icon={<Wrench className="w-3.5 h-3.5 text-amber-600" />} 
                    items={currentType.tools} 
                    onUpdate={(items) => updateCurrentType({ tools: items })} 
                  />
                  <ChecklistEditor 
                    title="لیست اقلام مصرفی" 
                    icon={<Layers className="w-3.5 h-3.5 text-sky-600" />} 
                    items={currentType.consumables} 
                    onUpdate={(items) => updateCurrentType({ consumables: items })} 
                  />
                </div>
              </section>

              {/* 6. Assignment */}
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-bold text-slate-700 text-sm">مسئول انجام</h2>
                </div>
                
                <div className="max-w-md">
                  <label className="block text-slate-700 text-xs font-semibold mb-1.5">سمت / پرسنل اجرایی (یوزر سیستم)</label>
                  <select 
                    value={currentType.assignedTo}
                    onChange={(e) => updateCurrentType({ assignedTo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="">انتخاب پرسنل یا سمت...</option>
                    <optgroup label="سمت‌های سازمانی">
                      <option value="role-1">تکنسین نصب سخت‌افزار</option>
                      <option value="role-2">کارشناس استقرار نرم‌افزار</option>
                    </optgroup>
                    <optgroup label="پرسنل">
                      <option value="user-1">علی رضایی (کد: 1042)</option>
                      <option value="user-2">محمد حسینی (کد: 1055)</option>
                    </optgroup>
                  </select>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-100">
                <button 
                  onClick={() => handleDelete(currentType.id)}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف این نوع استقرار
                </button>
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg font-bold transition-colors text-xs">
                    انصراف
                  </button>
                  <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold transition-shadow shadow-sm shadow-indigo-600/30 text-xs">
                    <CheckCircle className="w-4 h-4" /> ذخیره نهایی
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const FormBuilder = ({ fields, onUpdate }: { fields: FormField[], onUpdate: (fields: FormField[]) => void }) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 9),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired
    };
    onUpdate([...fields, newField]);
    setNewFieldLabel('');
  };

  const removeField = (id: string) => onUpdate(fields.filter(f => f.id !== id));

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={newFieldLabel} 
            onChange={e => setNewFieldLabel(e.target.value)} 
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
            placeholder="عنوان فیلد جدید..." 
          />
          <div className="flex gap-2">
            <select 
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FieldType)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs w-32"
            >
              <option value="checkbox">تیک تایید</option>
              <option value="text">متن کوتاه</option>
              <option value="number">عدد</option>
              <option value="select">انتخابی</option>
            </select>
            <button onClick={handleAddField} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold">افزودن</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {fields.map((f, i) => (
          <div key={f.id} className="p-3 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{f.type}</span>
            </div>
            <button onClick={() => removeField(f.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistEditor = ({ title, icon, items, onUpdate }: { title: string, icon: React.ReactNode, items: ChecklistItem[], onUpdate: (items: ChecklistItem[]) => void }) => {
  const [newValue, setNewValue] = useState('');
  const addItem = () => {
    if (!newValue.trim()) return;
    onUpdate([...items, { id: Math.random().toString(36).substring(2, 9), text: newValue.trim() }]);
    setNewValue('');
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
      <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">{icon} {title}</h3>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)} 
          className="flex-1 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs"
          placeholder="افزودن..." 
        />
        <button onClick={addItem} className="bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 group">
            <span className="text-xs text-slate-700 truncate">{item.text}</span>
            <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};
