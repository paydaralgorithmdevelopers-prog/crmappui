
import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Trash2, 
  Plus, 
  Calculator,
  Building,
  CalendarDays,
  ArrowRightLeft,
  Users
} from 'lucide-react';
import { BudgetPageLayout } from './BudgetPageLayout';
import { BudgetHeaderInfo, IndirectPayrollRecord } from './types';

export const IndirectPayrollForecastView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [headerInfo, setHeaderInfo] = useState<BudgetHeaderInfo>({
    fiscalYear: '۱۴۰۵',
    version: 'V1',
    orgUnit: 'all',
    baseCurrency: 'ریال',
    secondaryCurrency: 'یورو',
    exchangeRate: 650000,
    status: 'draft',
    description: 'پیش‌بینی حقوق و مزایای پرسنل بر اساس ساختار سازمانی مصوب سال ۱۴۰۵',
    startDate: '۱۴۰۵/۰۱/۰۱',
    endDate: '۱۴۰۵/۱۲/۲۹'
  });

  const orgStructure = [
    {
      id: 'unit1',
      name: 'دفتر مرکزی',
      code: 'HO-01',
      roles: [
        { id: 'role1', name: 'مدیریت ارشد', code: 'M1' },
        { id: 'role2', name: 'کارشناس اداری', code: 'A1' }
      ]
    },
    {
      id: 'unit2',
      name: 'واحد فروش و بازاریابی',
      code: 'SL-01',
      roles: [
        { id: 'role3', name: 'مدیر فروش', code: 'SM1' },
        { id: 'role4', name: 'کارشناس فروش', code: 'SS1' }
      ]
    },
    {
      id: 'unit3',
      name: 'واحد مالی',
      code: 'FN-01',
      roles: [
        { id: 'role5', name: 'مدیر مالی', code: 'FM1' },
        { id: 'role6', name: 'حسابدار', code: 'AC1' }
      ]
    },
    {
      id: 'unit4',
      name: 'تولید و فنی',
      code: 'FC-01',
      roles: [
        { id: 'role7', name: 'مدیر تولید', code: 'PM1' },
        { id: 'role8', name: 'سرپرست تولید', code: 'PS1' }
      ]
    },
    {
      id: 'unit5',
      name: 'لجستیک و انبار',
      code: 'LG-01',
      roles: [
        { id: 'role9', name: 'مدیر لجستیک', code: 'LM1' },
        { id: 'role10', name: 'انباردار', code: 'WH1' }
      ]
    }
  ];

  // Initialize records for 12 months for each role
  const initialRecords: IndirectPayrollRecord[] = useMemo(() => {
    const recs: IndirectPayrollRecord[] = [];
    for (let m = 1; m <= 12; m++) {
      orgStructure.forEach(unit => {
        unit.roles.forEach(role => {
          recs.push({
            id: `${m}-${unit.id}-${role.id}`,
            role: role.name,
            workLocationId: unit.id,
            workLocationName: unit.name,
            workLocationCode: role.code,
            month: m,
            headcount: 1,
            amountPerPerson: 0,
            amountBaseCurrency: 0,
            exchangeRate: 650000,
            amountSecondaryCurrency: 0,
            description: ''
          });
        });
      });
    }
    return recs;
  }, []);

  const [records, setRecords] = useState<IndirectPayrollRecord[]>(initialRecords);
  const [activeMonth, setActiveMonth] = useState<number>(1);

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'جمع سال'
  ];

  const currentMonthRecords = useMemo(() => {
    if (activeMonth > 12) return [];
    return records.filter(r => r.month === activeMonth);
  }, [records, activeMonth]);

  const updateRecord = (id: string, field: keyof IndirectPayrollRecord, value: any) => {
    if (activeMonth > 12) return;
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'headcount' || field === 'amountPerPerson') {
          updated.amountBaseCurrency = updated.headcount * updated.amountPerPerson;
          updated.amountSecondaryCurrency = Number((updated.amountBaseCurrency / updated.exchangeRate).toFixed(2));
        }
        return updated;
      }
      return r;
    }));
  };

  const handleCopyForward = (roleId: string, unitId: string) => {
    if (activeMonth >= 12) return;
    const currentRecord = records.find(r => r.month === activeMonth && r.id.includes(`${unitId}-${roleId}`));
    if (!currentRecord) return;

    setRecords(prev => prev.map(r => {
      if (r.month > activeMonth && r.id.includes(`${unitId}-${roleId}`)) {
        return {
          ...r,
          headcount: currentRecord.headcount,
          amountPerPerson: currentRecord.amountPerPerson,
          amountBaseCurrency: currentRecord.headcount * currentRecord.amountPerPerson,
          amountSecondaryCurrency: Number((currentRecord.headcount * currentRecord.amountPerPerson / r.exchangeRate).toFixed(2))
        };
      }
      return r;
    }));
    alert(`اطلاعات سمت برای ماه‌های ${activeMonth + 1} تا ۱۲ کپی شد.`);
  };

  const handleCopyFromPreviousMonth = () => {
    if (activeMonth <= 1 || activeMonth > 12) return;
    
    setRecords(prev => {
      const prevMonthRecords = prev.filter(r => r.month === activeMonth - 1);
      return prev.map(r => {
        if (r.month === activeMonth) {
          const prevRec = prevMonthRecords.find(pr => pr.id.includes(r.id.split('-').slice(1).join('-')));
          if (prevRec) {
            return {
              ...r,
              headcount: prevRec.headcount,
              amountPerPerson: prevRec.amountPerPerson,
              amountBaseCurrency: prevRec.amountBaseCurrency,
              amountSecondaryCurrency: prevRec.amountSecondaryCurrency
            };
          }
        }
        return r;
      });
    });
  };

  const getYearlyTotal = (roleId: string, unitId: string) => {
    return records
      .filter(r => r.id.includes(`${unitId}-${roleId}`))
      .reduce((sum, r) => sum + r.amountBaseCurrency, 0);
  };

  const getYearlyAverages = (roleId: string, unitId: string) => {
    const roleRecords = records.filter(r => r.id.includes(`${unitId}-${roleId}`));
    const avgHeadcount = roleRecords.reduce((sum, r) => sum + r.headcount, 0) / 12;
    const avgAmountPerPerson = roleRecords.reduce((sum, r) => sum + r.amountPerPerson, 0) / 12;
    const totalBase = roleRecords.reduce((sum, r) => sum + r.amountBaseCurrency, 0);
    const totalSecondary = roleRecords.reduce((sum, r) => sum + r.amountSecondaryCurrency, 0);
    
    return {
      avgHeadcount,
      avgAmountPerPerson,
      totalBase,
      totalSecondary
    };
  };

  const totalBase = currentMonthRecords.reduce((sum, r) => sum + r.amountBaseCurrency, 0);
  const totalSecondary = currentMonthRecords.reduce((sum, r) => sum + r.amountSecondaryCurrency, 0);
  const totalHeadcount = currentMonthRecords.reduce((sum, r) => sum + r.headcount, 0);

  const annualTotalBase = records.reduce((sum, r) => sum + r.amountBaseCurrency, 0);
  const annualTotalSecondary = records.reduce((sum, r) => sum + r.amountSecondaryCurrency, 0);
  const annualAvgHeadcount = records.reduce((sum, r) => sum + r.headcount, 0) / 12;

  return (
    <BudgetPageLayout
      title="پیش‌بینی حقوق و دستمزد غیرمستقیم"
      headerInfo={headerInfo}
      onHeaderChange={(info) => setHeaderInfo({ ...headerInfo, ...info })}
      onBack={onBack}
    >
      <div className="flex flex-col h-full gap-4">
        {/* Month Selector Tabs */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-sm w-fit max-w-full">
          {months.map((m, idx) => (
            <button
              key={m}
              onClick={() => setActiveMonth(idx + 1)}
              className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                activeMonth === idx + 1
                  ? idx === 12 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-rose-600 text-white shadow-md shadow-rose-100'
                  : idx === 12 ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-700">
                {activeMonth <= 12 ? `ساختار درختی و پیش‌بینی ماه ${months[activeMonth - 1]}` : 'گزارش تجمیعی کل سال (پیش‌بینی)'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {activeMonth > 1 && activeMonth <= 12 && (
                <button 
                  onClick={handleCopyFromPreviousMonth}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100 hover:bg-indigo-100 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  کپی از ماه قبل ({months[activeMonth - 2]})
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200">
                <Users className="w-3.5 h-3.5" />
                {activeMonth <= 12 ? `مجموع نفرات ماه: ${totalHeadcount} نفر` : `میانگین نفرات سالانه: ${annualAvgHeadcount.toFixed(1)} نفر`}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold text-right">ساختار سازمانی / سمت</th>
                  <th className="px-4 py-3 font-bold text-center w-28">
                    {activeMonth <= 12 ? 'تعداد (نفر)' : 'میانگین تعداد سال'}
                  </th>
                  <th className="px-4 py-3 font-bold text-left">
                    {activeMonth <= 12 ? `هزینه هر نفر (${headerInfo.baseCurrency})` : `میانگین هزینه (${headerInfo.baseCurrency})`}
                  </th>
                  <th className="px-4 py-3 font-bold text-left">
                    {activeMonth <= 12 ? `مجموع ماه (${headerInfo.baseCurrency})` : `مجموع سال (${headerInfo.baseCurrency})`}
                  </th>
                  <th className="px-4 py-3 font-bold text-left bg-rose-50/30 text-rose-900 border-l border-rose-100">
                    {activeMonth <= 12 ? `معادل (${headerInfo.secondaryCurrency})` : `مجموع سال (${headerInfo.secondaryCurrency})`}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgStructure.map(unit => (
                  <React.Fragment key={unit.id}>
                    <tr className="bg-slate-50/80">
                      <td colSpan={5} className="px-4 py-2 font-black text-slate-800 bg-slate-100/50">
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-rose-600" />
                          <span>{unit.name}</span>
                        </div>
                      </td>
                    </tr>
                    {unit.roles.map(role => {
                      const yearlyTotal = getYearlyTotal(role.id, unit.id);
                      const averages = getYearlyAverages(role.id, unit.id);
                      
                      if (activeMonth <= 12) {
                        const record = records.find(r => r.month === activeMonth && r.id.includes(`${unit.id}-${role.id}`))!;
                        return (
                          <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-4 py-3 pr-10">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span className="font-bold text-slate-700">{role.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number"
                                min="0"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-mono outline-none focus:border-rose-500"
                                value={record.headcount}
                                onChange={(e) => updateRecord(record.id, 'headcount', Number(e.target.value))}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-left font-mono outline-none focus:border-rose-500"
                                value={record.amountPerPerson}
                                onChange={(e) => updateRecord(record.id, 'amountPerPerson', Number(e.target.value))}
                              />
                            </td>
                            <td className="px-4 py-3 text-left font-mono font-bold text-slate-700 italic">
                              {record.amountBaseCurrency.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 bg-rose-50/10 border-l border-rose-100 text-left font-mono font-bold text-rose-700">
                              {record.amountSecondaryCurrency.toLocaleString()}
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={`${unit.id}-${role.id}-summary`} className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 pr-10">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                <span className="font-bold text-slate-700">{role.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-mono font-bold text-slate-600 italic bg-slate-50/30">
                              {averages.avgHeadcount.toFixed(1)}
                            </td>
                            <td className="px-4 py-3 text-left font-mono font-bold text-slate-600 bg-slate-50/30">
                              {Math.round(averages.avgAmountPerPerson).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-left font-mono font-black text-slate-800 bg-slate-50/50">
                              {averages.totalBase.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 bg-indigo-50/20 border-l border-indigo-100 text-left font-mono font-black text-indigo-700">
                              {averages.totalSecondary.toLocaleString()}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td className="px-4 py-4" colSpan={2}>
                    {activeMonth <= 12 ? `جمع کل ماه ${months[activeMonth - 1]}` : 'مجموع بودجه پیش‌بینی کل سال'}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm">
                    {activeMonth <= 12 ? `${totalHeadcount} نفر` : `${annualAvgHeadcount.toFixed(1)} نفر`}
                  </td>
                  <td className="px-4 py-4 text-left font-mono text-rose-400 text-sm">
                    {activeMonth <= 12 ? totalBase.toLocaleString() : annualTotalBase.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-left font-mono text-sm bg-rose-900/50 border-l border-white/10" colSpan={2}>
                    {activeMonth <= 12 ? totalSecondary.toLocaleString() : annualTotalSecondary.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary Section - Below Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
             <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${activeMonth === 13 ? 'bg-indigo-900 border-indigo-800 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeMonth === 13 ? 'bg-indigo-800 border-indigo-700 text-white' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase ${activeMonth === 13 ? 'text-indigo-300' : 'text-slate-400'}`}>
                      مجموع بودجه سالانه حقوق ({headerInfo.baseCurrency})
                    </p>
                    <p className="text-xl font-mono font-bold">
                      {annualTotalBase.toLocaleString()}
                    </p>
                  </div>
                </div>
                {activeMonth !== 13 && (
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">سهم ماه {months[activeMonth-1]}</p>
                    <p className="text-xs font-mono font-bold text-rose-600">
                      {((totalBase / annualTotalBase) * 100 || 0).toFixed(1)}%
                    </p>
                  </div>
                )}
             </div>

             <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${activeMonth === 13 ? 'bg-slate-800 border-slate-700 text-white shadow-lg shadow-slate-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeMonth === 13 ? 'bg-slate-700 border-slate-600 text-white' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase ${activeMonth === 13 ? 'text-slate-400' : 'text-slate-400'}`}>
                      مجموع بودجه سالانه ({headerInfo.secondaryCurrency})
                    </p>
                    <p className="text-xl font-mono font-bold">
                      {annualTotalSecondary.toLocaleString()}
                    </p>
                  </div>
                </div>
                {activeMonth !== 13 && (
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">سهم ماه {months[activeMonth-1]}</p>
                    <p className="text-xs font-mono font-bold text-indigo-600">
                      {((totalSecondary / annualTotalSecondary) * 100 || 0).toFixed(1)}%
                    </p>
                  </div>
                )}
             </div>
        </div>
      </div>
    </BudgetPageLayout>
  );
};
