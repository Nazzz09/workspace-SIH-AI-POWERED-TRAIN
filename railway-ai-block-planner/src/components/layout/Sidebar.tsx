'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  LayoutDashboard, 
  Map, 
  Activity, 
  Sparkles, 
  ListOrdered, 
  CalendarClock, 
  BarChart3, 
  FileCheck2, 
  BookOpen, 
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, maintenanceRequests, conflictAlerts, analytics } = useRailway();

  const pendingCount = maintenanceRequests.filter(r => r.status === 'PROPOSED_BY_AI' || r.status === 'PENDING_AI_ANALYSIS').length;
  const activeCount = maintenanceRequests.filter(r => r.status === 'IN_EXECUTION' || r.status === 'EMERGENCY_ACTIVE').length;
  const unreadAlerts = conflictAlerts.filter(a => !a.autoResolved).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Control Dashboard',
      subtitle: 'Corridor & Operations Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'map_gis',
      label: 'UP GIS Track Map',
      subtitle: 'Lucknow & State Rail Corridors',
      icon: Map,
      badge: 'Live GPS',
      badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    },
    {
      id: 'map_ctc',
      label: 'CTC Track Schematic',
      subtitle: 'Indian Railways Signal & Block Interlocking',
      icon: Activity,
      badge: 'ABS / EI',
      badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50',
    },
    {
      id: 'ai_planner',
      label: 'AI Auto-Block Planner',
      subtitle: 'Intelligent Conflict-Free Optimizer',
      icon: Sparkles,
      badge: 'AI Engine',
      badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    },
    {
      id: 'requests',
      label: 'Maintenance Registry',
      subtitle: 'P-Way, TRD & S&T Blocks',
      icon: ListOrdered,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-blue-900/80 text-cyan-200 border-blue-600',
    },
    {
      id: 'gantt_schedule',
      label: '24-Hr Master Gantt',
      subtitle: 'Train Time Paths vs Block Windows',
      icon: CalendarClock,
      badge: activeCount > 0 ? `${activeCount} Active` : null,
      badgeColor: 'bg-red-900/80 text-red-200 border-red-700',
    },
    {
      id: 'analytics',
      label: 'Delay & Availability Analytics',
      subtitle: 'Punctuality & Asset Health KPIs',
      icon: BarChart3,
      badge: `-${analytics.trainDelayReductionPercent}%`,
      badgeColor: 'bg-emerald-900/70 text-emerald-300 border-emerald-700',
    },
    {
      id: 'memo_generator',
      label: 'Sanction Memo (T/409)',
      subtitle: 'Official Caution Order & S&T Forms',
      icon: FileCheck2,
      badge: 'Print Ready',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'rulebook',
      label: 'IR Operating Manual',
      subtitle: 'G&SR, IRPWM & S&T Protocols',
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-navy-900/95 border-r border-railway-800/80 flex flex-col justify-between select-none shadow-xl shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      <div className="p-2.5 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Operations Modules</span>
          <span className="flex items-center text-emerald-400 space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SYSTEM ONLINE</span>
          </span>
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-railway-600 to-railway-700 text-white font-medium shadow-md shadow-railway-900/50 border border-railway-400/30'
                  : 'text-slate-300 hover:bg-navy-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <div className={`p-1.5 rounded-md ${
                  isActive ? 'bg-navy-950/40 text-amber-300' : 'bg-navy-850 text-slate-400 group-hover:text-railway-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-tight truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100/80' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${item.badgeColor || 'bg-navy-800 text-slate-300 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Divisional Status Footer */}
      <div className="p-3 bg-navy-950/90 border-t border-railway-800/90 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Punctuality Score:</span>
          <span className="font-mono font-bold text-emerald-400">{analytics.punctualityIndexPassenger}%</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Asset Health Index:</span>
          <span className="font-mono font-bold text-cyan-400">{analytics.assetHealthScoreOverall}%</span>
        </div>
        <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${analytics.assetHealthScoreOverall}%` }}
          />
        </div>
        <div className="text-[9px] text-slate-400 text-center pt-1 font-mono">
          Northern & North Eastern Railway • Lucknow Control
        </div>
      </div>
    </aside>
  );
}
