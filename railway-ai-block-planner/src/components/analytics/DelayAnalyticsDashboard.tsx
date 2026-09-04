'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingDown, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Layers, 
  Clock, 
  Leaf, 
  Fuel, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export default function DelayAnalyticsDashboard() {
  const { analytics, currentDivision } = useRailway();

  // Data 1: Delay Hours Saved weekly: AI vs Manual
  const delayComparisonData = [
    { week: 'W1 Aug', manualDelayHrs: 78, aiDelayHrs: 32, savedHrs: 46 },
    { week: 'W2 Aug', manualDelayHrs: 92, aiDelayHrs: 38, savedHrs: 54 },
    { week: 'W3 Aug', manualDelayHrs: 84, aiDelayHrs: 29, savedHrs: 55 },
    { week: 'W4 Aug', manualDelayHrs: 105, aiDelayHrs: 41, savedHrs: 64 },
    { week: 'W1 Sep (Current)', manualDelayHrs: 88, aiDelayHrs: 26, savedHrs: 62 },
  ];

  // Data 2: Corridor Asset Health Index
  const corridorHealthData = [
    { corridor: 'LKO - CNB Trunk', health: 94.5, target: 90, utilization: 88 },
    { corridor: 'LKO - BBK Quad', health: 92.0, target: 90, utilization: 92 },
    { corridor: 'BBK - AYC Ayodhya', health: 95.8, target: 90, utilization: 82 },
    { corridor: 'LKO - SLN Varanasi', health: 91.2, target: 90, utilization: 79 },
    { corridor: 'CNB - PRYJ Grand', health: 96.8, target: 90, utilization: 94 },
    { corridor: 'LKO - BE Bareilly', health: 90.7, target: 90, utilization: 76 },
  ];

  // Data 3: Department-wise block quota
  const deptData = [
    { name: 'Civil P-Way (Track)', hoursGranted: 182, quota: 200, color: '#0284c7' },
    { name: 'Electrical TRD (OHE)', hoursGranted: 114, quota: 120, color: '#f59e0b' },
    { name: 'Signal & Telecom (S&T)', hoursGranted: 88, quota: 95, color: '#10b981' },
    { name: 'Bridge & Structures', hoursGranted: 36, quota: 45, color: '#a855f7' },
  ];

  // Data 4: Train Category Punctuality
  const punctualityData = [
    { category: 'Vande Bharat Express', punctuality: 99.4, fill: '#ea580c' },
    { category: 'Rajdhani / Shatabdi', punctuality: 98.8, fill: '#0284c7' },
    { category: 'Superfast Mail', punctuality: 94.2, fill: '#3b82f6' },
    { category: 'MEMU Passenger', punctuality: 91.5, fill: '#10b981' },
    { category: 'Freight (BTPN/BLC)', punctuality: 86.8, fill: '#eab308' },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-navy-900 border border-railway-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-white">
              Predictive Delay & Operational Availability Intelligence Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data insights comparing AI Automatic Block Planning against legacy manual corridor scheduling ({currentDivision.name})
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-navy-950 px-3 py-1.5 rounded-lg border border-railway-800 text-xs">
          <span className="text-slate-400">Total Delay Reduction:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">-{analytics.trainDelayReductionPercent}%</span>
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-900 border border-emerald-800/50 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative Delay Hours Saved</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {analytics.delayHoursSavedMonthly} hrs
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Saves ₹1.82 Cr in train loitering costs</div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-cyan-800/50 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Asset Availability Gain</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            +{analytics.assetHealthScoreOverall}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Track availability across UP high-speed routes</div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-purple-800/50 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mega Shadow Block Multiplier</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">
            3.2x Synergy
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Civil + TRD + S&T sharing single window</div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-amber-800/50 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Diesel & Traction Energy Saved</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            18,400 L / 48 MWh
          </div>
          <div className="text-[10px] text-slate-400 mt-1">From avoiding unnecessary braking & idling</div>
        </div>
      </div>

      {/* Graph Row 1: Delay Hours Saved + Corridor Asset Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Delay Savings Area Chart */}
        <div className="lg:col-span-7 bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white">
                Train Delay Hours: AI Automatic Block Planner vs Legacy Manual Plans
              </h3>
              <p className="text-[10px] text-slate-400">Comparing total section delay minutes across 5 consecutive weeks</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              -58.4% Delay Drop
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={delayComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="manualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090f1c', borderColor: '#1e3a8a', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="manualDelayHrs" name="Legacy Manual Delay (hrs)" stroke="#ef4444" fillOpacity={1} fill="url(#manualGrad)" />
                <Area type="monotone" dataKey="aiDelayHrs" name="AI-Optimized Delay (hrs)" stroke="#10b981" fillOpacity={1} fill="url(#aiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Corridor Asset Health Bar Chart */}
        <div className="lg:col-span-5 bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white">Corridor Asset Health & Availability Score</h3>
              <p className="text-[10px] text-slate-400">IR-PWM & Track Safety Compliance rating</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">Avg: 93.6%</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corridorHealthData} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[70, 100]} stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="corridor" type="category" stroke="#94a3b8" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090f1c', borderColor: '#1e3a8a', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="health" name="Asset Health (%)" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graph Row 2: Department-wise Quota + Train Category Punctuality */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Block Hours Utilization */}
        <div className="lg:col-span-6 bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl">
          <h3 className="text-xs font-bold text-white mb-1">
            Department-wise Block Quota vs Actual Hours Granted
          </h3>
          <p className="text-[10px] text-slate-400 mb-3">Civil P-Way, TRD OHE, S&T Signal & Bridge Departments</p>

          <div className="space-y-3">
            {deptData.map((dept, idx) => {
              const pct = ((dept.hoursGranted / dept.quota) * 100).toFixed(1);
              return (
                <div key={idx} className="bg-navy-950 p-2.5 rounded-lg border border-railway-800">
                  <div className="flex justify-between text-xs font-medium text-white mb-1">
                    <span>{dept.name}</span>
                    <span className="font-mono text-cyan-300">{dept.hoursGranted} / {dept.quota} hrs ({pct}%)</span>
                  </div>
                  <div className="w-full bg-navy-850 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: dept.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Train Category Punctuality */}
        <div className="lg:col-span-6 bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl">
          <h3 className="text-xs font-bold text-white mb-1">
            Train Category Punctuality Index During Maintenance Blocks
          </h3>
          <p className="text-[10px] text-slate-400 mb-3">High Priority Vande Bharat & Rajdhani isolation protection</p>

          <div className="space-y-2.5">
            {punctualityData.map((trn, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-navy-950 p-2 rounded border border-railway-800">
                <span className="text-slate-200 font-semibold">{trn.category}</span>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-xs font-bold text-emerald-400">{trn.punctuality}%</span>
                  <span className="text-[10px] text-slate-400">On-Time</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
