import React, { useState, useEffect } from 'react';
import { TargetGroup } from '../../types';
import {
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  GitBranch,
  Building,
  Tag
} from 'lucide-react';

interface GroupFormProps {
  selectedGroup: TargetGroup | null;
  allGroups: TargetGroup[];
  onSaveGroup: (group: TargetGroup) => void;
  onNewGroup?: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  selectedGroup,
  allGroups,
  onSaveGroup,
}) => {
  const [formData, setFormData] = useState<Partial<TargetGroup>>({
    code: '',
    title: '',
    parentId: null,
    description: '',
    isActive: true,
    priority: 'medium',
    assignee: '',
    targetIndustry: '',
    expectedAnnualValue: 0,
    assignedLeadIds: [],
  });

  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setFormData(selectedGroup);
    } else {
      setFormData({
        id: `grp-${Date.now()}`,
        code: `TGT-${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        parentId: null,
        description: '',
        isActive: true,
        priority: 'high',
        assignee: '',
        targetIndustry: 'صنایع سنگین و مادر',
        expectedAnnualValue: 0,
        assignedLeadIds: [],
        createdAt: '۱۴۰۵/۱۱/۱۸',
        updatedAt: '۱۴۰۵/۱۱/۱۸',
      });
    }
  }, [selectedGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('لطفاً عنوان گروه هدف را وارد نمایید.');
      return;
    }

    const updatedGroup: TargetGroup = {
      id: formData.id || selectedGroup?.id || `grp-${Date.now()}`,
      code: formData.code?.trim() || selectedGroup?.code || `TGT-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title.trim(),
      parentId: formData.parentId || null,
      description: formData.description || '',
      isActive: formData.isActive ?? true,
      priority: formData.priority || 'medium',
      assignee: formData.assignee || '',
      targetIndustry: formData.targetIndustry || 'سایر صنایع',
      expectedAnnualValue: Number(formData.expectedAnnualValue) || 0,
      assignedLeadIds: formData.assignedLeadIds || [],
      createdAt: formData.createdAt || '۱۴۰۵/۱۱/۱۸',
      updatedAt: '۱۴۰۵/۱۱/۱۸',
    };

    onSaveGroup(updatedGroup);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const parentGroup = allGroups.find((g) => g.id === formData.parentId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header: فقط نام‌گذاری، بدون دکمه ایجاد گروه جدید */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-100/70 text-rose-800 flex items-center justify-center font-bold">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>نام‌گذاری گروه هدف</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md animate-fade-in">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ذخیره شد
            </span>
          )}
        </div>
      </div>

      {/* Form Content: فقط فیلدهای نام‌گذاری قابل ویرایش، بقیه نمایشی */}
      <form onSubmit={handleSubmit} className="p-3.5 space-y-2.5 text-xs">
        {/* ۱. نام‌گذاری گروه هدف (قابل ویرایش) */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            نام‌گذاری گروه هدف <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            id="group-title-input"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="مثلاً: صنایع نفت، گاز و پتروشیمی..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-xs shadow-2xs"
            required
          />
        </div>

        {/* ۳. ساختار درختی: والد (فیلد نمایشی) */}
        <div>
          <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
            <GitBranch className="w-3 h-3 text-slate-400" />
            <span>گروه والد در ساختار درختی (نمایشی)</span>
          </label>
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs flex items-center justify-between">
            <span className="truncate font-medium text-slate-700">
              {parentGroup ? parentGroup.title : '(گروه اصلی / ریشه - بدون والد)'}
            </span>
            {parentGroup && (
              <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                #{parentGroup.code}
              </span>
            )}
          </div>
        </div>

        {/* ۴. حوزه صنعت هدف (فیلد نمایشی) */}
        <div>
          <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" />
            <span>گروه مشتری و بازار هدف (نمایشی)</span>
          </label>
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs">
            <span className="font-medium text-slate-700">
              {formData.targetIndustry || 'سایر صنایع'}
            </span>
          </div>
        </div>

        {/* ۵. اولویت پیگیری (فیلد نمایشی) */}
        <div>
          <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            <span>اولویت پیگیری (نمایشی)</span>
          </label>
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                formData.priority === 'high'
                  ? 'bg-rose-500'
                  : formData.priority === 'low'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-slate-700">
              {formData.priority === 'high'
                ? 'اولویت بالا (استراتژیک)'
                : formData.priority === 'low'
                ? 'اولویت پایین (بلندمدت)'
                : 'اولویت متوسط (عادی)'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400">
            {formData.assignedLeadIds?.length || 0} سرنخ منتسب
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (selectedGroup) setFormData(selectedGroup);
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="بازنشانی به مقادیر اصلی گروه"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی</span>
            </button>

            <button
              type="submit"
              id="btn-save-group"
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخیره نام</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
