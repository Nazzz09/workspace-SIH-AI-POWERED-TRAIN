'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { TrackSection, Train } from '@/types';
import { 
  Radio, 
  Activity, 
  Zap, 
  Wrench, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  Layers, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

export default function CtcSchematicView() {
  const { 
    sections, 
    trains, 
    selectedSection, 
    setSelectedSection, 
    setSelectedTrain, 
    setIsAiPlannerOpen, 
    simulationTime 
  } = useRailway();

  const [activeCorridorFilter, setActiveCorridorFilter] = useState<'ALL' | 'LKO_CNB' | 'LKO_BBK' | 'LKO_AYC'>('ALL');

  // Specific key stations for the schematic track diagram
  const ctcStations = [
    { code: 'LKO', name: 'Lucknow Charbagh', km: 'Km 0.0', platforms: ['PF 1 (Vande Bharat)', 'PF 2 (Express)', 'PF 3 (Main)', 'PF 4 (Loop)'], x: 60 },
    { code: 'MKG', name: 'Manak Nagar', km: 'Km 6.2', platforms: ['PF 1 (Up)', 'PF 2 (Dn)'], x: 280 },
    { code: 'AMS', name: 'Amausi (Airport Link)', km: 'Km 14.0', platforms: ['PF 1', 'PF 2'], x: 500 },
    { code: 'HRN', name: 'Harauni', km: 'Km 25.4', platforms: ['PF 1', 'PF 2'], x: 720 },
    { code: 'AJ', name: 'Ajgain', km: 'Km 40.0', platforms: ['PF 1', 'PF 2 (Goods Loop)'], x: 940 },
    { code: 'ON', name: 'Unnao Junction', km: 'Km 58.2', platforms: ['PF 1', 'PF 2', 'PF 3 (Balamau Branch)', 'PF 4'], x: 1160 },
    { code: 'MGW', name: 'Magarwara (Ganga Approach)', km: 'Km 66.7', platforms: ['PF 1', 'PF 2'], x: 1380 },
    { code: 'CNB', name: 'Kanpur Central', km: 'Km 74.6', platforms: ['PF 1 (Shatabdi/VB)', 'PF 2', 'PF 3', 'PF 4 (Rajdhani)', 'PF 5'], x: 1600 },
  ];

  return (
    <div className="bg-navy-950 border border-railway-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-full select-none">
      {/* CTC Control Header */}
      <div className="p-3 bg-navy-900 border-b border-railway-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-navy-950 border border-emerald-800 text-emerald-400 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>CTC INTERLOCKING: ACTIVE (ABS 4-Aspect)</span>
          </div>
          <span className="text-xs text-slate-400">
            Lucknow – Kanpur Quadruple Trunk & S&T Electronic Interlocking
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] bg-navy-950/70 px-3 py-1.5 rounded-lg border border-railway-800">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1.5 bg-emerald-500 rounded-sm"></span>
            <span className="text-slate-300">Line Clear</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1.5 bg-red-600 rounded-sm animate-pulse"></span>
            <span className="text-slate-300">Train Occupied</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1.5 bg-purple-500 rounded-sm border border-purple-300"></span>
            <span className="text-slate-300">Maintenance Block</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1.5 bg-amber-500 rounded-sm"></span>
            <span className="text-slate-300">TSR Speed Restr.</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">25 kV AC OHE On</span>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal CTC Schematic Canvas */}
      <div className="p-4 overflow-x-auto bg-[#050b14] control-room-grid relative min-h-[460px] flex flex-col justify-center">
        <div className="min-w-[1720px] relative py-8">
          {/* Station Markers Header Row */}
          <div className="relative h-12 mb-4 border-b border-railway-800/80">
            {ctcStations.map((stn, idx) => (
              <div
                key={stn.code}
                style={{ left: `${stn.x}px` }}
                className="absolute transform -translate-x-1/2 flex flex-col items-center"
              >
                <div className="text-[10px] font-bold text-amber-400 font-mono tracking-wider">{stn.code}</div>
                <div className="text-[11px] font-bold text-white whitespace-nowrap">{stn.name}</div>
                <div className="text-[9px] text-slate-400 font-mono">{stn.km}</div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 border border-navy-950 shadow-[0_0_8px_#38bdf8]"></div>
              </div>
            ))}
          </div>

          {/* MAIN UP LINE (Direction: Kanpur -> Lucknow) */}
          <div className="relative h-20 my-2 bg-navy-900/40 rounded-lg p-2 border border-railway-800/60">
            <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest absolute top-1 left-2 flex items-center space-x-1">
              <span>▲ UP MAIN LINE (Direction: Kanpur &rarr; Lucknow Charbagh)</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1 rounded font-mono">MPS: 130 km/h</span>
            </div>

            {/* Continuous Track Line SVG */}
            <svg className="w-full h-16 mt-2" viewBox="0 0 1720 60">
              {/* Main Rail Track Path */}
              <line x1="40" y1="30" x2="1680" y2="30" stroke="#1e293b" strokeWidth="6" strokeDasharray="4 4" />
              <line x1="40" y1="30" x2="1680" y2="30" stroke="#10b981" strokeWidth="3" className="track-glow-green" />

              {/* Station Yard Platforms */}
              {ctcStations.map((stn, idx) => (
                <g key={idx}>
                  <rect x={stn.x - 30} y="18" width="60" height="6" fill="#0284c7" rx="2" opacity="0.8" />
                  {/* Signal Post (3-Aspect) */}
                  <circle cx={stn.x - 45} cy="14" r="3.5" fill="#10b981" />
                  <line x1={stn.x - 45} y1="14" x2={stn.x - 45} y2="30" stroke="#94a3b8" strokeWidth="1.5" />
                </g>
              ))}

              {/* Active Train on UP Line: Vande Bharat #22436 */}
              <g transform="translate(940, 20)">
                <rect x="-35" y="-14" width="70" height="20" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" className="shadow-lg" />
                <text x="0" y="-1" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">VB #22436</text>
                <text x="0" y="8" fill="#a5f3fc" fontSize="8" textAnchor="middle">128 km/h</text>
                <polygon points="38, -4 46, -4 42, 4" fill="#38bdf8" />
              </g>

              {/* Train 12004 Shatabdi */}
              <g transform="translate(380, 20)">
                <rect x="-35" y="-14" width="70" height="20" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="0" y="-1" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">SHT #12004</text>
                <text x="0" y="8" fill="#93c5fd" fontSize="8" textAnchor="middle">115 km/h</text>
              </g>
            </svg>
          </div>

          {/* MAIN DOWN LINE (Direction: Lucknow -> Kanpur) */}
          <div className="relative h-20 my-2 bg-navy-900/40 rounded-lg p-2 border border-railway-800/60">
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest absolute top-1 left-2 flex items-center space-x-1">
              <span>▼ DOWN MAIN LINE (Direction: Lucknow Charbagh &rarr; Kanpur Central)</span>
              <span className="text-[9px] bg-amber-950 text-amber-400 px-1 rounded font-mono">MPS: 130 km/h</span>
            </div>

            <svg className="w-full h-16 mt-2" viewBox="0 0 1720 60">
              <line x1="40" y1="30" x2="1680" y2="30" stroke="#1e293b" strokeWidth="6" strokeDasharray="4 4" />
              {/* Section with Active Block Highlight: Ajgain - Unnao (Km 40 - 58) */}
              <line x1="40" y1="30" x2="940" y2="30" stroke="#10b981" strokeWidth="3" />
              {/* Highlight Block Zone */}
              <line x1="940" y1="30" x2="1160" y2="30" stroke="#a855f7" strokeWidth="6" className="track-glow-blue" strokeDasharray="8 4" />
              <line x1="1160" y1="30" x2="1680" y2="30" stroke="#10b981" strokeWidth="3" />

              {/* Station Yard Platforms */}
              {ctcStations.map((stn, idx) => (
                <g key={idx}>
                  <rect x={stn.x - 30} y="36" width="60" height="6" fill="#0284c7" rx="2" opacity="0.8" />
                  <circle cx={stn.x + 45} cy="46" r="3.5" fill="#10b981" />
                  <line x1={stn.x + 45} y1="30" x2={stn.x + 45} y2="46" stroke="#94a3b8" strokeWidth="1.5" />
                </g>
              ))}

              {/* Maintenance Machine on Block Zone */}
              <g transform="translate(1050, 20)">
                <rect x="-42" y="-14" width="84" height="22" rx="4" fill="#6b21a8" stroke="#d8b4fe" strokeWidth="1.5" />
                <text x="0" y="-1" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">BCM-102</text>
                <text x="0" y="8" fill="#f3e8ff" fontSize="8" textAnchor="middle">Block Active (01-04)</text>
              </g>

              {/* MEMU Train #64203 */}
              <g transform="translate(620, 20)">
                <rect x="-35" y="-14" width="70" height="20" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                <text x="0" y="-1" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">MEMU #64203</text>
                <text x="0" y="8" fill="#a7f3d0" fontSize="8" textAnchor="middle">52 km/h</text>
              </g>
            </svg>
          </div>

          {/* GOODS & REGULATION LOOP LINES (Sonik & Unnao Yards) */}
          <div className="relative h-20 my-2 bg-navy-900/30 rounded-lg p-2 border border-dashed border-railway-800/70">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute top-1 left-2 flex items-center space-x-1">
              <span>↔ FREIGHT REGULATION LOOPS & TURN-OUT SIDING (Sonik & Unnao Junction Yard)</span>
            </div>

            <svg className="w-full h-16 mt-2" viewBox="0 0 1720 60">
              {/* Loop track bypass from Ajgain to Unnao */}
              <path d="M 900 20 L 960 42 L 1140 42 L 1200 20" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="3 3" />

              {/* Freight Train Regulated in Loop */}
              <g transform="translate(1050, 42)">
                <rect x="-48" y="-12" width="96" height="20" rx="3" fill="#854d0e" stroke="#fde047" strokeWidth="1.5" />
                <text x="0" y="0" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">BOXN/POL-8821</text>
                <text x="0" y="9" fill="#fef08a" fontSize="8" textAnchor="middle">Loitering in Loop PF 2</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* CTC Quick Action Bar */}
      <div className="p-3 bg-navy-900 border-t border-railway-800 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center space-x-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>
            <strong>Controller Tip:</strong> Clicking on any track section calculates real-time block conflict matrices and opens the AI Automatic Planner.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAiPlannerOpen(true)}
            className="bg-railway-600 hover:bg-railway-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Auto-Plan Block on Corridor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
