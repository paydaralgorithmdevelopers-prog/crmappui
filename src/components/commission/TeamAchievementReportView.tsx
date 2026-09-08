import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Target, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Medal,
  Activity,
  Layers,
  Search,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface TeamAchievement {
  id: string;
  name: string;
  manager: string;
  target: number;
  achievement: number;
  percent: number;
  memberCount: number;
  topPerformer: string;
  growth: number; // vs last month
}

const mockTeamData: TeamAchievement[] = [
  { id: '1', name: 'تیم پروژه‌های صنعتی', manager: 'مهندس محمودی', target: 5000000000, achievement: 5400000000, percent: 108, memberCount: 5, topPerformer: 'علیرضا حسینی', growth: 12.5 },
  { id: '2', name: 'تیم خرده‌فروشی', manager: 'خانم ناصری', target: 3000000000, achievement: 2100000000, percent: 70, memberCount: 4, topPerformer: 'محمد رضایی', growth: -5.2 },
  { id: '3', name: 'تیم فروش سازمانی', manager: 'مهندس کریمی', target: 8000000000, achievement: 7200000000, percent: 90, memberCount: 8, topPerformer: 'سارا احمدی', growth: 2.1 },
];

export const TeamAchievementReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num / 1000000));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">تحلیل عملکرد تیمی فروش</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">مقایسه درصد تحقق، نرخ رشد و راندمان تیم‌های مختلف</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            <select className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-bold text-slate-600 outline-hidden">
              <option>اردیبهشت ۱۴۰۶</option>
              <option>فروردین ۱۴۰۶</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeamData.map((team, idx) => (
          <motion.div 
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-rose-200 hover:shadow-md transition-all"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">{team.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">مدیر تیم: {team.manager}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${team.growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {team.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(team.growth)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">میزان تحقق</span>
                  <span className={`font-mono font-bold ${team.percent >= 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{team.percent}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(team.percent, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${team.percent >= 100 ? 'bg-emerald-500' : team.percent >= 80 ? 'bg-sky-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">تارگت (میلیون)</p>
                  <p className="text-xs font-mono font-bold text-slate-700">{formatNumber(team.target)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">تحقق (میلیون)</p>
                  <p className="text-xs font-mono font-bold text-slate-700">{formatNumber(team.achievement)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                    <Medal className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400">برترین کارشناس</p>
                    <p className="text-[10px] font-bold text-slate-700">{team.topPerformer}</p>
                  </div>
                </div>
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                      U{i+1}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                    +{team.memberCount - 3}
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-slate-50 hover:bg-rose-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-rose-600 transition-all">
              مشاهده عملکرد اعضای تیم <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparative Chart Placeholder */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">روند عملکرد ۶ ماهه تیم‌ها</h4>
          </div>
          <div className="flex items-center gap-4">
             {['تیم صنعتی', 'تیم خرده‌فروشی', 'تیم سازمانی'].map((name, i) => (
               <div key={i} className="flex items-center gap-1.5">
                 <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-sky-500' : 'bg-indigo-500'}`} />
                 <span className="text-[10px] font-bold text-slate-500">{name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="h-64 w-full flex items-end justify-between px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 max-w-[80px]">
              <div className="w-full flex items-end justify-center gap-1 h-48">
                <div className="w-3 bg-rose-500/80 rounded-t-sm" style={{ height: `${40 + Math.random() * 50}%` }} />
                <div className="w-3 bg-sky-500/80 rounded-t-sm" style={{ height: `${30 + Math.random() * 60}%` }} />
                <div className="w-3 bg-indigo-500/80 rounded-t-sm" style={{ height: `${50 + Math.random() * 40}%` }} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">ماه {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
