import React, { useState } from 'react';
import {
  Menu,
  Wifi,
  Bell,
  Calendar,
  Calculator,
  ChevronDown,
  Building2,
  CheckCircle2,
  FileDown,
  FileText,
  X,
  ExternalLink,
  Download
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const docs = [
    {
      id: 'ALL',
      title: '📦 پکیج جامع تمامی اسناد (همه در یک فایل)',
      desc: 'سند یکپارچه شامل تمام بخش‌های ۱ تا ۵ به همراه معماری، کامپوننت‌ها، مدل‌ها و فرم‌های سایدبار',
      filename: 'FULL-SALES-MARKETING-DOCUMENTATION.md',
      url: '/docs/FULL-SALES-MARKETING-DOCUMENTATION.md',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
    },
    {
      id: '01',
      title: 'سند معماری و طراحی سیستم فروش و بازاریابی',
      desc: 'تشریح ۵ ستون اصلی: CEM، CRM، خدمات پس از فروش، حسابداری فروش و تارگت/پورسانت',
      filename: '01-Sales-Marketing-System-Design.md',
      url: '/docs/01-Sales-Marketing-System-Design.md',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: '02',
      title: 'سند مشخصات کامپوننت‌های مشترک سازمانی',
      desc: 'معماری و کد ۱۰ کامپوننت جنریک، جدول سازمانی، کارت‌های KPI و دراورها',
      filename: '02-Shared-Components-Specification.md',
      url: '/docs/02-Shared-Components-Specification.md',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: '03',
      title: 'دستورالعمل پرامپت‌های مرحله‌به‌مرحله Claude',
      desc: 'متن‌های پرامپت آماده و مرحله‌به‌مرحله جهت تحویل به Claude برای تولید تمیز کدها',
      filename: '03-Claude-Step-by-Step-Prompts.md',
      url: '/docs/03-Claude-Step-by-Step-Prompts.md',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: '04',
      title: 'فرهنگ داده‌ها و قراردادهای API',
      desc: 'اینترفیس‌های جامع TypeScript، ساختار درخواست‌ها و پاسخ‌های REST API',
      filename: '04-Data-Models-and-API-Contracts.md',
      url: '/docs/04-Data-Models-and-API-Contracts.md',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: '05',
      title: 'مشخصات فرم‌های ساخت، ادیت و جداول سایدبار',
      desc: 'فیلد به فیلد تمامی فرم‌های ایجاد، ویرایش و مشخصات ستون‌های جداول و زیرجداول',
      filename: '05-Sidebar-Items-Forms-and-Tables-Spec.md',
      url: '/docs/05-Sidebar-Items-Forms-and-Tables-Spec.md',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: '06',
      title: '🛠️ سند دیزاین، UI و کدهای کامل خدمات پس از فروش',
      desc: 'دیزاین جامع UI/UX، تایپ‌ها، معماری و کدهای کامل تعاریف، عملیات و کاردکس',
      filename: '06-After-Sales-Services-Full-Spec-and-Code.md',
      url: '/docs/06-After-Sales-Services-Full-Spec-and-Code.md',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold'
    }
  ];

  const handleDownloadAll = () => {
    docs.forEach((doc, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 250);
    });
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Right side in RTL: Hamburger & Company & Fiscal Year */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              id="toggle-sidebar-btn"
              title="تغییر وضعیت منو"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
              <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm tracking-tight cursor-pointer hover:text-rose-700 transition-colors">
                <span>تابلوسازی برق پارس</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>سال مالی ۱۴۰۵</span>
              <span className="text-emerald-400">•</span>
              <span className="font-semibold">جاری</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
            </div>
          </div>

          {/* Center / Left tools: Docs download & quick utilities */}
          <div className="flex items-center gap-2">
            {/* Download Docs Button */}
            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="دانلود فایل‌های سند دیزاین برای Claude"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden md:inline">دانلود اسناد دیزاین (Claude)</span>
            </button>

            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100/80 px-2 py-1 rounded-lg">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline font-mono text-[11px] text-emerald-700">اتصال آنلاین پایدار</span>
            </div>

            <button
              id="btn-calendar"
              title="تقویم کاری و سررسیدها"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer relative"
            >
              <Calendar className="w-4 h-4" />
            </button>

            <button
              id="btn-calc"
              title="ماشین‌حساب مهندسی و مالی"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
            </button>

            <button
              id="btn-notifications"
              title="اعلان‌ها و یادآوری‌ها"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>پایگاه داده همگام</span>
            </div>
          </div>
        </div>
      </header>

      {/* Download Docs Modal */}
      {isDocsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">دریافت و دانلود اسناد فنی (مخصوص Claude)</h3>
                  <p className="text-xs text-slate-500">فایل‌های استاندارد Markdown و مستندات معماری جهت پیاده‌سازی</p>
                </div>
              </div>
              <button
                onClick={() => setIsDocsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${doc.color}`}>
                      {doc.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{doc.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{doc.desc}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    download={doc.filename}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 mr-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <a
                href="/docs/index.html"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-600 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
              >
                <span>مشاهده در پورتال تحت وب اسناد</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDocsOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  بستن
                </button>
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود همه فایل‌ها (یکجا)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

