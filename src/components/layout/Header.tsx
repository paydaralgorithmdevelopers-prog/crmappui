import React from 'react';
import {
  Menu,
  Wifi,
  Bell,
  Calendar,
  Calculator,
  ChevronDown,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
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

        {/* Center / Left tools: System status & quick utilities */}
        <div className="flex items-center gap-2">
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
  );
};
