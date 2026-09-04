'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { ShieldAlert, AlertTriangle, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function ActiveConflictsBanner() {
  const { conflictAlerts, resolveConflictAlert, setActiveTab, setIsAiPlannerOpen } = useRailway();

  const activeAlerts = conflictAlerts.filter(a => !a.autoResolved);

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200">
        <div className="flex items-center space-x-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-emerald-300">Corridor Signal & Block Clear:</span> No track clash or VIP train conflicts in the next 12-hour window.
          </div>
        </div>
        <button
          onClick={() => setActiveTab('gantt_schedule')}
          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
        >
          <span>View 24-hr Gantt</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activeAlerts.map(alert => {
        const isCrit = alert.severity === 'CRITICAL';
        return (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md transition ${
              isCrit
                ? 'bg-red-950/40 border-red-700/80 text-red-100 shadow-red-950/20'
                : 'bg-amber-950/30 border-amber-700/70 text-amber-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isCrit ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'}`}>
                {isCrit ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isCrit ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                  <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">({alert.sectionName})</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-emerald-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>AI Strategy:</strong> {alert.resolutionAdvice}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => {
                  setActiveTab('ai_planner');
                  setIsAiPlannerOpen(true);
                }}
                className="bg-gradient-to-r from-railway-600 to-railway-500 hover:from-railway-500 hover:to-railway-400 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shadow transition"
              >
                <span>AI Auto-Resolve</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => resolveConflictAlert(alert.id)}
                className="bg-navy-900 hover:bg-navy-800 border border-railway-700 text-slate-300 hover:text-white p-1.5 rounded-lg text-xs"
                title="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
