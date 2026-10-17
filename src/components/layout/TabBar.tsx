import React from 'react';
import { X, Layers, Users, Radio, Award } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  icon?: any;
  isPrimary?: boolean;
  closable?: boolean;
}

interface TabBarProps {
  activeTab: string;
  tabs: Tab[];
  setActiveTab: (tab: string) => void;
  onCloseTab: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, tabs, setActiveTab, onCloseTab }) => {

  return (
    <div className="bg-[#f8fafc] border-b border-slate-200 px-2 pt-1 flex items-center overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center gap-1 min-w-max pb-1">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.id;
          const Icon = tab.icon || Layers;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t-lg transition-all border-t border-x cursor-pointer ${
                isCurrent
                  ? 'bg-white text-rose-700 font-bold border-slate-200 border-b-white shadow-xs -mb-[1px] relative z-10'
                  : 'bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 border-transparent hover:border-slate-200'
              } ${tab.isPrimary ? 'ring-1 ring-rose-200/50' : ''}`}
            >
              {tab.isPrimary ? (
                <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
              ) : null}
              <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-rose-600' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{tab.title}</span>
              {tab.closable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="mr-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
