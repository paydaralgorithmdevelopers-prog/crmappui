import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  MapPin, 
  RefreshCw, 
  Maximize2, 
  ChevronRight,
  Settings,
  Wifi,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { QrPayload, Location } from '../../types/hcm/attendance';
import { attendanceService } from '../../services/hcm/AttendanceService';
import { locationManagementService } from '../../services/hcm/LocationManagementService';

export const AttendanceQrDisplayPage: React.FC = () => {
  const [setupMode, setSetupMode] = useState(true);
  const [availableLocations] = useState<Location[]>(locationManagementService.getLocations());
  const [locationName, setLocationName] = useState(availableLocations[0]?.title || 'دفتر مرکزی');
  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!setupMode) {
      fetchNewQr();
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            fetchNewQr();
            return refreshInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [setupMode, refreshInterval]);

  const fetchNewQr = async () => {
    try {
      const qr = await attendanceService.getGateQr('HQ-DEFAULT');
      setQrPayload(qr);
      // In a real app, the server returns the duration, but here we sync with our selected interval
      setTimeLeft(refreshInterval);
    } catch (error) {
      console.error('Failed to fetch QR', error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (setupMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8 bg-slate-800 text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تنظیمات نمایش QR</h2>
              <p className="text-white/40 text-xs">پیکربندی گیت ورودی برای مانیتور</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 mr-1">محل تردد</label>
                <select 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  {availableLocations.map(loc => (
                    <option key={loc.id} value={loc.title}>{loc.title}</option>
                  ))}
                  {availableLocations.length === 0 && (
                    <option value="">هیچ لوکیشنی تعریف نشده است</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 mr-1">مدت اعتبار QR (ثانیه)</label>
                <div className="flex gap-2">
                  {[30, 60].map(sec => (
                    <button 
                      key={sec}
                      onClick={() => { setRefreshInterval(sec); setTimeLeft(sec); }}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${refreshInterval === sec ? 'bg-sky-500 text-white border-sky-600 shadow-lg shadow-sky-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {sec} ثانیه
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSetupMode(false)}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              شروع نمایش QR
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 rtl relative overflow-hidden select-none">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl"></div>

      {/* Connection Status */}
      <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm animate-pulse">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="text-xs font-bold uppercase tracking-wider">Connected to Server</span>
        <Wifi className="w-3 h-3" />
      </div>

      {/* Controls Overlay (Hidden unless hover) */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={toggleFullscreen}
          className="p-3 bg-white shadow-lg rounded-full text-slate-400 hover:text-slate-800 border border-slate-100"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setSetupMode(true)}
          className="p-3 bg-white shadow-lg rounded-full text-slate-400 hover:text-slate-800 border border-slate-100"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        {/* Company & Gate Info */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-slate-400 mb-2">
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-bold tracking-widest uppercase">Paydar Algorithm Developers</span>
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">{locationName}</h1>
        </div>

        {/* QR Section */}
        <div className="relative group">
          <div className="absolute -inset-8 bg-slate-100 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative p-12 bg-white rounded-[3rem] shadow-2xl border-2 border-slate-50 flex items-center justify-center">
            {qrPayload ? (
              <QRCode 
                value={qrPayload.qrPayload}
                size={400}
                level="H"
                className="w-[50vh] h-[50vh] max-w-[500px] max-h-[500px]"
              />
            ) : (
              <div className="w-[50vh] h-[50vh] max-w-[500px] max-h-[500px] flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-slate-200 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Footer & Instructions */}
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="w-full max-w-md bg-slate-50 h-3 rounded-full overflow-hidden">
            <motion.div 
              key={timeLeft}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: timeLeft, ease: 'linear' }}
              className="h-full bg-sky-500 shadow-lg shadow-sky-500/50"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-slate-700">
              <span className="text-lg font-bold">QR جدید تا:</span>
              <span className="text-4xl font-mono font-black text-sky-600 tabular-nums">
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              جهت ثبت تردد، وارد ERP شوید و گزینه <span className="text-slate-800 font-bold">ثبت تردد</span> را انتخاب کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
