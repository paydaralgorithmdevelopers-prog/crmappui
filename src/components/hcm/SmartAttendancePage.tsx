import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  QrCode, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Scan,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { 
  AttendanceStatus, 
  AttendanceState, 
  LocationData, 
  VerificationSession, 
  VerificationResult 
} from '../../types/hcm/attendance';
import { attendanceService, locationService, verificationService } from '../../services/hcm/AttendanceService';

export const SmartAttendancePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [state, setState] = useState<AttendanceState>('INITIAL');
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [session, setSession] = useState<VerificationSession | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Detection flags
  const [faceDetected, setFaceDetected] = useState(false);
  const [qrDetected, setQrDetected] = useState(false);
  const [livenessCompleted, setLivenessCompleted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchInitialData();
    return () => clearInterval(timer);
  }, []);

  const fetchInitialData = async () => {
    try {
      const currentStatus = await attendanceService.getCurrentStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Failed to fetch attendance status', error);
    }
  };

  const startProcess = async () => {
    setState('GETTING_LOCATION');
    try {
      const pos = await locationService.getCurrentPosition();
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: new Date(pos.timestamp).toISOString()
      });
      
      setState('STARTING_SESSION');
      const verSession = await verificationService.startVerification();
      setSession(verSession);
      
      setState('WAITING_FOR_CAMERA');
      await setupCamera();
      
      setState('WAITING_FOR_QR');
      // In a real app, scanning starts here
      setTimeout(() => setQrDetected(true), 2000);
    } catch (error) {
      console.error('Process error:', error);
      setState('REJECTED');
    }
  };

  useEffect(() => {
    if (qrDetected && state === 'WAITING_FOR_QR') {
      setState('WAITING_FOR_FACE');
      setTimeout(() => setFaceDetected(true), 1500);
    }
  }, [qrDetected, state]);

  useEffect(() => {
    if (faceDetected && state === 'WAITING_FOR_FACE') {
      setState('LIVENESS_CHECK');
      setTimeout(() => setLivenessCompleted(true), 3000);
    }
  }, [faceDetected, state]);

  useEffect(() => {
    if (livenessCompleted && state === 'LIVENESS_CHECK') {
      setState('READY_TO_SUBMIT');
    }
  }, [livenessCompleted, state]);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async () => {
    if (!status || !location || !session) return;
    
    setState('SUBMITTING');
    try {
      const res = await verificationService.completeVerification({
        challengeId: session.challengeId,
        employeeId: status.employeeId,
        eventType: status.suggestedEventType,
        qrPayload: "MOCKED_QR_PAYLOAD",
        location,
        faceCapture: "MOCKED_FACE_IMAGE",
        livenessData: { status: 'COMPLETED' },
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          deviceId: "MOCKED_DEVICE_ID"
        }
      });
      
      setResult(res);
      setState(res.success ? 'SUCCESS' : 'REJECTED');
      stopCamera();
    } catch (error) {
      setState('REJECTED');
      stopCamera();
    }
  };

  const renderStatus = () => {
    if (state === 'SUCCESS' && result) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white ring-4 ring-emerald-50">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">تردد با موفقیت ثبت شد</h2>
            <p className="text-emerald-600 font-bold">{result.eventType === 'ENTRY' ? 'ورود' : 'خروج'}</p>
          </div>
          
          <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">ساعت ثبت:</span>
              <span className="text-slate-800 font-mono font-bold">
                {new Date(result.eventTime!).toLocaleTimeString('fa-IR')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">محل:</span>
              <span className="text-slate-800 font-bold">{result.locationName}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              {['QR', 'موقعیت', 'چهره', 'پویایی'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[10px] bg-white px-2 py-1.5 rounded-lg border border-slate-100 text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-colors"
          >
            بازگشت
          </button>
        </motion.div>
      );
    }

    if (state === 'REJECTED') {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white ring-4 ring-rose-50">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">تردد ثبت نشد</h2>
            <p className="text-rose-600 font-bold">علت: عدم تطابق اطلاعات</p>
          </div>
          
          <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              سیستم قادر به اعتبارسنجی نهایی اطلاعات شما نبود. لطفاً مجدداً تلاش کنید یا با مدیریت تماس بگیرید.
            </p>
          </div>

          <button 
            onClick={() => { setState('INITIAL'); setQrDetected(false); setFaceDetected(false); setLivenessCompleted(false); }}
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg hover:bg-rose-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-sm">ثبت تردد</span>
              <span className="text-[10px] text-slate-400">سیستم احراز هویت هوشمند</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono font-bold text-slate-700">{currentTime.toLocaleTimeString('fa-IR')}</span>
            <span className="text-[10px] text-slate-400">۱۴۰۵/۰۷/۰۱</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-4 space-y-4">
            {/* User Info & Current Status */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                ع
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-800">علی احمدی</div>
                <div className="text-xs text-slate-400 mt-1">کد پرسنلی: ۱۰۲۵</div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400">آخرین تردد:</div>
                <div className="text-xs font-bold text-slate-700">ورود - ۰۸:۰۲</div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">موقعیت مکانی</span>
                  <span className={`text-[10px] ${location ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    {location ? '✓ داخل محدوده مجاز' : 'در حال دریافت موقعیت...'}
                  </span>
                </div>
              </div>
              {location && (
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] rounded-full font-mono">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              )}
            </div>

            {/* Camera Area */}
            <div className="relative aspect-square w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 group">
              {state === 'INITIAL' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white bg-slate-800">
                  <div className="w-20 h-20 bg-slate-700 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                    <Camera className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">آماده ثبت تردد هستید؟</h3>
                  <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                    توجه: از قرارداشتن QR پویا در بک‌گراند خود اطمینان حاصل نمایید.
                  </p>
                  <button 
                    onClick={startProcess}
                    className="w-full py-4 bg-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 active:scale-95 transition-all"
                  >
                    شروع فرآیند احراز هویت
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* QR Target Frame */}
                    <motion.div 
                      animate={{ scale: qrDetected ? 0.9 : 1, opacity: qrDetected ? 0.2 : 1 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/50 rounded-3xl"
                    >
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-xl"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-xl"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-xl"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <QrCode className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    {/* Face Target Frame */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-40 border-2 border-dashed border-white/30 rounded-[3rem]"></div>
                    
                    {/* Instructions Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={state}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-3"
                        >
                          {state === 'WAITING_FOR_QR' && (
                            <>
                              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                <Scan className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white text-[10px] font-bold">مرحله اول: اسکن QR</span>
                                <span className="text-white/60 text-[8px]">QR ورودی را در کادر قرار دهید</span>
                              </div>
                            </>
                          )}
                          {state === 'WAITING_FOR_FACE' && (
                            <>
                              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white text-[10px] font-bold">مرحله دوم: تشخیص چهره</span>
                                <span className="text-white/60 text-[8px]">صورت خود را در کادر بالایی قرار دهید</span>
                              </div>
                            </>
                          )}
                          {state === 'LIVENESS_CHECK' && (
                            <>
                              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white text-[10px] font-bold">مرحله سوم: بررسی پویایی</span>
                                <span className="text-amber-200 text-[8px] font-bold">سر خود را کمی به سمت راست بچرخانید</span>
                              </div>
                            </>
                          )}
                          {state === 'READY_TO_SUBMIT' && (
                            <>
                              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white text-[10px] font-bold">تأیید نهایی</span>
                                <span className="text-emerald-200 text-[8px]">اطلاعات آماده ثبت است</span>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'موقعیت مکانی', done: !!location },
                { label: 'اسکن QR', done: qrDetected },
                { label: 'تشخیص چهره', done: faceDetected },
                { label: 'بررسی پویایی', done: livenessCompleted }
              ].map((check, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${check.done ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${check.done ? 'text-emerald-500' : 'text-slate-200'}`} />
                  <span className="text-[10px] font-bold">{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100 fixed bottom-0 left-0 right-0 z-50">
          <button 
            onClick={handleSubmit}
            disabled={state !== 'READY_TO_SUBMIT'}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              state === 'READY_TO_SUBMIT' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/20 active:scale-95' 
                : 'bg-slate-100 text-slate-400 grayscale'
            }`}
          >
            {state === 'SUBMITTING' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                در حال ارسال به سرور...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                ثبت {status?.suggestedEventType === 'ENTRY' ? 'ورود' : 'خروج'} هوشمند
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col rtl">
      <div className="max-w-md mx-auto w-full h-full bg-white relative shadow-2xl overflow-hidden flex flex-col">
        {renderStatus()}
      </div>
    </div>
  );
};
