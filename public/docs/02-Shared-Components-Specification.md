# 🧩 سند جامع کامپوننت‌های مشترک سازمانی (Shared Components Architecture)
**مسیر پیاده‌سازی:** `src/components/shared/`  
**تکنولوژی:** React 19 + TypeScript + Tailwind CSS + Lucide React  

---

## ۱. فهرست کامپوننت‌های مشترک

### ۱. `EnterpriseDataTable<T>` (`src/components/shared/EnterpriseDataTable.tsx`)
جدول سازمانی با پشتیبانی کامل از تایپ جنریک `<T>`.
* **امکانات:**
  * جستجوی سریع در تمام ستون‌ها به صورت Real-time
  * سورت صعودی و نزولی بر روی ستون‌های دارای `sortable: true`
  * قابلیت انتخاب ردیف‌ها (Checkbox) با کلید «انتخاب همه» و نوار اکشن گروهی (Bulk Actions)
  * دکمه‌های پرینت و خروجی اکسل/CSV
  * انتخاب اندازه صفحه (۱۰، ۲۵، ۵۰، ۱۰۰) و پیجینیشن روان
  * حالت‌های بارگذاری (Skeleton Loading) و صفحه خالی (Empty State)

### ۲. `ViewActionHeader` (`src/components/shared/ViewActionHeader.tsx`)
هدر استاندارد تمام صفحات ماژول.
* **امکانات:**
  * عنوان درشت، زیرعنوان خاکستری و آیکون با کادر رنگی اختصاصی
  * مسیر جاری (Breadcrumbs)
  * دکمه پین کردن زبانه جاری در سایدبار (`Pin` / `PinOff`)
  * محل قرارگیری دکمه‌های اقدام ویژه صفحه (Primary & Secondary Actions)

### ۳. `StatusBadge` (`src/components/shared/StatusBadge.tsx`)
بج نشانگر وضعیت با رنگ‌بندی استاندارد معنایی.
* **انواع Variant:**
  * `success`: تایید شده، پرداخت شده، برنده معامله (سبز)
  * `warning`: پیش‌نویس، در حال مذاکره، معوق (زرد)
  * `danger`: رد شده، لغو شده، باخته معامله (قرمز)
  * `info`: لید تازه، ارسال شده، ارزیابی اولیه (آبی)
  * `neutral`: خنثی، بایگانی شده (خاکستری)
* دارای آپشن نمایش دایره چشمک‌زن (Pulsing Dot Indicator).

### ۴. `KpiCard` (`src/components/shared/KpiCard.tsx`)
کارت‌های خلاصه عملکرد برای بالای داشبوردها.
* **امکانات:**
  * نمایش مقدار عددی با فرمت هزارگانی و واحد سنجش
  * نوار پیشرفت درصد تحقق تارگت (Progress Bar)
  * نمایش درصد رشد نسبت به دوره قبل همراه با آیکون ترند (`TrendingUp` / `TrendingDown`)

### ۵. `EntityDrawer` (`src/components/shared/EntityDrawer.tsx`)
کشوی جانبی اسلایدی از سمت راست جهت مشاهده و ویرایش سریع سند.
* **امکانات:**
  * انیمیشن نرم باز و بسته شدن با پوشش تیره پشت صحنه (Backdrop Blur)
  * هدر و فوتر چسبان (Sticky) برای دکمه‌های ذخیره و انصراف
  * بسته شدن با دکمه Esc یا کلیک بیرون کادر

### ۶. `ExchangeRateBar` (`src/components/shared/ExchangeRateBar.tsx`)
نوار نرخ ارز و چندارزی برای فرم‌های پیش‌فاکتور، فاکتور و فرصت فروش.
* **امکانات:**
  * انتخاب ارز پایه (ریال، درهم، دلار، یورو)
  * ورودی نرخ برابری ارز اصلی و فرعی با فرمت‌دهی خودکار
  * تبدیل لحظه‌ای مبالغ

### ۷. `JalaliDateFilter` (`src/components/shared/JalaliDateFilter.tsx`)
فیلتر تاریخ شمسی به همراه دکمه‌های سریع دوره‌ای.
* **پریست‌ها:** امروز، این هفته، این ماه، فصل جاری، سال ۱۴۰۵، همه.

### ۸. `TimelineStream` (`src/components/shared/TimelineStream.tsx`)
استریم تایم‌لاین عمودی رویدادها، تاریخچه تماس‌ها، یادداشت‌ها و لاگ‌ها با فرم ثبت سریع یادداشت جدید.

### ۹. `ActionConfirmModal` (`src/components/shared/ActionConfirmModal.tsx`)
مودال تایید قطعی یا رد عملیات‌های حساس (ابطال فاکتور، حذف، تایید گردش کار) با فیلد اختیاری ثبت دلیل.

### ۱۰. `DualCurrencyAmount` (`src/components/shared/DualCurrencyAmount.tsx`)
نمایشگر خوانای مبالغ ریالی با تفکیک سه رقمی و معادل تومانی یا دلاری اختیاری.
