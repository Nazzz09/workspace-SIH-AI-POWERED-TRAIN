'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  Clock, 
  TrendingDown, 
  ShieldCheck, 
  Gauge, 
  Layers, 
  CheckCircle2, 
  Zap, 
  AlertOctagon,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function KpiStatsRow() {
  const { analytics, maintenanceRequests, conflictAlerts, currentDivision } = useRailway();

  const pendingApprovals = maintenanceRequests.filter(r => r.status === 'PROPOSED_BY_AI').length;
  const activeBlocks = maintenanceRequests.filter(r => r.status === 'IN_EXECUTION' || r.status === 'EMERGENCY_ACTIVE').length;

  const cards = [
    {
      title: 'Total Block Hours Granted',
      value: `${analytics.totalBlockHoursGrantedToday} hrs`,
      subtext: `Target: ${analytics.totalBlockHoursTargetMonthly} hrs/mo (${currentDivision.code})`,
      icon: Clock,
      trend: '+12.4% vs last week',
      trendColor: 'text-emerald-400',
      gradient: 'from-blue-900/40 to-navy-900',
      borderColor: 'border-blue-700/40',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Train Delay Reduction',
      value: `-${analytics.trainDelayReductionPercent}%`,
      subtext: `${analytics.delayHoursSavedMonthly} hrs saved this month vs manual plans`,
      icon: TrendingDown,
      trend: 'AI Punctuality Gain',
      trendColor: 'text-emerald-400',
      gradient: 'from-emerald-950/40 to-navy-900',
      borderColor: 'border-emerald-700/40',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Asset Health & Safety Index',
      value: `${analytics.assetHealthScoreOverall}%`,
      subtext: 'P-Way, TRD & S&T Compliance',
      icon: ShieldCheck,
      trend: `${analytics.safetyComplianceScore}% Safety Score`,
      trendColor: 'text-cyan-400',
      gradient: 'from-cyan-950/40 to-navy-900',
      borderColor: 'border-cyan-700/40',
      iconColor: 'text-cyan-300',
    },
    {
      title: 'Section Capacity Utilization',
      value: `${analytics.sectionCapacityUtilizationPercent}%`,
      subtext: 'High-Density Golden Corridor',
      icon: Gauge,
      trend: 'ABS Signalling Active',
      trendColor: 'text-amber-400',
      gradient: 'from-amber-950/30 to-navy-900',
      borderColor: 'border-amber-700/40',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Mega Shadow Blocks Combined',
      value: `${analytics.shadowBlocksCombinedCount} Units`,
      subtext: 'Civil + TRD + S&T Multi-Depot closures',
      icon: Layers,
      trend: 'Saved 72 hrs line downtime',
      trendColor: 'text-emerald-400',
      gradient: 'from-purple-950/30 to-navy-900',
      borderColor: 'border-purple-700/40',
      iconColor: 'text-purple-300',
    },
    {
      title: 'Passenger Punctuality',
      value: `${analytics.punctualityIndexPassenger}%`,
      subtext: `Vande Bharat & Rajdhanis at 99.4%`,
      icon: CheckCircle2,
      trend: `${pendingApprovals} Blocks pending sanction`,
      trendColor: pendingApprovals > 0 ? 'text-amber-400' : 'text-emerald-400',
      gradient: 'from-railway-900 to-navy-900',
      borderColor: 'border-railway-700/50',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border bg-gradient-to-br ${card.gradient} ${card.borderColor} shadow-lg backdrop-blur-sm relative overflow-hidden transition transform hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">{card.title}</span>
              <div className={`p-1.5 rounded-lg bg-navy-950/70 border border-railway-800 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">{card.value}</span>
            </div>

            <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">{card.subtext}</p>

            <div className="mt-2.5 pt-2 border-t border-railway-800/80 flex items-center justify-between text-[10px]">
              <span className={`font-medium ${card.trendColor} flex items-center`}>
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {card.trend}
              </span>
              <span className="text-slate-400 font-mono">LIVE</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
