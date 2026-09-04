'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  CalendarClock, 
  Clock, 
  Layers, 
  Sparkles, 
  Info, 
  Filter, 
  ChevronRight, 
  Wrench, 
  Train as TrainIcon,
  Play,
  RotateCcw
} from 'lucide-react';

export default function MasterGanttVisualizer() {
  const { sections, trains, maintenanceRequests, simulationTime, setSimulationTime, setIsAiPlannerOpen } = useRailway();

  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState<string>('ALL');

  // 24 Hour marks
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Key Track Sections displayed in Gantt
  const ganttSections = [
    {
      id: 'SEC-AJ-ON-05',
      name: 'Ajgain (AJ) – Unnao Jn (ON) [DN Line]',
      type: 'High Density Trunk',
      trains: [
        { name: '12004 Shatabdi', timeStart: 11.5, duration: 0.5, color: 'bg-blue-600 border-blue-400', priority: 'P1' },
        { name: '22436 Vande Bharat', timeStart: 10.2, duration: 0.4, color: 'bg-orange-600 border-orange-400', priority: 'P1' },
        { name: '64203 MEMU', timeStart: 8.5, duration: 0.8, color: 'bg-emerald-600 border-emerald-400', priority: 'P3' },
        { name: 'BOXN Freight 8821', timeStart: 2.2, duration: 1.2, color: 'bg-amber-600 border-amber-400', priority: 'P4' },
      ],
      blocks: [
        { name: 'BCM-102 Deep Screening Block', timeStart: 1.25, duration: 3.0, status: 'AI Recommended', color: 'bg-purple-900/80 border-purple-500 text-purple-200' },
      ]
    },
    {
      id: 'SEC-LKO-MKG-01',
      name: 'Lucknow (LKO) – Manak Nagar (MKG) [UP Line]',
      type: 'City Exit Trunk',
      trains: [
        { name: '12555 Gorakhdham', timeStart: 21.3, duration: 0.5, color: 'bg-blue-600 border-blue-400', priority: 'P2' },
        { name: '20104 LTT SF', timeStart: 9.6, duration: 0.5, color: 'bg-blue-600 border-blue-400', priority: 'P2' },
        { name: '64205 MEMU', timeStart: 14.1, duration: 0.7, color: 'bg-emerald-600 border-emerald-400', priority: 'P3' },
      ],
      blocks: [
        { name: 'USFD Ultrasonic Rail Testing', timeStart: 2.0, duration: 2.0, status: 'Scheduled', color: 'bg-cyan-950/90 border-cyan-500 text-cyan-200' },
      ]
    },
    {
      id: 'SEC-AMS-HRN-03',
      name: 'Amausi (AMS) – Harauni (HRN) [DN Line]',
      type: 'TSR Imposed Section',
      trains: [
        { name: '22436 Vande Bharat', timeStart: 10.0, duration: 0.4, color: 'bg-orange-600 border-orange-400', priority: 'P1' },
        { name: '64203 MEMU', timeStart: 7.8, duration: 0.8, color: 'bg-emerald-600 border-emerald-400', priority: 'P3' },
      ],
      blocks: [
        { name: 'TRD OHE Tower Wagon Power Block', timeStart: 13.0, duration: 2.0, status: 'Approved', color: 'bg-indigo-900/80 border-indigo-500 text-indigo-200' },
      ]
    },
    {
      id: 'SEC-GTNR-ML-10',
      name: 'Gomti Nagar (GTNR) – Malhaur (ML) [Both Lines]',
      type: 'Ayodhya Link',
      trains: [
        { name: '22346 Patna-GTNR Vande Bharat', timeStart: 14.2, duration: 0.4, color: 'bg-orange-600 border-orange-400', priority: 'P1' },
        { name: '14206 Ayodhya Express', timeStart: 18.5, duration: 0.6, color: 'bg-blue-600 border-blue-400', priority: 'P2' },
      ],
      blocks: [
        { name: 'T-28 Diamond Turnout Relaying Mega Block', timeStart: 0.5, duration: 4.0, status: 'AI Proposed', color: 'bg-purple-900/80 border-purple-500 text-purple-200' },
      ]
    },
    {
      id: 'SEC-CNB-PRYJ-18',
      name: 'Kanpur (CNB) – Prayagraj (PRYJ) [Grand Chord]',
      type: '160 km/h KAVACH Line',
      trains: [
        { name: '12424 Dibrugarh Rajdhani', timeStart: 21.0, duration: 2.1, color: 'bg-indigo-600 border-indigo-400', priority: 'P1' },
        { name: '12398 Mahabodhi Express', timeStart: 19.2, duration: 1.8, color: 'bg-blue-600 border-blue-400', priority: 'P2' },
        { name: 'DFC Container Goods', timeStart: 4.0, duration: 2.5, color: 'bg-amber-600 border-amber-400', priority: 'P4' },
      ],
      blocks: [
        { name: 'Track Tamp & Ballast Regulation', timeStart: 1.0, duration: 2.5, status: 'Night Planned', color: 'bg-purple-950 border-purple-600 text-purple-200' },
      ]
    },
  ];

  // Convert current simulation time to fractional hours (e.g. "09:30" => 9.5)
  const [currH, currM] = simulationTime.split(':').map(Number);
  const currentFractionalHour = currH + currM / 60;
  const needleLeftPercent = (currentFractionalHour / 24) * 100;

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <div className="bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-railway-800 text-cyan-300">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>24-Hour Master Timetable & AI Block Gantt Visualizer</span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800">
                ABS Automated Headway
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Visual conflict radar comparing train paths against proposed maintenance windows
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] bg-navy-950/80 px-3 py-1.5 rounded-lg border border-railway-800">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-2 bg-orange-600 rounded-sm"></span>
            <span className="text-slate-300">Vande Bharat (P1)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-2 bg-blue-600 rounded-sm"></span>
            <span className="text-slate-300">Rajdhani/Mail (P2)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-2 bg-emerald-600 rounded-sm"></span>
            <span className="text-slate-300">MEMU (P3)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-2 bg-purple-600 border border-purple-400 rounded-sm"></span>
            <span className="text-slate-300">AI Block Window</span>
          </div>
        </div>
      </div>

      {/* Gantt Interactive Chart Panel */}
      <div className="bg-navy-950 border border-railway-800 rounded-xl p-4 shadow-2xl overflow-x-auto relative">
        <div className="min-w-[1200px] relative">
          {/* 24-Hour Timeline Header */}
          <div className="grid grid-cols-24 border-b border-railway-800 pb-2 text-[10px] font-mono text-slate-400">
            <div className="col-span-4 pl-2 font-bold text-slate-300 uppercase">Section / Corridor</div>
            <div className="col-span-20 grid grid-cols-24 text-center">
              {hours.map(h => (
                <div key={h} className="border-l border-railway-800/60 py-1">
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Time Scrubber Needle */}
          <div
            style={{ left: `calc(16.666% + ${(needleLeftPercent / 100) * 83.333}%)` }}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 shadow-[0_0_10px_#ef4444] pointer-events-none"
          >
            <div className="absolute -top-1 -left-3 bg-red-600 text-white text-[9px] font-mono font-bold px-1 rounded shadow">
              {simulationTime}
            </div>
          </div>

          {/* Section Swimlanes */}
          <div className="divide-y divide-railway-800/60">
            {ganttSections.map(sec => (
              <div key={sec.id} className="grid grid-cols-24 py-3.5 items-center hover:bg-navy-900/30 transition">
                {/* Section Info (Left) */}
                <div className="col-span-4 pr-3">
                  <div className="text-xs font-bold text-white truncate">{sec.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{sec.type}</div>
                </div>

                {/* 24-Hr Track Timeline (Right) */}
                <div className="col-span-20 h-12 bg-navy-900/60 rounded-lg border border-railway-800/80 relative overflow-hidden flex items-center">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-24 pointer-events-none">
                    {hours.map(h => (
                      <div key={h} className="border-r border-railway-800/40 h-full"></div>
                    ))}
                  </div>

                  {/* Scheduled Trains */}
                  {sec.trains.map((trn, idx) => {
                    const left = (trn.timeStart / 24) * 100;
                    const width = Math.max(2.5, (trn.duration / 24) * 100);
                    return (
                      <div
                        key={idx}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className={`absolute h-7 rounded px-1.5 flex items-center justify-between text-[9px] font-bold text-white shadow border ${trn.color} z-10 truncate cursor-pointer hover:scale-105 transition`}
                        title={`${trn.name} (${trn.priority}) - Pass Time: ${Math.floor(trn.timeStart)}:${Math.floor((trn.timeStart % 1) * 60)}`}
                      >
                        <span className="truncate">{trn.name}</span>
                      </div>
                    );
                  })}

                  {/* Scheduled / AI Proposed Blocks */}
                  {sec.blocks.map((blk, idx) => {
                    const left = (blk.timeStart / 24) * 100;
                    const width = (blk.duration / 24) * 100;
                    return (
                      <div
                        key={idx}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className={`absolute h-9 rounded-md px-2 flex items-center justify-between text-[10px] font-bold shadow-lg border-2 border-dashed ${blk.color} z-20 cursor-pointer hover:border-amber-400 transition`}
                        title={`${blk.name} (${blk.duration}h duration) - Status: ${blk.status}`}
                      >
                        <div className="flex items-center space-x-1 truncate">
                          <Wrench className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse" />
                          <span className="truncate">{blk.name}</span>
                        </div>
                        <span className="text-[9px] font-mono bg-navy-950/80 px-1 rounded shrink-0 ml-1">
                          {blk.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
