'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { TrackSection } from '@/types';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  ShieldAlert, 
  ArrowRight, 
  Gauge, 
  Zap, 
  PlusCircle, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function CorridorStatusGrid() {
  const { sections, setSelectedSection, setActiveTab, setIsAiPlannerOpen } = useRailway();

  const getStatusBadge = (status: TrackSection['currentStatus']) => {
    switch (status) {
      case 'CLEAR':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CLEAR / FIT</span>
          </span>
        );
      case 'MAINTENANCE_SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/70 text-cyan-300 border border-blue-700/60">
            <Wrench className="w-3 h-3 text-cyan-300" />
            <span>AI BLOCK SANCTIONED</span>
          </span>
        );
      case 'CAUTION':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-700/60">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>TSR IMPOSED</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/70 text-red-300 border border-red-700/60 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>LINE BLOCKED</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-navy-900 border border-railway-800/90 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-railway-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-railway-800 text-cyan-300">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Uttar Pradesh Core Railway Corridors & Track Sections</h3>
            <p className="text-[11px] text-slate-400">Live health, speed restrictions, and AI maintenance block status</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('map_ctc')}
          className="text-xs text-railway-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
        >
          <span>Open CTC Schematic View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.slice(0, 9).map(sec => (
          <div
            key={sec.id}
            className="p-3 rounded-lg bg-navy-850/80 hover:bg-navy-800/90 border border-railway-800/70 transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-navy-950 px-1.5 py-0.5 rounded border border-railway-800">
                  {sec.id}
                </span>
                {getStatusBadge(sec.currentStatus)}
              </div>

              <h4 className="text-xs font-bold text-white mt-1.5 group-hover:text-amber-300 transition line-clamp-1">
                {sec.sectionName}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{sec.corridorName}</p>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px] bg-navy-950/60 p-2 rounded border border-railway-800/50 font-mono">
                <div>
                  <span className="text-slate-400">MPS Speed:</span>{' '}
                  <span className="text-white font-bold">{sec.maxPermissibleSpeed} km/h</span>
                </div>
                <div>
                  <span className="text-slate-400">Distance:</span>{' '}
                  <span className="text-white font-bold">{sec.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-slate-400">Signalling:</span>{' '}
                  <span className="text-cyan-300 truncate block">{sec.signallingType.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-400">Health Score:</span>{' '}
                  <span className={`font-bold ${sec.assetHealthIndex > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {sec.assetHealthIndex}%
                  </span>
                </div>
              </div>

              {sec.currentTSR && (
                <div className="mt-2 text-[10px] bg-amber-950/40 text-amber-300 p-1.5 rounded border border-amber-800/50">
                  <strong>TSR {sec.currentTSR.speedKm} km/h:</strong> {sec.currentTSR.reason}
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-railway-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setSelectedSection(sec);
                  setActiveTab('map_gis');
                }}
                className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center space-x-1"
              >
                <span>Track Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  setSelectedSection(sec);
                  setIsAiPlannerOpen(true);
                }}
                className="text-[11px] bg-railway-700/60 hover:bg-railway-600 text-cyan-200 px-2 py-0.5 rounded border border-railway-600/50 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Plan Block</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
