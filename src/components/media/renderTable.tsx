import React from 'react';
import { Trash2 } from 'lucide-react';
import { MediaSignalField } from '../../types';

export const renderFieldsTable = (
  items: MediaSignalField[],
  handleToggleSignalActive: (id: string) => void,
  handleUpdateSignalTarget: (id: string, key: keyof MediaSignalField, val: any) => void,
  handleDeleteSignal: (id: string) => void
) => (
  <div className="overflow-x-auto">
    <table className="w-full text-right border-collapse text-xs">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
          <th className="p-2.5 text-center w-10">فعال</th>
          <th className="p-2.5 min-w-[200px]">نام فیلد</th>
          <th className="p-2.5 w-28 text-center">نوع مقایسه</th>
          <th className="p-2.5 w-32 text-center bg-rose-50/40 text-rose-900 font-bold">
            تارگت (OKR)
          </th>
          <th className="p-2.5 w-32 text-center bg-emerald-50/40 text-emerald-900 font-bold">
            میزان تحقق (KPI)
          </th>
          <th className="p-2.5 w-24 text-center">واحد سنجش</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((sig) => (
          <tr
            key={sig.id}
            className={`hover:bg-slate-50/80 transition-colors ${
              !sig.isActive ? 'opacity-50 bg-slate-50/40' : ''
            }`}
          >
            <td className="p-2 text-center">
              <input
                type="checkbox"
                checked={sig.isActive}
                onChange={() => handleToggleSignalActive(sig.id)}
                className="w-3.5 h-3.5 accent-rose-600 rounded cursor-pointer"
                title="فعال/غیرفعال"
              />
            </td>

            <td className="p-2">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">
                  {sig.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                    {sig.code}
                  </span>
                  {sig.description && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[240px]">
                      {sig.description}
                    </span>
                  )}
                </div>
              </div>
            </td>

            <td className="p-3 text-center">
              <select
                value={sig.targetType}
                onChange={(e) =>
                  handleUpdateSignalTarget(sig.id, 'targetType', e.target.value)
                }
                className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 shadow-2xs font-medium cursor-pointer focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                disabled={!sig.isActive}
              >
                <option value="min">حداقل (≥)</option>
                <option value="max">حداکثر (≤)</option>
                <option value="exact">دقیق (=)</option>
              </select>
            </td>

            <td className="p-3 text-center bg-rose-50/30">
              <input
                type="number"
                step="any"
                value={sig.targetValue}
                onChange={(e) =>
                  handleUpdateSignalTarget(sig.id, 'targetValue', Number(e.target.value))
                }
                className="w-full font-mono font-bold text-center bg-white border border-rose-300 focus:border-rose-600 rounded-md px-3 py-1.5 text-slate-900 text-sm shadow-sm transition-all"
                placeholder="تارگت OKR"
                disabled={!sig.isActive}
              />
            </td>
            
            <td className="p-3 text-center bg-emerald-50/30">
              <input
                type="number"
                step="any"
                value={sig.kpiValue || 0}
                onChange={(e) =>
                  handleUpdateSignalTarget(sig.id, 'kpiValue', Number(e.target.value))
                }
                className="w-full font-mono font-bold text-center bg-white border border-emerald-300 focus:border-emerald-600 rounded-md px-3 py-1.5 text-slate-900 text-sm shadow-sm transition-all"
                placeholder="مقدار KPI"
                disabled={!sig.isActive}
              />
            </td>

            <td className="p-2 text-center">
              <input
                type="text"
                value={sig.unit}
                onChange={(e) =>
                  handleUpdateSignalTarget(sig.id, 'unit', e.target.value)
                }
                className="w-full text-center bg-white border border-slate-200 rounded px-1 py-1 text-[11px] text-slate-700"
                disabled={!sig.isActive}
              />
            </td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={6} className="p-4 text-center text-slate-500">فیلدی برای این بخش یافت نشد.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
