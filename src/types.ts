export interface TargetGroup {
  id: string;
  code: string;
  title: string;
  parentId: string | null;
  description: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  targetIndustry: string;
  expectedAnnualValue: number;
  assignedLeadIds: string[];
  createdAt: string;
  updatedAt: string;
  children?: TargetGroup[];
}

export interface Lead {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  city: string;
  province: string;
  industry: string;
  source: 'نمایشگاه بین‌المللی' | 'وب‌سایت' | 'معرف' | 'تماس مستقیم' | 'کمپین تبلیغاتی';
  status: 'تازه' | 'در حال ارزیابی' | 'مذاکره اولیه' | 'پیش‌فاکتور صادر شده' | 'تبدیل شده';
  estimatedValue: number; // in Rials
  tags: string[];
  assignedDate?: string;
}

export type SelectionMode = 'from_list' | 'custom_filter' | 'custom_manual';

export interface DynamicFilterRule {
  id: string;
  field: 'industry' | 'city' | 'status' | 'source';
  operator: 'equals' | 'contains' | 'greater_than' | 'in';
  value: string;
}

// =================== تعاریف رسانه و KPI ===================
export type MainMediaType =
  | 'linkedin'
  | 'website'
  | 'instagram'
  | 'sms'
  | 'exhibition'
  | 'email';

export interface MediaSignalField {
  id: string;
  code: string;
  name: string; // نام فیلد
  description?: string;
  unit: string; // واحد سنجش
  targetType: 'min' | 'max' | 'exact'; // نوع تارگت
  targetValue: number; // مقدار تارگت (OKR)
  kpiValue?: number; // میزان تحقق (KPI)
  startDate?: string; // تاریخ شروع سیگنال
  metricType?: 'metric' | 'rate'; // نوع اطلاعات
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'per_campaign';
  weight: number; 
  isActive: boolean; 
}

export interface MediaChannel {
  id: string; // ID رسانه
  code: string; // کد سیگنال / رسانه
  title: string; // نام عنوان رسانه
  mainType: MainMediaType; // انتخاب تایپ اصلی (لینکدین، وب‌سایت و...)
  category: string; // دسته‌بندی ساختار هرمی در بک‌اند
  urlOrHandle?: string;
  manager?: string;
  status: 'active' | 'inactive' | 'testing';
  signals: MediaSignalField[]; // فیلدها و تارگت‌های KPI ست شده
  createdAt: string;
  updatedAt: string;
}

// =================== تعریف کمپین ===================
export interface CampaignMetric {
  id: string;
  name: string;
  unit: string;
  targetType: 'min' | 'max' | 'exact';
  targetValue: number;
  metricType: 'metric' | 'rate';
  isActive: boolean;
}

export interface CampaignSignalSelection {
  signalId: string;
  startDate: string;
}

export interface CampaignMediaSelection {
  mediaId: string;
  signals: CampaignSignalSelection[];
}

export interface Campaign {
  id: string;
  title: string;
  targetGroupId?: string;
  slogan?: string;
  goal?: string;
  budget?: number;
  startDate: string;
  endDate: string;
  instructions?: string;
  attachments?: string[];
  status: 'draft' | 'active' | 'completed';
  metrics: CampaignMetric[]; 
  mediaSelections: CampaignMediaSelection[];
}

