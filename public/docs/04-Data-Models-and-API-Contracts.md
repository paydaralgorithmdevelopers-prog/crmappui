# 📊 فرهنگ داده‌ها و قراردادهای API (Data Dictionary & API Contracts)
**سیستم:** مدیریت فروش و بازاریابی  
**فرمت تبادل داده:** JSON (RESTful & WebSocket)  

---

## ۱. مدل داده‌های پایه (Base Entities)

```typescript
// ۱. سرنخ و مشتری
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
  estimatedValue: number;
  tags: string[];
  score?: number;
  assignedDate?: string;
}

// ۲. فرصت فروش (Opportunity)
export interface Opportunity {
  id: string;
  leadId: string;
  date: string;
  baseCurrency: 'IRR' | 'USD' | 'EUR';
  mainExchangeRate: number;
  secondaryExchangeRate: number;
  winProbability: number; // 0 - 100
  items: Array<{
    id: number | string;
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
  }>;
  status: 'draft' | 'under_review' | 'won' | 'lost' | 'converted_to_proforma';
}

// ۳. پیش‌فاکتور و فاکتور فروش
export interface SalesInvoice {
  id: string;
  proformaId?: string;
  customerId: string;
  date: string;
  dueDate: string;
  baseCurrency: string;
  mainExchangeRate: number;
  secondaryExchangeRate: number;
  items: Array<{
    id: number | string;
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    taxAmount: number;
    additionalChargeAmount: number;
    lineTotal: number;
  }>;
  subTotal: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  paidAmount: number;
  status: 'draft' | 'approved' | 'partially_paid' | 'paid' | 'cancelled';
}

// ۴. مدل خدمات پس از فروش (تعمیرات / استقرار)
export interface AfterSalesTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  productId: string;
  serialNumber: string;
  type: 'deployment' | 'maintenance' | 'repair';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  technicianId?: string;
  status: 'registered' | 'assigned' | 'in_progress' | 'completed' | 'signed_off';
  partsUsed?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    unitCost: number;
  }>;
}
```

---

## ۲. مشخصات و قراردادهای API (REST Endpoints)

| متد | مسیر اندپوینت (Endpoint) | شرح عملکرد |
| :--- | :--- | :--- |
| `GET` | `/api/v1/sales/leads` | دریافت لیست سرنخ‌ها با قابلیت صفحه‌بندی و فیلتر |
| `POST` | `/api/v1/sales/opportunities` | ثبت فرصت فروش جدید |
| `POST` | `/api/v1/sales/invoices/proforma` | صدور پیش‌فاکتور جدید با اعتبارسنجی ارزی |
| `PUT` | `/api/v1/sales/invoices/:id/convert` | تبدیل پیش‌فاکتور به فاکتور رسمی فروش |
| `POST` | `/api/v1/sales/receipts` | ثبت رسید وصولی و ایجاد تراکنش در خزانه‌داری |
| `GET` | `/api/v1/commissions/calculate` | دریافت گزارش محاسبات پورسانت کارشناسان |
| `POST` | `/api/v1/after-sales/tickets` | ثبت تیکت جدید استقرار یا تعمیرات |
