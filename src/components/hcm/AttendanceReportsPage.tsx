import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Clock,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';

interface AttendanceLog {
  id: string;
  employeeName: string;
  employeeId: string;
  eventType: 'ENTRY' | 'EXIT';
  time: string;
  date: string;
  location: string;
  verificationMethod: string[];
  status: 'VERIFIED' | 'REJECTED';
  deviceInfo: string;
}

const mockLogs: AttendanceLog[] = [
  {
    id: '1',
    employeeName: 'علی احمدی',
    employeeId: '1025',
    eventType: 'ENTRY',
    time: '08:02:15',
    date: '1405/07/01',
    location: 'دفتر مرکزی - ورودی اصلی',
    verificationMethod: ['QR', 'Face', 'Liveness', 'Geo'],
    status: 'VERIFIED',
    deviceInfo: 'iPhone 13 - iOS 16.5'
  },
  {
    id: '2',
    employeeName: 'مریم محمدی',
    employeeId: '1030',
    eventType: 'ENTRY',
    time: '08:15:42',
    date: '1405/07/01',
    location: 'انبار جاده مخصوص',
    verificationMethod: ['QR', 'Geo'],
    status: 'VERIFIED',
    deviceInfo: 'Samsung S22 - Android 13'
  },
  {
    id: '3',
    employeeName: 'رضا علوی',
    employeeId: '1042',
    eventType: 'EXIT',
    time: '17:05:10',
    date: '1405/06/31',
    location: 'دفتر مرکزی - ورودی اصلی',
    verificationMethod: ['QR', 'Face', 'Geo'],
    status: 'VERIFIED',
    deviceInfo: 'Xiaomi 12 - Android 12'
  },
  {
    id: '4',
    employeeName: 'سارا کریمی',
    employeeId: '1055',
    eventType: 'ENTRY',
    time: '08:45:22',
    date: '1405/07/01',
    location: 'دفتر مرکزی - ورودی اصلی',
    verificationMethod: ['Face'],
    status: 'REJECTED',
    deviceInfo: 'iPhone 14 Pro'
  },
  {
    id: '5',
    employeeName: 'حمید رضاپور',
    employeeId: '1012',
    eventType: 'EXIT',
    time: '16:30:00',
    date: '1405/07/01',
    location: 'انبار جاده مخصوص',
    verificationMethod: ['QR', 'Geo'],
    status: 'VERIFIED',
    deviceInfo: 'Samsung A53'
  }
];

export const AttendanceReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState<AttendanceLog[]>(mockLogs);

  const filteredLogs = logs.filter(log => 
    log.employeeName.includes(searchTerm) || 
    log.employeeId.includes(searchTerm) ||
    log.location.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 rtl">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">گزارش ترددها</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">مشاهده جزئیات ثبت تـرددهای هوشمند و فیزیکی</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            خروجی اکسل
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95">
            <Filter className="w-4 h-4" />
            فیلتر پیشرفته
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'کل ترددها', value: '۱۲۴', color: 'bg-blue-500', icon: ClipboardList },
            { label: 'ورودهای امروز', value: '۸۶', color: 'bg-emerald-500', icon: CheckCircle2 },
            { label: 'خروج‌های امروز', value: '۳۸', color: 'bg-amber-500', icon: Clock },
            { label: 'موارد رد شده', value: '۳', color: 'bg-rose-500', icon: XCircle },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-100`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{stat.label}</div>
                <div className="text-lg font-black text-slate-800">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table Area */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="جستجو نام پرسنل، کد پرسنلی یا لوکیشن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-300">از تاریخ:</span>
                <CalendarIcon className="w-3.5 h-3.5 text-sky-500/50" />
                <span className="text-slate-700 font-mono">۱۴۰۵/۰۷/۰۱</span>
                <div className="w-px h-4 bg-slate-200 mx-2"></div>
                <span className="text-slate-300">تا تاریخ:</span>
                <CalendarIcon className="w-3.5 h-3.5 text-sky-500/50" />
                <span className="text-slate-700 font-mono">۱۴۰۵/۰۷/۳۰</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-sky-600 transition-colors">
                      پرسنل
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">نوع</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">زمان</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">لوکیشن</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">روش احراز</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">دستگاه</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">وضعیت</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold">
                          {log.employeeName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{log.employeeName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        log.eventType === 'ENTRY' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {log.eventType === 'ENTRY' ? 'ورود' : 'خروج'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-slate-700">{log.time}</span>
                        <span className="text-[9px] text-slate-400">{log.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs text-slate-600 font-medium">{log.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {log.verificationMethod.map(method => (
                          <span key={method} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">
                            {method}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Monitor className="w-3.5 h-3.5 text-slate-300" />
                        {log.deviceInfo}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {log.status === 'VERIFIED' ? (
                        <div className="flex items-center justify-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">تأیید شده</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg inline-flex">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">رد شده</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-left">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-bold">
              نمایش ۱ تا ۵ از ۱۲۴ رکورد
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 12].map((page, i) => (
                  <button 
                    key={i}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                      page === 1 ? 'bg-sky-600 text-white shadow-md shadow-sky-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors">
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
