import { MediaChannel, MainMediaType, MediaSignalField } from '../types';

export interface MediaTypeOption {
  type: MainMediaType;
  title: string;
  category: string;
  iconName: string;
  defaultSignals: Omit<MediaSignalField, 'id'>[];
}

export const mediaTypeTemplates: Record<MainMediaType, MediaTypeOption> = {
  email: {
    type: 'email',
    title: 'ایمیل (Email)',
    category: 'ارتباطات مستقیم دیجیتال',
    iconName: 'Mail',
    defaultSignals: [
      { code: 'SIG-EML-01', name: 'تعداد ارسال (Total Sent)', unit: 'عدد', targetType: 'min', targetValue: 5000, period: 'monthly', weight: 10, isActive: true },
      { code: 'SIG-EML-02', name: 'نرخ تحویل (Delivery Rate)', unit: 'درصد', targetType: 'min', targetValue: 98, period: 'monthly', weight: 15, isActive: true },
      { code: 'SIG-EML-03', name: 'نرخ باز شدن (Open Rate)', unit: 'درصد', targetType: 'min', targetValue: 25, period: 'monthly', weight: 25, isActive: true },
      { code: 'SIG-EML-04', name: 'نرخ کلیک (Click Rate)', unit: 'درصد', targetType: 'min', targetValue: 5, period: 'monthly', weight: 30, isActive: true },
      { code: 'SIG-EML-05', name: 'لید ایجاد شده (Leads)', unit: 'نفر', targetType: 'min', targetValue: 50, period: 'monthly', weight: 20, isActive: true },
    ]
  },
  sms: {
    type: 'sms',
    title: 'پیامک (SMS)',
    category: 'ارتباطات مستقیم',
    iconName: 'MessageSquare',
    defaultSignals: [
      { code: 'SIG-SMS-01', name: 'تعداد ارسال شده', unit: 'عدد', targetType: 'min', targetValue: 10000, period: 'per_campaign', weight: 20, isActive: true },
      { code: 'SIG-SMS-02', name: 'نرخ تحویل موفق', unit: 'درصد', targetType: 'min', targetValue: 95, period: 'per_campaign', weight: 30, isActive: true },
      { code: 'SIG-SMS-03', name: 'کلیک روی لینک', unit: 'عدد', targetType: 'min', targetValue: 800, period: 'per_campaign', weight: 50, isActive: true },
    ]
  },
  phone: {
    type: 'phone',
    title: 'تماس تلفنی (Phone)',
    category: 'ارتباطات کلامی',
    iconName: 'Phone',
    defaultSignals: [
      { code: 'SIG-PHN-01', name: 'تعداد تماس خروجی', unit: 'تماس', targetType: 'min', targetValue: 200, period: 'weekly', weight: 30, isActive: true },
      { code: 'SIG-PHN-02', name: 'نرخ پاسخ‌گویی', unit: 'درصد', targetType: 'min', targetValue: 70, period: 'weekly', weight: 30, isActive: true },
      { code: 'SIG-PHN-03', name: 'میانگین مدت مکالمه', unit: 'ثانیه', targetType: 'min', targetValue: 120, period: 'weekly', weight: 40, isActive: true },
    ]
  },
  whatsapp: {
    type: 'whatsapp',
    title: 'واتساپ (WhatsApp)',
    category: 'پیام‌رسان‌ها',
    iconName: 'MessageCircle',
    defaultSignals: [
      { code: 'SIG-WAP-01', name: 'پیام ارسالی تکی', unit: 'پیام', targetType: 'min', targetValue: 500, period: 'monthly', weight: 20, isActive: true },
      { code: 'SIG-WAP-02', name: 'نرخ خوانده شدن', unit: 'درصد', targetType: 'min', targetValue: 90, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-WAP-03', name: 'لید تولید شده', unit: 'نفر', targetType: 'min', targetValue: 20, period: 'monthly', weight: 40, isActive: true },
    ]
  },
  telegram: {
    type: 'telegram',
    title: 'تلگرام (Telegram)',
    category: 'پیام‌رسان‌ها',
    iconName: 'Send',
    defaultSignals: [
      { code: 'SIG-TEL-01', name: 'بازدید پست کانال', unit: 'بازدید', targetType: 'min', targetValue: 5000, period: 'weekly', weight: 30, isActive: true },
      { code: 'SIG-TEL-02', name: 'تعداد واکنش (Reaction)', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'weekly', weight: 30, isActive: true },
      { code: 'SIG-TEL-03', name: 'لینک کلیک شده', unit: 'عدد', targetType: 'min', targetValue: 250, period: 'weekly', weight: 40, isActive: true },
    ]
  },
  linkedin: {
    type: 'linkedin',
    title: 'لینکدین (LinkedIn)',
    category: 'شبکه‌های اجتماعی متخصصین',
    iconName: 'Linkedin',
    defaultSignals: [
      { code: 'SIG-LNK-01', name: 'نمایش پست (Impressions)', unit: 'نمایش', targetType: 'min', targetValue: 10000, period: 'monthly', weight: 20, isActive: true },
      { code: 'SIG-LNK-02', name: 'نرخ تعامل (Engagement)', unit: 'درصد', targetType: 'min', targetValue: 4, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-LNK-03', name: 'InMail ارسالی', unit: 'عدد', targetType: 'min', targetValue: 50, period: 'monthly', weight: 40, isActive: true },
    ]
  },
  instagram: {
    type: 'instagram',
    title: 'اینستاگرام (Instagram)',
    category: 'شبکه‌های اجتماعی تصویری',
    iconName: 'Instagram',
    defaultSignals: [
      { code: 'SIG-INS-01', name: 'بازدید ریلز (Reel Views)', unit: 'بازدید', targetType: 'min', targetValue: 20000, period: 'monthly', weight: 30, isActive: true },
      { code: 'SIG-INS-02', name: 'پاسخ به استوری', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'monthly', weight: 30, isActive: true },
      { code: 'SIG-INS-03', name: 'کلیک روی لینک بیو', unit: 'عدد', targetType: 'min', targetValue: 500, period: 'monthly', weight: 40, isActive: true },
    ]
  },
  facebook: {
    type: 'facebook',
    title: 'فیسبوک (Facebook)',
    category: 'شبکه‌های اجتماعی عمومی',
    iconName: 'Facebook',
    defaultSignals: [
      { code: 'SIG-FBK-01', name: 'نمایش پست', unit: 'نمایش', targetType: 'min', targetValue: 5000, period: 'monthly', weight: 50, isActive: true },
      { code: 'SIG-FBK-02', name: 'اشتراک‌گذاری', unit: 'عدد', targetType: 'min', targetValue: 50, period: 'monthly', weight: 50, isActive: true },
    ]
  },
  twitter: {
    type: 'twitter',
    title: 'ایکس / توییتر (X)',
    category: 'شبکه‌های اجتماعی متنی',
    iconName: 'Twitter',
    defaultSignals: [
      { code: 'SIG-XTR-01', name: 'تعداد ریتوییت (Repost)', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'monthly', weight: 50, isActive: true },
      { code: 'SIG-XTR-02', name: 'نمایش پست', unit: 'نمایش', targetType: 'min', targetValue: 8000, period: 'monthly', weight: 50, isActive: true },
    ]
  },
  tiktok: {
    type: 'tiktok',
    title: 'تیک‌تاک (TikTok)',
    category: 'ویدیو کوتاه',
    iconName: 'Music',
    defaultSignals: [
      { code: 'SIG-TIK-01', name: 'مجموع لایک ویدیو', unit: 'عدد', targetType: 'min', targetValue: 5000, period: 'monthly', weight: 50, isActive: true },
      { code: 'SIG-TIK-02', name: 'اشتراک‌گذاری ویدیو', unit: 'عدد', targetType: 'min', targetValue: 200, period: 'monthly', weight: 50, isActive: true },
    ]
  },
  youtube: {
    type: 'youtube',
    title: 'یوتیوب (YouTube)',
    category: 'پلتفرم ویدیو',
    iconName: 'Youtube',
    defaultSignals: [
      { code: 'SIG-YTB-01', name: 'زمان تماشا (Watch Time)', unit: 'ساعت', targetType: 'min', targetValue: 1000, period: 'monthly', weight: 60, isActive: true },
      { code: 'SIG-YTB-02', name: 'تعداد سابسکرایب جدید', unit: 'نفر', targetType: 'min', targetValue: 100, period: 'monthly', weight: 40, isActive: true },
    ]
  },
  pinterest: {
    type: 'pinterest',
    title: 'پینترست (Pinterest)',
    category: 'تصویر و ایده',
    iconName: 'Image',
    defaultSignals: [
      { code: 'SIG-PIN-01', name: 'تعداد ذخیره (Saves)', unit: 'عدد', targetType: 'min', targetValue: 300, period: 'monthly', weight: 100, isActive: true },
    ]
  },
  threads: {
    type: 'threads',
    title: 'تردز (Threads)',
    category: 'شبکه‌های اجتماعی متنی',
    iconName: 'AtSign',
    defaultSignals: [
      { code: 'SIG-THR-01', name: 'تعداد ریپلای', unit: 'عدد', targetType: 'min', targetValue: 50, period: 'monthly', weight: 100, isActive: true },
    ]
  },
  website: {
    type: 'website',
    title: 'وب‌سایت (Website)',
    category: 'رسانه‌های اختصاصی',
    iconName: 'Globe',
    defaultSignals: [
      { code: 'SIG-WEB-01', name: 'بازدید کل (Page Views)', unit: 'بازدید', targetType: 'min', targetValue: 50000, period: 'monthly', weight: 30, isActive: true },
      { code: 'SIG-WEB-02', name: 'تکمیل فرم تماس', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-WEB-03', name: 'درخواست دمو', unit: 'عدد', targetType: 'min', targetValue: 20, period: 'monthly', weight: 30, isActive: true },
    ]
  },
  mobile_app: {
    type: 'mobile_app',
    title: 'اپلیکیشن موبایل (Mobile App)',
    category: 'رسانه‌های اختصاصی',
    iconName: 'Smartphone',
    defaultSignals: [
      { code: 'SIG-APP-01', name: 'نصب فعال', unit: 'عدد', targetType: 'min', targetValue: 10000, period: 'monthly', weight: 50, isActive: true },
      { code: 'SIG-APP-02', name: 'کاربر فعال روزانه (DAU)', unit: 'نفر', targetType: 'min', targetValue: 800, period: 'monthly', weight: 50, isActive: true },
    ]
  },
  webinar: {
    type: 'webinar',
    title: 'وبینار (Webinar)',
    category: 'رویداد دیجیتال',
    iconName: 'Video',
    defaultSignals: [
      { code: 'SIG-WBN-01', name: 'تعداد ثبت‌نام کنندگان', unit: 'نفر', targetType: 'min', targetValue: 200, period: 'per_campaign', weight: 50, isActive: true },
      { code: 'SIG-WBN-02', name: 'تعداد شرکت‌کنندگان', unit: 'نفر', targetType: 'min', targetValue: 120, period: 'per_campaign', weight: 50, isActive: true },
    ]
  },
  video_call: {
    type: 'video_call',
    title: 'جلسه تصویری (Video Call)',
    category: 'ارتباطات کلامی',
    iconName: 'Video',
    defaultSignals: [
      { code: 'SIG-VCL-01', name: 'تعداد جلسات دمو', unit: 'جلسه', targetType: 'min', targetValue: 10, period: 'weekly', weight: 100, isActive: true },
    ]
  },
  exhibition: {
    type: 'exhibition',
    title: 'نمایشگاه (Exhibition)',
    category: 'رویداد حضوری',
    iconName: 'MapPin',
    defaultSignals: [
      { code: 'SIG-EXH-01', name: 'تعداد لید جذب شده', unit: 'نفر', targetType: 'min', targetValue: 100, period: 'per_campaign', weight: 100, isActive: true },
    ]
  },
  event: {
    type: 'event',
    title: 'رویداد (Event)',
    category: 'رویداد حضوری',
    iconName: 'Calendar',
    defaultSignals: [
      { code: 'SIG-EVN-01', name: 'تعداد شرکت‌کنندگان', unit: 'نفر', targetType: 'min', targetValue: 500, period: 'per_campaign', weight: 100, isActive: true },
    ]
  },
  outdoor: {
    type: 'outdoor',
    title: 'تبلیغات محیطی (Outdoor)',
    category: 'تبلیغات فیزیکی',
    iconName: 'Layout',
    defaultSignals: [
      { code: 'SIG-OUT-01', name: 'تعداد اسکن QR کد', unit: 'عدد', targetType: 'min', targetValue: 1000, period: 'monthly', weight: 100, isActive: true },
    ]
  },
  aparat: {
    type: 'aparat',
    title: 'آپارات (Aparat)',
    category: 'ویدیو داخلی',
    iconName: 'PlayCircle',
    defaultSignals: [
      { code: 'SIG-APR-01', name: 'بازدید ویدئو (Total Views)', unit: 'بازدید', targetType: 'min', targetValue: 5000, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-APR-02', name: 'تعداد پسند (Likes)', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'monthly', weight: 30, isActive: true },
      { code: 'SIG-APR-03', name: 'تعداد دنبال‌کننده جدید', unit: 'نفر', targetType: 'min', targetValue: 50, period: 'monthly', weight: 30, isActive: true },
    ]
  },
  rubika: {
    type: 'rubika',
    title: 'روبیکا (Rubika)',
    category: 'رسانه داخلی',
    iconName: 'MessageSquare',
    defaultSignals: [
      { code: 'SIG-RUB-01', name: 'بازدید پست کانال', unit: 'بازدید', targetType: 'min', targetValue: 3000, period: 'weekly', weight: 50, isActive: true },
      { code: 'SIG-RUB-02', name: 'تعداد لایک روبینو', unit: 'عدد', targetType: 'min', targetValue: 200, period: 'weekly', weight: 50, isActive: true },
    ]
  },
  eitaa: {
    type: 'eitaa',
    title: 'ایتا (Eitaa)',
    category: 'پیام‌رسان داخلی',
    iconName: 'Send',
    defaultSignals: [
      { code: 'SIG-EIT-01', name: 'تعداد بازدید کانال', unit: 'بازدید', targetType: 'min', targetValue: 4000, period: 'weekly', weight: 100, isActive: true },
    ]
  },
  bale: {
    type: 'bale',
    title: 'بله (Bale)',
    category: 'پیام‌رسان داخلی',
    iconName: 'CheckCircle',
    defaultSignals: [
      { code: 'SIG-BAL-01', name: 'تعداد واکنش پست', unit: 'عدد', targetType: 'min', targetValue: 150, period: 'weekly', weight: 100, isActive: true },
    ]
  },
  soroush: {
    type: 'soroush',
    title: 'سروش پلاس (Soroush+)',
    category: 'پیام‌رسان داخلی',
    iconName: 'MessageSquare',
    defaultSignals: [
      { code: 'SIG-SOR-01', name: 'تعداد بازدید پست', unit: 'بازدید', targetType: 'min', targetValue: 2000, period: 'weekly', weight: 100, isActive: true },
    ]
  },
  audio_visual: {
    type: 'audio_visual',
    title: 'رسانه‌های صوتی و تصویری',
    category: 'رسانه‌های جمعی',
    iconName: 'Tv',
    defaultSignals: [
      { code: 'SIG-AV-01', name: 'تعداد نوبت پخش', unit: 'عدد', targetType: 'min', targetValue: 30, period: 'monthly', weight: 100, isActive: true },
    ]
  },
  printed: {
    type: 'printed',
    title: 'رسانه‌های چاپی',
    category: 'رسانه‌های جمعی',
    iconName: 'FileText',
    defaultSignals: [
      { code: 'SIG-PRN-01', name: 'تعداد نسخه توزیع شده', unit: 'نسخه', targetType: 'min', targetValue: 1000, period: 'per_campaign', weight: 100, isActive: true },
    ]
  },
  direct_mail: {
    type: 'direct_mail',
    title: 'ارسال مستقیم (Direct Mail)',
    category: 'ارتباطات مستقیم',
    iconName: 'Package',
    defaultSignals: [
      { code: 'SIG-DM-01', name: 'تعداد مرسوله ارسالی', unit: 'عدد', targetType: 'min', targetValue: 100, period: 'monthly', weight: 100, isActive: true },
    ]
  },
  digital_ads: {
    type: 'digital_ads',
    title: 'تبلیغات دیجیتال (Native/Display)',
    category: 'تبلیغات آنلاین',
    iconName: 'Activity',
    defaultSignals: [
      { code: 'SIG-DAD-01', name: 'تعداد نمایش (Impressions)', unit: 'نمایش', targetType: 'min', targetValue: 100000, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-DAD-02', name: 'تعداد کلیک (Clicks)', unit: 'کلیک', targetType: 'min', targetValue: 2000, period: 'monthly', weight: 60, isActive: true },
    ]
  },
  influencer: {
    type: 'influencer',
    title: 'اینفلوئنسر مارکتینگ',
    category: 'تبلیغات آنلاین',
    iconName: 'Users',
    defaultSignals: [
      { code: 'SIG-INF-01', name: 'تعداد لید از اینفلوئنسر', unit: 'نفر', targetType: 'min', targetValue: 300, period: 'per_campaign', weight: 100, isActive: true },
    ]
  },
  google_ads: {
    type: 'google_ads',
    title: 'گوگل ادز (Google Ads)',
    category: 'تبلیغات آنلاین',
    iconName: 'Search',
    defaultSignals: [
      { code: 'SIG-GAD-01', name: 'تعداد کلیک (Clicks)', unit: 'کلیک', targetType: 'min', targetValue: 1500, period: 'monthly', weight: 40, isActive: true },
      { code: 'SIG-GAD-02', name: 'نرخ تبدیل (Conv. Rate)', unit: 'درصد', targetType: 'min', targetValue: 3, period: 'monthly', weight: 60, isActive: true },
    ]
  },
};

export const initialPredefinedMedia: MediaChannel[] = [
  {
    id: 'MED-LNK-01',
    code: 'LNK-PAIDAR-B2B',
    title: 'صفحه رسمی لینکدین شرکت تابلو برق پایدار',
    mainType: 'linkedin',
    category: 'شبکه‌های اجتماعی متخصصین',
    urlOrHandle: 'https://linkedin.com/company/paydar-switchgear',
    manager: 'مهندس رضایی',
    status: 'active',
    createdAt: '۱۴۰۵/۰۹/۱۰',
    updatedAt: '۱۴۰۵/۱۱/۱۸',
    signals: [],
  },
  {
    id: 'MED-WEB-01',
    code: 'WEB-PORTAL-01',
    title: 'پورتال جامع سازمانی و سامانه استعلام قیمت آنلاین',
    mainType: 'website',
    category: 'رسانه‌های اختصاصی',
    urlOrHandle: 'https://paydar-switchgear.com',
    manager: 'مهندس حسینی',
    status: 'active',
    createdAt: '۱۴۰۵/۰۸/۰۱',
    updatedAt: '۱۴۰۵/۱۱/۱۵',
    signals: [],
  },
  {
    id: 'MED-APR-01',
    code: 'APR-PAIDAR-CHAN',
    title: 'کانال آپارات رسمی شرکت پایدار',
    mainType: 'aparat',
    category: 'ویدیو داخلی',
    urlOrHandle: 'aparat.com/paydar',
    manager: 'تیم محتوا',
    status: 'active',
    createdAt: '۱۴۰۵/۱۰/۰۱',
    updatedAt: '۱۴۰۵/۱۱/۲۰',
    signals: [],
  }
];
