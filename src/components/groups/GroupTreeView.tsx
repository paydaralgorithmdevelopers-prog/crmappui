import React, { useState } from 'react';
import { TargetGroup } from '../../types';
import {
  FolderTree,
  ChevronDown,
  ChevronLeft,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface GroupTreeViewProps {
  groups: TargetGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onAddSubGroup: (parentId: string | null) => void;
  onDeleteGroup: (groupId: string) => void;
}

export const GroupTreeView: React.FC<GroupTreeViewProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onAddSubGroup,
  onDeleteGroup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'grp-1': true,
    'grp-2': true,
    'grp-3': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build tree
  const rootGroups = groups.filter((g) => g.parentId === null);
  const getChildren = (parentId: string) => groups.filter((g) => g.parentId === parentId);

  const filteredGroups = groups.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderNode = (node: TargetGroup, depth = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes[node.id] ?? true;
    const isSelected = selectedGroupId === node.id;
    const leadCount = node.assignedLeadIds.length;

    return (
      <div key={node.id} className="relative">
        <div
          onClick={() => onSelectGroup(node.id)}
          className={`group flex items-center justify-between px-2 py-1.5 rounded-lg my-0.5 cursor-pointer text-xs transition-all border ${
            isSelected
              ? 'bg-rose-50/80 border-rose-200 text-rose-900 font-semibold shadow-2xs ring-1 ring-rose-300/40'
              : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
          style={{ marginRight: `${depth * 16}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            ) : (
              <span className="w-4 flex items-center justify-center text-slate-300">•</span>
            )}

            <Layers className="w-3.5 h-3.5 text-rose-500/80 shrink-0" />

            <span className="truncate">{node.title}</span>

            {/* ERP Code Badge style */}
            <span className="hidden sm:inline-block font-mono text-[10px] text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
              #{node.code}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Lead Count Badge */}
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-md font-medium ${
                leadCount > 0
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
              title="تعداد سرنخ‌های متصل به این گروه"
            >
              {leadCount} سرنخ
            </span>

            {/* Action buttons on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
              <button
                type="button"
                title="افزودن زیرگروه"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubGroup(node.id);
                }}
                className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="حذف گروه"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`آیا از حذف گروه «${node.title}» اطمینان دارید؟`)) {
                    onDeleteGroup(node.id);
                  }
                }}
                className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Render child nodes recursively */}
        {hasChildren && isExpanded && (
          <div className="border-r border-slate-200/80 mr-3 pr-1 space-y-0.5">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <FolderTree className="w-3.5 h-3.5 text-rose-700" />
          </div>
          <span className="font-bold text-xs text-slate-800">ساختار درختی گروه‌های هدف</span>
          <span className="text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded-full font-medium">
            {groups.length} گروه
          </span>
        </div>

        <button
          type="button"
          id="btn-add-root-group"
          onClick={() => onAddSubGroup(null)}
          className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>گروه اصلی جدید</span>
        </button>
      </div>

      {/* Search box inside tree */}
      <div className="p-2 border-b border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو در درخت گروه‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
          <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Tree Content list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {searchTerm ? (
          filteredGroups.length > 0 ? (
            filteredGroups.map((g) => (
              <div
                key={g.id}
                onClick={() => onSelectGroup(g.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer border ${
                  selectedGroupId === g.id
                    ? 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                    : 'hover:bg-slate-50 border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                  <span>{g.title}</span>
                  <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                    #{g.code}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{g.assignedLeadIds.length} سرنخ</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              موردی با این عنوان یافت نشد
            </div>
          )
        ) : (
          rootGroups.map((root) => renderNode(root))
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="text-slate-500 truncate">
          کلیک روی هر شاخه: انتخاب و بارگذاری در فرم
        </span>
        <span className="font-mono text-[10px] text-slate-400 shrink-0">
          {groups.length} گره در ساختار
        </span>
      </div>
    </div>
  );
};
