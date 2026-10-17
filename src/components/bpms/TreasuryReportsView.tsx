import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  ArrowRight, 
  FileText, 
  Download, 
  Printer,
  Calendar,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

interface TreasuryReportsViewProps {
  type: string;
  onBack: () => void;
}

export const TreasuryReportsView: React.FC<TreasuryReportsViewProps> = ({
  type,
  onBack
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [selectedCheckbookId, setSelectedCheckbookId] = useState<string | null>(null);
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null);
  const [selectedHolderId, setSelectedHolderId] = useState<string | null>(null);
  const [selectedPettyCashNumber, setSelectedPettyCashNumber] = useState<string | null>(null);

  const isOutgoingCheckReport = type === 'treasury-report-check-outgoing';
  const isIncomingCheckReport = type === 'treasury-report-check-incoming';
  const isPettyCashOpsReport = type === 'treasury-report-petty-cash-ops';

  const getReportConfig = () => {
    switch (type) {
      case 'treasury-report-bank':
        return {
          title: 'حساب‌های بانکی',
          sources: [
            { id: '1', title: 'بانک ملت - شعبه مرکزی', initial: 1200000000, dr: 450000000, cr: 300000000, balance: 1350000000 },
            { id: '2', title: 'بانک تجارت - شعبه گلستان', initial: 50000000, dr: 120000000, cr: 80000000, balance: 90000000 },
            { id: '3', title: 'بانک ملی - جاری ۱۰۲۰', initial: 10000000, dr: 50000000, cr: 45000000, balance: 15000000 },
            { id: '4', title: 'بانک کشاورزی - شعبه ولیعصر', initial: 850000000, dr: 220000000, cr: 110000000, balance: 960000000 },
            { id: '5', title: 'بانک پاسارگاد - شعبه سعادت‌آباد', initial: 2400000000, dr: 600000000, cr: 450000000, balance: 2550000000 },
          ]
        };
      case 'treasury-report-cash':
        return {
          title: 'صندوق‌ها',
          sources: [
            { id: 'c1', title: 'صندوق دفتر مرکزی', initial: 50000000, dr: 250000000, cr: 200000000, balance: 100000000 },
            { id: 'c2', title: 'صندوق فروشگاه شماره ۱', initial: 15000000, dr: 450000000, cr: 400000000, balance: 65000000 },
            { id: 'c3', title: 'صندوق تنخواه تدارکات', initial: 2000000, dr: 100000000, cr: 95000000, balance: 7000000 },
          ]
        };
      case 'treasury-report-pos':
        return {
          title: 'کارتخوان‌ها',
          sources: [
            { id: 'p1', title: 'کارتخوان ملت - پذیرش', initial: 0, dr: 850000000, cr: 850000000, balance: 0 },
            { id: 'p2', title: 'کارتخوان سامان - فروشگاه', initial: 0, dr: 1200000000, cr: 1200000000, balance: 0 },
            { id: 'p3', title: 'کارتخوان پاسارگاد - خدمات', initial: 0, dr: 450000000, cr: 450000000, balance: 0 },
          ]
        };
      case 'treasury-report-gateways':
        return {
          title: 'درگاه‌های پرداخت',
          sources: [
            { id: 'g1', title: 'درگاه زرین‌پال - وب‌سایت', initial: 5000000, dr: 150000000, cr: 140000000, balance: 15000000 },
            { id: 'g2', title: 'درگاه مستقیم بانک ملت', initial: 0, dr: 450000000, cr: 400000000, balance: 50000000 },
            { id: 'g3', title: 'درگاه آیدی‌پی - فاکتور آنلاین', initial: 0, dr: 85000000, cr: 85000000, balance: 0 },
          ]
        };
      case 'treasury-report-petty-cash':
        return {
          title: 'تنخواهگردان‌ها',
          sources: [
            { id: 'pc1', title: 'تنخواه واحد اداری (احمدی)', initial: 10000000, dr: 50000000, cr: 45000000, balance: 15000000 },
            { id: 'pc2', title: 'تنخواه واحد فنی (رضایی)', initial: 25000000, dr: 150000000, cr: 140000000, balance: 35000000 },
            { id: 'pc3', title: 'تنخواه تدارکات (کریمی)', initial: 5000000, dr: 80000000, cr: 75000000, balance: 10000000 },
          ]
        };
      case 'treasury-report-check-incoming':
        return {
          title: 'چک‌های دریافتی',
          sources: [
            { id: 'ci1', title: 'چک‌های نزد صندوق', initial: 4500000000, dr: 1500000000, cr: 2000000000, balance: 4000000000 },
            { id: 'ci2', title: 'چک‌های واگذار شده به بانک', initial: 2000000000, dr: 2000000000, cr: 1500000000, balance: 2500000000 },
            { id: 'ci3', title: 'چک‌های برگشتی دریافتی', initial: 150000000, dr: 50000000, cr: 20000000, balance: 180000000 },
          ]
        };
      case 'treasury-report-check-outgoing':
        return {
          title: 'چک‌های پرداختی',
          sources: [
            { id: 'co1', title: 'چک‌های پاس نشده (سررسید آتی)', initial: 8500000000, dr: 1200000000, cr: 3000000000, balance: 6700000000 },
            { id: 'co2', title: 'چک‌های پاس شده', initial: 0, dr: 3000000000, cr: 3000000000, balance: 0 },
            { id: 'co3', title: 'چک‌های ابطال شده', initial: 0, dr: 450000000, cr: 450000000, balance: 0 },
          ]
        };
      case 'treasury-report-petty-cash-ops':
        return {
          title: 'تنخواه گردان‌ها',
          sources: [
            { id: 'h1', title: 'علیرضا احمدی', initial: 0, dr: 150000000, cr: 4500000, balance: 145500000 },
            { id: 'h2', title: 'مریم حسینی', initial: 50000000, dr: 200000000, cr: 180000000, balance: 70000000 },
            { id: 'h3', title: 'رضا کریمی', initial: 10000000, dr: 80000000, cr: 75000000, balance: 15000000 },
          ]
        };
      default:
        return {
          title: 'فهرست منابع',
          sources: []
        };
    }
  };

  const config = getReportConfig();

  const getTitle = () => {
    let baseTitle = '';
    switch (type) {
      case 'treasury-report-bank': baseTitle = 'گزارش گردش حساب‌های بانکی'; break;
      case 'treasury-report-cash': baseTitle = 'گزارش گردش صندوق‌ها'; break;
      case 'treasury-report-pos': baseTitle = 'گزارش گردش کارتخوان‌ها'; break;
      case 'treasury-report-gateways': baseTitle = 'گزارش گردش درگاه‌های پرداخت'; break;
      case 'treasury-report-petty-cash': baseTitle = 'گزارش گردش تنخواهگردان‌ها'; break;
      case 'treasury-report-petty-cash-ops': baseTitle = 'گزارش تنخواه'; break;
      case 'treasury-report-check-incoming': baseTitle = 'گزارش گردش عملیات چک دریافتی'; break;
      case 'treasury-report-check-outgoing': baseTitle = 'گزارش گردش عملیات چک پرداختی'; break;
      default: baseTitle = 'گزارشات خزانه'; break;
    }
    
    if (selectedIds.length > 0 && activeTab === 'circulation') {
      if (selectedIds.length === 1) {
        const name = config.sources.find(s => s.id === selectedIds[0])?.title;
        return `${baseTitle} - ${name}`;
      }
      return `${baseTitle} (${selectedIds.length} مورد انتخاب شده)`;
    }
    return baseTitle;
  };

  const getSourceTabTitle = () => {
    switch (type) {
      case 'treasury-report-bank': return 'حساب‌های بانکی';
      case 'treasury-report-cash': return 'صندوق‌ها';
      case 'treasury-report-pos': return 'کارتخوان‌ها';
      case 'treasury-report-gateways': return 'درگاه‌های پرداخت';
      case 'treasury-report-petty-cash': return 'تنخواهگردان‌ها';
      case 'treasury-report-petty-cash-ops': return 'تنخواه گردان‌ها';
      case 'treasury-report-check-incoming': return 'چک‌های دریافتی';
      case 'treasury-report-check-outgoing': return 'چک‌های پرداختی';
      default: return 'فهرست منابع';
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDrillUp = () => {
    if (isPettyCashOpsReport) {
      if (activeTab === 'circulation') {
        setActiveTab('numbers');
      } else if (activeTab === 'numbers') {
        setActiveTab('summary');
        setSelectedHolderId(null);
      } else {
        onBack();
      }
    } else if (isOutgoingCheckReport) {
      if (activeTab === 'circulation') {
        setActiveTab('leaves');
      } else if (activeTab === 'leaves') {
        setActiveTab('summary');
        setSelectedCheckbookId(null);
      } else {
        onBack();
      }
    } else if (isIncomingCheckReport) {
      if (activeTab === 'circulation') {
        setActiveTab('summary');
        setSelectedLeafId(null);
      } else {
        onBack();
      }
    } else {
      if (activeTab === 'circulation') {
        setActiveTab('summary');
        setSelectedIds([]);
      } else {
        onBack();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 lg:p-6 space-y-6 overflow-hidden rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDrillUp}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{getTitle()}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'circulation' ? (selectedIds.length > 0 ? `نمایش گردش برای ${selectedIds.length} منبع انتخاب شده` : 'گردش کلی تمامی تراکنش‌ها') : 'فهرست منابع مالی و خلاصه وضعیت مانده'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" />
            چاپ گزارش
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
            <Download className="w-4 h-4" />
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 px-6">
        {isOutgoingCheckReport ? (
          <>
            <button 
              onClick={() => {
                setActiveTab('summary');
                setSelectedCheckbookId(null);
                setSelectedLeafId(null);
              }}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'summary' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              دسته چک‌ها
            </button>
            <button 
              onClick={() => {
                if (selectedCheckbookId) setActiveTab('leaves');
              }}
              disabled={!selectedCheckbookId}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'leaves' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : !selectedCheckbookId ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              اوراق دسته چک
            </button>
            <button 
              onClick={() => {
                if (selectedLeafId) setActiveTab('circulation');
              }}
              disabled={!selectedLeafId}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'circulation' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : !selectedLeafId ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              گردش کار ورق
            </button>
          </>
        ) : isIncomingCheckReport ? (
          <>
            <button 
              onClick={() => {
                setActiveTab('summary');
                setSelectedLeafId(null);
              }}
              className={`min-w-[200px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'summary' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              فهرست اوراق دریافتی
            </button>
            <button 
              onClick={() => {
                if (selectedLeafId) setActiveTab('circulation');
              }}
              disabled={!selectedLeafId}
              className={`min-w-[200px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'circulation' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : !selectedLeafId ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              گردش کار ورق چک
            </button>
          </>
        ) : isPettyCashOpsReport ? (
          <>
            <button 
              onClick={() => {
                setActiveTab('summary');
                setSelectedHolderId(null);
                setSelectedPettyCashNumber(null);
              }}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'summary' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              تنخواه گردان
            </button>
            <button 
              onClick={() => {
                if (selectedHolderId) setActiveTab('numbers');
              }}
              disabled={!selectedHolderId}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'numbers' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5_rgba(0,0,0,0.05)] z-10' 
                  : !selectedHolderId ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              گردش
            </button>
            <button 
              onClick={() => {
                if (selectedPettyCashNumber) setActiveTab('circulation');
              }}
              disabled={!selectedPettyCashNumber}
              className={`min-w-[150px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'circulation' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5_rgba(0,0,0,0.05)] z-10' 
                  : !selectedPettyCashNumber ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              ریز گردش
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => {
                setActiveTab('summary');
                setSelectedIds([]);
              }}
              className={`min-w-[200px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'summary' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {getSourceTabTitle()}
            </button>
            <button 
              onClick={() => setActiveTab('circulation')}
              className={`min-w-[200px] py-5 text-sm font-black transition-all relative top-[1px] ${
                activeTab === 'circulation' 
                  ? 'bg-white border-x border-t border-slate-200 rounded-t-3xl text-emerald-600 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.05)] z-10' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              گردش
            </button>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <input type="text" placeholder="جستجو..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-hidden focus:border-emerald-500" />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        
        {type.includes('report-') && activeTab === 'circulation' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">موارد: {selectedIds.length || 'همه'}</span>
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 hover:border-emerald-500">
                <Activity className="w-4 h-4 text-emerald-600" />
                تغییر موارد انتخابی
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {/* Simple inline multi-select dropdown simulation */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 hidden group-hover:block">
                {config.sources.map(source => (
                  <label key={source.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(source.id)} 
                      onChange={() => handleToggleSelect(source.id)}
                      className="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-700">{source.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">از تاریخ</span>
            <input 
              type="text" 
              defaultValue="۱۴۰۵/۰۱/۰۱"
              className="bg-slate-50 border border-slate-200 rounded-xl pr-14 pl-4 py-2 text-[11px] font-bold outline-hidden focus:border-emerald-500 w-32" 
            />
          </div>
          <div className="relative">
            <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">تا تاریخ</span>
            <input 
              type="text" 
              defaultValue="۱۴۰۵/۱۲/۲۹"
              className="bg-slate-50 border border-slate-200 rounded-xl pr-14 pl-4 py-2 text-[11px] font-bold outline-hidden focus:border-emerald-500 w-32" 
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isOutgoingCheckReport ? (
          activeTab === 'summary' ? (
            <CheckbooksReport onSelect={(id) => {
              setSelectedCheckbookId(id);
              setActiveTab('leaves');
            }} />
          ) : activeTab === 'leaves' ? (
            <CheckbookLeavesReport checkbookId={selectedCheckbookId!} onSelect={(id) => {
              setSelectedLeafId(id);
              setActiveTab('circulation');
            }} />
          ) : (
            <LeafCirculationReport leafId={selectedLeafId!} />
          )
        ) : isIncomingCheckReport ? (
          activeTab === 'summary' ? (
            <IncomingCheckLeavesReport onSelect={(id) => {
              setSelectedLeafId(id);
              setActiveTab('circulation');
            }} />
          ) : (
            <LeafCirculationReport leafId={selectedLeafId!} isIncoming={true} />
          )
        ) : isPettyCashOpsReport ? (
          activeTab === 'summary' ? (
            <SummaryReport 
              onSelect={(id) => {
                setSelectedHolderId(id);
                setActiveTab('numbers');
              }}
              selectedIds={selectedHolderId ? [selectedHolderId] : []}
              onDrillDown={() => setActiveTab('numbers')}
              title="تنخواه گردان"
              data={config.sources}
            />
          ) : activeTab === 'numbers' ? (
            <PettyCashNumbersReport 
              holderId={selectedHolderId!} 
              onSelect={(id) => {
                setSelectedPettyCashNumber(id);
                setActiveTab('circulation');
              }} 
            />
          ) : (
            <PettyCashCirculationReport pettyCashNumber={selectedPettyCashNumber!} />
          )
        ) : type.startsWith('treasury-report-') ? (
          activeTab === 'circulation' ? (
            <CirculationReport selectedIds={selectedIds} type={type} />
          ) : (
            <SummaryReport 
              onSelect={handleToggleSelect} 
              selectedIds={selectedIds} 
              onDrillDown={() => setActiveTab('circulation')}
              title={config.title}
              data={config.sources}
            />
          )
        ) : (
          <GenericReportTable />
        )}
      </div>
    </div>
  );
};

const CheckCirculationTimeline: React.FC<{ data: any[], title: string, subtitle: string }> = ({ data, title, subtitle }) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black text-emerald-700 block">{title}</span>
            <span className="text-xs font-black text-slate-800">{subtitle}</span>
          </div>
        </div>
      </div>
      
      <div className="p-8 relative">
        {/* The Timeline Line */}
        <div className="absolute top-0 bottom-0 right-12 w-0.5 bg-slate-100" />
        
        <div className="space-y-12">
          {data.map((item, i) => (
            <div key={i} className="relative pr-16 group">
              {/* Timeline Dot */}
              <div className={`absolute right-[45.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ring-slate-50 z-10 transition-all group-hover:scale-125 ${
                i === data.length - 1 ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-300'
              }`} />
              
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Date and Document */}
                <div className="min-w-[120px] pt-0.5">
                  <div className="text-[10px] font-black text-slate-400 font-mono mb-1">{item.date}</div>
                  <div className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-mono">
                    {item.doc}
                  </div>
                </div>
                
                {/* Content Card */}
                <div className={`flex-1 bg-white border rounded-2xl p-4 shadow-sm transition-all group-hover:shadow-md group-hover:border-emerald-200 ${
                  i === data.length - 1 ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-slate-100'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="text-sm font-black text-slate-800">{item.desc}</h4>
                    {item.amount > 0 && (
                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">مبلغ تراکنش</span>
                        <span className="text-xs font-black text-slate-900 font-mono">{item.amount.toLocaleString()} <span className="text-[10px] text-slate-400 mr-1">ریال</span></span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500">
                      <Clock className="w-3 h-3" />
                      ثبت شده توسط: سیستم مرکزی
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black border ${
                      i === data.length - 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      وضعیت: {item.status}
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500">
                        <Activity className="w-3 h-3" />
                        موقعیت: {item.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LeafCirculationReport: React.FC<{ leafId: string; isIncoming?: boolean }> = ({ leafId, isIncoming }) => {
  const outgoingData = [
    { date: '۱۴۰۵/۰۶/۰۱', doc: 'TR-101', desc: 'صدور چک در وجه پیمانکار (آذرخش)', status: 'صادر شده', amount: 850000000, location: 'صندوق مرکزی' },
    { date: '۱۴۰۵/۰۶/۰۵', doc: 'TR-105', desc: 'تحویل چک به نماینده پیمانکار', status: 'تحویل شده', amount: 0, location: 'خارج از سازمان' },
    { date: '۱۴۰۵/۰۶/۲۰', doc: 'TR-120', desc: 'اعلام پاس شدن چک توسط بانک ملت', status: 'پاس شده', amount: 0, location: 'بانک ملت' },
  ];

  const incomingData = [
    { date: '۱۴۰۵/۰۵/۱۵', doc: 'TR-085', desc: 'دریافت چک از مشتری (شرکت البرز)', status: 'دریافت شده', amount: 450000000, location: 'صندوق مرکزی' },
    { date: '۱۴۰۵/۰۵/۲۰', doc: 'TR-090', desc: 'واگذاری چک به بانک تجارت جهت وصول', status: 'در جریان وصول', amount: 0, location: 'بانک تجارت - شعبه گلستان' },
    { date: '۱۴۰۵/۰۵/۲۵', doc: 'TR-098', desc: 'وصول چک و واریز به حساب جاری', status: 'وصول شده', amount: 0, location: 'حساب جاری ملت' },
  ];

  const data = isIncoming ? incomingData : outgoingData;

  return <CheckCirculationTimeline data={data} title="گردش کار ورق چک" subtitle={`سریال چک: ${leafId}`} />;
};

const PettyCashNumbersReport: React.FC<{ holderId: string; onSelect: (id: string) => void }> = ({ holderId, onSelect }) => {
  const data = [
    { id: 'PC-1405-0042', type: 'صورت هزینه', date: '۱۴۰۵/۰۶/۰۱', status: 'باز', count: 5, amount: 4500000 },
    { id: 'PC-REPL-005', type: 'شارژ تنخواه', date: '۱۴۰۵/۰۵/۲۰', status: 'تأیید شده', count: 0, amount: 50000000 },
    { id: 'PC-1405-0038', type: 'صورت هزینه', date: '۱۴۰۵/۰۵/۱۵', status: 'بسته شده', count: 12, amount: 28500000 },
    { id: 'PC-1405-0025', type: 'صورت هزینه', date: '۱۴۰۵/۰۴/۲۰', status: 'بسته شده', count: 8, amount: 12000000 },
    { id: 'PC-REPL-004', type: 'شارژ تنخواه', date: '۱۴۰۵/۰۴/۱۰', status: 'تأیید شده', count: 0, amount: 20000000 },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black text-slate-800">شماره‌های تنخواه گردان: {holderId === 'h1' ? 'علیرضا احمدی' : holderId === 'h2' ? 'مریم حسینی' : 'رضا کریمی'}</span>
      </div>
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4">نوع سند</th>
            <th className="px-6 py-4">شماره سند</th>
            <th className="px-6 py-4 text-center">تاریخ</th>
            <th className="px-6 py-4 text-center">تعداد اقلام</th>
            <th className="px-6 py-4 text-center">مبلغ تراکنش</th>
            <th className="px-6 py-4 text-center">وضعیت</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onDoubleClick={() => item.type === 'صورت هزینه' && onSelect(item.id)}
              className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${item.type === 'شارژ تنخواه' ? 'bg-emerald-50/20' : ''}`}
            >
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  item.type === 'شارژ تنخواه' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 font-black font-mono text-slate-900">{item.id}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.date}</td>
              <td className="px-6 py-4 text-center font-bold text-slate-700">{item.count > 0 ? `${item.count} مورد` : '-'}</td>
              <td className={`px-6 py-4 text-center font-mono font-black ${item.type === 'شارژ تنخواه' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.amount.toLocaleString()} <span className="text-[10px] text-slate-400 mr-1">ریال</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                  item.status === 'باز' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  item.status === 'تأیید شده' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {item.type === 'صورت هزینه' ? (
                  <button 
                    onClick={() => onSelect(item.id)}
                    className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-all"
                  >
                    ریز گردش
                  </button>
                ) : (
                  <span className="text-slate-300 text-[10px] font-bold italic">بدون ریز گردش</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PettyCashCirculationReport: React.FC<{ pettyCashNumber: string }> = ({ pettyCashNumber }) => {
  const data = [
    { date: '۱۴۰۵/۰۶/۰۱', doc: 'PC-EXP-001', gl: '۸۰۱۰ - هزینه‌های عملیاتی', detail: 'هزینه پذیرایی', desc: 'خرید چای و قند برای دفتر', amount: 4500000 },
    { date: '۱۴۰۵/۰۶/۰۲', doc: 'PC-EXP-002', gl: '۸۰۲۰ - هزینه‌های اداری', detail: 'لوازم التحریر', desc: 'خرید کاغذ A4', amount: 1200000 },
    { date: '۱۴۰۵/۰۶/۰۳', doc: 'PC-EXP-003', gl: '۸۰۱۰ - هزینه‌های عملیاتی', detail: 'کرایه حمل', desc: 'پیک موتوری - ارسال مدارک', amount: 850000 },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black text-slate-800">ریز اسناد شماره تنخواه: {pettyCashNumber}</span>
        <span className="text-[10px] font-bold text-slate-500">جمع کل: ۶,۵۵۰,۰۰۰ ریال</span>
      </div>
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-center">تاریخ</th>
            <th className="px-6 py-4 text-center">شماره سند</th>
            <th className="px-6 py-4">حساب معین / تفصیلی</th>
            <th className="px-6 py-4">شرح سند</th>
            <th className="px-6 py-4 text-center">مبلغ (ریال)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.date}</td>
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">{item.doc}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-black text-slate-800">{item.gl}</span>
                  <span className="text-[10px] font-bold text-slate-500">{item.detail}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-600">{item.desc}</td>
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">
                {item.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const IncomingCheckLeavesReport: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const data = Array.from({ length: 12 }).map((_, i) => ({
    id: `INC-${102030 + i}`,
    number: 102030 + i,
    dueDate: '۱۴۰۵/۰۹/۲۰',
    partner: i % 3 === 0 ? 'شرکت البرز' : i % 3 === 1 ? 'فروشگاه نوین' : 'بازرگانی کیان',
    bank: i % 2 === 0 ? 'بانک ملی' : 'بانک صادرات',
    amount: 120000000 + (i * 5000000),
    status: i % 4 === 0 ? 'وصول شده' : i % 4 === 1 ? 'در جریان وصول' : 'نزد صندوق',
  }));

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase">فهرست چک‌های دریافتی (اوراق)</span>
        <span className="text-[10px] font-bold text-slate-500">تعداد کل: ۱۲ فقره | مجموع: ۱,۹۸۰,۰۰۰,۰۰۰ ریال</span>
      </div>
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-center">سریال چک</th>
            <th className="px-6 py-4 text-center">تاریخ سررسید</th>
            <th className="px-6 py-4">طرف حساب / پرداخت‌کننده</th>
            <th className="px-6 py-4 text-center">بانک صادرکننده</th>
            <th className="px-6 py-4 text-center">مبلغ</th>
            <th className="px-6 py-4 text-center">وضعیت</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onDoubleClick={() => onSelect(item.id)}
              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">{item.number}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.dueDate}</td>
              <td className="px-6 py-4 font-bold text-slate-700">{item.partner}</td>
              <td className="px-6 py-4 text-center font-bold text-slate-500">{item.bank}</td>
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">
                {item.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                  item.status === 'وصول شده' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  item.status === 'در جریان وصول' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onSelect(item.id)}
                  className="text-emerald-600 hover:text-emerald-700 text-[10px] font-black"
                >
                  نمایش گردش کار
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckbookLeavesReport: React.FC<{ checkbookId: string; onSelect: (id: string) => void }> = ({ checkbookId, onSelect }) => {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    id: `L-${45000 + i}`,
    number: 45000 + i,
    dueDate: '۱۴۰۵/۰۷/۱۵',
    recipient: i % 3 === 0 ? 'شرکت آذرخش' : i % 3 === 1 ? 'فروشگاه سپهر' : '-',
    amount: i % 3 !== 2 ? (250000000 + (i * 10000000)) : 0,
    status: i % 3 !== 2 ? (i % 2 === 0 ? 'پاس شده' : 'صادر شده') : 'سفید (موجود)',
  }));

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black text-slate-800">اوراق دسته چک: {checkbookId}</span>
        <span className="text-[10px] font-bold text-slate-500">تعداد کل: ۵۰ برگ | صادر شده: ۱۲ | موجود: ۳۸</span>
      </div>
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-center">سریال چک</th>
            <th className="px-6 py-4 text-center">تاریخ سررسید</th>
            <th className="px-6 py-4">در وجه / گیرنده</th>
            <th className="px-6 py-4 text-center">مبلغ</th>
            <th className="px-6 py-4 text-center">وضعیت</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onDoubleClick={() => onSelect(item.id)}
              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">{item.number}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.recipient !== '-' ? item.dueDate : '-'}</td>
              <td className="px-6 py-4 font-bold text-slate-700">{item.recipient}</td>
              <td className="px-6 py-4 text-center font-mono font-black text-slate-900">
                {item.amount > 0 ? item.amount.toLocaleString() : '-'}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                  item.status.includes('پاس') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  item.status.includes('صادر') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onSelect(item.id)}
                  className="text-emerald-600 hover:text-emerald-700 text-[10px] font-black"
                >
                  نمایش گردش کار
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckbooksReport: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const data = [
    { id: 'CB-01', bank: 'بانک ملت', account: '۱۲۰۲۰۳۰۴۰', series: 'الف/۴۵', start: 45000, end: 45050, used: 12, status: 'فعال' },
    { id: 'CB-02', bank: 'بانک تجارت', account: '۵۵۸۸۹۹۰۰', series: 'ج/۱۲', start: 12000, end: 12025, used: 25, status: 'پایان یافته' },
    { id: 'CB-03', bank: 'بانک ملی', account: '۷۷۴۴۱۱', series: 'ب/۸۸', start: 88000, end: 88100, used: 5, status: 'فعال' },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4">بانک / حساب</th>
            <th className="px-6 py-4 text-center">سری و سریال</th>
            <th className="px-6 py-4 text-center">بازه شماره</th>
            <th className="px-6 py-4 text-center">مصرف شده</th>
            <th className="px-6 py-4 text-center">وضعیت</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onDoubleClick={() => onSelect(item.id)}
              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-black text-slate-800">{item.bank}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{item.account}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-mono font-black text-slate-700">{item.series}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.start} - {item.end}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${(item.used / (item.end - item.start)) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-slate-900">{item.used}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                  item.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onSelect(item.id)}
                  className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black hover:bg-white hover:border-emerald-500 transition-all"
                >
                  مشاهده اوراق
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SummaryReport: React.FC<{ 
  onSelect: (id: string) => void;
  selectedIds: string[];
  onDrillDown: () => void;
  title: string;
  data: any[];
}> = ({ onSelect, selectedIds, onDrillDown, title, data }) => {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 w-12 text-center">انتخاب</th>
            <th className="px-6 py-4">{title}</th>
            <th className="px-6 py-4 text-center">مانده اول دوره</th>
            <th className="px-6 py-4 text-center text-emerald-600">جمع بدهکار (+)</th>
            <th className="px-6 py-4 text-center text-rose-600">جمع بستانکار (-)</th>
            <th className="px-6 py-4 text-center">مانده نهایی</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onDoubleClick={() => {
                if (!selectedIds.includes(item.id)) onSelect(item.id);
                onDrillDown();
              }}
              className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${selectedIds.includes(item.id) ? 'bg-emerald-50/30' : ''}`}
            >
              <td className="px-6 py-4 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onSelect(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              <td className="px-6 py-4 font-black text-slate-800">
                {item.title}
              </td>
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.initial.toLocaleString()}</td>
              <td className="px-6 py-4 text-center font-mono text-emerald-600 font-black">{item.dr.toLocaleString()}</td>
              <td className="px-6 py-4 text-center font-mono text-rose-600 font-black">{item.cr.toLocaleString()}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-900 font-black bg-slate-50/50">{item.balance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 bg-slate-50/30 text-[10px] text-slate-400 font-bold flex flex-wrap items-center gap-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          جهت مشاهده ریز تراکنش‌ها، ردیف‌ها را انتخاب کرده و به تب «گردش» بروید یا روی ردیف دو بار کلیک کنید.
        </div>
        {selectedIds.length > 0 && (
          <button 
            onClick={onDrillDown}
            className="mr-auto bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            مشاهده گردش موارد انتخاب شده ({selectedIds.length})
            <TrendingUp className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

const CirculationReport: React.FC<{ selectedIds: string[]; type: string }> = ({ selectedIds, type }) => {
  const isCheck = type.includes('check');
  
  const getMockData = () => {
    const isCash = type.includes('cash');
    
    return [
      { date: '۱۴۰۵/۰۶/۰۱', doc: 'TR-101', desc: 'مانده از قبل', dr: 0, cr: 0, balance: 1200000000, status: 'تأیید شده', location: 'صندوق' },
      { date: '۱۴۰۵/۰۶/۰۲', doc: 'TR-102', desc: isCheck ? 'دریافت چک از مشتری - ناصر خسروی' : isCash ? 'شارژ تنخواه از حساب بانکی' : 'دریافت از مشتری - ناصر خسروی', dr: 150000000, cr: 0, balance: 1350000000, status: 'دریافت شده', location: 'صندوق مرکزی' },
      { date: '۱۴۰۵/۰۶/۰۳', doc: 'TR-103', desc: isCheck ? 'واگذاری چک به بانک جهت وصول' : 'برداشت نقدی جهت هزینه‌های جاری', dr: 0, cr: 25000000, balance: 1325000000, status: 'در جریان وصول', location: 'بانک تجارت' },
      { date: '۱۴۰۵/۰۶/۰۸', doc: 'TR-105', desc: isCheck ? 'اعلام وصول چک واگذاری' : 'پرداخت اجاره دفتر مرکزی', dr: 0, cr: 200000000, balance: 1137000000, status: 'وصول شده', location: 'بانک تجارت' },
    ];
  };

  const data = getMockData();

  if (isCheck) {
    return <CheckCirculationTimeline 
      data={data.map(item => ({ ...item, amount: item.dr || item.cr }))} 
      title="گردش عملیات چک دریافتی" 
      subtitle={selectedIds.length > 0 ? `کد چک: ${selectedIds[0]}` : 'گردش کلی تراکنش‌ها'} 
    />;
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-center">تاریخ</th>
            <th className="px-6 py-4 text-center">شماره سند</th>
            <th className="px-6 py-4">شرح تراکنش</th>
            <th className="px-6 py-4 text-center text-emerald-600">بدهکار / واریز (+)</th>
            <th className="px-6 py-4 text-center text-rose-600">بستانکار / برداشت (-)</th>
            <th className="px-6 py-4 text-center">مانده ردیف</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4 text-center font-mono text-slate-500">{item.date}</td>
              <td className="px-6 py-4 text-center font-mono text-slate-900 font-black">{item.doc}</td>
              <td className="px-6 py-4 font-bold text-slate-700">{item.desc}</td>
              <td className="px-6 py-4 text-center font-mono text-emerald-600 font-black">
                {item.dr > 0 ? item.dr.toLocaleString() : '-'}
              </td>
              <td className="px-6 py-4 text-center font-mono text-rose-600 font-black">
                {item.cr > 0 ? item.cr.toLocaleString() : '-'}
              </td>
              <td className="px-6 py-4 text-center font-mono text-slate-900 font-black bg-slate-50/50">
                {item.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GenericReportTable: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-center p-12 opacity-40">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
        <Activity className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-black text-slate-800">گزارش در حال تولید...</h3>
      <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs">
        سیستم در حال واکشی اطلاعات از دیتابیس مرکزی ERP است. لطفاً شکیبا باشید.
      </p>
    </div>
  );
};
