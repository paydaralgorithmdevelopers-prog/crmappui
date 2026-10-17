import React, { useState, useMemo } from 'react';
import { 
  Table, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Maximize2,
  Users,
  User,
  Globe,
  Package,
  Calculator,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface PeriodData {
  target: number;
  realized: number;
  commission: number;
}

interface ReportData {
  teamCode: string;
  teamName: string;
  userCode: string;
  userName: string;
  position: string;
  responsibilityMultiplier: number;
  userShare: number;
  geoCode: string;
  geoName: string;
  geoShare: number;
  geoMultiplier: number;
  productGroupCode: string;
  productGroupName: string;
  productShare: number;
  productMultiplier: number;
  months: Record<string, PeriodData>; // m1 to m12
  paidCommission: number;
}

const rawData: ReportData[] = [
  { 
    teamCode: 'W01', teamName: 'تیم 1', userCode: 'P002', userName: 'فرد2', position: 'کارشناس ارشد فروش1', 
    responsibilityMultiplier: 1, userShare: 0, geoCode: 'G01', geoName: 'مکانهای استوایی', geoShare: 0.50, geoMultiplier: 1.2, 
    productGroupCode: 'T01', productGroupName: 'راهبردی', productShare: 0, productMultiplier: 1, 
    months: {
      m1: { target: 473, realized: 350, commission: 42000 },
      m2: { target: 551, realized: 600, commission: 72000 },
      m3: { target: 630, realized: 0, commission: 0 },
      m4: { target: 709, realized: 0, commission: 0 },
      m5: { target: 788, realized: 0, commission: 0 },
      m6: { target: 788, realized: 0, commission: 0 },
      m7: { target: 788, realized: 0, commission: 0 },
      m8: { target: 788, realized: 0, commission: 0 },
      m9: { target: 788, realized: 0, commission: 0 },
      m10: { target: 788, realized: 0, commission: 0 },
      m11: { target: 394, realized: 0, commission: 0 },
      m12: { target: 394, realized: 0, commission: 0 },
    },
    paidCommission: 50000
  },
  // ... more items can be added here
];

export const ComprehensiveTargetCommissionReportView: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const groupedData = useMemo(() => {
    const teams: Record<string, any> = {};

    const createEmptyTotals = () => ({
      months: Array.from({ length: 12 }, (_, i) => ({ target: 0, realized: 0, commission: 0 })),
      paidCommission: 0
    });

    rawData.forEach(item => {
      if (!teams[item.teamCode]) {
        teams[item.teamCode] = { 
          id: item.teamCode, name: item.teamName, type: 'team', users: {},
          totals: createEmptyTotals()
        };
      }
      
      const team = teams[item.teamCode];
      if (!team.users[item.userCode]) {
        team.users[item.userCode] = { 
          id: `${item.teamCode}-${item.userCode}`, name: item.userName, position: item.position, type: 'user', geos: {},
          totals: createEmptyTotals()
        };
      }

      const user = team.users[item.userCode];
      if (!user.geos[item.geoCode]) {
        user.geos[item.geoCode] = { 
          id: `${item.teamCode}-${item.userCode}-${item.geoCode}`, name: item.geoName, type: 'geo', products: [],
          totals: createEmptyTotals()
        };
      }

      const geo = user.geos[item.geoCode];
      geo.products.push({
        ...item,
        id: `${item.teamCode}-${item.userCode}-${item.geoCode}-${item.productGroupCode}`,
        type: 'product'
      });

      // Update totals
      [team, user, geo].forEach(node => {
        for (let i = 1; i <= 12; i++) {
          const mKey = `m${i}`;
          node.totals.months[i-1].target += item.months[mKey]?.target || 0;
          node.totals.months[i-1].realized += item.months[mKey]?.realized || 0;
          node.totals.months[i-1].commission += item.months[mKey]?.commission || 0;
        }
        node.totals.paidCommission += item.paidCommission || 0;
      });
    });

    return Object.values(teams);
  }, []);

  const renderPeriodColumns = (period: any) => {
    const deviation = period.realized - period.target;
    return (
      <>
        <td className="px-2 py-3 text-center border-l border-slate-100">{period.target.toLocaleString()}</td>
        <td className="px-2 py-3 text-center border-l border-slate-100 text-emerald-600 font-bold">{period.realized.toLocaleString()}</td>
        <td className={`px-2 py-3 text-center border-l border-slate-100 font-bold ${deviation < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          {deviation.toLocaleString()}
        </td>
        <td className="px-2 py-3 text-center border-l border-slate-200 font-black text-indigo-700">{period.commission.toLocaleString()}</td>
      </>
    );
  };

  const calculateQuarter = (months: any[], q: number) => {
    const startIndex = (q - 1) * 3;
    const qMonths = months.slice(startIndex, startIndex + 3);
    return qMonths.reduce((acc, m) => ({
      target: acc.target + m.target,
      realized: acc.realized + m.realized,
      commission: acc.commission + m.commission
    }), { target: 0, realized: 0, commission: 0 });
  };

  const calculateYear = (months: any[]) => {
    return months.reduce((acc, m) => ({
      target: acc.target + m.target,
      realized: acc.realized + m.realized,
      commission: acc.commission + m.commission
    }), { target: 0, realized: 0, commission: 0 });
  };

  const renderRows = (nodes: any[], depth = 0): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.type !== 'product';
      
      let children: any[] = [];
      if (node.type === 'team') children = Object.values(node.users);
      if (node.type === 'user') children = Object.values(node.geos);
      if (node.type === 'geo') children = node.products;

      const Icon = node.type === 'team' ? Users : node.type === 'user' ? User : node.type === 'geo' ? Globe : Package;
      
      const months = node.type === 'product' 
        ? Array.from({ length: 12 }, (_, i) => node.months[`m${i+1}`] || { target: 0, realized: 0, commission: 0 })
        : node.totals.months;
      
      const yearTotals = calculateYear(months);
      const paid = node.type === 'product' ? node.paidCommission : node.totals.paidCommission;

      return (
        <React.Fragment key={node.id}>
          <tr className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${node.type === 'team' ? 'bg-slate-50/50 font-bold' : ''}`}>
            <td className="px-4 py-3 sticky right-0 bg-white z-20 border-l border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2" style={{ marginRight: `${depth * 24}px` }}>
                {hasChildren ? (
                  <button onClick={() => toggleExpand(node.id)} className="p-1 hover:bg-slate-200 rounded transition-colors">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
                  </button>
                ) : (
                  <div className="w-6" />
                )}
                <Icon className={`w-4 h-4 ${node.type === 'team' ? 'text-rose-600' : node.type === 'user' ? 'text-indigo-600' : node.type === 'geo' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="truncate max-w-[200px]">{node.name || node.productGroupName}</span>
              </div>
            </td>

            {/* Common Info */}
            <td className="px-4 py-3 text-center font-mono text-[10px] text-slate-400">{node.type === 'team' ? node.id : node.teamCode || ''}</td>
            <td className="px-4 py-3 text-center font-mono text-[10px] text-slate-400">{node.type === 'user' ? node.id.split('-')[1] : node.userCode || ''}</td>
            <td className="px-4 py-3 text-center">{node.position || ''}</td>
            <td className="px-4 py-3 text-center font-bold text-indigo-600">{node.responsibilityMultiplier || ''}</td>
            <td className="px-4 py-3 text-center">{node.userShare || ''}</td>
            <td className="px-4 py-3 text-center font-mono text-[10px] text-slate-400">{node.geoCode || ''}</td>
            <td className="px-4 py-3 text-center">{node.geoShare || ''}</td>
            <td className="px-4 py-3 text-center font-bold text-emerald-600">{node.geoMultiplier || ''}</td>
            <td className="px-4 py-3 text-center font-mono text-[10px] text-slate-400">{node.productGroupCode || ''}</td>
            <td className="px-4 py-3 text-center">{node.productShare || ''}</td>
            <td className="px-4 py-3 text-center font-bold text-rose-600 border-l-2 border-slate-200">{node.productMultiplier || ''}</td>

            {/* Monthly Columns */}
            {months.map((m: any, i: number) => (
              <React.Fragment key={i}>
                {renderPeriodColumns(m)}
                {(i + 1) % 3 === 0 && (
                  <td className="p-0 border-l-2 border-slate-300">
                    <table className="w-full h-full text-[10px]">
                      <tr className="bg-slate-100 font-bold">
                        {renderPeriodColumns(calculateQuarter(months, (i + 1) / 3))}
                      </tr>
                    </table>
                  </td>
                )}
              </React.Fragment>
            ))}

            {/* Year Totals */}
            <td className="px-4 py-3 text-center bg-indigo-50 font-black text-indigo-700 border-r-2 border-indigo-200">{yearTotals.target.toLocaleString()}</td>
            <td className="px-4 py-3 text-center bg-indigo-50 font-black text-indigo-700">{yearTotals.realized.toLocaleString()}</td>
            <td className="px-4 py-3 text-center bg-indigo-50 font-black text-rose-700">{(yearTotals.realized - yearTotals.target).toLocaleString()}</td>
            <td className="px-4 py-3 text-center bg-indigo-100 font-black text-indigo-900 border-l-2 border-indigo-300">{yearTotals.commission.toLocaleString()}</td>
            
            {/* Payment & Balance */}
            <td className="px-4 py-3 text-center bg-emerald-50 font-bold text-emerald-700">{paid.toLocaleString()}</td>
            <td className="px-4 py-3 text-center bg-rose-50 font-bold text-rose-700">{(yearTotals.commission - paid).toLocaleString()}</td>
          </tr>
          {isExpanded && renderRows(children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">ابرگزارش جامع تارگت، تحقق و پورسانت</h1>
            <p className="text-[10px] text-slate-500">تحلیل ۳۶۰ درجه عملکرد فروش و تسویه‌حساب‌های مالی در تمام سطوح سازمانی</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجو در گزارش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-100">
            <Download className="w-4 h-4" /> خروجی اکسل پیشرفته
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1 relative custom-scrollbar">
          <table className="w-full text-right text-[10px] border-collapse min-w-[8000px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-30">
              <tr>
                <th className="px-4 py-4 font-bold sticky right-0 bg-slate-100 z-40 border-l-2 border-slate-200" rowSpan={2}>ساختار سلسله‌مراتبی</th>
                <th className="px-4 py-2 font-bold text-center border-l border-slate-200 bg-slate-100/50" colSpan={11}>مشخصات و ضرایب</th>
                
                {Array.from({ length: 12 }, (_, i) => (
                  <React.Fragment key={i}>
                    <th className="px-4 py-2 font-bold text-center border-l-2 border-slate-200 bg-indigo-50/30" colSpan={4}>برج {i+1}</th>
                    {(i + 1) % 3 === 0 && (
                      <th className="px-4 py-2 font-bold text-center border-l-4 border-slate-300 bg-slate-200/50" colSpan={4}>فصل {(i+1)/3}</th>
                    )}
                  </React.Fragment>
                ))}

                <th className="px-4 py-2 font-bold text-center border-l-4 border-indigo-300 bg-indigo-100" colSpan={4}>عملکرد کل سال</th>
                <th className="px-4 py-2 font-bold text-center border-l-4 border-emerald-300 bg-emerald-100 text-emerald-900" colSpan={2}>وضعیت تسویه</th>
              </tr>
              <tr className="bg-slate-50/80 text-[9px]">
                <th className="px-2 py-2 border-l border-slate-200">کد تیم</th>
                <th className="px-2 py-2 border-l border-slate-200">کد فرد</th>
                <th className="px-2 py-2 border-l border-slate-200">سمت</th>
                <th className="px-2 py-2 border-l border-slate-200">ض.مسئولیت</th>
                <th className="px-2 py-2 border-l border-slate-200">سهم فرد</th>
                <th className="px-2 py-2 border-l border-slate-200">کد منطقه</th>
                <th className="px-2 py-2 border-l border-slate-200">سهم منطقه</th>
                <th className="px-2 py-2 border-l border-slate-200">ض.منطقه</th>
                <th className="px-2 py-2 border-l border-slate-200">کد گروه</th>
                <th className="px-2 py-2 border-l border-slate-200">سهم محصول</th>
                <th className="px-2 py-2 border-l-2 border-slate-300">ض.محصول</th>

                {Array.from({ length: 16 }, (_, i) => ( // 12 months + 4 quarters
                  <React.Fragment key={i}>
                    <th className="px-2 py-2 border-l border-slate-200">تارگت</th>
                    <th className="px-2 py-2 border-l border-slate-200">تحقق</th>
                    <th className="px-2 py-2 border-l border-slate-200">انحراف</th>
                    <th className="px-2 py-2 border-l-2 border-slate-300">پورسانت</th>
                  </React.Fragment>
                ))}

                <th className="px-2 py-2 border-l border-slate-200 bg-indigo-50">تارگت کل</th>
                <th className="px-2 py-2 border-l border-slate-200 bg-indigo-50">تحقق کل</th>
                <th className="px-2 py-2 border-l border-slate-200 bg-indigo-50">انحراف کل</th>
                <th className="px-2 py-2 border-l-4 border-indigo-400 bg-indigo-100">پورسانت کل</th>
                
                <th className="px-2 py-2 border-l border-slate-200 bg-emerald-50">پرداخت شده</th>
                <th className="px-2 py-2 bg-rose-50 text-rose-700">مانده نهایی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renderRows(groupedData)}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};
