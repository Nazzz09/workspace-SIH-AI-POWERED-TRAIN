'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import KpiStatsRow from './KpiStatsRow';
import ActiveConflictsBanner from './ActiveConflictsBanner';
import CorridorStatusGrid from './CorridorStatusGrid';
import RecentBlockProposalsCard from './RecentBlockProposalsCard';
import { 
  Sparkles, 
  Map, 
  Activity, 
  CalendarClock, 
  ListOrdered, 
  TrendingDown, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function DashboardOverview() {
  const { currentDivision, setActiveTab, setIsAiPlannerOpen } = useRailway();

  return (
    <div className="space-y-6 select-none">
      {/* Active Conflict Warning Banner */}
      <ActiveConflictsBanner />

      {/* KPI Stats Row (6 Cards) */}
      <KpiStatsRow />

      {/* Main Operational Split: UP Corridors Health Grid (Left) + AI Proposals Queue (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <CorridorStatusGrid />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <RecentBlockProposalsCard />

          {/* Quick Division Highlights & AI Engine Status */}
          <div className="bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-railway-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-railway-800 text-cyan-300">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Divisional Control Highlights
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                100% Electrified
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between bg-navy-950 p-2 rounded border border-railway-800">
                <span className="text-slate-400">Headquarters / DRM:</span>
                <strong className="text-white">{currentDivision.headquarters}</strong>
              </div>
              <div className="flex justify-between bg-navy-950 p-2 rounded border border-railway-800">
                <span className="text-slate-400">Sr. DOM In-Charge:</span>
                <strong className="text-amber-300">{currentDivision.controllerName}</strong>
              </div>
              <div className="flex justify-between bg-navy-950 p-2 rounded border border-railway-800">
                <span className="text-slate-400">Route / Track Km:</span>
                <strong className="text-white font-mono">{currentDivision.routeKm} km (Electrified)</strong>
              </div>
              <div className="flex justify-between bg-navy-950 p-2 rounded border border-railway-800">
                <span className="text-slate-400">Active Trains in Division:</span>
                <strong className="text-cyan-400 font-mono">{currentDivision.activeTrainsCount} Trains Moving</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-railway-800 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('map_gis')}
                className="text-xs text-railway-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <span>Open UP GIS Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsAiPlannerOpen(true)}
                className="bg-railway-600 hover:bg-railway-500 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Block Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
