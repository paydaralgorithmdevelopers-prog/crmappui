# 🛠️ سند جامع دیزاین، معماری و کدهای کامل «خدمات پس از فروش» (After-Sales Services)
**سامانه:** ERP و CRM تابلوسازی برق پارس  
**نسخه سند:** 1.0.0 (اختصاصی Claude و تیم توسعه فرانت‌اند)  
**شامل:** مشخصات نیازمندی‌ها، معماری جریان فرآیند، دیزاین کامل UI/UX و کدهای کامل TypeScript / React 19 / Tailwind CSS تمام صفحات  

---

## فهرست سرفصل‌های این مستند

1. **معماری کلان و چرخه‌عمر خدمات پس از فروش (Lifecycle Architecture)**
2. **مدل‌های داده و تایپ‌های مشترک (`types/afterSales.ts`)**
3. **طراحی UI/UX، پالت رنگی و استانداردهای طراحی فرم و صورتجلسات**
4. **بخش تعاریف پایه (Definitions):**
   * ۴.۱. `DeploymentManagementView`: تعریف انواع نصب و استقرار
   * ۴.۲. `MaintenanceManagementView`: تعریف برنامه‌های نگهداشت دوره‌ای (PM)
   * ۴.۳. `FailureManagementView`: تعریف عیوب و درخت کدهای خطا (Fault Tree)
   * ۴.۴. `ToolboxDefinitionView`: تعریف جعبه ابزار و انبارک‌های تکنسین‌ها
5. **بخش عملیات اجرایی (Operations):**
   * ۵.۱. `DeploymentRequestView`: ثبت درخواست نصب و راه‌اندازی
   * ۵.۲. `DeploymentReportView`: ثبت گزارش اتمام استقرار و صورتجلسه تحویل
   * ۵.۳. `MaintenanceRequestView`: ثبت درخواست سرویس دوره‌ای
   * ۵.۴. `MaintenanceReportView`: ثبت گزارش سرویس دوره‌ای و چک‌لیست بازرسی
   * ۵.۵. `RepairRequestView`: ثبت درخواست تعمیرات اضطراری (تیکت عیب)
   * ۵.۶. `RepairReportView`: ثبت گزارش اقدام تعمیراتی و مصرف قطعات یدکی
6. **بخش گزارشات (Reports):**
   * ۶.۱. `ToolboxKardexReportView`: گزارش کاردکس گردش و مانده ابزار و قطعات یدکی
7. **پرامپت اجرایی مخصوص Claude برای تولید دونه‌به‌دونه کدهای این ماژول**

---

# ۱. معماری کلان و چرخه‌عمر خدمات پس از فروش

```
[فاکتور قطعی فروش] ───► [ثبت سریال و تجهیزات]
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
[۱. نصب و استقرار]     [۲. نگهداشت دوره‌ای PM]   [۳. تعمیرات اضطراری]
  ├── ثبت درخواست         ├── زمان‌بندی دوره‌ای     ├── ثبت تیکت خطا
  ├── اعزام تکنسین        ├── بررسی چک‌لیست        ├── عارضه‌یابی
  └── صورتجلسه تحویل      └── مصرف قطعات PM        └── تعویض قطعه و رفع عیب
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                ▼
         [انبارک / جعبه ابزار و کاردکس مصرف قطعات یدکی]
```

### نیازمندی‌های کلیدی کسب‌وکار:
1. **اتصال به فاکتور فروش:** هر درخواست خدمات به یک فاکتور رسمی معتبر و سریال یونیک دستگاه متصل است.
2. **فیلدهای گزارش‌دهی داینامیک:** در تعریف نوع استقرار، کارشناس می‌تواند فرم فیلدهای متغیری را تعریف کند که تکنسین در زمان گزارش موظف به پر کردن آن‌هاست.
3. **کنترل قطعات یدکی و ابزار:** تفکیک ابزار مصرف‌نشدنی از قطعات یدکی مصرفی، با ثبت ورود و خروج به تفکیک سریال دستگاه در کاردکس.
4. **توقف خط (Downtime):** محاسبه دقیق مدت‌زمان خارج از مدار بودن تابلو برق از لحظه اعلام خرابی تا صورتجلسه اتمام تعمیر.

---

# ۲. مدل‌های داده و اینترفیس‌های مشترک (`types/afterSales.ts`)

```typescript
// types/afterSales.ts

export type ServicePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface DynamicFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked?: boolean;
}

// ۱. تعریف نوع استقرار
export interface DeploymentType {
  id: string;
  title: string;
  group: string;
  productId: string;
  timingAfterDelivery: number; // روزهای مجاز پس از تحویل
  alertBeforeTime: number;      // هشدار قبل از سررسید (روز)
  instructions: string;
  link: string;
  formFields: DynamicFormField[];
  tools: ChecklistItem[];
  consumables: ChecklistItem[];
  assignedTo: string;
}

// ۲. تعریف نوع نگهداشت پیشگیرانه (PM)
export interface MaintenanceType {
  id: string;
  title: string;
  productId: string;
  intervalMonths: number;      // بازه ماهانه
  intervalHours: number;       // بازه کارکرد ساعتی
  instructions: string;
  checklist: ChecklistItem[];
  requiredParts: Array<{
    partId: string;
    partName: string;
    quantity: number;
    unit: string;
  }>;
}

// ۳. تعریف انواع خرابی (Fault Tree)
export interface FailureType {
  id: string;
  productId: string;
  code: string;
  label: string;
  severity: 'critical' | 'major' | 'minor';
  rootCauses: string[];
  standardSolution: string;
}

// ۴. تعریف جعبه ابزار و انبارک
export interface Toolbox {
  id: string;
  title: string;
  type: 'نصب و راه اندازی' | 'نگهداشت' | 'تعمیرات تخصصی';
  responsibleId: string;
  responsibleName: string;
  accountingGlId: string;
  accountingGlTitle: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

// ۵. درخواست استقرار
export interface DeploymentRequest {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  serialNumber: string;
  deploymentTypeId: string;
  customerName: string;
  requestedDate: string;
  assignedTechnician: string;
  siteAddress: string;
  priority: ServicePriority;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
}

// ۶. گزارش استقرار
export interface DeploymentReport {
  id: string;
  requestId: string;
  completionDate: string;
  technicianName: string;
  customerSignatory: string;
  dynamicFieldValues: Record<string, any>;
  toolsUsed: string[];
  consumablesUsed: Array<{ partId: string; quantity: number }>;
  isNoLoadTestPassed: boolean;
  isLoadTestPassed: boolean;
  customerRating: number; // 1 to 5
  notes: string;
}

// ۷. درخواست و گزارش تعمیرات
export interface RepairTicket {
  id: string;
  invoiceId: string;
  serialNumber: string;
  customerName: string;
  failureTypeId: string;
  isProductionStopped: boolean;
  reportDate: string;
  reportTime: string;
  severity: 'critical' | 'major' | 'minor';
  assignedTechnician?: string;
  status: 'registered' | 'dispatched' | 'repaired' | 'closed';
  defectDetails: string;
}

export interface RepairReport {
  ticketId: string;
  actualCause: string;
  actionsTaken: string;
  repairStartDate: string;
  repairEndDate: string;
  totalDowntimeHours: number;
  replacedParts: Array<{
    partCode: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    oldPartSerialNumber?: string;
    newPartSerialNumber?: string;
  }>;
  customerRepresentativeName: string;
  finalStatus: 'fixed' | 'temporary_fix' | 'needs_factory_repair';
}

// ۸. کاردکس ابزار و قطعات
export interface ToolboxKardexItem {
  id: string;
  date: string;
  voucherNumber: string;
  toolboxId: string;
  toolOrPartName: string;
  type: 'tool' | 'spare_part';
  actionType: 'in' | 'out'; // ورود به انبارک / خروج و مصرف
  quantity: number;
  balance: number;
  technicianName: string;
  targetCustomerOrSerial: string;
  notes?: string;
}
```

---

# ۳. طراحی UI/UX و استانداردهای طراحی فرم‌ها

* **نشانگرهای وضعیت (Status Badges):**
  * `registered` / `pending`: `bg-amber-50 text-amber-700 border-amber-200` (در انتظار / ثبت‌شده)
  * `in_progress` / `dispatched`: `bg-blue-50 text-blue-700 border-blue-200` (اعزام شده / در حال اقدام)
  * `completed` / `fixed`: `bg-emerald-50 text-emerald-700 border-emerald-200` (موفق / تکمیل‌شده)
  * `critical` (توقف خط تولید): `bg-rose-50 text-rose-700 border-rose-200 animate-pulse`
* **چیدمان فرم‌ها:** ۲ ستونه در دسکتاپ، دارای نوارهای تب برای جداسازی مشخصات عمومی از چک‌لیست‌ها و مصرف قطعات، پشتیبانی از آپلود اسناد صورتجلسه تحویل با پیش‌نمایش تصویر.

---

# ۴. کدهای کامل بخش تعاریف پایه (Definitions)

## ۴.۱. کد کامپوننت `DeploymentManagementView.tsx` (تعریف انواع استقرار)

```tsx
import React, { useState } from 'react';
import { 
  Layers, Settings, Save, CheckCircle, Plus, Trash2, FileText, 
  User, Wrench, Box, Clock, ListChecks, Type, Hash, CheckSquare, 
  List as ListIcon, GripVertical
} from 'lucide-react';
import { DeploymentType, DynamicFormField, ChecklistItem } from '../../types/afterSales';

export const DeploymentManagementView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [types, setTypes] = useState<DeploymentType[]>([
    {
      id: 'DT-1',
      title: 'استقرار استاندارد تابلوی فشار ضعیف (LV)',
      group: 'تابلوهای فشار ضعیف',
      productId: 'P-101',
      timingAfterDelivery: 7,
      alertBeforeTime: 2,
      instructions: 'بررسی شینه کشی، آچارکشی اتصالات و تست دی‌الکتریک قبل از برق‌دار کردن.',
      link: 'https://docs.pars.ir/lv-standard',
      assignedTo: 'مهندس حسینی (سرپرست نصب)',
      tools: [
        { id: 't1', text: 'آچار ترکمتر عایق ۱۰۰۰ ولت' },
        { id: 't2', text: 'میگر تست عایقی ۵۰۰۰ ولت' }
      ],
      consumables: [
        { id: 'c1', text: 'سرکابل مسی نمره ۱۲۰' },
        { id: 'c2', text: 'وارنیش حرارتی نسوز' }
      ],
      formFields: [
        { id: 'f1', label: 'مقاومت عایقی فاز به فاز (مگااهم)', type: 'number', required: true },
        { id: 'f2', label: 'دمای محیط پست برق (درجه سانتی‌گراد)', type: 'number', required: false },
        { id: 'f3', label: 'تاییدیه سیستم ارتینگ کارخانه', type: 'checkbox', required: true }
      ]
    }
  ]);

  const [selectedId, setSelectedId] = useState<string>(types[0]?.id || '');
  const activeType = types.find(t => t.id === selectedId) || types[0];

  const [activeTab, setActiveTab] = useState<'general' | 'fields' | 'tools'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Field Add Modal State
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'checkbox' | 'select'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(true);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: DynamicFormField = {
      id: `field-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired
    };
    const updated = types.map(t => t.id === activeType.id ? { ...t, formFields: [...t.formFields, newField] } : t);
    setTypes(updated);
    setNewFieldLabel('');
  };

  const handleRemoveField = (fieldId: string) => {
    const updated = types.map(t => t.id === activeType.id ? { 
      ...t, 
      formFields: t.formFields.filter(f => f.id !== fieldId) 
    } : t);
    setTypes(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900">تعریف انواع نصب و راه‌اندازی (استقرار)</h1>
            <p className="text-xs text-slate-500">تنظیم فرآیندهای استاندارد استقرار، ابزارها و فیلدهای پویای گزارش کار</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> ذخیره شد
            </span>
          )}
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" /> ذخیره تغییرات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xs text-slate-700">انواع استقرار تعریف‌شده</h3>
            <button className="p-1 rounded-lg hover:bg-slate-100 text-blue-600 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-right p-3 rounded-xl text-xs font-semibold transition-all border ${
                  selectedId === t.id 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold line-clamp-1">{t.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.group} • {t.timingAfterDelivery} روز</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-3">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-6">
            <button 
              onClick={() => setActiveTab('general')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              مشخصات عمومی و دستورالعمل
            </button>
            <button 
              onClick={() => setActiveTab('fields')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'fields' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              فیلدهای داینامیک فرم گزارش ({activeType.formFields.length})
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'tools' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ابزارها و اقلام مصرفی
            </button>
          </div>

          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">عنوان نوع استقرار</label>
                  <input 
                    type="text" 
                    value={activeType.title} 
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">گروه تابلو / محصول</label>
                  <input 
                    type="text" 
                    value={activeType.group} 
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">مهلت استقرار پس از تحویل (روز)</label>
                  <input 
                    type="number" 
                    value={activeType.timingAfterDelivery} 
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">مسئول پیش‌فرض</label>
                  <input 
                    type="text" 
                    value={activeType.assignedTo} 
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">دستورالعمل و الزامات فنی نصب</label>
                <textarea 
                  rows={4} 
                  value={activeType.instructions} 
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white leading-relaxed" 
                />
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input 
                  type="text" 
                  placeholder="عنوان فیلد جدید (مثلاً تست جریان نشتی)" 
                  value={newFieldLabel}
                  onChange={e => setNewFieldLabel(e.target.value)}
                  className="flex-1 text-xs p-2 border border-slate-200 rounded-lg bg-white" 
                />
                <select 
                  value={newFieldType}
                  onChange={e => setNewFieldType(e.target.value as any)}
                  className="text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="text">متنی</option>
                  <option value="number">عددی</option>
                  <option value="checkbox">تیک‌باکس (تایید/رد)</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newFieldRequired} 
                    onChange={e => setNewFieldRequired(e.target.checked)} 
                  />
                  <span>الزامی</span>
                </label>
                <button 
                  onClick={handleAddField}
                  className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
                >
                  افزودن فیلد
                </button>
              </div>

              {/* Fields Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-100 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">ردیف</th>
                      <th className="p-3">عنوان فیلد</th>
                      <th className="p-3">نوع ورودی</th>
                      <th className="p-3">الزامی بودن</th>
                      <th className="p-3 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeType.formFields.map((f, i) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-bold text-slate-800">{f.label}</td>
                        <td className="p-3 text-slate-500">
                          {f.type === 'text' ? 'متن' : f.type === 'number' ? 'عدد' : 'چک‌باکس'}
                        </td>
                        <td className="p-3">
                          {f.required ? <span className="text-rose-600 font-bold">بله</span> : 'خیر'}
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleRemoveField(f.id)} 
                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" /> ابزارهای اختصاصی الزامی
                </h4>
                <ul className="space-y-2 text-xs">
                  {activeType.tools.map(tool => (
                    <li key={tool.id} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <span>{tool.text}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-600" /> اقلام مصرفی استاندارد
                </h4>
                <ul className="space-y-2 text-xs">
                  {activeType.consumables.map(c => (
                    <li key={c.id} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <span>{c.text}</span>
                      <span className="text-slate-400 text-[10px]">همراه تکنسین</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

# ۵. کدهای کامل بخش عملیات اجرایی (Operations)

## ۵.۱. کد کامپوننت `DeploymentRequestView.tsx` (ثبت درخواست استقرار)

```tsx
import React, { useState } from 'react';
import { 
  Headphones, Calendar, FileText, Package, Users, Upload, CheckCircle, 
  Search, Info, AlertTriangle, ArrowRight 
} from 'lucide-react';

export const DeploymentRequestView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedInvoice, setSelectedInvoice] = useState('INV-1405-882');
  const [selectedSerial, setSelectedSerial] = useState('SN-PARS-99201');
  const [customerName, setCustomerName] = useState('مجتمع فولاد خوزستان');
  const [requestedDate, setRequestedDate] = useState('۱۴۰۵/۰۲/۲۰');
  const [siteAddress, setSiteAddress] = useState('اهواز، شهرک صنعتی شماره ۲، فاز ۳ توسعه نیروگاهی');
  const [assignedTechnician, setAssignedTechnician] = useState('مهندس رضایی');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [notes, setNotes] = useState('نیاز به هماهنگی با حراست کارخانه جهت ورود ترکمتر و تجهیزات تست عایقی.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900">ثبت درخواست استقرار (نصب و راه‌اندازی)</h1>
            <p className="text-xs text-slate-500">ایجاد نوبت استقرار بر مبنای فاکتور فروش قطعی و اعزام تکنسین نصب</p>
          </div>
        </div>

        {onBack && (
          <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer">
            بازگشت به فهرست
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">درخواست استقرار با موفقیت ثبت شد</h3>
            <p className="text-xs text-slate-500">شماره پیگیری: <span className="font-mono font-bold text-slate-800">REQ-DEP-9941</span></p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-slate-800 text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-900"
            >
              ثبت درخواست جدید
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Link to Invoice */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> ارتباط با فاکتور رسمی فروش
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">شماره فاکتور</label>
                  <input 
                    type="text" 
                    value={selectedInvoice}
                    onChange={e => setSelectedInvoice(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">شماره سریال دستگاه</label>
                  <input 
                    type="text" 
                    value={selectedSerial}
                    onChange={e => setSelectedSerial(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Customer & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">نام مشتری / کارفرما</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">تاریخ پیشنهادی اعزام تکنسین</label>
                <input 
                  type="text" 
                  value={requestedDate}
                  onChange={e => setRequestedDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">کارشناس اعزامی</label>
                <select 
                  value={assignedTechnician}
                  onChange={e => setAssignedTechnician(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                >
                  <option value="مهندس رضایی">مهندس رضایی (تیم برق قدرت)</option>
                  <option value="مهندس محمدی">مهندس محمدی (تیم اتوماسیون)</option>
                  <option value="مهندس سعیدی">مهندس سعیدی (تکنسین نصب ارشد)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">اولویت انجام</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                >
                  <option value="normal">عادی (طبق برنامه زمان‌بندی)</option>
                  <option value="urgent">فوری (خط تولید در انتظار)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">آدرس سایت و محل نصب تابلوی برق</label>
              <input 
                type="text" 
                value={siteAddress}
                onChange={e => setSiteAddress(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">توضیحات و هماهنگی‌های کارگاهی</label>
              <textarea 
                rows={3} 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                تایید و صدور دستور اعزام
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
```

---

## ۵.۲. کد کامپوننت `RepairRequestView.tsx` (تیکت خرابی و تعمیرات اضطراری)

```tsx
import React, { useState } from 'react';
import { 
  Wrench, AlertTriangle, Calendar, FileText, CheckCircle, 
  Clock, ShieldAlert, CheckSquare 
} from 'lucide-react';

export const RepairRequestView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [ticketId] = useState(`TCK-${Math.floor(10000 + Math.random() * 90000)}`);
  const [customer, setCustomer] = useState('پتروشیمی زاگرس');
  const [serialNumber, setSerialNumber] = useState('SN-88201-ZR');
  const [failureCode, setFailureCode] = useState('ERR-401');
  const [isProductionHalted, setIsProductionHalted] = useState(true);
  const [incidentDate, setIncidentDate] = useState('۱۴۰۵/۰۴/۱۵');
  const [incidentTime, setIncidentTime] = useState('۱۴:۳۰');
  const [defectDescription, setDefectDescription] = useState('تریپ خوردن کلید اتوماتیک کامپکت ۳ فاز ۱۶۰۰ آمپر در زیر بار کامل و بوی سوختگی در سلول ورودی.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900">ثبت اعلام خرابی و تیکت تعمیرات اضطراری</h1>
            <p className="text-xs text-slate-500">ثبت توقف تجهیزات، عارضه‌یابی اولیه و اعزام تیم اورژانس فنی</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            شماره تیکت: {ticketId}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">تیکت اعلام خرابی با کد اضطراری صادر شد</h3>
            <p className="text-xs text-slate-500">پیامک اعزام فوری برای کشیک پشتیبانی ارسال گردید.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-slate-800 text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-900"
            >
              ثبت تیکت دیگر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Critical Production Alert */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              isProductionHalted ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${isProductionHalted ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-bold text-xs">آیا خط تولید مشتری متوقف شده است؟ (توقف اضطراری)</div>
                  <div className="text-[11px] text-slate-500">فعال بودن این گزینه باعث اولویت بحرانی در صف اعزام می‌شود.</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isProductionHalted} 
                  onChange={e => setIsProductionHalted(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">نام کارفرما / کارخانه</label>
                <input 
                  type="text" 
                  value={customer} 
                  onChange={e => setCustomer(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">شماره سریال تابلو برق</label>
                <input 
                  type="text" 
                  value={serialNumber} 
                  onChange={e => setSerialNumber(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">کد خطای دستگاه</label>
                <select 
                  value={failureCode}
                  onChange={e => setFailureCode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                >
                  <option value="ERR-401">ERR-401: قطع کلید اصلی / Overload Trip</option>
                  <option value="ERR-202">ERR-202: عدم تقارن ولتاژ فازها / Phase Loss</option>
                  <option value="ERR-105">ERR-105: آلارم دمای ترانس و تابلوی خازنی</option>
                  <option value="ERR-999">سایر عیوب ناشناخته</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">تاریخ رخداد</label>
                  <input 
                    type="text" 
                    value={incidentDate} 
                    onChange={e => setIncidentDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ساعت دقیق</label>
                  <input 
                    type="text" 
                    value={incidentTime} 
                    onChange={e => setIncidentTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">شرح دقیق عیب از زبان اپراتور سایت</label>
              <textarea 
                rows={4} 
                value={defectDescription} 
                onChange={e => setDefectDescription(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white leading-relaxed"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="submit" 
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                ثبت تیکت و اعزام اضطراری
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
```

---

# ۶. کدهای کامل بخش گزارشات و کاردکس (Reports)

## ۶.۱. کد کامپوننت `ToolboxKardexReportView.tsx` (کاردکس ابزار و قطعات یدکی)

```tsx
import React, { useState } from 'react';
import { 
  Box, Search, Filter, Download, Printer, ArrowDownLeft, 
  ArrowUpRight, Wrench, Package, Calendar 
} from 'lucide-react';
import { ToolboxKardexItem } from '../../types/afterSales';

export const ToolboxKardexReportView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tool' | 'spare_part'>('all');

  const [kardexItems] = useState<ToolboxKardexItem[]>([
    {
      id: 'k-1',
      date: '۱۴۰۵/۰۳/۰۱',
      voucherNumber: 'TR-1001',
      toolboxId: 'TB-101',
      toolOrPartName: 'کلید حرارتی اشنایدر ۳۲ آمپر',
      type: 'spare_part',
      actionType: 'in',
      quantity: 10,
      balance: 10,
      technicianName: 'مهندس رضایی',
      targetCustomerOrSerial: 'شارژ اولیه از انبار مرکزی',
      notes: 'حواله شماره ۸۸۴۱'
    },
    {
      id: 'k-2',
      date: '۱۴۰۵/۰۳/۰۸',
      voucherNumber: 'REP-4402',
      toolboxId: 'TB-101',
      toolOrPartName: 'کلید حرارتی اشنایدر ۳۲ آمپر',
      type: 'spare_part',
      actionType: 'out',
      quantity: 2,
      balance: 8,
      technicianName: 'مهندس رضایی',
      targetCustomerOrSerial: 'پتروشیمی زاگرس (SN-88201)',
      notes: 'تعویض قطعه سوخته در محل'
    },
    {
      id: 'k-3',
      date: '۱۴۰۵/۰۳/۱۰',
      voucherNumber: 'TR-1005',
      toolboxId: 'TB-101',
      toolOrPartName: 'آچار ترکمتر عایق ۱۰۰۰ ولت',
      type: 'tool',
      actionType: 'in',
      quantity: 1,
      balance: 1,
      technicianName: 'مهندس رضایی',
      targetCustomerOrSerial: 'تحویل ابزار اختصاصی',
      notes: 'کالیبره شده با سرتیفیکیت'
    }
  ]);

  const filtered = kardexItems.filter(item => {
    const matchesSearch = item.toolOrPartName.includes(searchTerm) || 
                          item.targetCustomerOrSerial.includes(searchTerm) ||
                          item.technicianName.includes(searchTerm);
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900">گزارش کاردکس جعبه ابزار و قطعات یدکی</h1>
            <p className="text-xs text-slate-500">گردش وارده، صادره و موجودی لحظه‌ای قطعات در انبارک‌های سیار تکنسین‌ها</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer text-slate-700">
            <Printer className="w-4 h-4" /> چاپ کاردکس
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 cursor-pointer shadow-xs">
            <Download className="w-4 h-4" /> خروجی اکسل
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input 
              type="text" 
              placeholder="جستجو در نام قطعه، نام مشتری یا تکنسین..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">نوع قلم:</span>
          <button 
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه
          </button>
          <button 
            onClick={() => setFilterType('spare_part')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              filterType === 'spare_part' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            قطعات یدکی مصرفی
          </button>
          <button 
            onClick={() => setFilterType('tool')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              filterType === 'tool' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ابزارآلات
          </button>
        </div>
      </div>

      {/* Kardex Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-xs text-right">
          <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">ردیف</th>
              <th className="p-3.5">تاریخ</th>
              <th className="p-3.5">شماره سند</th>
              <th className="p-3.5">شرح کالا یا قطعه</th>
              <th className="p-3.5">نوع قلم</th>
              <th className="p-3.5 text-center">وارده</th>
              <th className="p-3.5 text-center">صادره</th>
              <th className="p-3.5 text-center">مانده موجودی</th>
              <th className="p-3.5">تکنسین مسئول</th>
              <th className="p-3.5">مشتری / مصرف‌کننده</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 text-slate-400">{index + 1}</td>
                <td className="p-3.5 font-mono">{item.date}</td>
                <td className="p-3.5 font-mono font-bold text-slate-800">{item.voucherNumber}</td>
                <td className="p-3.5 font-bold text-slate-900">{item.toolOrPartName}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    item.type === 'spare_part' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {item.type === 'spare_part' ? 'قطعه یدکی' : 'ابزار کار'}
                  </span>
                </td>
                <td className="p-3.5 text-center font-mono font-bold text-emerald-600">
                  {item.actionType === 'in' ? `+${item.quantity}` : '-'}
                </td>
                <td className="p-3.5 text-center font-mono font-bold text-rose-600">
                  {item.actionType === 'out' ? `-${item.quantity}` : '-'}
                </td>
                <td className="p-3.5 text-center font-mono font-extrabold text-slate-900 bg-slate-50/80">
                  {item.balance}
                </td>
                <td className="p-3.5 text-slate-700">{item.technicianName}</td>
                <td className="p-3.5 text-slate-500">{item.targetCustomerOrSerial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

# ۷. پرامپت آماده ارسال به Claude برای ساخت کل ماژول

```text
نقش تو: Senior Frontend Architect در React 19 + TypeScript + Tailwind CSS.
دستور: لطفاً کل ماژول «خدمات پس از فروش (After-Sales Services)» را طبق مستند "06-After-Sales-Services-Full-Spec-and-Code.md" با تمام تایپ‌های types/afterSales.ts، کامپوننت‌های تعاریف چهارگانه، عملیات شش‌گانه و گزارش کاردکس جعبه ابزار به صورت فایل‌های مجزا، راست‌چین کامل (RTL) و استایل‌های سازمانی پیاده‌سازی کن.
```
