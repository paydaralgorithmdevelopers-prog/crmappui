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
  score?: number;
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
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'telegram'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'threads'
  | 'mobile_app'
  | 'webinar'
  | 'video_call'
  | 'event'
  | 'outdoor'
  | 'aparat'
  | 'rubika'
  | 'eitaa'
  | 'bale'
  | 'soroush'
  | 'audio_visual'
  | 'printed'
  | 'direct_mail'
  | 'digital_ads'
  | 'influencer'
  | 'google_ads';

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

// =================== BPMS - پلتفرم روندها ===================
export interface ProcessDefinition {
  id: string | number;
  title: string;
  code: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  creator: string;
  createDate: string;
  usageCount: number;
}

export interface ProcessInstance {
  id: string;
  processDefinitionId: string | number;
  title: string;
  createdAt: string;
  lastUpdate: string;
  currentStage: string;
  progress: number; // 0 to 100
  responsible: string;
}

// =================== Treasury (خزانه‌داری) ===================

export interface BankAccount {
  id: string;
  title: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  iban: string; // شبا
  cardNumber?: string;
  currency: string;
  glAccountId: string; // حساب معین
  detailedAccountId?: string; // تفصیلی
  isActive: boolean;
  description?: string;
}

export interface CashBox {
  id: string;
  code: string;
  title: string;
  branch: string;
  responsible: string;
  currency: string;
  glAccountId: string;
  detailedAccountId?: string;
  isActive: boolean;
  description?: string;
}

export interface POSTerminal {
  id: string;
  title: string;
  terminalNumber: string;
  merchantId: string;
  bankAccountId: string; // حساب بانکی مقصد
  bankName: string;
  branch: string;
  glAccountId: string;
  isActive: boolean;
}

export interface PaymentGateway {
  id: string;
  title: string;
  provider: string;
  merchantId: string;
  bankAccountId: string;
  settlementPeriod: string;
  glAccountId: string;
  isActive: boolean;
  description?: string;
}

export interface PettyCash {
  id: string;
  code: string;
  title: string;
  responsiblePerson: string;
  department: string;
  limit: number;
  currency: string;
  glAccountId: string;
  isActive: boolean;
}

export interface Checkbook {
  id: string;
  bankAccountId: string;
  bankName: string;
  seriesNumber: string;
  fromNumber: number;
  toNumber: number;
  leafCount: number;
  receivedDate: string;
  status: 'active' | 'finished' | 'archived';
  description?: string;
}

export type TreasuryTransactionType = 'cash' | 'check' | 'document';
export type TreasuryOperationType = 'receive' | 'pay' | 'transfer';

export interface TreasuryOperation {
  id: string;
  date: string;
  voucherNumber: string;
  accountingVoucherNumber?: string;
  description: string;
  baseCurrency: string;
  exchangeRateMain: number;
  exchangeRateSub: number;
  fiscalYear: string;
  transactionType: TreasuryTransactionType;
  operationType: TreasuryOperationType;
  linkedInvoiceId?: string;
  amount: number;
  fee: number;
  
  sourceType: 'partner' | 'bank' | 'cashbox' | 'pos' | 'gateway' | 'pettycash' | 'check';
  sourceId: string;
  
  destinationType: 'partner' | 'bank' | 'cashbox' | 'pos' | 'gateway' | 'pettycash' | 'check';
  destinationId: string;
  
  // Check details if transactionType is 'check'
  checkNumber?: string;
  checkDueDate?: string;
  sayadNumber?: string;
  issuerBank?: string;
}

export type CheckStatus = 
  | 'received' | 'waiting_deposit' | 'in_vault' | 'in_collection' | 'cleared' | 'returned_from_bank' | 'endorsed' | 'bounced' | 'cancelled'
  | 'issued' | 'delivered' | 'paid' | 'returned';

export interface CheckInstance {
  id: string;
  amount: number;
  partnerId: string;
  bankName: string;
  currentVaultId?: string;
  checkNumber: string;
  dueDate: string;
  sayadNumber: string;
  description?: string;
  type: 'incoming' | 'outgoing';
  status: CheckStatus;
  currentLocation: string;
}

export interface CheckOperation {
  id: string;
  type: 
    | 'to_vault' | 'to_bank' | 'return_from_bank' | 'collection' | 'endorse' 
    | 'settle_payment' | 'return_payment' | 'cancel';
  checkId: string;
  date: string;
  vaultId?: string;
  partnerId?: string;
  bankAccountId?: string;
  fee: number;
  description: string;
}

